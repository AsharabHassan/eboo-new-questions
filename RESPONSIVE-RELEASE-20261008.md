# EBOO responsive check and production release — 8 October 2026

Checked local homepage, `/retarget`, `/quiz`, `/book` and `/thank-you` at
320, 390, 768 and 1440 CSS pixels. No page-level horizontal overflow or clipped
heading boxes were detected. Visually reviewed mobile ad destination, assessment
and confirmation, plus desktop confirmation. The mobile menu opened/closed and
the assessment advanced from the lifestyle question to the next question.

Enlarged the assessment Back button from a 16px mobile width to a minimum 44px
tap target. No synthetic submission or booking was made in the live CRM.

Previous production deployment: `dpl_6ywzXs5FGJ6HuAVBVxbcFLkra3s8`.
New production deployment: `dpl_4bWfcQDxN4Tfgwxy6r1syiJm4hzk`.
Existing Vercel project: `eboo-new-questions`.
Verified custom domain: https://eboo.harleystreetwellness.co.uk/

The remote production build passed. Vercel reports the new deployment Ready and
both EBOO custom domains assigned to it. Checked the live `/retarget` page at
390px: correct London/Glasgow addresses, no horizontal overflow. The live `/book`
calendar loaded the Wellness Consultant widget. Direct `/thank-you` access
rendered without a Meta SDK or a fabricated conversion.

The deployment explicitly sets `META_LEAD_ENABLED=false` and
`NEXT_PUBLIC_META_LEAD_ENABLED=false` (build and runtime). It includes the optional
Lead integration but does not activate it. No production CAPI token is configured
in the project environment list. Eligibility, matching-data authorization and
end-to-end Meta event testing remain separate prerequisites for activation.

Automated verification from the implementation: 26 tests passed, covering CRM
success/failure, city routing, consent, payload exclusion, hashes and receipts.
The browser Lead path with enabled measurement has not been verified against Meta.
