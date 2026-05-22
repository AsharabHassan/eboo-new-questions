"use client";

import { motion } from "motion/react";

const STEPS = [
  {
    n: "01",
    titlePre: "Blood is",
    titleAccent: "drawn.",
    body: "A single IV in your left arm. The flow is gentle; you'll feel almost nothing. Sit with a book, a laptop, or the city through the window.",
    stat: "1.5 L",
    statLabel: "PER HOUR",
  },
  {
    n: "02",
    titlePre: "It passes through a",
    titleAccent: "filter.",
    body: "A medical-grade dialysis membrane catches the residue your body's been carrying — inflammatory proteins, oxidised lipids, the molecular sediment of modern life.",
    stat: "0.2 μm",
    statLabel: "MEMBRANE",
  },
  {
    n: "03",
    titlePre: "It is",
    titleAccent: "ozonated.",
    body: "Medical ozone is dissolved into the filtered blood at a precisely controlled dose. This activates NRF2 — your master antioxidant pathway — and primes the immune system.",
    stat: "40 μg/mL",
    statLabel: "O₃ DOSE",
  },
  {
    n: "04",
    titlePre: "It returns,",
    titleAccent: "oxygenated.",
    body: "Through a second IV in your right arm. Clean, oxygen-rich blood re-enters circulation. Most clients report a clarity within hours — and a quiet shift over the days that follow.",
    stat: "60 MIN",
    statLabel: "SESSION",
  },
] as const;

export function Mechanism() {
  return (
    <section
      id="mechanism"
      className="relative border-t border-[var(--line)] px-5 md:px-10 py-24 md:py-36 max-w-[1440px] mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-[0.42fr_1fr] gap-12 md:gap-20">
        {/* Sticky heading on desktop */}
        <div className="md:sticky md:top-32 md:self-start">
          <div className="font-mono text-[10px] tracking-[0.25em] text-gold mb-5 md:mb-7">
            PL. II — THE MECHANISM
          </div>
          <h2 className="font-display display-tight text-[44px] md:text-[56px] lg:text-[68px] leading-[0.95] font-light text-ink">
            What happens
            <br />
            in the <span className="italic-display text-gold font-normal">hour.</span>
          </h2>
        </div>

        {/* Steps */}
        <ol className="flex flex-col">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.2, 0.9, 0.1, 1] }}
              className="grid grid-cols-[40px_1fr] md:grid-cols-[50px_1fr_90px] gap-x-5 md:gap-x-8 gap-y-4 py-8 md:py-10 border-b border-[var(--line)] last:border-b-0 items-baseline"
            >
              <div className="font-mono text-[11px] tracking-[0.2em] text-gold pt-2">
                — {step.n}
              </div>
              <div>
                <h3 className="font-display text-[24px] md:text-[32px] leading-[1.05] font-normal text-ink mb-2 md:mb-3">
                  {step.titlePre}{" "}
                  <span className="italic-display text-gold">{step.titleAccent}</span>
                </h3>
                <p className="text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light max-w-[52ch]">
                  {step.body}
                </p>
                {/* Stat shows under body on mobile, in 3rd column on desktop */}
                <div className="md:hidden mt-4 font-mono text-[10px] tracking-[0.18em] text-ink-faint">
                  <span className="font-display text-[20px] tracking-tight text-ink mr-2">
                    {step.stat}
                  </span>
                  {step.statLabel}
                </div>
              </div>
              <div className="hidden md:block text-right font-mono text-[10px] tracking-[0.18em] text-ink-faint pt-3">
                <span className="block font-display text-[22px] tracking-tight text-ink mb-1 font-normal">
                  {step.stat}
                </span>
                {step.statLabel}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
