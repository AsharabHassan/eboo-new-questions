import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { setImmediate as nextTurn } from "node:timers/promises";

// All endpoints and identities below are synthetic. The fetch stub fails closed:
// no test can contact GHL, Meta, Resend or any other external service.
const LONDON = "https://crm.invalid/london";
const GLASGOW = "https://crm.invalid/glasgow";
const ENV_KEYS = [
  "GHL_WEBHOOK_URL", "GHL_WEBHOOK_URL_GLASGOW", "RESEND_API_KEY",
  "RESEND_FROM", "CLINIC_EMAIL", "META_PIXEL_ID", "META_CAPI_ACCESS_TOKEN",
  "META_CAPI_TEST_CODE", "NEXT_PUBLIC_META_PIXEL_ID", "NEXT_PUBLIC_SITE_URL",
  "META_LEAD_ENABLED", "NEXT_PUBLIC_META_LEAD_ENABLED", "META_GRAPH_API_VERSION",
] as const;

type CapturedCall = { url: string; payload: Record<string, unknown> };
let originalFetch: typeof fetch;
let originalEnv: Map<string, string | undefined>;
let calls: CapturedCall[];
let allowMeta: boolean;

beforeEach(() => {
  originalFetch = globalThis.fetch;
  originalEnv = new Map(ENV_KEYS.map((key) => [key, process.env[key]]));
  for (const key of ENV_KEYS) delete process.env[key];
  process.env.GHL_WEBHOOK_URL = LONDON;
  process.env.GHL_WEBHOOK_URL_GLASGOW = GLASGOW;
  process.env.NEXT_PUBLIC_SITE_URL = "https://assessment.invalid";
  calls = [];
  allowMeta = false;
  mockFetch(() => new Response("{}", { status: 200 }));
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of originalEnv) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function mockFetch(
  reply: (call: CapturedCall) => Response | Promise<Response>,
) {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const call = {
      url,
      payload: JSON.parse(typeof init?.body === "string" ? init.body : "{}"),
    };
    calls.push(call);
    assert.ok(url === LONDON || url === GLASGOW ||
      (allowMeta && url === "https://graph.facebook.com/v25.0/999999999999999/events"),
      `Unexpected external request blocked: ${new URL(url).hostname}`);
    assert.equal(init?.method, "POST");
    return reply(call);
  }) as typeof fetch;
}

function validLead(city: "london" | "glasgow" = "london") {
  return {
    id: "q_offline_test_submission_001",
    name: "Offline Test",
    email: "offline-test@example.invalid",
    phone: "07700 900123",
    answers: {
      lifestyle: "steady", symptoms: ["none"], age: "30-44",
      goal: "longevity", pregnancy: "no", g6pd: "no", anticoag: "no",
      location: city,
    },
  };
}

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://assessment.invalid/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

async function submit(body: unknown = validLead(), headers: Record<string, string> = {}) {
  const { POST } = await import("../app/api/lead/route");
  return POST(request(body, headers));
}

test("a successful London handoff preserves contact and submission identity", async () => {
  const response = await submit();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, LONDON);
  assert.equal(calls[0].payload.submission_id, "q_offline_test_submission_001");
  assert.equal(calls[0].payload.full_name, "Offline Test");
  assert.equal(calls[0].payload.email, "offline-test@example.invalid");
  assert.equal(calls[0].payload.phone, "+447700900123");
  assert.equal(calls[0].payload.answer_location_value, "london");
});

test("Glasgow submissions reach only the Glasgow workflow", async () => {
  const response = await submit(validLead("glasgow"));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, GLASGOW);
  assert.equal(calls[0].payload.answer_location_value, "glasgow");
});

test("success waits for the CRM response instead of merely starting delivery", async () => {
  let release: ((response: Response) => void) | undefined;
  mockFetch(() => new Promise<Response>((resolve) => { release = resolve; }));
  let completed = false;
  const pending = submit().then((response) => { completed = true; return response; });
  // Allow Request.json() and the route's async work to reach the mocked handoff.
  for (let i = 0; i < 10 && !release && !completed; i++) await nextTurn();
  assert.ok(release, "Expected a pending CRM request");
  assert.equal(completed, false, "The API reported completion before CRM accepted the submission");
  release(new Response("{}", { status: 202 }));
  const response = await pending;
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
});

test("a CRM rejection returns 502 and does not expose the provider response", async () => {
  mockFetch(() => new Response("provider-private-detail", { status: 400 }));
  const response = await submit();
  assert.equal(response.status, 502);
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.ok(!JSON.stringify(body).includes("provider-private-detail"));
  assert.equal(calls.length, 1, "Rejected handoffs are not automatically replayed");
});

test("a network failure returns 502 without automatically replaying a submission", async () => {
  mockFetch(() => { throw new TypeError("Synthetic offline failure"); });
  const response = await submit();
  assert.equal(response.status, 502);
  assert.equal((await response.json()).ok, false);
  assert.equal(calls.length, 1);
});

test("missing London configuration fails closed before sending", async () => {
  delete process.env.GHL_WEBHOOK_URL;
  const response = await submit();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
  assert.equal(calls.length, 0);
});

test("missing Glasgow configuration never falls back to the London workflow", async () => {
  delete process.env.GHL_WEBHOOK_URL_GLASGOW;
  const response = await submit(validLead("glasgow"));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
  assert.equal(calls.length, 0);
});

test("configured credentials alone cannot activate Meta forwarding", async () => {
  process.env.META_PIXEL_ID = "999999999999999";
  process.env.NEXT_PUBLIC_META_PIXEL_ID = "999999999999999";
  process.env.META_CAPI_ACCESS_TOKEN = "synthetic-test-token-not-a-credential";
  const response = await submit();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.deepEqual(calls.map((call) => call.url), [LONDON]);
});

function enableMeta() {
  allowMeta = true;
  process.env.META_LEAD_ENABLED = "true";
  process.env.NEXT_PUBLIC_META_LEAD_ENABLED = "true";
  process.env.NEXT_PUBLIC_META_PIXEL_ID = "999999999999999";
  process.env.META_GRAPH_API_VERSION = "v25.0"; // Synthetic stub; no live version dependency.
  process.env.META_CAPI_ACCESS_TOKEN = "synthetic-test-token-not-a-credential";
}

test("even an enabled sender requires explicit visitor consent", async () => {
  enableMeta();
  const response = await submit({ ...validLead(), metaLeadConsent: "true" });
  const body = await response.json();
  assert.equal(body.meta.status, "no_consent");
  assert.equal(body.meta.eventId, undefined);
  assert.deepEqual(calls.map((call) => call.url), [LONDON]);
});

test("consented CAPI runs after CRM receipt with the same event ID and no assessment data", async () => {
  enableMeta();
  mockFetch((call) => new Response(JSON.stringify(
    call.url === LONDON ? {} : { events_received: 1, messages: [] },
  ), { status: 200 }));
  const response = await submit({ ...validLead(), metaLeadConsent: true }, {
    cookie: "_fbp=fb.1.12345.synthetic; _fbc=fb.1.12345.synthetic-click",
    "x-forwarded-for": "192.0.2.1", "user-agent": "Synthetic browser",
  });
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.meta.status, "accepted");
  assert.equal(body.meta.eventId, validLead().id);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, LONDON);
  const event = (calls[1].payload.data as Record<string, unknown>[])[0];
  assert.equal(event.event_id, body.meta.eventId);
  assert.equal(event.event_name, "Lead");
  assert.equal(event.event_source_url, "https://assessment.invalid/quiz");
  assert.deepEqual(event.custom_data, { currency: "GBP" });
  const serialized = JSON.stringify(event);
  for (const forbidden of ["answers", "symptoms", "pregnancy", "score", "protocol", "Offline Test", "offline-test@example.invalid", "+447700900123"]) {
    assert.ok(!serialized.includes(forbidden), `Leaked field/value: ${forbidden}`);
  }
});

test("a rejected CRM handoff cannot create a Meta Lead", async () => {
  enableMeta();
  mockFetch(() => new Response("{}", { status: 400 }));
  const response = await submit({ ...validLead(), metaLeadConsent: true });
  assert.equal(response.status, 502);
  assert.deepEqual(calls.map((call) => call.url), [LONDON]);
});

test("CAPI rejection never loses a successfully saved enquiry", async () => {
  enableMeta();
  mockFetch((call) => new Response("{}", { status: call.url === LONDON ? 200 : 400 }));
  const response = await submit({ ...validLead(), metaLeadConsent: true });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.ghl.sent, true);
  assert.equal(body.meta.status, "failed");
  assert.equal(body.meta.eventId, validLead().id); // Browser fallback shares the same identity.
});

test("malformed attribution cookie encodings do not lose a valid enquiry", async () => {
  const response = await submit(validLead(), { cookie: "_fbc=%E0%A4%A; _fbp=%; unrelated=ok" });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.deepEqual(calls.map((call) => call.url), [LONDON]);
});

test("paid-source and campaign identifiers survive the internal CRM handoff", async () => {
  const attribution = {
    utm_source: "facebook", utm_medium: "paid_social", utm_campaign: "eboo-london-test",
    utm_content: "consultation-v1", utm_term: "", campaign_id: "120999000000001",
    adset_id: "120999000000002", ad_id: "120999000000003", placement: "Facebook_Feed",
    site_source_name: "fb", captured_at: "2026-09-09T00:00:00.000Z",
    landing_url: "https://eboo.harleystreetmedicalwellness.co.uk/?utm_source=facebook&utm_medium=paid_social&campaign_id=120999000000001&toxic_load_score=99&email=do-not-retain%40example.invalid",
  };
  const response = await submit({ ...validLead(), attribution });
  assert.equal(response.status, 200);
  const payload = calls[0].payload;
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "campaign_id", "adset_id", "ad_id", "placement", "site_source_name"] as const) {
    assert.equal(payload[key], attribution[key], `${key} was lost in the CRM payload`);
  }
  const sourceUrl = String(payload.meta_event_source_url ?? "");
  assert.ok(sourceUrl.includes("campaign_id=120999000000001"));
  assert.ok(!sourceUrl.includes("toxic_load_score"));
  assert.ok(!sourceUrl.includes("do-not-retain"));
});

test("malformed JSON fails before any external delivery", async () => {
  const { POST } = await import("../app/api/lead/route");
  const response = await POST(new Request("https://assessment.invalid/api/lead", {
    method: "POST", headers: { "content-type": "application/json" }, body: "{invalid",
  }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).ok, false);
  assert.equal(calls.length, 0);
});
