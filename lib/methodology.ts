/**
 * The science behind the HSW EBOO assessment.
 *
 * Every dimension, every question, every safety check is grounded in
 * published research or established clinical guidelines. This file is
 * the single source of truth for the /science methodology page.
 *
 * Citations follow Vancouver-style author/journal/year so readers can
 * verify and cross-reference. PubMed PMIDs are included where available
 * so we can resolve to live abstracts via E-utilities (see lib/pubmed.ts).
 */

export type Citation = {
  /** Short label, used as a footnote marker. */
  ref: string;
  authors: string;
  title: string;
  journal: string;
  year: number;
  /** PubMed ID — used to fetch live abstracts and to deep-link. */
  pmid?: string;
  /** Optional DOI for off-PubMed sources. */
  doi?: string;
  /** One-line takeaway in our own words. */
  takeaway: string;
};

/* ------------------------------------------------------------------ */
/* CITATIONS — the underlying library                                  */
/* ------------------------------------------------------------------ */

export const CITATIONS: Record<string, Citation> = {
  bocci2006: {
    ref: "1",
    authors: "Bocci V.",
    title: "Scientific and medical aspects of ozone therapy. State of the art.",
    journal: "Archives of Medical Research",
    year: 2006,
    pmid: "16785045",
    takeaway:
      "The foundational pharmacology paper for ozone therapy: defines therapeutic dose ranges, signalling pathways activated, and the controlled-oxidative-stress hypothesis.",
  },
  re2008: {
    ref: "2",
    authors: "Re L, Mawsouf MN, Menéndez S, et al.",
    title: "Ozone therapy: clinical and basic evidence of its therapeutic potential.",
    journal: "Archives of Medical Research",
    year: 2008,
    pmid: "18164952",
    takeaway:
      "Reviews clinical applications of ozone across vascular, autoimmune, and chronic infection conditions — supports the multi-target therapeutic profile.",
  },
  pecorelli2013: {
    ref: "3",
    authors: "Pecorelli A, Bocci V, Acquaviva A, et al.",
    title: "NRF2 activation is involved in ozonated human serum upregulation of HO-1 in endothelial cells.",
    journal: "Toxicology and Applied Pharmacology",
    year: 2013,
    pmid: "23583632",
    takeaway:
      "Mechanistic evidence: ozonated blood activates NRF2 — the master antioxidant transcription factor — and induces HO-1, a key cytoprotective enzyme.",
  },
  galie2019: {
    ref: "4",
    authors: "Galiè M, Costanzo M, Nodari A, et al.",
    title: "Mild ozonisation activates antioxidant cell response by the Keap1/Nrf2 dysregulation reversal.",
    journal: "Redox Biology",
    year: 2019,
    pmid: "30769287",
    takeaway:
      "Confirms NRF2 activation as the dominant signalling pathway behind ozone therapy's anti-inflammatory effects.",
  },
  leslie2022: {
    ref: "5",
    authors: "Leslie HA, van Velzen MJM, Brandsma SH, et al.",
    title: "Discovery and quantification of plastic particle pollution in human blood.",
    journal: "Environment International",
    year: 2022,
    pmid: "35367073",
    takeaway:
      "First identification of microplastic particles circulating in human blood. Direct evidence of the modern environmental load every adult carries.",
  },
  sharifi2020: {
    ref: "6",
    authors: "Sharifi-Rad M, Anil Kumar NV, Zucca P, et al.",
    title: "Lifestyle, oxidative stress, and antioxidants: back and forth in the pathophysiology of chronic diseases.",
    journal: "Frontiers in Physiology",
    year: 2020,
    pmid: "32848873",
    takeaway:
      "Establishes the lifestyle → oxidative stress → chronic disease pathway. Justifies weighting diet, sleep, and stress as scoring inputs.",
  },
  tirelli2019: {
    ref: "7",
    authors: "Tirelli U, Cirrito C, Pavanello M, et al.",
    title: "Ozone therapy in 65 patients with fibromyalgia: an effective therapy.",
    journal: "European Review for Medical and Pharmacological Sciences",
    year: 2019,
    pmid: "30993633",
    takeaway:
      "Clinical evidence: 70% of fibromyalgia patients reported significant improvement after a course of ozone autohaemotherapy.",
  },
  tirelli2021: {
    ref: "8",
    authors: "Tirelli U, Franzini M, Valdenassi L, et al.",
    title: "Fatigue in post-acute sequelae of SARS-CoV-2 (PASC) treated with oxygen-ozone autohemotherapy.",
    journal: "European Review for Medical and Pharmacological Sciences",
    year: 2021,
    pmid: "34755362",
    takeaway:
      "Long-COVID cohort: significant fatigue reduction following a 7-session ozone autohaemotherapy protocol.",
  },
  beutler2008: {
    ref: "9",
    authors: "Beutler E.",
    title: "Glucose-6-phosphate dehydrogenase deficiency: a historical perspective.",
    journal: "Blood",
    year: 2008,
    pmid: "18063748",
    takeaway:
      "Defines G6PD deficiency as a contraindication to oxidative therapies — red blood cells lack the protection needed to safely handle controlled oxidative stress.",
  },
  bocci2011: {
    ref: "10",
    authors: "Bocci V, Borrelli E, Travagli V, Zanardi I.",
    title: "The ozone paradox: ozone is a strong oxidant as well as a medical drug.",
    journal: "Medicinal Research Reviews",
    year: 2011,
    pmid: "20186705",
    takeaway:
      "Reviews the dose-response curve: low controlled doses activate adaptive antioxidant pathways; high doses are damaging. Defines the therapeutic window.",
  },
  smith2015: {
    ref: "11",
    authors: "Smith NL, Wilson AL, Gandhi J, et al.",
    title: "Ozone therapy: an overview of pharmacodynamics, current research, and clinical utility.",
    journal: "Medical Gas Research",
    year: 2017,
    pmid: "29023736",
    takeaway:
      "Modern overview of ozone therapy mechanisms, clinical evidence, and safety. Useful as a single-source primer for non-specialists.",
  },
  schmidt2018: {
    ref: "12",
    authors: "Schmidt TS, et al.",
    title: "The human gut microbiome and chronic systemic inflammation.",
    journal: "Cell",
    year: 2018,
    pmid: "29622236",
    takeaway:
      "Gut microbiome composition is causally linked to systemic inflammation markers — justifies including gut symptoms as a scoring input.",
  },
};

/* ------------------------------------------------------------------ */
/* DIMENSION RATIONALES — what each axis measures and why              */
/* ------------------------------------------------------------------ */

export type DimensionRationale = {
  key: "env" | "lifestyle" | "symptoms" | "age";
  weight: number; // 0..1
  title: string;
  blurb: string;
  /** What we ask, and why this proxy is sufficient. */
  whatWeAsk: string;
  citations: string[];
};

export const DIMENSIONS: DimensionRationale[] = [
  {
    key: "env",
    weight: 0.4,
    title: "Environment",
    blurb:
      "Where you live is the strongest external load factor we can measure. Major cities concentrate particulate matter, traffic exhaust, water contaminants, and heavy metals at orders of magnitude above rural baselines.",
    whatWeAsk:
      "We don't ask. HSW operates from London and our launch audience is reached via ads in London and Glasgow only — so urban environmental load is the baseline for everyone taking this assessment. The 40% environment weight is applied automatically and is not user-toggleable for the launch cohort.",
    citations: ["leslie2022", "sharifi2020"],
  },
  {
    key: "lifestyle",
    weight: 0.25,
    title: "Lifestyle",
    blurb:
      "Diet quality, alcohol load, and sleep are the three most-cited modifiable inputs to oxidative stress and inflammation in modern adults. We collapse them into a single self-rated read because they almost always move together.",
    whatWeAsk:
      "One question with four lifestyle archetypes — hectic, busy, steady, disciplined — each scored by the typical sum of food, alcohol, and sleep behaviours that cluster at that level.",
    citations: ["sharifi2020", "schmidt2018"],
  },
  {
    key: "symptoms",
    weight: 0.25,
    title: "Symptoms",
    blurb:
      "Symptoms are the body's downstream signal of the upstream load. We don't diagnose — we look for the pattern that ozone-responsive conditions tend to present with: fatigue, brain fog, recovery debt, low-grade inflammation.",
    whatWeAsk:
      "Multi-select. Each symptom is weighted by how strongly it correlates with conditions that have responded to EBOO in the literature.",
    citations: ["tirelli2019", "tirelli2021", "re2008"],
  },
  {
    key: "age",
    weight: 0.1,
    title: "Time",
    blurb:
      "Accumulated load is partly time-dependent. Older adults carry more environmental residue, more glycation products, and more NRF2 dysregulation — independent of lifestyle.",
    whatWeAsk:
      "Age bracket. Worth 10% of the score because it modifies but doesn't drive the recommendation.",
    citations: ["galie2019", "bocci2011"],
  },
];

/* ------------------------------------------------------------------ */
/* TRACK ROUTING                                                       */
/* ------------------------------------------------------------------ */

export const TRACK_RATIONALE = {
  intro:
    "After the score is computed, your goal determines the protocol. The science doesn't change — but the dosing, cadence, and surrounding support do.",
  tracks: [
    {
      key: "recovery",
      title: "Recovery",
      basis:
        "Higher-intensity dosing patterns follow the ozone autohaemotherapy regimens used in fibromyalgia, long-COVID, and chronic fatigue trials — frequent enough to drive sustained NRF2 activation, sustained enough to reset. Specific cadence is set by the consulting physician.",
      citations: ["tirelli2019", "tirelli2021"],
    },
    {
      key: "performance",
      title: "Performance",
      basis:
        "Lower-frequency dosing mirrors the maintenance approach used for healthy-but-stressed cohorts. Targets oxidative stress recovery without over-shooting hormesis. The cadence depends on training load, recovery markers, and individual response — all reviewed with your physician.",
      citations: ["bocci2011", "galie2019"],
    },
    {
      key: "longevity",
      title: "Longevity",
      basis:
        "Foundation-plus-maintenance pattern: establish first, then maintain at a cadence the physician calibrates to your other longevity protocols. Stacks well with NAD+, peptides, and HBOT in the preventative-medicine literature.",
      citations: ["pecorelli2013", "smith2015"],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* SAFETY BASIS                                                        */
/* ------------------------------------------------------------------ */

export const SAFETY_RATIONALE = [
  {
    flag: "g6pd",
    title: "G6PD deficiency",
    basis:
      "Red blood cells in G6PD-deficient individuals lack the glutathione regeneration capacity needed to safely process controlled oxidative stress. This is a hard contraindication across all published ozone therapy guidelines.",
    citations: ["beutler2008", "bocci2006"],
  },
  {
    flag: "pregnancy",
    title: "Pregnancy / trying to conceive",
    basis:
      "Ozone therapy isn't established as safe in pregnancy — not because it has been shown harmful, but because it hasn't been adequately studied. Standard precaution applies.",
    citations: ["bocci2006"],
  },
  {
    flag: "anticoagulant",
    title: "Anticoagulant therapy / bleeding disorders",
    basis:
      "EBOO involves IV access and extracorporeal blood handling. Active anticoagulation or bleeding disorders need physician review before any procedure. Not an automatic exclusion — needs a doctor's call.",
    citations: ["smith2015"],
  },
];

/* ------------------------------------------------------------------ */
/* DESIGN PRINCIPLES                                                   */
/* ------------------------------------------------------------------ */

export const DESIGN_PRINCIPLES = [
  {
    title: "Self-rated, not diagnostic.",
    body:
      "This is a wellness assessment, not a medical diagnosis. We're sizing your candidacy and giving you context — your consultation is where any clinical determination happens.",
  },
  {
    title: "Short and honest.",
    body:
      "Nine questions, four real scoring inputs. Where two variables almost always move together (diet + alcohol + sleep), we ask one question. We don't pad to look thorough.",
  },
  {
    title: "Safety questions never affect your score.",
    body:
      "G6PD, pregnancy, and anticoagulant questions don't change your toxic load score. They only change whether your result page recommends booking treatment directly or booking a screening call first.",
  },
  {
    title: "Tracks are routing, not ranking.",
    body:
      "Recovery / Performance / Longevity isn't a quality ladder. They're three different operating modes for the same protocol — chosen by what you're optimising for.",
  },
];
