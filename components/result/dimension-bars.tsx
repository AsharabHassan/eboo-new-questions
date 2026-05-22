"use client";

import { motion } from "motion/react";
import type { DimensionScore } from "@/lib/quiz-data";

const EASE = [0.2, 0.9, 0.1, 1] as [number, number, number, number];

const COPY: Record<DimensionScore["key"], { desc: string; basedOn: string }> = {
  env: {
    desc: "City living concentrates particulate matter, water contaminants, and traffic exhaust at orders of magnitude above rural baselines.",
    basedOn: "Assumed at maximum for the launch audience — HSW serves London and Glasgow.",
  },
  lifestyle: {
    desc: "Diet, alcohol, and sleep behaviours that move together produce a measurable read on cumulative oxidative load.",
    basedOn: "Based on your self-reported lifestyle pace.",
  },
  symptoms: {
    desc: "Downstream signals of upstream load. The pattern matters more than any single symptom.",
    basedOn: "Based on the symptoms you reported.",
  },
  age: {
    desc: "Accumulated exposure scales with time. Older systems carry more environmental residue and more antioxidant-pathway dysregulation.",
    basedOn: "Based on your age bracket.",
  },
};

export function DimensionBars({ dimensions }: { dimensions: DimensionScore[] }) {
  const total = dimensions.reduce((sum, d) => sum + d.contribution, 0);
  return (
    <div className="border border-[var(--line)] bg-ground-raised/30">
      <div className="px-7 md:px-9 pt-7 pb-5 border-b border-[var(--line)] flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[20px] md:text-[24px] font-normal text-ink">
          Where your{" "}
          <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
            score came from.
          </em>
        </h3>
        <span className="font-mono text-[10px] tracking-[0.22em] text-ink-faint">
          TOTAL · {total}/100
        </span>
      </div>
      <ol className="flex flex-col">
        {dimensions.map((d, i) => (
          <DimensionRow key={d.key} d={d} delay={i * 0.1} />
        ))}
      </ol>
    </div>
  );
}

function DimensionRow({ d, delay }: { d: DimensionScore; delay: number }) {
  const copy = COPY[d.key];
  const maxContribution = Math.round(d.weight * 100);
  // visual fill on a 0..maxContribution scale relative to the dimension's max weight
  const fillPct = (d.contribution / maxContribution) * 100;

  return (
    <li className="px-7 md:px-9 py-6 border-b border-[var(--line)] last:border-b-0">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <div>
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-gold mb-1">
            {d.label}
          </div>
          <div className="font-display text-[15px] md:text-[16px] text-ink leading-snug">
            {copy.desc}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display text-[28px] md:text-[34px] leading-none font-light text-ink display-tight">
            {d.contribution}
          </div>
          <div className="font-mono text-[9px] tracking-[0.2em] text-ink-faint mt-0.5">
            / {maxContribution} max
          </div>
        </div>
      </div>
      {/* Bar */}
      <div className="relative h-[6px] bg-ground-deeper border border-[var(--line)] overflow-hidden mt-4">
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: fillPct / 100 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 1.4, delay, ease: EASE }}
          style={{ transformOrigin: "left" }}
          className="absolute inset-0 bg-gradient-to-r from-gold-deep via-gold to-gold-soft origin-left"
        />
        {/* Ticks at 25/50/75% */}
        {[0.25, 0.5, 0.75].map((p) => (
          <span
            key={p}
            className="absolute top-0 bottom-0 w-px bg-[var(--line)]"
            style={{ left: `${p * 100}%` }}
          />
        ))}
      </div>
      <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-faint mt-3">
        {copy.basedOn}
      </div>
    </li>
  );
}
