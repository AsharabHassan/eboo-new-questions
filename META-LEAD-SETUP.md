# EBOO Lead tracking — 8 October 2026

The source now contains an optional browser + server Lead integration. It is off by
default. The app changes were deployed on 8 October 2026 to the existing EBOO
production project. Meta sending remains disabled; Meta processing is unverified.

## Behavior

- `/api/lead` validates the contact and waits for the correct London/Glasgow CRM webhook.
- Only a successful CRM receipt can trigger Meta. Explicit optional enquiry-measurement
  consent is required separately from the existing public-page cookie choice.
- The server sends `Lead`, a shared submission/event ID, event time, the actual `/quiz`
  source URL, SHA-256 email/phone, valid `_fbp`/`_fbc`, and IP/user-agent. Currency is GBP;
  no fabricated lead value is used. No name, answers, clinical score, protocol, screening
  flag, report URL or campaign/assessment object is forwarded.
- Consented submissions enter `/thank-you` in a fresh document. A short-lived,
  single-use receipt fires a browser `Lead` with the same event ID and pixel ID.
  Direct visits/reloads without that receipt do not fire Lead. No automatic PageView
  is sent on this page. Viewing the report starts another fresh document without Meta.
- Declined consent or disabled/unconfigured tracking retains the existing direct report flow.
- Meta rejection/timeout does not reject a lead already saved in GHL. `accepted` means
  API transport acceptance only; it does not prove processing or campaign attribution.

## Before activation

Confirm that Meta permits **this assessment-submission Lead event on these EBOO domains**.
The app collects health-related assessment answers; excluding those fields, hashing
contacts, or using a confirmation page does not remove that context or bypass a block.
Do not move EBOO events to Life Ahead's pixel to evade EBOO restrictions.

Confirm operator authorization to transmit the listed matching fields to Meta and use
the actual EBOO dataset connected to the advertising account. Obtain the production
token through the hosting secret manager, without placing it in source or logs.

Configure `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, and a currently supported
`META_GRAPH_API_VERSION`. Set both `META_LEAD_ENABLED` and
`NEXT_PUBLIC_META_LEAD_ENABLED` to `true`, then rebuild (the public flag is compiled in).
Use `META_CAPI_TEST_CODE` for a controlled test and remove it before production release.

Test a London and Glasgow submission with approved synthetic contact details, consent
allowed and declined. Verify the correct CRM record, processed browser/server Lead
events and deduplication in Meta Test Events. Check that failed CRM submissions do not
emit Lead. Inspect network traffic for assessment/URL leaks. Then check production
events and real campaign attribution; these are distinct from test events.

Consultation-booked tags remain CRM qualified leads. This change does not send Schedule
or QualifiedLead events or modify campaigns, budgets, targeting or GHL workflows.
