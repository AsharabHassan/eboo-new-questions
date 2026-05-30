/**
 * Quiz schema for the HSW EBOO assessment.
 *
 * Three layers running in parallel:
 *   1. Act 1 — Toxic Load Score (8 questions, weighted 0-100)
 *   2. Act 2 — Track Segmentation (4 questions → Recovery / Performance / Longevity)
 *   3. Safety screen (3 questions, woven into either act, any "yes" routes
 *      result to a screening-first variant)
 *
 * Plus one email-capture step between Act 1 and Act 2.
 */

export type AnswerValue = string | string[];

export type QuestionOption = {
  value: string;
  label: string;
  hint?: string;
  /** Numeric weight added to a dimension (Act 1 only). */
  weight?: number;
  /** Track score adjustment for Act 2 — which track this answer favors. */
  track?: { recovery?: number; performance?: number; longevity?: number };
  /** Raises a safety flag when selected. */
  safety?: SafetyFlag;
};

export type SafetyFlag = "pregnancy" | "g6pd" | "anticoagulant";

export type Question = {
  id: string;
  act: 1 | 2 | "safety" | "location" | "email";
  /** Display index of the question within the whole flow (1..n). */
  index: number;
  eyebrow: string;
  prompt: string;
  subtitle?: string;
  /** Which Act-1 dimension this contributes to. */
  dimension?: "env" | "lifestyle" | "symptoms" | "age";
  type: "single" | "multi" | "email";
  options?: QuestionOption[];
};

export const TRACKS = {
  recovery: {
    key: "recovery",
    label: "Recovery",
    tagline: "Reset the engine.",
    blurb:
      "Your score and symptom pattern indicate a system carrying significant accumulated load. EBOO works here as foundational reset — not maintenance.",
    benefit:
      "On the Recovery track, EBOO's role is to break the cycle of low-grade inflammation that's keeping your symptoms in place. The dialysis stage physically removes circulating inflammatory mediators; the ozonation stage activates NRF2, the antioxidant master switch that's been chronically suppressed. Together they create the conditions for your body to start repairing what it hasn't had the capacity to repair.",
    expectation:
      "Most Recovery patients report a noticeable lift in energy and mental clarity within days. Deeper effects — sleep quality, joint pain, brain fog — typically shift over weeks. Your physician will explain exactly what to expect for your situation.",
  },
  performance: {
    key: "performance",
    label: "Performance",
    tagline: "Premium oil for a high-revving engine.",
    blurb:
      "You're driving hard. EBOO acts as maintenance for a system that's running hot — clears accumulated oxidative stress and keeps it running clean.",
    benefit:
      "On the Performance track, EBOO's role is preventative. You're producing more reactive oxygen species than someone living at lower intensity — through training, cognitive load, travel, stress — and your antioxidant defences are constantly drawing down. EBOO replenishes that capacity before it turns into symptoms.",
    expectation:
      "Performance patients usually report sharper focus, faster training recovery, and steadier daily energy starting within hours of a session and persisting for weeks afterwards.",
  },
  longevity: {
    key: "longevity",
    label: "Longevity",
    tagline: "Preventive maintenance, indefinite.",
    blurb:
      "You're stacking for the long arc. EBOO sits at the foundation — clears the substrate that other interventions act on.",
    benefit:
      "On the Longevity track, EBOO is the cleanup layer your other protocols depend on. NAD+, peptides, HBOT, sauna — all of them work better when the substrate they're acting on is less inflammatory and more oxygenated. EBOO addresses the bottleneck most longevity stacks ignore.",
    expectation:
      "Longevity patients describe the effect as 'baseline shift' — they don't feel a dramatic acute change, but their biomarkers (CRP, fasting glucose, HRV) trend better and their other protocols compound more efficiently.",
  },
} as const;

export type TrackKey = keyof typeof TRACKS;

export const QUESTIONS: Question[] = [
  // ============ ACT 1 — TOXIC LOAD SCORE (3 questions) ============
  // Note: the "Environment" dimension (40% of the score) is no longer asked.
  // The launch audience reaches this quiz from London / Glasgow paid ads, so
  // we assume maximum urban environmental load — see ASSUMED_ENV_LOAD in
  // computeScore() and the /science page methodology section.
  {
    id: "lifestyle",
    act: 1,
    index: 1,
    dimension: "lifestyle",
    eyebrow: "01 · Lifestyle",
    prompt: "How would you describe your lifestyle right now?",
    subtitle: "We're combining diet, alcohol, and sleep into one read. Pick the closest fit.",
    type: "single",
    options: [
      {
        value: "hectic",
        label: "Hectic",
        hint: "Mostly processed or eating-out, regular drinks, often less than 7 hours of sleep",
        weight: 30,
      },
      {
        value: "busy",
        label: "Busy",
        hint: "Mixed habits, social drinks, around 6–7 hours of sleep",
        weight: 22,
      },
      {
        value: "steady",
        label: "Steady",
        hint: "Mostly home-cooked, occasional drinks, 7+ hours of sleep",
        weight: 13,
      },
      {
        value: "disciplined",
        label: "Disciplined",
        hint: "Clean diet, minimal alcohol, 8+ hours of sleep",
        weight: 5,
      },
    ],
  },
  {
    id: "symptoms",
    act: 1,
    index: 2,
    dimension: "symptoms",
    eyebrow: "02 · Signal",
    prompt: "Which of these do you experience regularly?",
    subtitle: "Select any that apply. We're listening for the pattern, not any single one.",
    type: "multi",
    options: [
      { value: "fatigue", label: "Persistent fatigue, even after rest", weight: 6 },
      { value: "brain-fog", label: "Brain fog or trouble focusing", weight: 6 },
      { value: "joint-pain", label: "Joint or muscle pain without injury", weight: 5 },
      { value: "poor-recovery", label: "Slow to recover from workouts or stress", weight: 5 },
      { value: "gut", label: "Recurring gut issues (bloating, IBS-type)", weight: 4 },
      { value: "skin", label: "Skin inflammation or recurring breakouts", weight: 3 },
      { value: "sleep-quality", label: "Poor sleep quality despite hours", weight: 4 },
      { value: "mood", label: "Low mood or low motivation", weight: 4 },
      { value: "none", label: "None of these", weight: 0 },
    ],
  },
  {
    id: "age",
    act: 1,
    index: 3,
    dimension: "age",
    eyebrow: "03 · Time",
    prompt: "How old are you?",
    subtitle: "More years mean more accumulated load — not a problem, just a factor.",
    type: "single",
    options: [
      { value: "<30", label: "Under 30", weight: 2 },
      { value: "30-44", label: "30–44", weight: 5 },
      { value: "45-59", label: "45–59", weight: 8 },
      { value: "60+", label: "60+", weight: 11 },
    ],
  },

  // ============ ACT 2 — TRACK SEGMENTATION (1 question) ============
  {
    id: "goal",
    act: 2,
    index: 4,
    eyebrow: "04 · Goal",
    prompt: "What's your #1 goal right now?",
    subtitle: "This routes you to the protocol that fits.",
    type: "single",
    options: [
      {
        value: "recovery",
        label: "Feel better and recover",
        hint: "Dealing with chronic symptoms, low energy, or a setback",
        track: { recovery: 3 },
      },
      {
        value: "performance",
        label: "Optimise daily energy & focus",
        hint: "Pushing hard at work or training, want a sharper edge",
        track: { performance: 3 },
      },
      {
        value: "longevity",
        label: "Slow aging and live longer",
        hint: "Already healthy, stacking for the long arc",
        track: { longevity: 3 },
      },
    ],
  },

  // ============ SAFETY SCREEN (3 questions — non-negotiable medical) ============
  {
    id: "pregnancy",
    act: "safety",
    index: 5,
    eyebrow: "Safety · 1 of 3",
    prompt: "Are you pregnant or trying to conceive?",
    subtitle: "EBOO has standard pregnancy precautions. We'll discuss them with you if relevant.",
    type: "single",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes", safety: "pregnancy" },
      { value: "trying", label: "Trying to conceive", safety: "pregnancy" },
    ],
  },
  {
    id: "g6pd",
    act: "safety",
    index: 6,
    eyebrow: "Safety · 2 of 3",
    prompt: "Do you have G6PD deficiency or favism?",
    subtitle:
      "Most people don't know — it's a genetic condition affecting how red blood cells handle oxidative stress. If you're not sure, that's fine.",
    type: "single",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes", safety: "g6pd" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "anticoag",
    act: "safety",
    index: 7,
    eyebrow: "Safety · 3 of 3",
    prompt: "Are you on blood thinners or do you have a bleeding disorder?",
    type: "single",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes", safety: "anticoagulant" },
    ],
  },

  // ============ LOCATION (final question before data capture) ============
  // Captured for routing and CRM segmentation only — does NOT affect the
  // score. London and Glasgow both carry the same (maximum) assumed
  // environmental load, so the reading is identical either way.
  {
    id: "location",
    act: "location",
    index: 8,
    eyebrow: "Final question",
    prompt: "Where are you based?",
    subtitle: "We see patients in London and Glasgow. Choose the one nearest you.",
    type: "single",
    options: [
      { value: "london", label: "London" },
      { value: "glasgow", label: "Glasgow" },
    ],
  },

  // ============ EMAIL GATE (final step before results) ============
  {
    id: "email",
    act: "email",
    index: 9,
    eyebrow: "Assessment complete",
    prompt: "Where should we send your full report?",
    subtitle:
      "Your score is ready. Add your details and we'll reveal your full breakdown and personalised protocol.",
    type: "email",
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;

/** Quiz answer dictionary keyed by question id. */
export type Answers = Record<string, AnswerValue>;

/* ----------------------- Scoring & routing ----------------------- */

/** Maximum possible weighted score per dimension (for normalisation). */
const DIMENSION_MAX = {
  env: 25, // single question, "Major city centre" maxes
  lifestyle: 30, // single question, "Hectic" maxes
  // symptoms: highest of multi-select if all checked except 'none'
  symptoms: 6 + 6 + 5 + 5 + 4 + 3 + 4 + 4, // 37
  age: 11,
};

const DIMENSION_WEIGHT = {
  env: 0.4,
  lifestyle: 0.25,
  symptoms: 0.25,
  age: 0.1,
};

/**
 * Assumed environmental load for the launch audience.
 *
 * We're advertising in London and Glasgow only, so every quiz taker lives in
 * a major UK city. Rather than asking a redundant geography question, we
 * bake the maximum env score in. If the targeting ever expands, restore the
 * env question and remove this assumption.
 */
const ASSUMED_ENV_LOAD = DIMENSION_MAX.env;

export function computeScore(answers: Answers): number {
  const dims: Record<keyof typeof DIMENSION_MAX, number> = {
    env: ASSUMED_ENV_LOAD,
    lifestyle: 0,
    symptoms: 0,
    age: 0,
  };

  for (const q of QUESTIONS) {
    if (q.act !== 1 || !q.dimension) continue;
    const ans = answers[q.id];
    if (!ans) continue;
    if (q.type === "single" && typeof ans === "string") {
      const opt = q.options?.find((o) => o.value === ans);
      if (opt?.weight) dims[q.dimension] += opt.weight;
    } else if (q.type === "multi" && Array.isArray(ans)) {
      // sum all chosen except 'none'
      for (const val of ans) {
        const opt = q.options?.find((o) => o.value === val);
        if (opt?.weight && val !== "none") dims[q.dimension] += opt.weight;
      }
    }
  }

  // normalise each dimension to 0..1, then weighted average
  let score = 0;
  (Object.keys(dims) as (keyof typeof DIMENSION_MAX)[]).forEach((k) => {
    const normalised = Math.min(1, dims[k] / DIMENSION_MAX[k]);
    score += normalised * DIMENSION_WEIGHT[k] * 100;
  });

  return Math.round(score);
}

export function computeTrack(answers: Answers): TrackKey {
  const tally: Record<TrackKey, number> = { recovery: 0, performance: 0, longevity: 0 };

  for (const q of QUESTIONS) {
    if (q.act !== 2) continue;
    const ans = answers[q.id];
    if (!ans) continue;
    const values = Array.isArray(ans) ? ans : [ans];
    for (const v of values) {
      const opt = q.options?.find((o) => o.value === v);
      if (!opt?.track) continue;
      if (opt.track.recovery) tally.recovery += opt.track.recovery;
      if (opt.track.performance) tally.performance += opt.track.performance;
      if (opt.track.longevity) tally.longevity += opt.track.longevity;
    }
  }

  // Pick max — ties favour recovery (most clinically meaningful)
  const ordered: TrackKey[] = ["recovery", "performance", "longevity"];
  return ordered.reduce((best, k) => (tally[k] > tally[best] ? k : best), "recovery" as TrackKey);
}

export function computeSafetyFlags(answers: Answers): SafetyFlag[] {
  const flags: SafetyFlag[] = [];
  for (const q of QUESTIONS) {
    if (q.act !== "safety") continue;
    const ans = answers[q.id];
    if (typeof ans !== "string") continue;
    const opt = q.options?.find((o) => o.value === ans);
    if (opt?.safety) flags.push(opt.safety);
  }
  return flags;
}

export function scoreBand(score: number): { label: string; tone: "light" | "moderate" | "heavy" | "critical" } {
  if (score >= 81) return { label: "Critical Load", tone: "critical" };
  if (score >= 61) return { label: "Heavy Buildup", tone: "heavy" };
  if (score >= 31) return { label: "Moderate Buildup", tone: "moderate" };
  return { label: "Light Load", tone: "light" };
}

/* ----------------------- Personalisation helpers ----------------------- */

export type DimensionScore = {
  key: keyof typeof DIMENSION_MAX;
  label: string;
  /** Their raw score on this dimension (0..DIMENSION_MAX[key]) */
  raw: number;
  /** Normalised 0..1 */
  normalised: number;
  /** Contribution to the final 0..100 score */
  contribution: number;
  /** Dimension's weight in the total score */
  weight: number;
};

const DIMENSION_LABELS: Record<keyof typeof DIMENSION_MAX, string> = {
  env: "Environment",
  lifestyle: "Lifestyle",
  symptoms: "Symptoms",
  age: "Time",
};

/**
 * Per-dimension breakdown of how the final score was built. Used to render
 * the contribution bars on the result page.
 */
export function dimensionBreakdown(answers: Answers): DimensionScore[] {
  const raws: Record<keyof typeof DIMENSION_MAX, number> = {
    env: ASSUMED_ENV_LOAD, // baked in for the launch audience
    lifestyle: 0,
    symptoms: 0,
    age: 0,
  };

  for (const q of QUESTIONS) {
    if (q.act !== 1 || !q.dimension) continue;
    const ans = answers[q.id];
    if (!ans) continue;
    if (q.type === "single" && typeof ans === "string") {
      const opt = q.options?.find((o) => o.value === ans);
      if (opt?.weight) raws[q.dimension] += opt.weight;
    } else if (q.type === "multi" && Array.isArray(ans)) {
      for (const val of ans) {
        const opt = q.options?.find((o) => o.value === val);
        if (opt?.weight && val !== "none") raws[q.dimension] += opt.weight;
      }
    }
  }

  return (Object.keys(raws) as (keyof typeof DIMENSION_MAX)[]).map((k) => {
    const normalised = Math.min(1, raws[k] / DIMENSION_MAX[k]);
    return {
      key: k,
      label: DIMENSION_LABELS[k],
      raw: raws[k],
      normalised,
      contribution: Math.round(normalised * DIMENSION_WEIGHT[k] * 100),
      weight: DIMENSION_WEIGHT[k],
    };
  });
}

/** Selected symptom labels (without the "none" sentinel). */
export function selectedSymptoms(answers: Answers): string[] {
  const symptomQ = QUESTIONS.find((q) => q.id === "symptoms");
  if (!symptomQ) return [];
  const ans = answers["symptoms"];
  if (!Array.isArray(ans)) return [];
  return ans
    .filter((v) => v !== "none")
    .map((v) => symptomQ.options?.find((o) => o.value === v)?.label ?? "")
    .filter(Boolean);
}

/** Single-select answer's label by question id (for "you said your lifestyle is X"). */
export function answerLabel(answers: Answers, qId: string): string | undefined {
  const q = QUESTIONS.find((x) => x.id === qId);
  if (!q) return undefined;
  const ans = answers[qId];
  if (typeof ans !== "string") return undefined;
  return q.options?.find((o) => o.value === ans)?.label;
}
