import { LegalShell } from "@/components/legal/legal-shell";

export const metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions under which Harley Street Wellness provides this website and its online assessment.",
};

export default function TermsPage() {
  return (
    <LegalShell eyebrow="Terms" title="Terms of Service" updated="May 2026">
      <p>
        These terms ("<strong>Terms</strong>") govern your use of <strong>hsw.london</strong>{" "}
        and the online EBOO assessment provided by Harley Street Wellness Ltd ("<strong>HSW</strong>",
        "we", "our"). By using the site you agree to these Terms in full. If you do not
        agree, please don't use the site.
      </p>

      <h2>1. The service we <em>provide</em></h2>
      <p>
        The site provides:
      </p>
      <ul>
        <li>Educational information about EBOO (Extracorporeal Blood Oxygenation and Ozonation).</li>
        <li>A self-rated wellness assessment that returns a Toxic Load Score, a protocol track, and an emailed report.</li>
        <li>The ability to book a free 15-minute consultation with a GMC-registered doctor.</li>
      </ul>

      <h2>2. Important — wellness, <em>not medical diagnosis</em></h2>
      <p>
        <strong>
          The HSW EBOO assessment is a wellness tool. It does not provide a medical
          diagnosis or constitute medical advice.
        </strong>
      </p>
      <p>
        The score and protocol recommendation are based on self-reported information and
        statistical heuristics. They are intended to inform a conversation with a
        qualified physician — not to replace one. Specifically:
      </p>
      <ul>
        <li>The assessment does not diagnose, treat, cure, or prevent any disease.</li>
        <li>The result is not a clinical record and should not be relied on for treatment decisions.</li>
        <li>You should always consult your GP or another qualified healthcare provider before starting any new therapy, especially if you have a pre-existing condition or take prescribed medication.</li>
        <li>If you are experiencing a medical emergency, call 999 (UK) or attend your nearest A&amp;E. Do not use this site for emergencies.</li>
      </ul>
      <p>
        Any decision to undergo EBOO therapy is made between you and an HSW physician at
        the consultation stage — never on the basis of the assessment result alone.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be 18 years or older to use the assessment. By submitting the assessment
        you confirm that the information you have provided is accurate to the best of your
        knowledge.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Submit deliberately false or misleading information.</li>
        <li>Use automated tools (bots, scrapers) to interact with the site.</li>
        <li>Attempt to interfere with the operation or security of the site.</li>
        <li>Reproduce, redistribute, or commercially exploit the assessment, its content, or the methodology without our written permission.</li>
      </ul>

      <h2>5. Intellectual property</h2>
      <p>
        All site content — including the brand name, logos, copy, assessment design,
        Toxic Load Score methodology, EBOO machine illustration, and visual identity — is
        the property of HSW or its licensors. You may not copy, modify, or reuse any of it
        without our written permission.
      </p>

      <h2>6. Third-party services</h2>
      <p>
        We use third-party services (Resend for email, GoHighLevel for booking, Vercel for
        hosting, Plausible for analytics, NCBI E-utilities for research metadata). Your use
        of these services through our site is also governed by their own terms. We are not
        responsible for their content, availability, or practices.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law:
      </p>
      <ul>
        <li>The site and its content are provided "as is" without warranty of any kind.</li>
        <li>We do not warrant that the site will be uninterrupted, error-free, or that any information will be accurate or complete.</li>
        <li>We are not liable for any indirect, incidental, or consequential loss arising from your use of the site or the assessment.</li>
      </ul>
      <p>
        Nothing in these Terms limits or excludes our liability for death or personal
        injury caused by our negligence, fraud, or any other liability that cannot be
        limited by law.
      </p>

      <h2>8. Marketing communications</h2>
      <p>
        When you complete the assessment we'll send you the report and a small number of
        related follow-up emails. Every email contains a one-click unsubscribe link. You
        can also email <a href="mailto:hello@harleystreetmedicalwellness.co.uk">hello@harleystreetmedicalwellness.co.uk</a> to opt
        out at any time.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be notified by
        email (if we have your address) or by a notice on the site at least 30 days in
        advance.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These Terms are governed by the laws of England and Wales. Any dispute arising
        from these Terms or your use of the site will be subject to the exclusive
        jurisdiction of the courts of England and Wales.
      </p>

      <h2>11. Contact</h2>
      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:hello@harleystreetmedicalwellness.co.uk">hello@harleystreetmedicalwellness.co.uk</a>
        <br />
        <strong>London:</strong> Harley Street Wellness Ltd, London Medical Rooms,
        Ground Floor, 1–5 Portpool Lane, Chancery Lane, London EC1N 7UU ·{" "}
        <a href="tel:+442046283137">020 4628 3137</a>
        <br />
        <strong>Glasgow:</strong> 5th Floor, Ingram House, 227 Ingram Street, Glasgow
        G1 1DA · <a href="tel:+441414888985">0141 488 8985</a>
      </p>
    </LegalShell>
  );
}
