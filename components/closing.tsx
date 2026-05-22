"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function Closing() {
  return (
    <section
      id="assessment"
      className="relative border-t border-[var(--line)] py-24 md:py-36 px-5 md:px-10 text-center overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at center top, rgba(201,163,71,0.10) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative max-w-[820px] mx-auto"
      >
        <div className="inline-flex items-center gap-3.5 mb-8 md:mb-10">
          <span className="w-8 h-px bg-gold-deep" />
          <span className="font-body text-[10px] tracking-[0.32em] uppercase text-gold font-medium">
            Begin
          </span>
          <span className="w-8 h-px bg-gold-deep" />
        </div>

        <h3 className="font-display text-[44px] md:text-[72px] lg:text-[96px] leading-[0.96] font-light text-ink mb-7 md:mb-9 display-tight">
          See what's <em className="italic-display text-gold">built up.</em>
          <br />
          See what to <em className="italic-display text-gold">do about it.</em>
        </h3>

        <p className="max-w-[540px] mx-auto text-[15px] md:text-[16px] leading-[1.7] text-ink-dim font-light mb-11 md:mb-12">
          A three-minute assessment scores your toxic load and recommends the protocol that fits
          your physiology and your goals. Free. Private. No card required.
        </p>

        <a
          href="/quiz"
          className="plausible-event-name=quiz_start plausible-event-source=closing group relative inline-flex items-center justify-center gap-4 bg-gold text-ground px-8 py-5 md:px-10 md:py-6 font-mono text-[11px] md:text-[12px] tracking-[0.28em] font-medium overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-15px_rgba(201,163,71,0.5)]"
        >
          <span className="relative z-10">BEGIN THE ASSESSMENT</span>
          <ArrowRight
            size={18}
            className="relative z-10 transition-transform duration-500 group-hover:translate-x-1.5"
          />
          <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.5)_50%,transparent_70%)] -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </a>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-[10px] tracking-[0.22em] text-ink-faint">
          <span>03 MINUTES</span>
          <span className="text-gold">●</span>
          <span>15 QUESTIONS</span>
          <span className="text-gold">●</span>
          <span>1 PROTOCOL FOR YOU</span>
        </div>
      </motion.div>
    </section>
  );
}
