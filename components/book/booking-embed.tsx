"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * GoHighLevel calendar embed.
 *
 * GHL exposes booking calendars at
 *   https://api.leadconnectorhq.com/widget/booking/{calendar_id}
 * and ships a small `form_embed.js` that handles iframe resize on the
 * client. Prefill is passed via URL query params (first_name, email,
 * notes, etc.) — see https://help.gohighlevel.com.
 *
 * Config:
 *   NEXT_PUBLIC_GHL_CALENDAR_URL          - main consultation calendar
 *   NEXT_PUBLIC_GHL_SCREENING_CALENDAR_URL - longer slot for safety reviews
 *                                            (falls back to main URL)
 *
 * If neither is set we render a tasteful placeholder so dev and staging
 * keep working before the calendar IDs are provisioned.
 */
const GHL_BASE = process.env.NEXT_PUBLIC_GHL_CALENDAR_URL || "";
const GHL_SCREENING = process.env.NEXT_PUBLIC_GHL_SCREENING_CALENDAR_URL || GHL_BASE;

export function BookingEmbed() {
  const search = useSearchParams();
  const screening = search.get("screening") === "1";
  const [prefill, setPrefill] = useState<{ name: string; email: string; track?: string } | null>(null);

  useEffect(() => {
    try {
      const lastId = window.localStorage.getItem("hsw:last");
      if (!lastId) return;
      const raw = window.sessionStorage.getItem(`hsw:${lastId}`);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setPrefill({ name: parsed.name ?? "", email: parsed.email ?? "", track: parsed.track });
    } catch {
      /* prefill is best-effort */
    }
  }, []);

  // Load GHL resize script once
  useEffect(() => {
    if (!GHL_BASE) return;
    if (document.querySelector('script[data-ghl-embed="1"]')) return;
    const s = document.createElement("script");
    s.src = "https://link.msgsndr.com/js/form_embed.js";
    s.async = true;
    s.dataset.ghlEmbed = "1";
    document.body.appendChild(s);
  }, []);

  if (!GHL_BASE) return <PlaceholderCard screening={screening} prefill={prefill} />;

  const baseUrl = screening ? GHL_SCREENING : GHL_BASE;
  const url = new URL(baseUrl);
  const [first, ...rest] = (prefill?.name ?? "").split(" ");
  if (first) url.searchParams.set("first_name", first);
  if (rest.length) url.searchParams.set("last_name", rest.join(" "));
  if (prefill?.email) url.searchParams.set("email", prefill.email);
  if (prefill?.track) url.searchParams.set("notes", `Track: ${prefill.track}`);

  return (
    <div className="relative">
      {screening && (
        <div className="mb-4 px-5 py-3 border border-rouge/40 bg-rouge/[0.06] font-mono text-[10px] tracking-[0.2em] uppercase text-rouge">
          Screening call · longer slot for safety review
        </div>
      )}
      <div className="relative bg-ground-raised/30 border border-[var(--line)] overflow-hidden">
        {/* The iframe takes whatever height GHL's script tells it to. */}
        <iframe
          src={url.toString()}
          title="Book your HSW consultation"
          loading="lazy"
          className="w-full block"
          style={{ minHeight: 720, border: "none" }}
          scrolling="no"
          id="hsw-ghl-calendar"
        />
      </div>
    </div>
  );
}

function PlaceholderCard({
  screening,
  prefill,
}: {
  screening: boolean;
  prefill: { name: string; email: string; track?: string } | null;
}) {
  return (
    <div className="relative border border-gold/40 bg-gradient-to-br from-gold/[0.04] to-gold/[0.01] p-8 md:p-12 text-center overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(228,201,122,0.08) 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold font-medium mb-5">
          Calendar coming online
        </div>
        <h3 className="font-display text-[28px] md:text-[36px] font-light text-ink mb-5">
          We'll be in touch within{" "}
          <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
            one business day.
          </em>
        </h3>
        <p className="max-w-[480px] mx-auto text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light mb-8">
          We received your assessment and will contact you{prefill?.email ? ` at ${prefill.email}` : ""}{" "}
          to schedule your {screening ? "screening call" : "free consultation"}. London business hours (Mon–Fri, 9–18 GMT).
        </p>
        {prefill?.track && (
          <div className="inline-block font-mono text-[10px] tracking-[0.22em] uppercase border border-gold/40 text-gold px-4 py-2 mb-7">
            Track · {prefill.track}
          </div>
        )}
        <div className="text-[13px] text-ink-faint">
          For urgent enquiries —{" "}
          <a href="mailto:hello@harleystreetmedicalwellness.co.uk" className="text-gold hover:underline">
            hello@harleystreetmedicalwellness.co.uk
          </a>
        </div>
      </div>
    </div>
  );
}
