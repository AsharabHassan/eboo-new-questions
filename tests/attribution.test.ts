import assert from "node:assert/strict";
import { test } from "node:test";
import { attributionStatus, captureAttribution, normalizeAttribution, readMetaCookies } from "../lib/attribution";

test("normalization drops arbitrary health/contact fields, URL paths and fragments", () => {
  const value = normalizeAttribution({
    utm_source: " facebook ", utm_medium: "paid_social", campaign_id: "120999000000001",
    toxic_load_score: 99, safety_flags: "synthetic", email: "offline@example.invalid",
    landing_url: "https://assessment.invalid/result/private-result-id?campaign_id=120999000000001&email=offline%40example.invalid&toxic_load_score=99#private-fragment",
  });
  assert.equal(value.utm_source, "facebook");
  assert.equal(value.campaign_id, "120999000000001");
  assert.ok(!("toxic_load_score" in value));
  assert.ok(!("safety_flags" in value));
  assert.ok(!("email" in value));
  const url = new URL(value.landing_url!);
  assert.equal(url.pathname, "/");
  assert.equal(url.hash, "");
  assert.equal(url.searchParams.get("campaign_id"), "120999000000001");
  assert.equal(url.searchParams.has("email"), false);
  assert.equal(url.searchParams.has("toxic_load_score"), false);
});

test("a click identifier alone is not labelled paid campaign acquisition", () => {
  assert.equal(attributionStatus({ fbclid: "synthetic-click" }), "meta_click_unverified");
  assert.equal(attributionStatus({}, "fb.1.123.synthetic-click"), "meta_click_unverified");
  assert.equal(attributionStatus({}), "unknown");
  assert.equal(attributionStatus({ utm_source: "google", utm_medium: "cpc" }), "tagged_other");
});

test("paid Meta classification requires source, paid medium and a numeric campaign identifier", () => {
  assert.equal(attributionStatus({ utm_source: "facebook", utm_medium: "paid_social", campaign_id: "120999000000001" }), "meta_paid_social");
  assert.notEqual(attributionStatus({ utm_source: "facebook", campaign_id: "120999000000001" }), "meta_paid_social");
  assert.notEqual(attributionStatus({ utm_source: "facebook", utm_medium: "organic", campaign_id: "120999000000001" }), "meta_paid_social");
  assert.equal(attributionStatus({ utm_source: "facebook", utm_medium: "paid_social", utm_campaign: "120999000000001" }), "meta_paid_social");
  assert.notEqual(attributionStatus({ utm_source: "facebook", utm_medium: "paid_social", utm_campaign: "descriptive-campaign-name" }), "meta_paid_social");
});

test("invalid input and unresolved dynamic placeholders cannot manufacture attribution", () => {
  for (const value of [null, undefined, "invalid", 123, []]) {
    assert.deepEqual(normalizeAttribution(value), {});
  }
  const result = normalizeAttribution({ campaign_id: "{{campaign.id}}", ad_id: { invalid: true }, landing_url: "javascript:alert(1)" });
  assert.equal(result.campaign_id, undefined);
  assert.equal(result.ad_id, undefined);
  assert.equal(result.landing_url, undefined);
});

test("malformed Meta cookie values are safely ignored", () => {
  assert.deepEqual(readMetaCookies("_fbc=%E0%A4%A; _fbp=%"), {});
  assert.deepEqual(readMetaCookies(null), {});
  assert.deepEqual(readMetaCookies("_fbc=fb.1.123.synthetic; irrelevant=value"), { fbc: "fb.1.123.synthetic" });
});

test("campaign context survives navigation from the landing page to the questionnaire", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
  const location = { href: "https://assessment.invalid/?utm_source=facebook&utm_medium=paid_social&campaign_id=120999000000001&ad_id=120999000000003" };
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location } });
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: storage });
  try {
    const entry = captureAttribution();
    location.href = "https://assessment.invalid/quiz";
    const questionnaire = captureAttribution();
    assert.equal(questionnaire.campaign_id, "120999000000001");
    assert.equal(questionnaire.ad_id, "120999000000003");
    assert.equal(questionnaire.landing_url, entry.landing_url);
    assert.equal(questionnaire.captured_at, entry.captured_at);
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (originalStorage) Object.defineProperty(globalThis, "sessionStorage", originalStorage);
    else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});
