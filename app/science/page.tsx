import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  CITATIONS,
  DIMENSIONS,
  TRACK_RATIONALE,
  SAFETY_RATIONALE,
  DESIGN_PRINCIPLES,
} from "@/lib/methodology";
import { searchPubMed, EBOO_SEARCH_QUERY } from "@/lib/pubmed";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "The Science · HSW EBOO Assessment",
  description:
    "How the HSW EBOO assessment is built — scoring framework, per-dimension rationale, track logic, safety basis, and the published research it draws on.",
};

// Weekly ISR so live PubMed results stay fresh without hammering NCBI
export const revalidate = 604800;

export default async function SciencePage() {
  const latest = await searchPubMed(EBOO_SEARCH_QUERY, 6);

  return (
    <main className="relative min-h-[100svh] bg-ground vignette grain overflow-hidden">
      {/* Top bar */}
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
          <Link
            href="/quiz"
            className="font-mono text-[10px] tracking-[0.22em] uppercase border border-gold text-gold px-4 py-2.5 hover:bg-gold hover:text-ground transition-all duration-300"
          >
            Begin Assessment
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-[140px] md:pt-[180px] pb-20 md:pb-28 px-5 md:px-10 max-w-[1100px] mx-auto">
        <div className="inline-flex items-center gap-3 mb-7">
          <span className="w-10 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold font-medium">
            The science
          </span>
        </div>
        <h1 className="font-display display-tight text-[44px] sm:text-[60px] md:text-[88px] lg:text-[112px] leading-[0.92] font-light text-ink max-w-[14ch]">
          How the assessment is{" "}
          <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
            built.
          </em>
        </h1>
        <p className="mt-9 md:mt-11 max-w-[640px] text-[15px] md:text-[17px] leading-[1.7] text-ink-dim font-light">
          A wellness assessment is only useful if it tells you something true. This is
          how ours works: four scoring dimensions, one routing question, three safety
          questions — each grounded in published research. The science underneath, in plain language.
        </p>
      </section>

      {/* Design principles */}
      <Principles />

      {/* Score framework — 4 dimensions */}
      <Framework />

      {/* Tracks */}
      <Tracks />

      {/* Safety */}
      <Safety />

      {/* Live research feed */}
      <LatestResearch papers={latest} />

      {/* Full reference list */}
      <Bibliography />

      {/* CTA */}
      <Closing />

      <SiteFooter />
    </main>
  );
}

/* -------------------- sections -------------------- */

function Principles() {
  return (
    <section className="relative border-t border-[var(--line)] px-5 md:px-10 py-20 md:py-28 max-w-[1100px] mx-auto">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-7">
        Pl. I — Principles
      </div>
      <h2 className="font-display display-tight text-[32px] md:text-[48px] leading-[1] font-light text-ink mb-12 max-w-[16ch]">
        Four rules we{" "}
        <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
          designed around.
        </em>
      </h2>
      <ol className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-16 md:gap-y-12">
        {DESIGN_PRINCIPLES.map((p, i) => (
          <li key={p.title} className="flex gap-5">
            <span className="font-mono text-[11px] tracking-[0.18em] text-gold pt-1.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-[22px] md:text-[26px] font-normal text-ink mb-2 leading-[1.15]">
                {p.title}
              </h3>
              <p className="text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light">
                {p.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Framework() {
  return (
    <section className="relative border-t border-[var(--line)] px-5 md:px-10 py-20 md:py-28 max-w-[1100px] mx-auto">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-7">
        Pl. II — Scoring framework
      </div>
      <h2 className="font-display display-tight text-[32px] md:text-[48px] leading-[1] font-light text-ink mb-5 max-w-[20ch]">
        Four dimensions.{" "}
        <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
          One score.
        </em>
      </h2>
      <p className="max-w-[640px] text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light mb-14 md:mb-16">
        The Toxic Load Score (0–100) is a weighted composite of four independent inputs.
        Each dimension is normalised against its theoretical maximum, then multiplied by
        its weight. The weights reflect how strongly each axis drives the literature on
        oxidative stress, inflammation, and accumulated load.
      </p>

      <ol className="flex flex-col">
        {DIMENSIONS.map((d, i) => (
          <li
            key={d.key}
            className="grid grid-cols-[64px_1fr] md:grid-cols-[64px_1fr_120px] gap-x-6 md:gap-x-10 gap-y-3 py-10 border-b border-[var(--line)] last:border-b-0"
          >
            <div className="font-mono text-[11px] tracking-[0.2em] text-gold pt-1.5">
              — {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <h3 className="font-display text-[24px] md:text-[32px] font-normal text-ink mb-2">
                {d.title}{" "}
                <span className="font-mono text-[12px] md:text-[13px] tracking-[0.18em] text-gold align-middle">
                  · {Math.round(d.weight * 100)}%
                </span>
              </h3>
              <p className="text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light max-w-[58ch] mb-4">
                {d.blurb}
              </p>
              <p className="text-[13px] md:text-[14px] leading-[1.7] text-ink font-light max-w-[58ch] italic mb-4">
                <span className="text-gold not-italic font-medium">What we ask:</span>{" "}
                {d.whatWeAsk}
              </p>
              <CitationRow refs={d.citations} />
            </div>
            <div className="hidden md:block text-right pt-2">
              <div className="font-display text-[36px] font-light text-ink leading-none">
                {Math.round(d.weight * 100)}
              </div>
              <div className="font-mono text-[9px] tracking-[0.22em] text-ink-faint mt-1">
                / 100
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Tracks() {
  return (
    <section className="relative border-t border-[var(--line)] px-5 md:px-10 py-20 md:py-28 max-w-[1100px] mx-auto">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-7">
        Pl. III — Track routing
      </div>
      <h2 className="font-display display-tight text-[32px] md:text-[48px] leading-[1] font-light text-ink mb-5 max-w-[20ch]">
        After the score,{" "}
        <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
          your goal.
        </em>
      </h2>
      <p className="max-w-[640px] text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light mb-12">
        {TRACK_RATIONALE.intro}
      </p>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)]">
        {TRACK_RATIONALE.tracks.map((t) => (
          <li key={t.key} className="bg-ground-raised/40 p-7 md:p-9">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-3">
              {t.title}
            </div>
            <p className="text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light mb-5">
              {t.basis}
            </p>
            <CitationRow refs={t.citations} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function Safety() {
  return (
    <section className="relative border-t border-[var(--line)] px-5 md:px-10 py-20 md:py-28 max-w-[1100px] mx-auto">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-rouge font-medium mb-7">
        Pl. IV — Safety screen
      </div>
      <h2 className="font-display display-tight text-[32px] md:text-[48px] leading-[1] font-light text-ink mb-5 max-w-[20ch]">
        Why we screen for{" "}
        <em className="italic-display text-rouge" style={{ fontStyle: "italic" }}>
          three things.
        </em>
      </h2>
      <p className="max-w-[640px] text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light mb-12">
        These questions don't affect your score. They route the result page — if any
        flag is raised, you're directed to a screening call with a doctor rather than
        straight to booking.
      </p>
      <ol className="flex flex-col">
        {SAFETY_RATIONALE.map((s, i) => (
          <li
            key={s.flag}
            className="grid grid-cols-[64px_1fr] gap-x-6 md:gap-x-10 py-8 md:py-10 border-b border-[var(--line)] last:border-b-0"
          >
            <div className="font-mono text-[11px] tracking-[0.2em] text-rouge pt-1.5">
              — {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <h3 className="font-display text-[22px] md:text-[28px] font-normal text-ink mb-3">
                {s.title}
              </h3>
              <p className="text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light max-w-[58ch] mb-4">
                {s.basis}
              </p>
              <CitationRow refs={s.citations} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function LatestResearch({ papers }: { papers: Awaited<ReturnType<typeof searchPubMed>> }) {
  if (papers.length === 0) {
    return (
      <section className="relative border-t border-[var(--line)] px-5 md:px-10 py-20 md:py-28 max-w-[1100px] mx-auto">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-7">
          Pl. V — Live from PubMed
        </div>
        <p className="text-[14px] text-ink-dim font-light">
          Live research feed is temporarily unavailable. Refresh shortly — we pull from
          PubMed weekly.
        </p>
      </section>
    );
  }
  return (
    <section className="relative border-t border-[var(--line)] px-5 md:px-10 py-20 md:py-28 max-w-[1100px] mx-auto">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-7">
        Pl. V — Live from PubMed
      </div>
      <div className="flex items-end justify-between gap-6 mb-10 md:mb-12 flex-wrap">
        <h2 className="font-display display-tight text-[32px] md:text-[48px] leading-[1] font-light text-ink max-w-[18ch]">
          The newest published{" "}
          <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
            EBOO research.
          </em>
        </h2>
        <span className="font-mono text-[10px] tracking-[0.2em] text-ink-dim">
          AUTO-UPDATED WEEKLY · NCBI E-UTILITIES
        </span>
      </div>
      <ol className="flex flex-col gap-px bg-[var(--line)] border border-[var(--line)]">
        {papers.map((p) => (
          <li key={p.pmid} className="bg-ground-raised/40">
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 md:p-8 hover:bg-ground-raised/70 transition-colors group"
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div className="flex-shrink-0 font-mono text-[10px] tracking-[0.18em] text-gold pt-1">
                  {p.year ?? "—"}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-[18px] md:text-[22px] font-normal text-ink mb-2 leading-[1.25] group-hover:text-gold transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-ink-dim font-light leading-[1.6]">
                    {p.authors}
                    {p.authors && p.journal ? " · " : ""}
                    <span className="italic">{p.journal}</span>
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="flex-shrink-0 text-ink-faint group-hover:text-gold group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                />
              </div>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Bibliography() {
  const all = Object.values(CITATIONS);
  return (
    <section className="relative border-t border-[var(--line)] px-5 md:px-10 py-20 md:py-28 max-w-[1100px] mx-auto">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-7">
        Pl. VI — Bibliography
      </div>
      <h2 className="font-display display-tight text-[32px] md:text-[48px] leading-[1] font-light text-ink mb-12 max-w-[18ch]">
        Every claim,{" "}
        <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
          sourced.
        </em>
      </h2>
      <ol className="flex flex-col divide-y divide-[var(--line)]">
        {all.map((c) => (
          <li key={c.ref} className="grid grid-cols-[40px_1fr] gap-x-5 py-6 md:py-7">
            <div className="font-mono text-[12px] tracking-[0.1em] text-gold pt-1">
              [{c.ref}]
            </div>
            <div>
              <p className="text-[14px] md:text-[15px] leading-[1.55] text-ink font-light mb-2">
                {c.authors} <span className="italic-display" style={{ fontStyle: "italic" }}>{c.title}</span>{" "}
                <span className="italic text-ink-dim">{c.journal}</span>{" "}
                <span className="font-mono text-[12px] text-ink-faint">· {c.year}</span>
              </p>
              <p className="text-[13px] leading-[1.65] text-ink-dim font-light mb-3 max-w-[60ch]">
                {c.takeaway}
              </p>
              {c.pmid && (
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-gold hover:text-gold-soft transition-colors"
                >
                  PubMed · {c.pmid}
                  <ArrowUpRight size={11} />
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative border-t border-[var(--line)] px-5 md:px-10 py-24 md:py-32 text-center">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at center top, rgba(201,163,71,0.08) 0%, transparent 60%)",
        }}
      />
      <div className="relative max-w-[680px] mx-auto">
        <div className="inline-flex items-center gap-3 mb-7">
          <span className="w-10 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold font-medium">
            Take it
          </span>
          <span className="w-10 h-px bg-gold" />
        </div>
        <h3 className="font-display display-tight text-[36px] md:text-[60px] leading-[0.98] font-light text-ink mb-9">
          Now you know how the assessment works.{" "}
          <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
            Time to take it.
          </em>
        </h3>
        <Link
          href="/quiz"
          className="plausible-event-name=quiz_start plausible-event-source=science group relative inline-flex items-center gap-4 bg-gold text-ground px-8 py-5 md:py-6 font-mono text-[11px] md:text-[12px] tracking-[0.28em] font-medium overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(201,163,71,0.55)]"
        >
          <span className="relative z-10">BEGIN THE ASSESSMENT</span>
          <ArrowRight size={16} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1.5" />
          <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </Link>
      </div>
    </section>
  );
}

function CitationRow({ refs }: { refs: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-ink-faint mr-1">
        Sources
      </span>
      {refs.map((r) => {
        const c = CITATIONS[r];
        if (!c) return null;
        return (
          <a
            key={r}
            href={c.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/` : "#"}
            target={c.pmid ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-gold/80 hover:text-gold border border-gold/30 hover:border-gold/70 px-2 py-1 transition-colors"
            title={`${c.authors} ${c.title}`}
          >
            [{c.ref}]
            {c.pmid && <ArrowUpRight size={9} />}
          </a>
        );
      })}
    </div>
  );
}
