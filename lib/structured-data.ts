/**
 * Schema.org JSON-LD payloads.
 *
 * Each helper returns a plain JSON-LD object that can be dropped into a
 * <script type="application/ld+json"> tag via dangerouslySetInnerHTML.
 *
 * We use these schemas:
 *   - MedicalBusiness (the clinic itself — address, hours, affiliations)
 *   - MedicalProcedure (the EBOO procedure — description, body part, code)
 *   - WebSite (with SearchAction so Google can surface a sitelinks search)
 *   - FAQPage (rich snippet eligibility on /about-eboo)
 *
 * Reference: https://schema.org and https://developers.google.com/search/docs/appearance/structured-data
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://hsw.london";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "MedicalClinic"],
    "@id": `${SITE}/#organization`,
    name: "Harley Street Wellness",
    alternateName: "HSW",
    url: SITE,
    logo: `${SITE}/opengraph-image`,
    image: `${SITE}/opengraph-image`,
    description:
      "Harley Street Wellness offers EBOO (Extracorporeal Blood Oxygenation and Ozonation) and integrative wellness procedures from one of London's most established medical addresses.",
    medicalSpecialty: [
      "PrimaryCare",
      "Wellness",
      "InternalMedicine",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "London Medical Rooms, Ground Floor, 1-5 Portpool Lane, Chancery Lane",
      addressLocality: "London",
      addressRegion: "England",
      postalCode: "EC1N 7UU",
      addressCountry: "GB",
    },
    telephone: "+44 20 4628 3137",
    location: [
      {
        "@type": "MedicalBusiness",
        name: "Harley Street Wellness — London",
        telephone: "+44 20 4628 3137",
        address: {
          "@type": "PostalAddress",
          streetAddress: "London Medical Rooms, Ground Floor, 1-5 Portpool Lane, Chancery Lane",
          addressLocality: "London",
          addressRegion: "England",
          postalCode: "EC1N 7UU",
          addressCountry: "GB",
        },
      },
      {
        "@type": "MedicalBusiness",
        name: "Harley Street Wellness — Glasgow",
        telephone: "+44 141 488 8985",
        address: {
          "@type": "PostalAddress",
          streetAddress: "5th Floor, Ingram House, 227 Ingram Street",
          addressLocality: "Glasgow",
          addressRegion: "Scotland",
          postalCode: "G1 1DA",
          addressCountry: "GB",
        },
      },
    ],
    areaServed: [
      { "@type": "City", name: "London" },
      { "@type": "City", name: "Glasgow" },
      { "@type": "Country", name: "United Kingdom" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "£££",
    email: "hello@harleystreetmedicalwellness.co.uk",
    sameAs: [],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "EBOO Therapy Protocols",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "MedicalProcedure", name: "EBOO — Recovery Protocol" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "MedicalProcedure", name: "EBOO — Performance Protocol" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "MedicalProcedure", name: "EBOO — Longevity Protocol" },
        },
      ],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: "Harley Street Wellness",
    url: SITE,
    publisher: { "@id": `${SITE}/#organization` },
    inLanguage: "en-GB",
  };
}

export function ebooProcedureJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${SITE}/about-eboo#procedure`,
    name: "EBOO — Extracorporeal Blood Oxygenation and Ozonation",
    alternateName: ["EBOO Therapy", "Extracorporeal Ozone Therapy"],
    description:
      "EBOO is a one-hour medical procedure that filters approximately 1.5 litres of blood per hour through a dialysis-grade membrane while simultaneously infusing it with medical-grade ozone, before returning the cleaned, oxygenated blood through a second IV.",
    procedureType: "https://schema.org/TherapeuticProcedure",
    bodyLocation: "Circulatory system",
    preparation:
      "Standard pre-procedure consultation with a GMC-registered physician. Health screening including G6PD status, pregnancy, and anticoagulant use.",
    howPerformed:
      "Blood is drawn from a vein in one arm via IV, passed through a sterile single-use dialysis-grade membrane, infused with medical ozone at a calibrated dose (typically 40 µg/mL), and returned through a second IV in the opposite arm. Closed-loop circuit; blood never contacts outside air.",
    followup:
      "Most clients report improved energy and clarity within hours. Anti-inflammatory effects build over the following week as NRF2-driven antioxidant gene expression peaks. A typical protocol consists of 3–6 sessions.",
    contraindication: [
      "Glucose-6-phosphate dehydrogenase (G6PD) deficiency",
      "Pregnancy",
      "Active anticoagulant therapy or bleeding disorders",
    ],
    provider: { "@id": `${SITE}/#organization` },
  };
}

export type FaqEntry = { q: string; a: string };
export function faqJsonLd(entries: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.q,
      acceptedAnswer: { "@type": "Answer", text: e.a },
    })),
  };
}

export function breadcrumbsJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/**
 * Helper to inline a JSON-LD payload in a React tree without `next/script`
 * (which would defer it past the initial render). Crawlers want it
 * server-rendered.
 */
export function jsonLd(payload: unknown) {
  return {
    __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
  };
}
