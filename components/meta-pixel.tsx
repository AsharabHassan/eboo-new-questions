"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CONSENT_KEY = "hsw:meta-consent:v1";
const CHANGE_CHOICE_EVENT = "hsw:change-cookie-choice";
type Consent = "allowed" | "declined" | null;

function isPrivatePath(pathname: string) {
  try { pathname = decodeURIComponent(pathname); } catch { /* Match the original path if malformed. */ }
  return /^\/(quiz|result|book)(\/|$)/.test(pathname);
}

function readConsent(): Consent {
  try {
    const saved = localStorage.getItem(CONSENT_KEY);
    return saved === "allowed" || saved === "declined" ? saved : null;
  } catch {
    return null;
  }
}

export function CookiePreferenceControl() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CHANGE_CHOICE_EVENT))}
      className="border border-gold/60 px-5 py-3 text-sm text-ink hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      Change cookie choice
    </button>
  );
}

/**
 * Meta Pixel loader.
 *
 * Optional public-page PageView only. Assessment conversions stay in the CRM.
 * Enter assessment routes in a fresh document: removing a Script component
 * alone cannot unload a third-party SDK that has already executed.
 */
export function MetaPixel({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const privatePage = isPrivatePath(pathname);
  const configured = /^\d+$/.test(pixelId);
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);
  const [changingChoice, setChangingChoice] = useState(false);
  const sdkMayBeLoaded = useRef(false);
  const documentStartedPrivate = useRef(privatePage);

  useEffect(() => {
    const restoreChoice = () => {
      const saved = readConsent();
      if (sdkMayBeLoaded.current && saved !== "allowed") {
        window.location.reload();
        return;
      }
      if (saved === "allowed" && configured && !isPrivatePath(window.location.pathname)) {
        sdkMayBeLoaded.current = true;
      }
      setConsent(saved);
      setReady(true);
    };
    const openChoice = () => setChangingChoice(true);
    const syncChoice = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) restoreChoice();
    };
    const restoreCachedPage = (event: PageTransitionEvent) => {
      if (event.persisted) restoreChoice();
    };
    const crossPrivacyBoundary = (event: MouseEvent) => {
      if (!configured || (readConsent() !== "allowed" && !sdkMayBeLoaded.current) ||
          event.button !== 0 || event.metaKey ||
          event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("download") ||
          (anchor.target && anchor.target.toLowerCase() !== "_self")) return;
      let url: URL;
      try { url = new URL(anchor.href, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin) return;
      const leavingPrivate = isPrivatePath(window.location.pathname);
      const enteringPrivate = isPrivatePath(url.pathname);
      if (leavingPrivate === enteringPrivate && !(enteringPrivate && sdkMayBeLoaded.current)) return;

      // Isolate both directions: public pages must not load an SDK into a
      // document that still has private routes in its client-side history.
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(url.href);
    };

    document.addEventListener("click", crossPrivacyBoundary, true);
    window.addEventListener(CHANGE_CHOICE_EVENT, openChoice);
    window.addEventListener("storage", syncChoice);
    window.addEventListener("pageshow", restoreCachedPage);
    restoreChoice();
    return () => {
      document.removeEventListener("click", crossPrivacyBoundary, true);
      window.removeEventListener(CHANGE_CHOICE_EVENT, openChoice);
      window.removeEventListener("storage", syncChoice);
      window.removeEventListener("pageshow", restoreCachedPage);
    };
  }, [configured]);

  useEffect(() => {
    if ((privatePage && sdkMayBeLoaded.current) ||
        (configured && consent === "allowed" && privatePage !== documentStartedPrivate.current)) {
      // Defence for future programmatic navigation or client-side history.
      window.location.replace(window.location.href);
    } else if (configured && consent === "allowed" && !privatePage) {
      sdkMayBeLoaded.current = true;
    }
  }, [configured, consent, privatePage]);

  function choose(next: Exclude<Consent, null>) {
    try { localStorage.setItem(CONSENT_KEY, next); } catch { /* Current-page choice still applies. */ }
    if (next === "declined" && sdkMayBeLoaded.current) {
      // A fresh document is required to stop an SDK that has already loaded.
      window.location.reload();
      return;
    }
    if (next === "allowed" && configured && !privatePage) sdkMayBeLoaded.current = true;
    setConsent(next);
    setChangingChoice(false);
  }

  if (privatePage) return null;

  return (
    <>
      {ready && consent === "allowed" && configured && !documentStartedPrivate.current && (
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
          fbq('set', 'autoConfig', false, '${pixelId}');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
          `}
        </Script>
      )}
      {ready && (consent === null || changingChoice) && (
        <section
          aria-labelledby="cookie-choice-title"
          className="fixed inset-x-3 bottom-3 z-[120] mx-auto max-w-[680px] border border-gold/40 bg-ground p-5 shadow-2xl sm:inset-x-6 sm:bottom-6 sm:p-6"
        >
          <h2 id="cookie-choice-title" className="text-base font-medium text-ink">
            Optional measurement
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-dim">
            Allow Meta to measure visits to our public pages using advertising
            cookies? The assessment works with either choice. We keep Meta tracking off the quiz, results and
            booking pages. <a href="/cookies" className="text-gold underline underline-offset-4">Cookie details</a>
          </p>
          <div className="mt-4 flex gap-3">
            {(["allowed", "declined"] as const).map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => choose(choice)}
                className="min-h-11 flex-1 border border-gold/60 px-5 py-2.5 text-sm text-ink hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                {choice === "allowed" ? "Allow" : "Decline"}
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
