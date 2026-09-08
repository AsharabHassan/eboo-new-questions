import { after, NextResponse } from "next/server";
import { Resend } from "resend";
import { computeScore, computeTrack, computeSafetyFlags, type Answers } from "@/lib/quiz-data";
import { clinicNotificationEmail, userConfirmationEmail } from "@/lib/emails";
import { buildGhlPayload, postToGhl } from "@/lib/ghl";
import { normalizeAttribution, readMetaCookies } from "@/lib/attribution";
import { normalisePhoneE164 } from "@/lib/phone";

export const runtime = "nodejs";
export const maxDuration = 30;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LeadBody = {
  id?: unknown; name?: unknown; email?: unknown; phone?: unknown;
  answers?: Answers; attribution?: unknown;
};

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (typeof body.id !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(body.id)) {
    return NextResponse.json({ ok: false, error: "Invalid submission ID" }, { status: 400 });
  }
  if (typeof body.email !== "string" || body.email.length > 254 || !EMAIL_RE.test(body.email.trim())) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email" }, { status: 400 });
  }
  if (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.length > 160) {
    return NextResponse.json({ ok: false, error: "Please enter your name" }, { status: 400 });
  }
  const phoneE164 = normalisePhoneE164(body.phone);
  if (!phoneE164) {
    return NextResponse.json({ ok: false, error: "Please check your phone number, including its country code" }, { status: 400 });
  }
  if (!body.answers || typeof body.answers !== "object" || Array.isArray(body.answers)) {
    return NextResponse.json({ ok: false, error: "Missing answers" }, { status: 400 });
  }
  const city = body.answers.location;
  if (city !== "london" && city !== "glasgow") {
    return NextResponse.json({ ok: false, error: "Please select London or Glasgow" }, { status: 400 });
  }
  const webhook = city === "glasgow" ? process.env.GHL_WEBHOOK_URL_GLASGOW : process.env.GHL_WEBHOOK_URL;
  if (!webhook) {
    console.error("[lead] CRM intake unavailable", { city });
    return NextResponse.json({ ok: false, error: "We could not save your enquiry. Please try again shortly." }, { status: 503 });
  }

  const score = computeScore(body.answers);
  const track = computeTrack(body.answers);
  const safety = computeSafetyFlags(body.answers);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const resultUrl = `${siteUrl.replace(/\/$/, "")}/result/${body.id}`;
  const bookingUrl = `${siteUrl.replace(/\/$/, "")}/book${safety.length ? "?screening=1" : ""}`;
  const attribution = normalizeAttribution(body.attribution);
  // Click identifiers remain inside the clinic CRM; they are not forwarded to Meta here.
  const { fbp, fbc } = readMetaCookies(req.headers.get("cookie"));
  const fbclid = attribution.fbclid || (fbc?.match(/^fb\.\d+\.\d+\.(.+)$/)?.[1] ?? "");
  const payload = buildGhlPayload({
    id: body.id, name: body.name.trim(), email: body.email.trim(),
    phone: typeof body.phone === "string" ? body.phone.trim() : "", phoneE164,
    answers: body.answers, score, track, safety, resultUrl, bookingUrl,
    userAgent: req.headers.get("user-agent") || undefined,
    ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
    metaEventId: body.id,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID || "",
    metaFbp: fbp, metaFbc: fbc, metaFbclid: fbclid,
    // Existing GHL reference field also records the allowlisted campaign URL in each intake note.
    metaEventSourceUrl: attribution.landing_url || new URL(siteUrl).origin,
    attribution: { ...attribution, ...(fbclid ? { fbclid } : {}) },
  });
  const receipt = await postToGhl(webhook, payload);
  if (!receipt.ok) {
    console.error("[lead] CRM receipt not confirmed", { city, status: receipt.status });
    return NextResponse.json({ ok: false, error: "We could not confirm your enquiry was saved. Please try again." }, { status: 502 });
  }

  // Optional existing emails run only after the clinic CRM acknowledges intake.
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM || "HSW Assessment <noreply@example.com>";
    const clinicEmail = process.env.CLINIC_EMAIL;
    const emailInput = {
      id: body.id, name: body.name.trim(), email: body.email.trim(), phone: phoneE164,
      score, track, safety, resultUrl, bookingUrl,
    };
    const userMail = userConfirmationEmail(emailInput);
    const clinicMail = clinicNotificationEmail(emailInput);
    after(async () => { try {
      await resend.emails.send({
        from, to: emailInput.email, subject: userMail.subject, text: userMail.text, html: userMail.html,
        replyTo: clinicEmail || undefined,
      }, { idempotencyKey: `eboo-user-${body.id}` });
      if (clinicEmail) await resend.emails.send({
        from, to: clinicEmail, subject: clinicMail.subject, text: clinicMail.text, html: clinicMail.html,
        replyTo: emailInput.email,
      }, { idempotencyKey: `eboo-clinic-${body.id}` });
    } catch {
      console.warn("[lead] Optional email delivery failed after confirmed CRM intake");
    } });
  }
  // The EBOO domain has health-provider restrictions. Do not send assessment/Lead events
  // or health-derived parameters to advertising endpoints, including renamed equivalents.
  return NextResponse.json({ ok: true, id: body.id, resultUrl, bookingUrl, ghl: { sent: true } });
}
