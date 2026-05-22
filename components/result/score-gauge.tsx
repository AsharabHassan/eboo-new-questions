"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const EASE = [0.2, 0.9, 0.1, 1] as [number, number, number, number];

/**
 * Animated half-circle score gauge — fills from 0 to `score` over ~1.4s.
 * Triggered on mount (or when entering view).
 */
export function ScoreGauge({
  score,
  label,
  tone,
}: {
  score: number;
  label: string;
  tone: "light" | "moderate" | "heavy" | "critical";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [display, setDisplay] = useState(0);

  // Tick the displayed number up from 0 → score on reveal
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(score * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, score]);

  const toneColor = {
    light: "#5fffd0",
    moderate: "#E4C97A",
    heavy: "#C9A347",
    critical: "#b8395a",
  }[tone];

  // SVG arc params
  const cx = 150;
  const cy = 140;
  const r = 110;
  const startAngle = Math.PI; // 180°
  const endAngle = 2 * Math.PI; // 360° / 0°
  const arcLen = Math.PI * r; // half-circumference
  const filledLen = (score / 100) * arcLen;

  return (
    <div ref={ref} className="relative w-full max-w-[340px] mx-auto">
      <svg viewBox="0 0 300 180" className="w-full h-auto">
        <defs>
          <linearGradient id="gaugeFill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5fffd0" />
            <stop offset="50%" stopColor="#E4C97A" />
            <stop offset="100%" stopColor="#b8395a" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d={describeArc(cx, cy, r, startAngle, endAngle)}
          stroke="#2a3041"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />

        {/* Fill */}
        <motion.path
          d={describeArc(cx, cy, r, startAngle, endAngle)}
          stroke="url(#gaugeFill)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={arcLen}
          initial={{ strokeDashoffset: arcLen }}
          animate={{ strokeDashoffset: inView ? arcLen - filledLen : arcLen }}
          transition={{ duration: 1.4, ease: EASE }}
        />

        {/* Tick marks at 0 / 30 / 60 / 80 / 100 */}
        {[0, 30, 60, 80, 100].map((t) => {
          const angle = startAngle + (t / 100) * Math.PI;
          const inner = polarToCartesian(cx, cy, r - 22, angle);
          const outer = polarToCartesian(cx, cy, r - 8, angle);
          return (
            <line
              key={t}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#9C9586"
              strokeWidth={t === 0 || t === 100 ? 0.8 : 0.5}
              opacity={t === 0 || t === 100 ? 0.7 : 0.4}
            />
          );
        })}

        {/* Indicator notch at current score */}
        {inView && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            {(() => {
              const angle = startAngle + (score / 100) * Math.PI;
              const tip = polarToCartesian(cx, cy, r + 12, angle);
              const base = polarToCartesian(cx, cy, r - 8, angle);
              return (
                <line
                  x1={base.x}
                  y1={base.y}
                  x2={tip.x}
                  y2={tip.y}
                  stroke={toneColor}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              );
            })()}
          </motion.g>
        )}
      </svg>

      <div className="absolute inset-x-0 bottom-2 text-center pointer-events-none">
        <div className="font-display display-tight text-[72px] md:text-[88px] leading-none font-light text-ink">
          {display}
        </div>
        <div className="font-mono text-[10px] tracking-[0.25em] text-ink-dim mt-1">
          / 100
        </div>
      </div>

      <div className="mt-4 text-center">
        <div
          className="font-mono text-[11px] tracking-[0.32em] uppercase font-medium"
          style={{ color: toneColor }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, start);
  const e = polarToCartesian(cx, cy, r, end);
  const largeArc = end - start > Math.PI ? 1 : 0;
  // sweep 1 for clockwise
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
}
