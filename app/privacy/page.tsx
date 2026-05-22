import { LegalShell } from "@/components/legal/legal-shell";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Harley Street Wellness collects, uses, and protects your personal and health information. UK GDPR compliant.",
};

export default function PrivacyPage() {
  return (
    <LegalShell eyebrow="Privacy" title="Privacy Policy" updated="May 2026">
      <p>
        This Privacy Policy explains how Harley Street Wellness ("<strong>HSW</strong>",
        "we", "our", "us") collects, uses, and protects information you provide when
        using <strong>hsw.london</strong> (the "site"), our online assessment, and any
        related services.
      </p>
      <p>
        We are committed to handling your data lawfully, transparently, and only for the
        purposes set out below. This policy is governed by the UK General Data Protection
        Regulation (UK GDPR), the Data Protection Act 2018, and the Privacy and
        Electronic Communications Regulations 2003 (PECR).
      </p>

      <h2>1. Who we are</h2>
      <p>
        <strong>Data controller:</strong> Harley Street Wellness Ltd, London Medical
        Rooms, Ground Floor, 1–5 Portpool Lane, Chancery Lane, London EC1N 7UU, United
        Kingdom. We will register with the Information Commissioner's Office prior to
        public launch; our registration number will appear here once issued.
      </p>
      <p>
        <strong>Contact:</strong> <a href="mailto:hello@harleystreetmedicalwellness.co.uk">hello@harleystreetmedicalwellness.co.uk</a>{" "}
        for any data-related enquiry, including requests to exercise the rights set out
        below.
      </p>

      <h2>2. What we <em>collect</em></h2>
      <h3>2.1 Information you give us</h3>
      <ul>
        <li>
          <strong>Identifiers:</strong> your first name and email address when you
          complete the assessment.
        </li>
        <li>
          <strong>Quiz answers:</strong> your responses to the questions about lifestyle,
          symptoms, age, primary health goal, and safety screen.
        </li>
        <li>
          <strong>Booking information:</strong> if you book a consultation, the calendar
          provider (GoHighLevel) collects your name, email, phone number, and chosen
          appointment slot.
        </li>
      </ul>
      <h3>2.2 Information collected automatically</h3>
      <ul>
        <li>
          <strong>Anonymous analytics:</strong> aggregated page views, referrer, and
          country-level location. We use a cookieless analytics provider (Plausible) — no
          personal identifier, IP address, or device fingerprint is stored.
        </li>
        <li>
          <strong>Technical logs:</strong> our hosting provider (Vercel) retains short
          server logs for security and abuse prevention — typically deleted within 30 days.
        </li>
      </ul>

      <h2>3. Health data — <em>special category</em></h2>
      <p>
        Some questions in our assessment relate to your health (symptoms, pregnancy
        status, G6PD deficiency, anticoagulant medication). Under UK GDPR Article 9, this
        constitutes "special category" data and is given enhanced protection.
      </p>
      <p>
        <strong>Our lawful basis for processing health data is your explicit consent</strong>{" "}
        (UK GDPR Article 9(2)(a)). You give this consent by completing the assessment and
        submitting your details. You can withdraw consent at any time by contacting{" "}
        <a href="mailto:hello@harleystreetmedicalwellness.co.uk">hello@harleystreetmedicalwellness.co.uk</a> — we will delete your
        record without affecting the lawfulness of processing before that point.
      </p>

      <h2>4. Why we use your data</h2>
      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Lawful basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Generate your personalised Toxic Load Score and protocol</td>
            <td>Explicit consent (Article 9(2)(a))</td>
          </tr>
          <tr>
            <td>Email you your report and follow-up information</td>
            <td>Consent (Article 6(1)(a))</td>
          </tr>
          <tr>
            <td>Contact you to schedule a consultation (if you book one)</td>
            <td>Performance of pre-contract steps (Article 6(1)(b))</td>
          </tr>
          <tr>
            <td>Improve the assessment and detect site abuse</td>
            <td>Legitimate interests (Article 6(1)(f))</td>
          </tr>
          <tr>
            <td>Comply with our legal obligations (e.g. record-keeping)</td>
            <td>Legal obligation (Article 6(1)(c))</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Who we <em>share</em> data with</h2>
      <p>
        We never sell your data. We share limited information only with the third-party
        services we use to deliver the service:
      </p>
      <ul>
        <li>
          <strong>Resend</strong> (email delivery) — processes your email address and the
          contents of the report email. EU/US data transfers under Standard Contractual Clauses.
        </li>
        <li>
          <strong>GoHighLevel</strong> (booking / CRM) — receives your booking details if
          you book a consultation.
        </li>
        <li>
          <strong>Vercel</strong> (hosting) — processes anonymous request data and short
          server logs.
        </li>
        <li>
          <strong>Plausible Analytics</strong> (analytics) — receives only aggregated,
          non-identifying page-view data.
        </li>
      </ul>
      <p>
        Each processor is bound by a data processing agreement and operates under
        appropriate technical and organisational safeguards.
      </p>

      <h2>6. How long we <em>keep</em> your data</h2>
      <ul>
        <li>
          <strong>Quiz submissions and health data:</strong> retained for 24 months from
          the date of submission, after which they are deleted unless you become an
          HSW patient (in which case standard NHS / private clinic medical record
          retention applies).
        </li>
        <li>
          <strong>Marketing email subscription:</strong> until you unsubscribe (one-click
          link in every email).
        </li>
        <li>
          <strong>Server logs:</strong> 30 days.
        </li>
        <li>
          <strong>Analytics:</strong> aggregated counts kept indefinitely; no
          individual-level data retained.
        </li>
      </ul>

      <h2>7. Your <em>rights</em></h2>
      <p>Under UK GDPR you have the following rights:</p>
      <ul>
        <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
        <li><strong>Rectification</strong> — ask us to correct inaccurate data.</li>
        <li><strong>Erasure</strong> — ask us to delete your data ("right to be forgotten").</li>
        <li><strong>Restriction</strong> — ask us to pause processing while a query is resolved.</li>
        <li><strong>Portability</strong> — receive your data in a structured, machine-readable format.</li>
        <li><strong>Object</strong> — object to processing based on legitimate interests.</li>
        <li><strong>Withdraw consent</strong> — at any time, without affecting prior lawful processing.</li>
        <li><strong>Complain to the ICO</strong> — at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a> if you believe your rights have been infringed.</li>
      </ul>
      <p>
        To exercise any of these rights, email <a href="mailto:hello@harleystreetmedicalwellness.co.uk">hello@harleystreetmedicalwellness.co.uk</a>.
        We respond to all valid requests within one month.
      </p>

      <h2>8. Security</h2>
      <p>
        We use TLS encryption in transit, strict access controls, and the principle of
        least privilege for all systems handling personal data. No system is perfectly
        secure, but we maintain the technical and organisational measures appropriate to
        the sensitivity of the data we hold.
      </p>

      <h2>9. International transfers</h2>
      <p>
        Some of our processors (Resend, Vercel) are based in or transfer data to the
        United States. These transfers rely on the UK addendum to the EU Standard
        Contractual Clauses, supplemented by technical safeguards (encryption,
        pseudonymisation) where appropriate.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update this policy from time to time. Material changes will be communicated
        by email (if we have your address) or by a prominent notice on the site at least
        30 days before they take effect. The "Last updated" date at the top of this page
        reflects the most recent revision.
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
