import { createHash } from "node:crypto";
import { isIP } from "node:net";

/** Enable only after Meta confirms this EBOO submission event is eligible. */
export function metaLeadConfig() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
  const token = process.env.META_CAPI_ACCESS_TOKEN || "";
  const version = process.env.META_GRAPH_API_VERSION || "";
  const enabled = process.env.META_LEAD_ENABLED === "true" &&
    process.env.NEXT_PUBLIC_META_LEAD_ENABLED === "true" &&
    /^\d+$/.test(pixelId) && Boolean(token) && /^v\d+\.\d+$/.test(version);
  return { enabled, pixelId, token, version };
}

type MetaLeadInput = {
  eventId: string; email: string; phoneE164: string; sourceUrl: string;
  consent: boolean; fbp?: string; fbc?: string; userAgent?: string; ipAddress?: string;
};

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

/** Construct an allowlist from primitives. Never accept the CRM/assessment payload. */
export function buildMetaLeadEvent(input: MetaLeadInput) {
  const source = new URL(input.sourceUrl);
  if (source.protocol !== "https:" && source.protocol !== "http:") throw new Error("Invalid event source");
  source.search = "";
  source.hash = "";
  const userData: Record<string, string | string[]> = {
    em: [hash(input.email.trim().toLowerCase())],
    ph: [hash(input.phoneE164.replace(/\D/g, ""))],
  };
  for (const key of ["fbp", "fbc"] as const) {
    const value = input[key];
    if (value && /^fb\.\d+\.\d+\.[A-Za-z0-9_-]{1,512}$/.test(value)) userData[key] = value;
  }
  if (input.ipAddress && isIP(input.ipAddress)) userData.client_ip_address = input.ipAddress;
  if (input.userAgent) userData.client_user_agent = input.userAgent.slice(0, 1024);
  return {
    event_name: "Lead", event_id: input.eventId,
    event_time: Math.floor(Date.now() / 1000), action_source: "website",
    event_source_url: source.toString(), user_data: userData,
    custom_data: { currency: "GBP" },
  };
}

export async function sendMetaLead(input: MetaLeadInput): Promise<{
  status: "disabled" | "no_consent" | "accepted" | "failed";
}> {
  const config = metaLeadConfig();
  if (!config.enabled) return { status: "disabled" };
  if (!input.consent) return { status: "no_consent" };
  try {
    const payload = {
      data: [buildMetaLeadEvent(input)],
      ...(process.env.META_CAPI_TEST_CODE ? { test_event_code: process.env.META_CAPI_TEST_CODE } : {}),
    };
    const response = await fetch(`https://graph.facebook.com/${config.version}/${config.pixelId}/events`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.token}` },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(5000),
    });
    const receipt = await response.json().catch(() => null);
    if (response.ok && receipt?.events_received === 1) return { status: "accepted" };
    // Do not log Meta response bodies, tokens, contact details or the event payload.
    console.warn("[meta-lead] Delivery not accepted", { status: response.status });
  } catch {
    console.warn("[meta-lead] Delivery could not be confirmed");
  }
  // Meta failures must never turn a successfully saved CRM lead into a failed form.
  return { status: "failed" };
}
