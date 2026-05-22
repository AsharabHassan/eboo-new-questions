import { LegalShell } from "@/components/legal/legal-shell";

export const metadata = {
  title: "Cookies",
  description:
    "How HSW uses cookies and similar technologies. We use no third-party tracking cookies — analytics is cookieless.",
};

export default function CookiesPage() {
  return (
    <LegalShell eyebrow="Cookies" title="Cookie Policy" updated="May 2026">
      <p>
        We've kept this short because there isn't much to say. HSW uses no third-party
        tracking cookies and no advertising cookies. We're built around a privacy-first
        analytics setup, which means you'll find no cookie banner on the site and no
        consent toggles — there's nothing to consent to.
      </p>

      <h2>What we <em>do</em> use</h2>
      <ul>
        <li>
          <strong>Strictly necessary browser storage</strong> — your browser's
          sessionStorage and localStorage hold your in-progress quiz answers and your
          assessment result ID, so the page can show you your report without an account.
          These are <em>not cookies</em> — they live only in your own browser, are never
          transmitted to our servers, and are cleared when you close the browser tab (for
          sessionStorage) or when you clear your site data (for localStorage).
        </li>
        <li>
          <strong>Cookieless analytics</strong> — we use{" "}
          <a href="https://plausible.io" target="_blank" rel="noopener noreferrer">
            Plausible Analytics
          </a>, which records aggregated, anonymous page-view data using a fingerprint of
          the current day's anonymised request signature only — no cookies, no IP address
          storage, no device tracking, no cross-site identification.
        </li>
      </ul>

      <h2>What we <em>don't</em> use</h2>
      <ul>
        <li>No Google Analytics or other third-party tracker.</li>
        <li>No advertising or retargeting cookies (Facebook Pixel, Google Ads, etc.).</li>
        <li>No social media share buttons that drop cookies.</li>
        <li>No fingerprinting scripts.</li>
      </ul>

      <h2>Embedded third parties</h2>
      <p>
        When you visit the <strong>/book</strong> page we load an embedded booking widget
        from GoHighLevel. That widget runs on a separate domain
        (api.leadconnectorhq.com) and operates under{" "}
        <a href="https://www.gohighlevel.com/privacy-policy" target="_blank" rel="noopener noreferrer">
          GoHighLevel's own privacy policy and cookie practices
        </a>
        . If you don't book a consultation, no third-party cookies from GoHighLevel will
        be set in your browser.
      </p>

      <h2>Changing your mind</h2>
      <p>
        Because we use no tracking cookies, there's no opt-out to configure. If you want
        to clear your sessionStorage / localStorage data manually, use your browser's
        site settings or developer tools.
      </p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:hello@harleystreetmedicalwellness.co.uk">hello@harleystreetmedicalwellness.co.uk</a>
      </p>
    </LegalShell>
  );
}
