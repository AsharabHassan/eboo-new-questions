/**
 * GoHighLevel (GHL) webhook integration.
 *
 * Posts a flat JSON payload to a GHL "Inbound Webhook" trigger so that
 * every quiz field maps cleanly to its own custom field on the contact.
 *
 * Setup in GHL:
 *   1. Automation > Workflows > New Workflow > Inbound Webhook trigger
 *   2. Copy the webhook URL and paste it into GHL_WEBHOOK_URL in .env.local
 *   3. Save & publish, send one test submission, then map the captured
 *      sample JSON keys to your contact custom fields in the workflow.
 *
 * Each field below is a discrete top-level key so the GHL UI shows them
 * as separate, mappable variables. Nothing is nested or concatenated.
 */

import {
  TRACKS,
  scoreBand,
  selectedSymptoms,
  answerLabel,
  dimensionBreakdown,
  type Answers,
  type SafetyFlag,
  type TrackKey,
} from "./quiz-data";

export type GhlPayloadInput = {
  id: string;
  name: string;
  email: string;
  /** Raw phone string as the user typed it. */
  phone?: string;
  /** E.164-normalised phone, e.g. +447700900123. */
  phoneE164?: string;
  answers: Answers;
  score: number;
  track: TrackKey;
  safety: SafetyFlag[];
  resultUrl: string;
  bookingUrl: string;
  userAgent?: string;
  ipAddress?: string;
  /** ----- Meta Pixel / CAPI attribution ----- */
  metaEventId?: string;
  metaPixelId?: string;
  metaFbp?: string;
  metaFbc?: string;
  metaFbclid?: string;
  metaEventSourceUrl?: string;
};

const SAFETY_LABELS: Record<SafetyFlag, string> = {
  pregnancy: "Pregnancy or trying to conceive",
  g6pd: "G6PD deficiency / favism",
  anticoagulant: "Blood thinners or bleeding disorder",
};

export function buildGhlPayload(input: GhlPayloadInput) {
  const band = scoreBand(input.score);
  const track = TRACKS[input.track];
  const symptoms = selectedSymptoms(input.answers);
  const breakdown = dimensionBreakdown(input.answers);
  const dimMap = Object.fromEntries(
    breakdown.map((d) => [d.key, d.contribution]),
  ) as Record<"env" | "lifestyle" | "symptoms" | "age", number>;

  const needsScreening = input.safety.length > 0;
  const city = stringAnswer(input.answers, "location"); // "london" | "glasgow" | ""

  // Split first / last name conservatively (GHL has both fields).
  const [firstName, ...lastParts] = input.name.trim().split(/\s+/);

  return {
    // -------- Standard contact fields (GHL maps these automatically) --------
    first_name: firstName || input.name.trim() || "",
    last_name: lastParts.join(" ") || "",
    full_name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phoneE164 || input.phone?.trim() || "",
    phone_raw: input.phone?.trim() || "",
    phone_e164: input.phoneE164 || "",

    // -------- Tags (comma-separated, easy to use in GHL "Add Tag" steps) --------
    tags: [
      "eboo-assessment",
      `track-${input.track}`,
      `band-${band.tone}`,
      needsScreening ? "needs-screening" : "no-safety-flags",
      city ? `city-${city}` : "city-unknown",
    ].join(","),

    // -------- Score & banding --------
    submission_id: input.id,
    toxic_load_score: input.score,
    score_band: band.label,
    score_band_tone: band.tone,

    // -------- Protocol routing --------
    protocol_track: track.label,
    protocol_track_key: input.track,
    protocol_tagline: track.tagline,

    // -------- Safety --------
    safety_status: needsScreening ? "needs_screening" : "clear",
    safety_flags: input.safety.map((f) => SAFETY_LABELS[f]).join(", "),
    safety_flag_count: input.safety.length,
    next_step: needsScreening ? "screening_call" : "consultation",

    // -------- Per-question answers (one field per question) --------
    answer_lifestyle: answerLabel(input.answers, "lifestyle") ?? "",
    answer_lifestyle_value: stringAnswer(input.answers, "lifestyle"),
    answer_symptoms: symptoms.join(", "),
    answer_symptoms_count: symptoms.length,
    answer_age: answerLabel(input.answers, "age") ?? "",
    answer_age_value: stringAnswer(input.answers, "age"),
    answer_goal: answerLabel(input.answers, "goal") ?? "",
    answer_goal_value: stringAnswer(input.answers, "goal"),
    answer_location: answerLabel(input.answers, "location") ?? "",
    answer_location_value: city,
    answer_pregnancy: answerLabel(input.answers, "pregnancy") ?? "",
    answer_g6pd: answerLabel(input.answers, "g6pd") ?? "",
    answer_anticoag: answerLabel(input.answers, "anticoag") ?? "",

    // -------- Score breakdown by dimension (0..100 contribution) --------
    dimension_environment: dimMap.env ?? 0,
    dimension_lifestyle: dimMap.lifestyle ?? 0,
    dimension_symptoms: dimMap.symptoms ?? 0,
    dimension_age: dimMap.age ?? 0,

    // -------- Links --------
    result_url: input.resultUrl,
    booking_url: input.bookingUrl,

    // -------- Source / metadata --------
    source: "EBOO Assessment",
    source_form: "hsw-eboo-quiz",
    submitted_at: new Date().toISOString(),
    submitted_at_uk: new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }),
    user_agent: input.userAgent ?? "",
    ip_address: input.ipAddress ?? "",

    // -------- Meta Pixel / Conversions API attribution --------
    meta_event_id: input.metaEventId ?? input.id,
    meta_pixel_id: input.metaPixelId ?? "",
    meta_event_name: "Lead",
    meta_event_source_url: input.metaEventSourceUrl ?? "",
    meta_fbp: input.metaFbp ?? "",
    meta_fbc: input.metaFbc ?? "",
    meta_fbclid: input.metaFbclid ?? "",
  };
}

function stringAnswer(answers: Answers, id: string): string {
  const a = answers[id];
  if (typeof a === "string") return a;
  if (Array.isArray(a)) return a.join(",");
  return "";
}

/**
 * Fire-and-forget POST to the GHL inbound webhook.
 * Returns a status object — never throws.
 */
export async function postToGhl(
  webhookUrl: string,
  payload: ReturnType<typeof buildGhlPayload>,
): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, status: res.status, error: text.slice(0, 200) };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
