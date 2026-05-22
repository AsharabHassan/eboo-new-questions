/**
 * Meta Conversions API (CAPI).
 *
 * Sends server-side `Lead` events that mirror the client-side Pixel fire.
 * Meta dedupes browser + server events that share the same `event_id`
 * + `event_name` so both signals strengthen attribution without
 * double-counting conversions.
 *
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 *
 * Env vars:
 *   - META_PIXEL_ID          — same ID as the browser pixel (server-side only)
 *   - META_CAPI_ACCESS_TOKEN — generated in Events Manager > Settings >
 *                              Conversions API > Generate Access Token
 *   - META_CAPI_TEST_CODE    — (optional) e.g. TEST12345, while validating in
 *                              Events Manager > Test Events
 */

import crypto from "node:crypto";

export type CapiUser = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  country?: string;
  /** _fbp cookie value */
  fbp?: string;
  /** _fbc cookie value (or fbclid-derived) */
  fbc?: string;
  clientIp?: string;
  clientUserAgent?: string;
  externalId?: string;
};

export type CapiEvent = {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  user: CapiUser;
  customData?: Record<string, unknown>;
  /** Defaults to now */
  eventTimeSec?: number;
};

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hashOrUndefined(value?: string): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return sha256(normalized);
}

/**
 * Build the user_data block. Meta requires PII to be SHA-256 hashed and
 * normalised (lowercased, trimmed, no spaces for phone).
 */
function buildUserData(u: CapiUser) {
  const userData: Record<string, string | string[]> = {};
  const em = hashOrUndefined(u.email);
  if (em) userData.em = em;
  const fn = hashOrUndefined(u.firstName);
  if (fn) userData.fn = fn;
  const ln = hashOrUndefined(u.lastName);
  if (ln) userData.ln = ln;
  const ph = hashOrUndefined(u.phone?.replace(/\D/g, ""));
  if (ph) userData.ph = ph;
  const ct = hashOrUndefined(u.city);
  if (ct) userData.ct = ct;
  const country = hashOrUndefined(u.country);
  if (country) userData.country = country;
  if (u.fbp) userData.fbp = u.fbp;
  if (u.fbc) userData.fbc = u.fbc;
  if (u.clientIp) userData.client_ip_address = u.clientIp;
  if (u.clientUserAgent) userData.client_user_agent = u.clientUserAgent;
  if (u.externalId) userData.external_id = sha256(u.externalId.trim());
  return userData;
}

export async function postToMetaCapi(
  event: CapiEvent,
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const testCode = process.env.META_CAPI_TEST_CODE;

  if (!pixelId || !accessToken) {
    return { ok: false, error: "META_PIXEL_ID or META_CAPI_ACCESS_TOKEN not configured" };
  }

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTimeSec ?? Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl,
        action_source: "website",
        user_data: buildUserData(event.user),
        custom_data: event.customData ?? {},
      },
    ],
    ...(testCode ? { test_event_code: testCode } : {}),
  };

  const endpoint = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(
    accessToken,
  )}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, status: res.status, error: text.slice(0, 300) };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/* ---------- helpers ---------- */

/** Parse a Cookie header for `_fbp` and `_fbc`. */
export function readMetaCookies(cookieHeader: string | null): {
  fbp?: string;
  fbc?: string;
} {
  if (!cookieHeader) return {};
  const out: { fbp?: string; fbc?: string } = {};
  for (const part of cookieHeader.split(";")) {
    const [rawK, ...rest] = part.split("=");
    const k = rawK?.trim();
    const v = rest.join("=").trim();
    if (!k || !v) continue;
    if (k === "_fbp") out.fbp = decodeURIComponent(v);
    else if (k === "_fbc") out.fbc = decodeURIComponent(v);
  }
  return out;
}
