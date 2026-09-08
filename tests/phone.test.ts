import assert from "node:assert/strict";
import { test } from "node:test";
import { normalisePhoneE164 } from "../lib/phone";

test("UK national and optional international trunk prefixes normalize consistently", () => {
  for (const raw of ["07700 900123", "7700900123", "+44 7700 900123", "+44 (0)7700 900123", "0044 (0)7700 900123"]) {
    assert.equal(normalisePhoneE164(raw), "+447700900123");
  }
});
test("explicit international numbers retain their country code and malformed numbers fail", () => {
  assert.equal(normalisePhoneE164("+1 202 555 0123"), "+12025550123");
  assert.equal(normalisePhoneE164("123"), "");
  assert.equal(normalisePhoneE164("+44007700900123"), "");
  assert.equal(normalisePhoneE164("invalid07700900123"), "");
});
