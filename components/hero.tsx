"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HeroCanvas } from "./hero-canvas";
import { EbooMachine } from "./eboo-machine";
import { PatientEndpoints } from "./patient-endpoints";
import { ArrowRight } from "lucide-react";

const EASE = [0.2, 0.9, 0.1, 1] as [number, number, number, number];

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const fgY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const fgOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [1, 0.35, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const machineY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const machineScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const t = (delay = 0, dur = 1.1) => ({
    duration: reduce ? 0 : dur,
    delay: reduce ? 0 : delay,
    ease: EASE,
  });

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[760px] md:min-h-[820px] lg:min-h-[880px] w-full overflow-hidden"
    >
      {/* Atmosphere canvas */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 z-0">
        <HeroCanvas />
      </motion.div>

      {/* Patient endpoints + connecting tubes — sits between canvas and machine */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 1.0, ease: EASE }}
        className="absolute inset-0 z-[5] pointer-events-none"
      >
        <PatientEndpoints />
      </motion.div>

      {/* MACHINE — centerpiece, positioned in upper-middle of frame */}
      <motion.div
        style={{ y: machineY, scale: machineScale }}
        className="absolute inset-x-0 top-[14%] md:top-[15%] z-10 flex items-start justify-center pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.8, delay: 0.5, ease: EASE }}
          className="relative w-[80vw] max-w-[320px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[540px] xl:max-w-[600px] aspect-[800/540]"
        >
          {/* Warm halo directly behind the machine */}
          <div
            aria-hidden
            className="absolute -inset-[20%] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(228,201,122,0.20) 0%, rgba(201,163,71,0.08) 40%, transparent 70%)",
            }}
          />
          <EbooMachine className="w-full h-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)] [filter:drop-shadow(0_0_40px_rgba(201,163,71,0.18))]" />
          {!reduce && (
            <motion.div
              aria-hidden
              animate={{ opacity: [0.0, 0.12, 0.0] }}
              transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(228,201,122,0.4),transparent_55%)] mix-blend-overlay pointer-events-none"
            />
          )}
        </motion.div>
      </motion.div>

      {/* Bottom scrim for text legibility */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none z-[11]"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,15,26,0) 0%, rgba(7,11,21,0.55) 50%, rgba(7,11,21,0.96) 100%)",
        }}
      />
      {/* Top scrim under nav */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[200px] pointer-events-none z-[11]"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,11,21,0.92) 0%, rgba(7,11,21,0) 100%)",
        }}
      />

      {/* Architectural top hairline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.6, delay: 0.35, ease: EASE }}
        style={{ transformOrigin: "left" }}
        className="absolute left-0 right-0 top-[64px] md:top-[76px] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent z-[12]"
      />

      {/* Film-leader bottom rule */}
      <BottomRule />

      {/* Editorial markings (timecode, plate number) */}
      <Markings />

      {/* Corner brackets */}
      <CornerBracket pos="tl" delay={0.6} />
      <CornerBracket pos="tr" delay={0.7} />
      <CornerBracket pos="bl" delay={0.8} />
      <CornerBracket pos="br" delay={0.9} />

      {/* IN / OUT labels — anchor near machine flow endpoints */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={t(2.1, 1)}
        className="hidden md:block absolute left-12 lg:left-16 top-[44%] z-[13] font-mono text-[10px] tracking-[0.26em] text-rouge"
      >
        <div className="flex items-center gap-3">
          <span className="w-12 h-px bg-rouge/70" />
          <div>
            <div className="text-rouge font-medium">IN · DEOX</div>
            <div className="text-ink-faint text-[9px] mt-1">VENOUS DRAW</div>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={t(2.2, 1)}
        className="hidden md:block absolute right-12 lg:right-16 top-[20%] z-[13] font-mono text-[10px] tracking-[0.26em] text-gold text-right"
      >
        <div className="flex items-center gap-3 justify-end">
          <div>
            <div className="text-gold font-medium">OUT · O₃ + O₂</div>
            <div className="text-ink-faint text-[9px] mt-1">OXYGENATED RETURN</div>
          </div>
          <span className="w-12 h-px bg-gold/70" />
        </div>
      </motion.div>

      {/* Title-card composition */}
      <motion.div
        style={{ y: fgY, opacity: fgOpacity }}
        className="relative z-20 h-full flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-20 md:pb-16 max-w-[1600px] mx-auto pointer-events-none"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 md:items-end pointer-events-auto">
          <div className="max-w-[860px]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(1.05, 0.9)}
              className="inline-flex items-center gap-4 mb-7 md:mb-9"
            >
              <span className="w-12 md:w-16 h-px bg-gold" />
              <span className="font-body text-[10px] tracking-[0.34em] uppercase text-gold font-medium">
                Extracorporeal Blood Oxygenation
              </span>
            </motion.div>

            <h1 className="font-display display-tight text-[44px] leading-[0.86] sm:text-[54px] md:text-[68px] lg:text-[84px] xl:text-[96px] font-light text-ink">
              <MaskLine delay={1.2}>A human</MaskLine>
              <AccentLine delay={1.45} text="oil change." />
              <MaskLine
                delay={1.85}
                className="block text-[0.32em] md:text-[0.28em] text-ink-dim font-light tracking-tight mt-5 md:mt-7"
              >
                On <Strike delay={2.4}>Harley</Strike> our Street.
              </MaskLine>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(2.2, 0.9)}
              className="max-w-[500px] text-[13px] md:text-[15px] leading-[1.65] text-ink-dim font-light mt-6 md:mt-7"
            >
              Thirty years of city air, processed food, and modern stress leave residue in your blood.{" "}
              <strong className="font-normal text-ink">
                A one-hour medical procedure that filters it out
              </strong>{" "}
              &mdash; and oxygenates what's returned.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(2.4, 0.9)}
              className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-9 mt-8 md:mt-9"
            >
              <a
                href="/quiz"
                className="plausible-event-name=quiz_start plausible-event-source=hero group relative inline-flex items-center justify-between gap-4 bg-gold text-ground px-7 md:px-8 py-5 md:py-[22px] font-mono text-[11px] md:text-[12px] tracking-[0.28em] font-medium overflow-hidden transition-all duration-500 hover:-translate-y-[2px] hover:shadow-[0_22px_50px_-15px_rgba(201,163,71,0.55)]"
              >
                <span className="relative z-10">BEGIN THE ASSESSMENT</span>
                <ArrowRight size={16} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1.5" />
                <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </a>
              <div className="font-mono text-[10px] tracking-[0.22em] text-ink-dim leading-[1.8]">
                <div>03 MIN · NO CARD</div>
                <div>
                  <span className="text-gold">15 SLOTS</span> · THIS WEEK
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right caption — desktop */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(2.55, 1)}
            className="hidden md:block max-w-[280px] text-right pt-6"
          >
            <div className="border-t border-gold/30 pt-5">
              <p className="font-display italic-display text-[15px] leading-[1.55] text-ink-dim">
                <em className="text-gold not-italic font-medium">Fig. I.</em>{" "}
                &mdash; CTfi-1500 dialysis-grade circuit. Venous blood enters at{" "}
                <span className="text-gold">1.5 L/hr</span>; ozonated, oxygenated blood returns via opposite vein.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t(2.9, 1.2)}
        className="hidden md:flex absolute bottom-12 right-12 z-20 flex-col items-end gap-3 font-mono text-[9px] tracking-[0.32em] text-ink-faint"
      >
        <span>SCROLL TO REVEAL</span>
        <motion.span
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-14 bg-gradient-to-b from-gold via-gold/40 to-transparent origin-top"
        />
      </motion.div>
    </section>
  );
}

/* ---------- Subcomponents ---------- */

function MaskLine({
  children,
  delay = 0,
  className = "block overflow-hidden",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      <motion.span
        initial={{ y: "115%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 1.2, delay, ease: EASE }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function AccentLine({ text, delay = 0 }: { text: string; delay?: number }) {
  const letters = Array.from(text);
  return (
    <span className="block italic-display text-gold font-normal pl-[0.18em] overflow-hidden">
      <span className="inline-flex">
        {letters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: "110%", opacity: 0, rotateX: -45 }}
            animate={{ y: "0%", opacity: 1, rotateX: 0 }}
            transition={{ duration: 1.1, delay: delay + i * 0.045, ease: EASE }}
            className="inline-block"
            style={{ whiteSpace: "pre" }}
          >
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

function Strike({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="relative inline-block">
      {children}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.75, delay, ease: [0.7, 0.1, 0.3, 1] }}
        style={{ transformOrigin: "left" }}
        className="absolute left-[-4%] right-[-4%] top-[55%] h-[2px] bg-rouge"
      />
    </span>
  );
}

function CornerBracket({
  pos,
  delay = 0,
}: {
  pos: "tl" | "tr" | "bl" | "br";
  delay?: number;
}) {
  const pmap = {
    tl: "top-[88px] left-6 md:top-[110px] md:left-12",
    tr: "top-[88px] right-6 md:top-[110px] md:right-12",
    bl: "bottom-[80px] left-6 md:bottom-[100px] md:left-12",
    br: "bottom-[80px] right-6 md:bottom-[100px] md:right-12",
  } as const;
  const omap = {
    tl: { x: "left", y: "top" },
    tr: { x: "right", y: "top" },
    bl: { x: "left", y: "bottom" },
    br: { x: "right", y: "bottom" },
  } as const;
  const o = omap[pos];

  return (
    <div className={`absolute z-[12] pointer-events-none ${pmap[pos]}`}>
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay, ease: EASE }}
        style={{ transformOrigin: o.x }}
        className={`block w-10 md:w-16 h-px bg-gold/50 absolute ${o.y === "top" ? "top-0" : "bottom-0"} ${o.x === "left" ? "left-0" : "right-0"}`}
      />
      <motion.span
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: delay + 0.1, ease: EASE }}
        style={{ transformOrigin: o.y }}
        className={`block w-px h-10 md:h-16 bg-gold/50 absolute ${o.y === "top" ? "top-0" : "bottom-0"} ${o.x === "left" ? "left-0" : "right-0"}`}
      />
    </div>
  );
}

function Markings() {
  const [timecode, setTimecode] = useState("00:00:00");

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
      const s = String(elapsed % 60).padStart(2, "0");
      setTimecode(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.8, ease: EASE }}
        className="absolute top-[96px] md:top-[120px] right-6 md:right-12 z-[13] text-right font-mono text-[10px] tracking-[0.24em] text-ink-dim leading-[1.65]"
      >
        <div className="text-gold">PL. I</div>
        <div>HSW · EBOO</div>
        <div className="text-ink-faint">FIG. 01 · CTfi-1500</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.8, ease: EASE }}
        className="hidden md:flex absolute top-[120px] left-12 z-[13] items-center gap-3 font-mono text-[10px] tracking-[0.26em] text-ink-dim"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_12px_var(--gold)]" />
        <span>READING · NORMAL</span>
        <span className="text-ink-faint">/</span>
        <span className="text-gold">1.5 L/HR</span>
        <span className="text-ink-faint">/</span>
        <span>{timecode}</span>
      </motion.div>
    </>
  );
}

function BottomRule() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1, ease: EASE }}
      className="absolute bottom-0 inset-x-0 z-[12] pointer-events-none"
    >
      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute -top-px left-0 right-0 flex justify-between px-6 md:px-12">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="w-px h-[6px] bg-gold/30" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
