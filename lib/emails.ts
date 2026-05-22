/**
 * Email templates for the HSW EBOO assessment.
 *
 * Two transactional emails fire when a quiz completes:
 *   1. User confirmation — sends the report link and a booking CTA.
 *   2. Clinic notification — gives the practice everything needed to follow up.
 *
 * Plain text + HTML versions are built side-by-side to maximise deliverability.
 */

import { TRACKS, scoreBand, type TrackKey, type SafetyFlag } from "./quiz-data";

export type LeadEmailInput = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  score: number;
  track: TrackKey;
  safety: SafetyFlag[];
  resultUrl: string;
  bookingUrl: string;
};

const FLAG_LABELS: Record<SafetyFlag, string> = {
  pregnancy: "Pregnancy or trying to conceive",
  g6pd: "G6PD deficiency / favism",
  anticoagulant: "Blood thinners or bleeding disorder",
};

/* ---------- user-facing confirmation ---------- */

export function userConfirmationEmail(input: LeadEmailInput) {
  const band = scoreBand(input.score);
  const track = TRACKS[input.track];
  const screeningFirst = input.safety.length > 0;

  const subject = `Your EBOO assessment is ready · score ${input.score}`;

  const text = [
    `Hello ${input.name || "there"},`,
    "",
    `Thank you for completing the HSW EBOO assessment.`,
    "",
    `Your Toxic Load Score is ${input.score} / 100 — ${band.label}.`,
    `Your track: ${track.label} — ${track.tagline}`,
    "",
    "Your full report (with the dimension breakdown, what your score means, and what to expect) is here:",
    `${input.resultUrl}`,
    "",
    screeningFirst
      ? "Because your assessment flagged a safety consideration, your next step is a free 15-minute screening call with a Harley Street doctor. They'll review your history and discuss whether EBOO is right for you."
      : "Your next step is a free 15-minute online consultation with a Harley Street doctor. They'll walk through your report, discuss what's appropriate, and answer everything. No card required, no obligation.",
    "",
    `Book your call: ${input.bookingUrl}`,
    "",
    "If you have questions before you book, just reply to this email — a real person reads them.",
    "",
    "Harley Street Wellness",
    "London — London Medical Rooms, Ground Floor, 1–5 Portpool Lane, Chancery Lane, London EC1N 7UU · 020 4628 3137",
    "Glasgow — 5th Floor, Ingram House, 227 Ingram Street, Glasgow G1 1DA · 0141 488 8985",
  ].join("\n");

  const html = baseHtml({
    title: subject,
    bodyContent: `
      <p style="font-size:15px;line-height:1.6;color:#1a2238;margin:0 0 20px;">
        Hello ${escapeHtml(input.name || "there")},
      </p>
      <p style="font-size:15px;line-height:1.6;color:#1a2238;margin:0 0 24px;">
        Thank you for completing your HSW EBOO assessment.
      </p>

      <div style="border:1px solid #C9A347;background:#FAF7F2;padding:24px 22px;margin-bottom:28px;">
        <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:3px;color:#8E6F2A;margin-bottom:8px;text-transform:uppercase;">
          Your Toxic Load Score
        </div>
        <div style="font-family:Georgia,serif;font-size:56px;line-height:1;color:#1a2238;font-weight:300;">
          ${input.score}<span style="font-size:18px;color:#8E6F2A;"> / 100</span>
        </div>
        <div style="font-family:Georgia,serif;font-size:14px;color:#8E6F2A;font-style:italic;margin-top:6px;">
          ${escapeHtml(band.label)}
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #ece5d8;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6b6356;width:140px;">Track</td>
          <td style="padding:14px 0;border-bottom:1px solid #ece5d8;font-size:14px;color:#1a2238;">
            ${escapeHtml(track.label)} — <em style="color:#8E6F2A;">${escapeHtml(track.tagline)}</em>
          </td>
        </tr>
      </table>

      <p style="font-size:14px;line-height:1.6;color:#1a2238;margin:0 0 16px;">
        <a href="${escapeAttr(input.resultUrl)}" style="color:#8E6F2A;">View your full report</a> — the dimension breakdown, what your score means, what to expect, and prep for your call.
      </p>

      ${
        screeningFirst
          ? `<div style="border-left:3px solid #6B1D2E;padding:14px 18px;background:rgba(107,29,46,0.06);margin-bottom:28px;font-size:14px;line-height:1.6;color:#1a2238;">
              Because your assessment flagged a safety consideration, your next step is a free <strong>15-minute screening call</strong> with a Harley Street doctor. They'll review your history and discuss whether EBOO is right for you.
            </div>`
          : `<p style="font-size:14px;line-height:1.6;color:#1a2238;margin:0 0 24px;">
              Your next step is a free <strong>15-minute online consultation</strong> with a Harley Street doctor. They'll walk through your report, discuss what's appropriate, and answer everything. No card required, no obligation.
            </p>`
      }

      <div style="margin:32px 0;">
        <a href="${escapeAttr(input.bookingUrl)}" style="display:inline-block;background:#1a2238;color:#FAF7F2;padding:16px 28px;text-decoration:none;font-family:'Courier New',monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
          ${screeningFirst ? "Book a screening call →" : "Book your free consultation →"}
        </a>
      </div>

      <p style="font-size:13px;line-height:1.6;color:#6b6356;margin:0;">
        Questions? Just reply to this email — a real person reads them.
      </p>
    `,
  });

  return { subject, text, html };
}

/* ---------- clinic-facing lead notification ---------- */

export function clinicNotificationEmail(input: LeadEmailInput) {
  const band = scoreBand(input.score);
  const track = TRACKS[input.track];
  const safetyText =
    input.safety.length === 0
      ? "None"
      : input.safety.map((f) => `• ${FLAG_LABELS[f]}`).join("\n");

  const subject = `New lead · ${input.name || input.email} · ${track.label} · score ${input.score}${
    input.safety.length ? " · SAFETY" : ""
  }`;

  const text = [
    `New EBOO assessment submission.`,
    ``,
    `Name:       ${input.name || "(not provided)"}`,
    `Email:      ${input.email}`,
    `Phone:      ${input.phone || "(not provided)"}`,
    `Track:      ${track.label} (${track.tagline})`,
    `Score:      ${input.score} / 100 (${band.label})`,
    `Safety:     ${safetyText}`,
    ``,
    `Report:     ${input.resultUrl}`,
    `ID:         ${input.id}`,
    `Submitted:  ${new Date().toISOString()}`,
  ].join("\n");

  const html = baseHtml({
    title: subject,
    bodyContent: `
      <p style="font-size:14px;color:#1a2238;margin:0 0 22px;">
        <strong>New EBOO assessment submission.</strong>
      </p>

      ${
        input.safety.length > 0
          ? `<div style="border:1px solid #6B1D2E;background:rgba(107,29,46,0.08);padding:14px 18px;margin-bottom:24px;font-size:14px;color:#6B1D2E;">
              <strong>Safety screen flagged:</strong> ${input.safety
                .map((f) => escapeHtml(FLAG_LABELS[f]))
                .join(", ")}. Route to a screening call.
            </div>`
          : ""
      }

      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#1a2238;">
        ${row("Name", input.name || "—")}
        ${row("Email", `<a href="mailto:${escapeAttr(input.email)}" style="color:#8E6F2A;">${escapeHtml(input.email)}</a>`)}
        ${row("Phone", input.phone ? `<a href="tel:${escapeAttr(input.phone)}" style="color:#8E6F2A;">${escapeHtml(input.phone)}</a>` : "—")}
        ${row("Track", `${escapeHtml(track.label)} — <em style="color:#8E6F2A;">${escapeHtml(track.tagline)}</em>`)}
        ${row("Score", `${input.score} / 100 · ${escapeHtml(band.label)}`)}
        ${row("Safety", input.safety.length ? input.safety.map((f) => escapeHtml(FLAG_LABELS[f])).join("<br>") : "None")}
        ${row("Report", `<a href="${escapeAttr(input.resultUrl)}" style="color:#8E6F2A;">${escapeAttr(input.resultUrl)}</a>`)}
        ${row("Submission ID", `<code style="font-family:monospace;color:#6b6356;">${escapeHtml(input.id)}</code>`)}
        ${row("Submitted", new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }))}
      </table>
    `,
  });

  return { subject, text, html };
}

/* ---------- helpers ---------- */

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:12px 16px 12px 0;border-bottom:1px solid #ece5d8;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6b6356;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:12px 0;border-bottom:1px solid #ece5d8;">${value}</td>
    </tr>
  `;
}

function baseHtml({ title, bodyContent }: { title: string; bodyContent: string }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f5f1e8;font-family:Georgia,'Times New Roman',serif;color:#1a2238;">
  <div style="max-width:580px;margin:0 auto;padding:32px 20px;">
    <div style="background:#FAF7F2;padding:36px 32px;border:1px solid #ece5d8;">
      <div style="text-align:center;margin-bottom:36px;padding-bottom:24px;border-bottom:1px solid #ece5d8;">
        <div style="font-family:Georgia,serif;font-size:24px;font-weight:700;letter-spacing:6px;color:#C9A347;">HSW</div>
        <div style="font-family:'Courier New',monospace;font-size:8px;letter-spacing:3px;color:#6b6356;margin-top:4px;">HARLEY STREET WELLNESS</div>
      </div>
      ${bodyContent}
      <div style="margin-top:40px;padding-top:24px;border-top:1px solid #ece5d8;font-family:'Courier New',monospace;font-size:10px;letter-spacing:2px;color:#9C9586;text-align:center;line-height:1.8;">
        LONDON · 1–5 PORTPOOL LANE, EC1N 7UU · 020 4628 3137<br>
        GLASGOW · 227 INGRAM STREET, G1 1DA · 0141 488 8985
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function escapeAttr(s: string) {
  return escapeHtml(s);
}
