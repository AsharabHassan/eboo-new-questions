import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/400-italic.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { MetaPixel } from "@/components/meta-pixel";
import { jsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hsw.london";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HSW — A human oil change, on Harley Street.",
    template: "%s · HSW",
  },
  description:
    "EBOO at Harley Street Wellness, London. A one-hour medical procedure that filters the residue of modern life from your blood and re-oxygenates what's returned. Take the 3-minute assessment.",
  applicationName: "HSW EBOO Assessment",
  authors: [{ name: "Harley Street Wellness" }],
  keywords: [
    "EBOO London",
    "EBOO therapy",
    "extracorporeal blood oxygenation",
    "ozone therapy London",
    "Harley Street wellness",
    "blood detox London",
    "ozone autohaemotherapy",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Harley Street Wellness",
    title: "HSW — A human oil change, on Harley Street.",
    description:
      "A one-hour medical procedure that filters the residue of modern life from your blood. Take the 3-minute assessment.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "HSW — A human oil change, on Harley Street.",
    description:
      "A one-hour medical procedure that filters the residue of modern life from your blood. Take the 3-minute assessment.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B0F1A",
};

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "823507040655170";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationJsonLd())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(websiteJsonLd())}
        />
      </head>
      <body className="grain vignette">
        <SmoothScroll>{children}</SmoothScroll>
        {/* Meta Pixel — paired with server-side CAPI for browser/server dedup. */}
        <MetaPixel pixelId={META_PIXEL_ID} />
        {/* Plausible — cookieless analytics. Only injected when configured. */}
        {PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.outbound-links.tagged-events.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
