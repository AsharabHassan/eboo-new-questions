"use client";

import Script from "next/script";

/**
 * Meta Pixel loader.
 *
 * Loads the base fbq() function, initialises the pixel, and fires a
 * `PageView`. After this runs, `window.fbq(...)` is available from any
 * client component (e.g. to fire a `Lead` event on form submit).
 *
 * Each browser-side conversion event should be paired with a server-side
 * CAPI event sharing the same `eventID` and `eventName` so Meta can
 * dedupe them — see lib/meta-capi.ts.
 */
export function MetaPixel({ pixelId }: { pixelId: string }) {
  if (!pixelId) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

/* ---------------- fbq helper (client-only) ---------------- */

type FbqArgs =
  | ["init", string]
  | ["track", string, Record<string, unknown>?, { eventID?: string }?]
  | ["trackCustom", string, Record<string, unknown>?, { eventID?: string }?];

declare global {
  interface Window {
    fbq?: (...args: FbqArgs) => void;
  }
}

export function trackPixelEvent(
  name: string,
  params?: Record<string, unknown>,
  eventID?: string,
) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", name, params ?? {}, eventID ? { eventID } : undefined);
}
