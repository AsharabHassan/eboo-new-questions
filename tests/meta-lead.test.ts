import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { buildMetaLeadEvent } from "../lib/meta-lead";
import { parseMetaLeadReceipt, consumeMetaLeadReceipt } from "../lib/meta-lead-receipt";

test("matching uses normalized hashes and excludes URL query, fragment and arbitrary input", () => {
  const input = {
    eventId: "q_test", email: " PERSON@EXAMPLE.INVALID ", phoneE164: "+447700900123",
    sourceUrl: "https://assessment.invalid/quiz?email=private&score=90#result", consent: true,
    ipAddress: "not-an-ip", fbc: "malformed", answers: { symptoms: "private" },
  };
  const event = buildMetaLeadEvent(input);
  assert.equal(event.event_source_url, "https://assessment.invalid/quiz");
  assert.deepEqual(event.user_data.em, [createHash("sha256").update("person@example.invalid").digest("hex")]);
  assert.deepEqual(event.user_data.ph, [createHash("sha256").update("447700900123").digest("hex")]);
  assert.equal(event.user_data.client_ip_address, undefined);
  assert.equal(event.user_data.fbc, undefined);
  assert.ok(!JSON.stringify(event).includes("private"));
});

test("a confirmation receipt is consumed once and cannot fire on refresh", () => {
  let raw: string | null = JSON.stringify({ eventId: "q_test", pixelId: "123456789", createdAt: Date.now() });
  const storage = { getItem: () => raw, removeItem: () => { raw = null; } };
  assert.equal(consumeMetaLeadReceipt(storage)?.eventId, "q_test");
  assert.equal(consumeMetaLeadReceipt(storage), null);
});

test("confirmation receipts reject missing, malformed, future and expired receipts", () => {
  const now = 1_000_000;
  const receipt = { eventId: "q_test", pixelId: "123456789", createdAt: now };
  assert.deepEqual(parseMetaLeadReceipt(JSON.stringify(receipt), now), receipt);
  for (const raw of [null, "{", JSON.stringify({ ...receipt, eventId: "<script>" }),
    JSON.stringify({ ...receipt, createdAt: now + 1 }),
    JSON.stringify({ ...receipt, createdAt: now - 600001 })]) {
    assert.equal(parseMetaLeadReceipt(raw, now), null);
  }
});
