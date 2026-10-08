"use client";

import { useEffect, useRef, useState } from "react";
import { consumeMetaLeadReceipt } from "@/lib/meta-lead-receipt";

type Pixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void; queue: unknown[][];
  push?: Pixel; loaded?: boolean; version?: string;
};

export function LeadConfirmation({ enabled, pixelId }: { enabled: boolean; pixelId: string }) {
  const started = useRef(false);
  const [resultId, setResultId] = useState<string | null>(null);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    try {
      // Consume once: direct visits/reloads cannot create another browser Lead.
      const receipt = consumeMetaLeadReceipt(sessionStorage);
      if (!receipt) return;
      setResultId(receipt.eventId);
      if (!enabled || receipt.pixelId !== pixelId || window.location.search || window.location.hash) return;
      const win = window as typeof window & { fbq?: Pixel; _fbq?: Pixel };
      if (!win.fbq) {
        const pixel = function (...args: unknown[]) {
          if (pixel.callMethod) pixel.callMethod(...args);
          else pixel.queue.push(args);
        } as Pixel;
        pixel.queue = []; pixel.push = pixel; pixel.loaded = true; pixel.version = "2.0";
        win.fbq = pixel; win._fbq = pixel;
        const script = document.createElement("script");
        script.async = true; script.src = "https://connect.facebook.net/en_US/fbevents.js";
        document.head.appendChild(script);
      }
      win.fbq("set", "autoConfig", false, pixelId);
      win.fbq("init", pixelId);
      win.fbq("trackSingle", pixelId, "Lead", { currency: "GBP" }, { eventID: receipt.eventId });
    } catch { /* Optional browser measurement must not prevent access to the report. */ }
  }, [enabled, pixelId]);

  return (
    <main className="min-h-screen bg-ground px-6 py-24 text-ink">
      <section className="mx-auto max-w-xl">
        <h1 className="font-display text-4xl">{resultId ? "Thank you. Your enquiry has been received." : "Harley Street Wellness"}</h1>
        <p className="mt-6 text-ink-dim">{resultId ? "Your report is ready. You can view it and choose whether to request a consultation." : "Please complete the assessment to receive your report."}</p>
        {/* Full navigation unloads Meta before any personalised result appears. */}
        <a className="mt-8 inline-block bg-gold px-6 py-3 text-ground"
          href={resultId ? `/result/${resultId}` : "/quiz"}> {resultId ? "View my report" : "Start assessment"}</a>
      </section>
    </main>
  );
}
