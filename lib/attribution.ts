/** Internal CRM attribution only. Never pass this object to advertising APIs. */
export const ATTRIBUTION_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "campaign_id", "adset_id", "ad_id", "placement", "site_source_name", "fbclid", "gclid",
] as const;

export type Attribution = Partial<Record<typeof ATTRIBUTION_KEYS[number], string>> & {
  landing_url?: string;
  captured_at?: string;
};

const STORE_KEY = "hsw:attribution:v1";

function clean(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const result = value.trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 512);
  return result || undefined;
}

/** Allowlist campaign metadata; drop arbitrary URL/form fields. */
export function normalizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const raw = input as Record<string, unknown>;
  const result: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = clean(raw[key]);
    if (value && !value.includes("{{")) result[key] = value;
  }
  if (typeof raw.captured_at === "string" && Number.isFinite(Date.parse(raw.captured_at))) {
    result.captured_at = new Date(raw.captured_at).toISOString();
  }
  if (typeof raw.landing_url === "string") {
    try {
      const url = new URL(raw.landing_url);
      if (url.protocol === "https:" || url.protocol === "http:") {
        // Paths can contain report/contact IDs. Retain the origin and allowed campaign keys only.
        const safe = new URL(url.origin);
        for (const key of ATTRIBUTION_KEYS) {
          const value = result[key] || clean(url.searchParams.get(key));
          if (value && !value.includes("{{")) {
            result[key] = value;
            safe.searchParams.set(key, value);
          }
        }
        result.landing_url = safe.toString();
      }
    } catch { /* invalid attribution must not reject a legitimate enquiry */ }
  }
  return result;
}

export function attributionStatus(a: Attribution, fbc?: string) {
  const source = (a.utm_source || a.site_source_name || "").toLowerCase();
  const medium = (a.utm_medium || "").toLowerCase();
  const campaign = a.campaign_id || a.utm_campaign || "";
  if (["fb", "ig", "facebook", "instagram", "meta"].includes(source) &&
      ["paid_social", "paid", "cpc", "ppc"].includes(medium) && /^\d+$/.test(campaign)) {
    return "meta_paid_social";
  }
  if (a.fbclid || fbc) return "meta_click_unverified";
  if (a.utm_source || a.gclid) return "tagged_other";
  return "unknown";
}

/** Capture at entry, keeping campaign context through internal quiz navigation. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  let previous: Attribution = {};
  try { previous = normalizeAttribution(JSON.parse(sessionStorage.getItem(STORE_KEY) || "{}")); }
  catch { /* storage can be unavailable */ }
  const url = new URL(window.location.href);
  const hasCampaign = ATTRIBUTION_KEYS.some((key) => url.searchParams.has(key));
  const incoming = normalizeAttribution({
    ...Object.fromEntries(ATTRIBUTION_KEYS.map((key) => [key, url.searchParams.get(key)])),
    landing_url: url.toString(),
    captured_at: new Date().toISOString(),
  });
  const result = hasCampaign || !previous.landing_url ? incoming : previous;
  try { sessionStorage.setItem(STORE_KEY, JSON.stringify(result)); } catch { /* no storage fallback */ }
  return result;
}

/** Cookie reads are optional: a malformed cookie must never drop a lead. */
export function readMetaCookies(header: string | null): { fbp?: string; fbc?: string } {
  const result: { fbp?: string; fbc?: string } = {};
  for (const part of (header || "").split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name !== "_fbp" && name !== "_fbc") continue;
    try {
      const value = clean(decodeURIComponent(rest.join("=")));
      if (value) result[name === "_fbp" ? "fbp" : "fbc"] = value;
    } catch { /* ignore malformed values */ }
  }
  return result;
}
