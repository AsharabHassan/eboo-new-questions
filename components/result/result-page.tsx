"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ScoreGauge } from "./score-gauge";
import { DimensionBars } from "./dimension-bars";
import {
  TRACKS,
  type Answers,
  type SafetyFlag,
  type TrackKey,
  dimensionBreakdown,
  selectedSymptoms,
  answerLabel,
  scoreBand,
} from "@/lib/quiz-data";
import { SiteFooter } from "@/components/site-footer";

const EASE = [0.2, 0.9, 0.1, 1] as [number, number, number, number];

type ResultData = {
  id: string;
  score: number;
  track: TrackKey;
  safety: SafetyFlag[];
  name: string;
  email: string;
  answers: Answers;
};

export function ResultPage({ data }: { data: ResultData }) {
  const band = scoreBand(data.score);
  const track = TRACKS[data.track];
  const screeningFirst = data.safety.length > 0;
  const firstName = data.name?.split(" ")[0] ?? "";
  const dims = dimensionBreakdown(data.answers);
  const symptoms = selectedSymptoms(data.answers);
  const lifestyle = answerLabel(data.answers, "lifestyle");
  const age = answerLabel(data.answers, "age");

  return (
    <main className="relative min-h-[100svh] bg-ground vignette grain overflow-hidden">
      <BrandBar reportId={data.id} />

      <article className="relative max-w-[1100px] mx-auto px-5 md:px-10">
        {/* ====== HERO ====== */}
        <Hero firstName={firstName} score={data.score} band={band} />

        {/* ====== SCORE GAUGE ====== */}
        <Reveal>
          <ScoreGauge score={data.score} label={band.label} tone={band.tone} />
        </Reveal>

        <Reveal delay={0.4}>
          <div className="text-center mt-6 mb-24 md:mb-32">
            <Link
              href="/science"
              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-ink-dim hover:text-gold transition-colors border-b border-[var(--line)] hover:border-gold pb-1"
            >
              How this score was computed
              <ArrowRight size={11} />
            </Link>
          </div>
        </Reveal>

        {/* ====== PERSONAL ANALYSIS ====== */}
        <Reveal>
          <Section plate="Pl. I" eyebrow="Reading">
            <Heading>
              What we{" "}
              <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
                read
              </em>{" "}
              in your answers.
            </Heading>
            <PersonalAnalysis
              firstName={firstName}
              band={band}
              symptoms={symptoms}
              lifestyle={lifestyle}
              age={age}
              dims={dims}
            />
          </Section>
        </Reveal>

        {/* ====== DIMENSION BREAKDOWN ====== */}
        <Reveal>
          <Section plate="Pl. II" eyebrow="The breakdown">
            <Heading>
              Four inputs.{" "}
              <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
                One reading.
              </em>
            </Heading>
            <p className="text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light max-w-[60ch] mb-10">
              Your score is a weighted composite of four independent dimensions. Here's
              how much each contributed.
            </p>
            <DimensionBars dimensions={dims} />
          </Section>
        </Reveal>

        {/* ====== TRACK ====== */}
        <Reveal>
          <Section plate="Pl. III" eyebrow="Your track">
            <Heading>
              {track.label} —{" "}
              <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
                {track.tagline.replace(/\.$/, "")}
              </em>
              .
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 md:gap-16">
              <div className="space-y-6">
                <p className="text-[15px] md:text-[16px] leading-[1.75] text-ink font-light max-w-[60ch]">
                  {track.blurb}
                </p>
                <p className="text-[14px] md:text-[15px] leading-[1.75] text-ink-dim font-light max-w-[60ch]">
                  {track.benefit}
                </p>
                <p className="text-[14px] md:text-[15px] leading-[1.75] text-ink-dim font-light max-w-[60ch]">
                  <span className="text-gold font-medium">What to expect: </span>
                  {track.expectation}
                </p>
              </div>
              <aside className="border border-[var(--line)] bg-ground-raised/30 p-7 self-start">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
                  Protocol
                </div>
                <p className="font-display italic-display text-[20px] text-ink leading-snug mb-3">
                  Defined at consultation.
                </p>
                <p className="text-[13px] leading-[1.7] text-ink-dim font-light">
                  Your exact number of sessions, cadence, and any adjunct interventions
                  are decided by your physician at the 15-minute call — not by an
                  algorithm. The doctor reviews your full picture, your goals, and what
                  you can realistically commit to before recommending anything.
                </p>
              </aside>
            </div>
          </Section>
        </Reveal>

        {/* ====== BOOKING CTA OR SAFETY ====== */}
        <Reveal>
          {screeningFirst ? (
            <SafetyCard safetyFlags={data.safety} />
          ) : (
            <BookingCard track={track.label} />
          )}
        </Reveal>

        {/* ====== WHAT HAPPENS NEXT ====== */}
        <Reveal>
          <Section plate="Pl. IV" eyebrow="What happens next">
            <Heading>
              From here to your{" "}
              <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
                consultation.
              </em>
            </Heading>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
              {[
                {
                  n: "01",
                  title: "Pick your slot",
                  body: "Choose a time that suits you. London business hours, Monday to Friday. No card required.",
                },
                {
                  n: "02",
                  title: "15-minute video call",
                  body: "GMC-registered doctor. Reviews your report with you. Honest answers, no scripts.",
                },
                {
                  n: "03",
                  title: "Personalised plan",
                  body: "If EBOO is right for you, the doctor designs the protocol together with you. If it isn't, they say so.",
                },
              ].map((s) => (
                <li key={s.n} className="bg-ground-raised/40 p-7 md:p-8">
                  <div className="font-mono text-[11px] tracking-[0.22em] text-gold mb-4">
                    — {s.n}
                  </div>
                  <h3 className="font-display text-[19px] md:text-[22px] font-normal text-ink mb-2.5 leading-[1.15]">
                    {s.title}
                  </h3>
                  <p className="text-[13px] leading-[1.7] text-ink-dim font-light">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </Section>
        </Reveal>

        {/* ====== HOW TO PREPARE ====== */}
        <Reveal>
          <Section plate="Pl. V" eyebrow="Before your call">
            <Heading>
              Four things{" "}
              <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
                worth doing.
              </em>
            </Heading>
            <p className="text-[14px] md:text-[15px] leading-[1.75] text-ink-dim font-light max-w-[60ch] mb-10">
              Not mandatory — the consultation works regardless. These just make it more
              productive.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
              {[
                {
                  title: "Write your top three questions.",
                  body: "Whatever you'd most want a doctor's honest answer on. Pre-empts the 'oh I forgot to ask' moment.",
                },
                {
                  title: "Have your recent bloods to hand.",
                  body: "Inflammatory markers (CRP, ESR), vitamin D, ferritin, full blood count. Helpful but not required — we can also order baselines for you.",
                },
                {
                  title: "Be honest about constraints.",
                  body: "Travel schedule, budget, what's realistic. The protocol that works is the one you'll actually follow.",
                },
                {
                  title: "Hydrate the day before.",
                  body: "If you decide to proceed and book a session that week, hydration makes IV access easier.",
                },
              ].map((t) => (
                <li key={t.title} className="flex gap-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-[17px] md:text-[19px] font-normal text-ink mb-1.5 leading-[1.25]">
                      {t.title}
                    </h3>
                    <p className="text-[13px] leading-[1.7] text-ink-dim font-light max-w-[48ch]">
                      {t.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </Reveal>

        {/* ====== FAQ ====== */}
        <Reveal>
          <Section plate="Pl. VI" eyebrow="Most-asked">
            <Heading>
              Questions before{" "}
              <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
                the call.
              </em>
            </Heading>
            <dl className="flex flex-col gap-px bg-[var(--line)] border border-[var(--line)]">
              {[
                {
                  q: "Is the consultation really free?",
                  a: "Yes. No card, no deposit, no catch. Fifteen minutes with a GMC-registered doctor at no charge — we want you well-informed before deciding anything.",
                },
                {
                  q: "How long is it?",
                  a: "15 minutes. Video call. We've kept it short on purpose — long enough to walk through your report and answer your questions, short enough that it doesn't take a real chunk out of your day.",
                },
                {
                  q: "Will the doctor try to sell me treatment?",
                  a: "No. The doctor's role is to give you a clear read on whether EBOO is appropriate for your situation. Plenty of consultations end with 'this isn't right for you' or 'let's look at something else first' — and that's the point.",
                },
                {
                  q: "What if I can't make my slot?",
                  a: "Just reply to the confirmation email — we'll reschedule. No fee, no fuss.",
                },
                {
                  q: "Do I need to prepare anything?",
                  a: "Nothing required. If you have recent blood work (inflammatory markers, vitamin D, ferritin) it's helpful to have it to hand — but it's not necessary. Your report from this assessment is the main thing.",
                },
                {
                  q: "What if EBOO turns out to be right for me?",
                  a: "Your doctor will walk you through the specific protocol they recommend, the cadence, and the cost — together with you, at the consultation. Nothing is committed at booking.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-ground-raised/40 p-6 md:p-8">
                  <dt className="font-display text-[17px] md:text-[20px] font-normal text-ink mb-2">
                    {q}
                  </dt>
                  <dd className="text-[13px] md:text-[14px] leading-[1.7] text-ink-dim font-light max-w-[68ch]">
                    {a}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
        </Reveal>

        {/* ====== FINAL CTA ====== */}
        <Reveal>
          <section className="relative my-24 md:my-32 py-16 md:py-20 px-7 md:px-12 border border-[var(--line)] bg-ground-raised/30 text-center overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(228,201,122,0.08) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="w-10 h-px bg-gold" />
                <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold font-medium">
                  Last word
                </span>
                <span className="w-10 h-px bg-gold" />
              </div>
              <h3 className="font-display display-tight text-[28px] md:text-[44px] leading-[1] font-light text-ink mb-8 max-w-[22ch] mx-auto">
                You've seen your reading.{" "}
                <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
                  Now have the conversation.
                </em>
              </h3>
              <Link
                href={screeningFirst ? "/book?screening=1" : "/book"}
                className={`plausible-event-name=${
                  screeningFirst ? "screening_click" : "consult_click"
                } plausible-event-source=result-bottom group inline-flex items-center gap-4 bg-gold text-ground px-8 py-5 md:py-6 font-mono text-[11px] md:text-[12px] tracking-[0.28em] font-medium relative overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(201,163,71,0.55)]`}
              >
                <span className="relative z-10">
                  {screeningFirst ? "BOOK A SCREENING CALL" : "BOOK YOUR FREE CONSULTATION"}
                </span>
                <ArrowRight
                  size={16}
                  className="relative z-10 transition-transform duration-500 group-hover:translate-x-1.5"
                />
                <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
              <p className="mt-7 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-faint">
                15 minutes · Free · No card · No pressure
              </p>
            </div>
          </section>
        </Reveal>

        {/* ====== BOTTOM PLATE ====== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="mb-10 pt-8 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.22em] text-ink-faint"
        >
          <span>
            HSW · ASSESSMENT REPORT · {new Date().toISOString().slice(0, 10).toUpperCase()}
          </span>
          <span className="text-gold">●</span>
          <span>ID · {data.id}</span>
        </motion.div>
      </article>

      <SiteFooter />
    </main>
  );
}

/* ============================ Subcomponents ============================ */

function BrandBar({ reportId }: { reportId: string }) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl bg-ground/85 border-b border-[var(--line)]">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10 h-[64px] md:h-[76px] flex items-center justify-between">
        <Link href="/" className="text-center" aria-label="Home">
          <div className="font-display font-bold text-[20px] md:text-[22px] tracking-[0.32em] leading-none text-gold">
            HSW
          </div>
          <div className="font-mono text-[7.5px] tracking-[0.32em] text-ink-dim mt-1 hidden md:block">
            HARLEY STREET WELLNESS
          </div>
        </Link>
        <div className="font-mono text-[10px] tracking-[0.22em] text-ink-dim hidden md:block">
          <span className="text-gold">REPORT</span>
          <span className="text-ink-faint"> · {reportId}</span>
        </div>
      </div>
    </header>
  );
}

function Hero({
  firstName,
  score,
  band,
}: {
  firstName: string;
  score: number;
  band: ReturnType<typeof scoreBand>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="text-center pt-[120px] md:pt-[160px] mb-14 md:mb-20"
    >
      <div className="inline-flex items-center gap-3 mb-6">
        <span className="w-10 h-px bg-gold" />
        <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold font-medium">
          Your assessment {firstName ? `· ${firstName}` : ""}
        </span>
        <span className="w-10 h-px bg-gold" />
      </div>
      <h1 className="font-display display-tight text-[36px] sm:text-[44px] md:text-[60px] leading-[0.98] font-light text-ink max-w-[20ch] mx-auto mb-5">
        Here's what we{" "}
        <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
          found
        </em>{" "}
        in your blood.
      </h1>
      <p className="max-w-[520px] mx-auto text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light">
        Read this in five minutes. The whole point is to give you enough context to make
        the consultation worth your time —{" "}
        <span className="text-gold">not to sell you a protocol from a webpage</span>.
      </p>
    </motion.div>
  );
}

function PersonalAnalysis({
  firstName,
  band,
  symptoms,
  lifestyle,
  age,
  dims,
}: {
  firstName: string;
  band: ReturnType<typeof scoreBand>;
  symptoms: string[];
  lifestyle: string | undefined;
  age: string | undefined;
  dims: ReturnType<typeof dimensionBreakdown>;
}) {
  // Identify the top contributor (excluding environment which is always baseline)
  const sorted = [...dims].filter((d) => d.key !== "env").sort((a, b) => b.contribution - a.contribution);
  const topDim = sorted[0];

  const intro =
    band.tone === "critical"
      ? `Your score sits in the top band. That's not an alarm bell — it means the substrate is loud enough that a focused intervention is likely to produce a meaningful shift.`
      : band.tone === "heavy"
      ? `Your score is on the higher end of what we see. The pattern suggests a system carrying real accumulated load — the kind that responds well when the underlying inflammation comes down.`
      : band.tone === "moderate"
      ? `Your score sits in the middle. Most people who come through this assessment land here. It means there's something to address but nothing that demands urgency — which is actually the best place to start.`
      : `Your score sits at the low end — which is unusual for the cohort we see. EBOO is still relevant on a preventative basis, but the conversation will focus more on maintenance than reset.`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 md:gap-16">
      <div className="space-y-5">
        <p className="text-[15px] md:text-[16px] leading-[1.75] text-ink font-light max-w-[60ch]">
          {firstName ? `${firstName}, ` : ""}
          {intro}
        </p>
        {topDim && topDim.contribution > 0 && (
          <p className="text-[14px] md:text-[15px] leading-[1.75] text-ink-dim font-light max-w-[60ch]">
            <span className="text-gold font-medium">Your strongest signal: </span>
            {topDim.key === "symptoms"
              ? `the cluster of symptoms you reported. The pattern matters more than any single one — and the pattern is what the consultation will focus on.`
              : topDim.key === "lifestyle"
              ? `your lifestyle pace${
                  lifestyle ? ` (you described it as "${lifestyle.toLowerCase()}")` : ""
                }. That's the dimension you have the most leverage over, and the one that responds fastest when you start reducing inflammatory inputs.`
              : `time. ${age ? `At ${age.toLowerCase()}, ` : ""}your system has had more years to accumulate residue than younger cohorts — which is the main reason age sits as a multiplier in the scoring model.`}
          </p>
        )}
        {symptoms.length > 0 && (
          <div className="pt-2">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-dim mb-3">
              You reported
            </div>
            <ul className="flex flex-wrap gap-2">
              {symptoms.map((s) => (
                <li
                  key={s}
                  className="text-[12px] tracking-[0.04em] text-ink border border-[var(--line)] bg-ground-raised/30 px-3 py-1.5"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <aside className="border-l border-[var(--line)] pl-7 md:pl-10">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-3">
          What this isn't
        </div>
        <p className="text-[13px] leading-[1.7] text-ink-dim font-light italic mb-5">
          A diagnosis. A clinical record. A prescription for treatment. A guarantee of
          outcome.
        </p>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-3">
          What it is
        </div>
        <p className="text-[13px] leading-[1.7] text-ink-dim font-light italic">
          A structured read on the inputs we know correlate with EBOO-responsive
          conditions. Useful for framing the conversation with a physician.
        </p>
      </aside>
    </div>
  );
}

function BookingCard({ track }: { track: string }) {
  return (
    <div className="relative my-20 md:my-28 border border-gold bg-gradient-to-br from-gold/[0.06] to-gold/[0.02] p-8 md:p-12">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(228,201,122,0.12) 0%, transparent 60%)",
        }}
      />
      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12 md:items-end">
        <div>
          <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold font-medium mb-4">
            Next step
          </div>
          <h2 className="font-display text-[28px] md:text-[40px] leading-[1.03] font-light text-ink mb-4">
            Book a 15-minute video consultation.{" "}
            <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
              Free. No card required.
            </em>
          </h2>
          <p className="text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light max-w-[500px]">
            A GMC-registered doctor will walk through your {track} reading, discuss what's
            appropriate, and answer everything. No charge, no obligation to book treatment
            afterwards.
          </p>
        </div>
        <Link
          href="/book"
          className="plausible-event-name=consult_click plausible-event-source=result group inline-flex items-center justify-between gap-4 bg-gold text-ground px-7 md:px-8 py-5 md:py-[22px] font-mono text-[11px] md:text-[12px] tracking-[0.28em] font-medium overflow-hidden relative transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(201,163,71,0.55)] whitespace-nowrap"
        >
          <span className="relative z-10">BOOK FREE CONSULTATION</span>
          <ArrowRight
            size={16}
            className="relative z-10 transition-transform duration-500 group-hover:translate-x-1.5"
          />
          <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </Link>
      </div>
    </div>
  );
}

function SafetyCard({ safetyFlags }: { safetyFlags: SafetyFlag[] }) {
  const flagLabels: Record<SafetyFlag, string> = {
    pregnancy: "Pregnancy or trying to conceive",
    g6pd: "G6PD deficiency / favism",
    anticoagulant: "Blood thinners or bleeding disorder",
  };

  return (
    <div className="relative my-20 md:my-28 border border-rouge/60 bg-rouge/[0.06] p-8 md:p-12">
      <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-rouge font-medium mb-4">
        Let's talk first
      </div>
      <h2 className="font-display text-[28px] md:text-[40px] leading-[1.03] font-light text-ink mb-4">
        EBOO may still be right for you,{" "}
        <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
          but we need a screening call first.
        </em>
      </h2>
      <p className="text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light max-w-[560px] mb-6">
        Your assessment flagged:
      </p>
      <ul className="flex flex-col gap-2 mb-8 max-w-[520px]">
        {safetyFlags.map((f) => (
          <li
            key={f}
            className="flex items-center gap-3 text-[14px] md:text-[15px] text-ink font-light"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rouge" />
            {flagLabels[f]}
          </li>
        ))}
      </ul>
      <p className="text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light max-w-[560px] mb-8">
        These don't rule EBOO out automatically — they mean a doctor needs to review your
        case before any treatment is planned. The screening call is free and takes 15 minutes.
      </p>
      <Link
        href="/book?screening=1"
        className="plausible-event-name=screening_click plausible-event-source=result group inline-flex items-center justify-between gap-4 bg-rouge text-ink px-7 md:px-8 py-5 md:py-[22px] font-mono text-[11px] md:text-[12px] tracking-[0.28em] font-medium overflow-hidden relative transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(107,29,46,0.55)]"
      >
        <span className="relative z-10">BOOK A SCREENING CALL</span>
        <ArrowRight
          size={16}
          className="relative z-10 transition-transform duration-500 group-hover:translate-x-1.5"
        />
      </Link>
    </div>
  );
}

/* ---------- layout primitives ---------- */

function Section({
  plate,
  eyebrow,
  children,
}: {
  plate: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[var(--line)] py-20 md:py-28">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-6">
        {plate} — {eyebrow}
      </div>
      {children}
    </section>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display display-tight text-[28px] md:text-[44px] leading-[1.02] font-light text-ink mb-7 max-w-[22ch]">
      {children}
    </h2>
  );
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
