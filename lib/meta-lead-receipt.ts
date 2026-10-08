export const META_LEAD_RECEIPT_KEY = "hsw:meta-lead-receipt:v1";
export type MetaLeadReceipt = { eventId: string; pixelId: string; createdAt: number };

export function parseMetaLeadReceipt(raw: string | null, now = Date.now()): MetaLeadReceipt | null {
  try {
    const value = JSON.parse(raw || "null");
    if (!value || typeof value.eventId !== "string" || typeof value.pixelId !== "string" ||
        !/^[a-zA-Z0-9_-]{1,128}$/.test(value.eventId) ||
        !/^\d+$/.test(value.pixelId) || typeof value.createdAt !== "number" ||
        !Number.isFinite(value.createdAt) ||
        value.createdAt > now || now - value.createdAt > 10 * 60 * 1000) return null;
    return { eventId: value.eventId, pixelId: value.pixelId, createdAt: value.createdAt };
  } catch { return null; }
}

/** Remove before returning: refreshes and double effects cannot reuse this receipt. */
export function consumeMetaLeadReceipt(storage: Pick<Storage, "getItem" | "removeItem">) {
  const raw = storage.getItem(META_LEAD_RECEIPT_KEY);
  storage.removeItem(META_LEAD_RECEIPT_KEY);
  return parseMetaLeadReceipt(raw);
}
