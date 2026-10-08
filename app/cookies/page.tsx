import { LegalShell } from "@/components/legal/legal-shell";
import { CookiePreferenceControl } from "@/components/meta-pixel";

export const metadata = {
  title: "Cookies",
  description: "How HSW uses optional Meta measurement, browser storage and campaign information, and how to change your choice.",
};

export default function CookiesPage() {
  return (
    <LegalShell eyebrow="Cookies" title="Cookie Policy" updated="9 September 2026">
      <p>
        We use browser storage to support the assessment and remember your cookie
        choice. Optional Meta measurement on our public pages starts only after
        you choose <strong>Allow</strong>. Choosing <strong>Decline</strong> does
        not prevent you from using the assessment or contacting the clinic.
      </p>

      <h2>Optional Meta measurement</h2>
      <p>
        When allowed, the Meta Pixel records a PageView on a public page and may
        set or read advertising cookies such as <strong>_fbp</strong> and
        <strong> _fbc</strong>. Meta receives information about that visit,
        including the public page URL and browser or device information. See{" "}
        <a href="https://www.facebook.com/privacy/policies/cookies/" target="_blank" rel="noopener noreferrer">
          Meta's cookie policy
        </a>.
      </p>
      <p>
        We do not load the Meta Pixel on the quiz, personalised result or booking
        pages. If the Pixel has loaded on a public page, entering the assessment
        starts a fresh document to keep it out of the assessment. Our website does not send
        questionnaire answers, assessment scores or protocols to Meta.
      </p>

      <h2>Optional enquiry measurement</h2>
      <p>
        If enquiry measurement is available, the contact form offers a separate,
        optional checkbox. With your permission, after the clinic confirms receipt,
        we send Meta a Lead event, an event identifier, hashed email and phone,
        advertising cookie identifiers and IP/browser details. Hashing supports
        matching and does not make these details anonymous. The event identifies an
        enquiry on this clinic website; it excludes your assessment answers, score,
        protocol and report. Declining does not affect your enquiry or report.
      </p>
      <p>
        A confirmation page may send the same Lead event through the Meta Pixel,
        with a shared identifier to avoid counting it twice. No Meta SDK is loaded
        beside your assessment or personalised report. This measurement is enabled
        only where the submission event is eligible under Meta's restrictions.
      </p>

      <h2>Browser storage and clinic intake</h2>
      <ul>
        <li>
          <strong>Assessment information:</strong> sessionStorage and localStorage
          support the quiz and display your report without an account. When you
          submit an enquiry, your contact details and assessment information are
          sent to the clinic's intake system.
        </li>
        <li>
          <strong>Campaign information:</strong> sessionStorage preserves available
          source, campaign, ad and click identifiers, together with a landing URL
          limited to the site origin and supported campaign parameters. This
          information accompanies your enquiry in the clinic's CRM to help us
          understand where enquiries came from. The full campaign object is not
          sent to Meta; eligible, separately consented enquiry measurement may use
          the advertising cookie identifiers described above.
        </li>
        <li>
          <strong>Your choice:</strong> localStorage remembers whether you allowed
          or declined Meta measurement. You can change this below or clear it in
          your browser's site settings.
        </li>
      </ul>
      <p>
        Session storage normally lasts for the browser tab's session. Local
        storage remains until it is removed by the site or cleared in your
        browser. Clearing browser data does not delete an enquiry already sent
        to the clinic.
      </p>

      <h2>Other services</h2>
      <p>
        Where configured, we use{" "}
        <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer">
          Plausible
        </a>{" "}
        for cookieless, aggregate website measurement. The Meta choice above
        controls the Meta Pixel.
      </p>
      <p>
        The booking page can load a GoHighLevel calendar through our branded
        booking domain, link.harleystreetmedicalwellness.co.uk. The embedded
        service may use its own cookies or similar technologies when loaded,
        under{" "}
        <a href="https://www.gohighlevel.com/privacy-policy" target="_blank" rel="noopener noreferrer">
          GoHighLevel's privacy policy
        </a>.
      </p>

      <h2>Changing your choice</h2>
      <p>
        Use the button below to allow or decline optional Meta measurement. If
        you decline after allowing it, this page reloads to stop the already
        loaded Pixel. You can remove previously stored cookies through your
        browser's site settings.
      </p>
      <CookiePreferenceControl />

      <h2>Contact</h2>
      <p>
        <a href="mailto:hello@harleystreetmedicalwellness.co.uk">hello@harleystreetmedicalwellness.co.uk</a>
      </p>
    </LegalShell>
  );
}
