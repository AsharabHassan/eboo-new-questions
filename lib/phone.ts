/** UK local numbers default to +44; explicit international prefixes are preserved. */
export function normalisePhoneE164(value: unknown): string {
  if (typeof value !== "string") return "";
  const raw = value.trim();
  if (!/^[+\d\s().-]+$/.test(raw)) return "";
  const digits = raw.replace(/\D/g, "");
  let international = raw.startsWith("+") ? digits : raw.startsWith("00") ? digits.slice(2) : "";
  if (international) {
    if (international.startsWith("440")) international = `44${international.slice(3)}`;
    if (international.startsWith("44")) return /^44[1-9]\d{9}$/.test(international) ? `+${international}` : "";
    return /^[1-9]\d{9,14}$/.test(international) ? `+${international}` : "";
  }
  if (/^44\d{10}$/.test(digits)) return `+${digits}`;
  if (/^0[1-9]\d{9}$/.test(digits)) return `+44${digits.slice(1)}`;
  if (/^[12378]\d{9}$/.test(digits)) return `+44${digits}`;
  return "";
}
