import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  computeScore,
  computeTrack,
  computeSafetyFlags,
  type Answers,
  type SafetyFlag,
  type TrackKey,
} from "@/lib/quiz-data";
import { clinicNotificationEmail, userConfirmationEmail } from "@/lib/emails";
import { buildGhlPayload, postToGhl } from "@/lib/ghl";
import { postToMetaCapi, readMetaCookies } from "@/lib/meta-capi";

export const runtime = "nodejs"; // Resend SDK needs Node, not Edge

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LeadBody = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  answers: Answers;
  /** Pre-computed by the client; we recompute server-side to be safe. */
  score?: number;
  track?: TrackKey;
  safety?: SafetyFlag[];
  /** Meta event_id from the browser Pixel fire — used for CAPI dedup. */
  metaEventId?: string;
  /** Page URL the lead was generated from (for event_source_url). */
  pageUrl?: string;
};

/** Normalise a UK phone to E.164 (+44XXXXXXXXXX). Returns "" if invalid. */
function normalisePhoneE164(raw: string | undefined): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("44")) return `+${digits}`;
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  if (digits.length >= 10) return `+${digits}`;
  return "";
}

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // ---- Validate ----
  if (!body.id || typeof body.id !== "string") {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }
  if (!body.email || !EMAIL_RE.test(body.email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }
  if (!body.answers || typeof body.answers !== "object") {
    return NextResponse.json({ ok: false, error: "Missing answers" }, { status: 400 });
  }

  // ---- Compute server-side (don't trust client) ----
  const score = computeScore(body.answers);
  const track = computeTrack(body.answers);
  const safety = computeSafetyFlags(body.answers);

  // ---- Build links ----
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (req.headers.get("x-forwarded-proto") || "https") + "://" + (req.headers.get("host") ?? "");
  const resultUrl = `${siteUrl}/result/${body.id}`;
  const bookingUrl = `${siteUrl}/book${safety.length ? "?screening=1" : ""}`;

  const phoneE164 = normalisePhoneE164(body.phone);
  const phoneRaw = body.phone?.trim() ?? "";

  const emailInput = {
    id: body.id,
    name: body.name?.trim() ?? "",
    email: body.email.trim(),
    phone: phoneE164 || phoneRaw,
    score,
    track,
    safety,
    resultUrl,
    bookingUrl,
  };

  // ---- Send emails via Resend (if configured) ----
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "HSW Assessment <noreply@example.com>";
  const clinicEmail = process.env.CLINIC_EMAIL;

  const sendResult: {
    userEmailSent: boolean;
    clinicEmailSent: boolean;
    errors: string[];
  } = { userEmailSent: false, clinicEmailSent: false, errors: [] };

  if (!apiKey) {
    // Dev / pre-launch: log to console so the team can verify the payload.
    console.info("[lead] received (Resend not configured)", {
      id: body.id,
      email: body.email,
      score,
      track,
      safety,
    });
  } else {
    const resend = new Resend(apiKey);
    const userMail = userConfirmationEmail(emailInput);
    const clinicMail = clinicNotificationEmail(emailInput);

    try {
      const { error } = await resend.emails.send({
        from,
        to: emailInput.email,
        subject: userMail.subject,
        text: userMail.text,
        html: userMail.html,
        replyTo: clinicEmail || undefined,
      });
      if (error) sendResult.errors.push(`user: ${error.message}`);
      else sendResult.userEmailSent = true;
    } catch (e) {
      sendResult.errors.push(`user: ${(e as Error).message}`);
    }

    if (clinicEmail) {
      try {
        const { error } = await resend.emails.send({
          from,
          to: clinicEmail,
          subject: clinicMail.subject,
          text: clinicMail.text,
          html: clinicMail.html,
          replyTo: emailInput.email,
        });
        if (error) sendResult.errors.push(`clinic: ${error.message}`);
        else sendResult.clinicEmailSent = true;
      } catch (e) {
        sendResult.errors.push(`clinic: ${(e as Error).message}`);
      }
    }
  }

  // ---- Capture Meta attribution context (used by both GHL & CAPI) ----
  const { fbp: metaFbp, fbc: metaFbc } = readMetaCookies(req.headers.get("cookie"));
  const metaPixelId = process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
  const metaEventId = body.metaEventId || body.id;
  const metaEventSourceUrl =
    body.pageUrl || req.headers.get("referer") || `${siteUrl}/quiz`;
  // fbc encodes the fbclid. Extract it for direct attribution.
  const metaFbclid = metaFbc?.split(".").pop() || "";
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined;

  // ---- Send to GoHighLevel via inbound webhook (if configured) ----
  const ghlResult: { sent: boolean; status?: number; error?: string } = { sent: false };
  const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;

  if (ghlWebhookUrl) {
    const ghlPayload = buildGhlPayload({
      id: body.id,
      name: emailInput.name,
      email: emailInput.email,
      phone: phoneRaw,
      phoneE164,
      answers: body.answers,
      score,
      track,
      safety,
      resultUrl,
      bookingUrl,
      userAgent,
      ipAddress,
      metaEventId,
      metaPixelId,
      metaFbp,
      metaFbc,
      metaFbclid,
      metaEventSourceUrl,
    });
    const r = await postToGhl(ghlWebhookUrl, ghlPayload);
    ghlResult.sent = r.ok;
    if (r.status) ghlResult.status = r.status;
    if (r.error) ghlResult.error = r.error;
    if (!r.ok) console.warn("[lead] GHL webhook failed", r);
  } else {
    console.info("[lead] GHL_WEBHOOK_URL not set — skipping CRM push");
  }

  // ---- Send to Meta Conversions API (paired with browser Pixel for dedup) ----
  const capiResult: { sent: boolean; status?: number; error?: string } = { sent: false };

  if (process.env.META_PIXEL_ID && process.env.META_CAPI_ACCESS_TOKEN) {
    const [firstName, ...lastParts] = emailInput.name.split(/\s+/);

    const r = await postToMetaCapi({
      eventName: "Lead",
      eventId: metaEventId,
      eventSourceUrl: metaEventSourceUrl,
      user: {
        email: emailInput.email,
        firstName,
        lastName: lastParts.join(" "),
        phone: phoneE164 || phoneRaw || undefined,
        country: "gb",
        fbp: metaFbp,
        fbc: metaFbc,
        clientIp: ipAddress,
        clientUserAgent: userAgent,
        externalId: body.id,
      },
      customData: {
        currency: "GBP",
        value: 0,
        content_name: "EBOO Assessment",
        content_category: track,
        toxic_load_score: score,
        protocol_track: track,
        score_band: score >= 81 ? "critical" : score >= 61 ? "heavy" : score >= 31 ? "moderate" : "light",
        safety_flags: safety.join(",") || "none",
      },
    });
    capiResult.sent = r.ok;
    if (r.status) capiResult.status = r.status;
    if (r.error) capiResult.error = r.error;
    if (!r.ok) console.warn("[lead] Meta CAPI failed", r);
  }

  return NextResponse.json({
    ok: true,
    id: body.id,
    score,
    track,
    safety,
    resultUrl,
    bookingUrl,
    emails: sendResult,
    ghl: ghlResult,
    meta: capiResult,
  });
}
