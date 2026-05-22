"use client";

import { motion } from "motion/react";

/**
 * EBOO schematic — the visual centerpiece.
 * Dirty blood flows in (rouge), through the filter membrane (gold core),
 * out as oxygenated (bone). Particles travel the paths; central node breathes.
 */
export function CirculationVisual() {
  return (
    <div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden border border-[var(--line)] bg-[radial-gradient(ellipse_at_50%_30%,#1a2540_0%,var(--bg)_70%)]">
      {/* Corner brackets */}
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />

      {/* Top labels */}
      <div className="absolute top-5 inset-x-5 md:top-8 md:inset-x-8 flex justify-between font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-ink-dim">
        <span>SPECIMEN · 073 / 100</span>
        <span>SESSION 01 / 06</span>
      </div>

      {/* The schematic */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 320 400"
          className="w-[80%] max-w-[360px] h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="coreGlow">
              <stop offset="0%" stopColor="#C9A347" stopOpacity="1" />
              <stop offset="50%" stopColor="#C9A347" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C9A347" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="dirtyFlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6B1D2E" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#6B1D2E" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="cleanFlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C9A347" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F5F1E8" stopOpacity="0.2" />
            </linearGradient>
            <filter id="soften">
              <feGaussianBlur stdDeviation="0.6" />
            </filter>
          </defs>

          {/* Outer rotating orbit */}
          <g style={{ transformOrigin: "160px 200px", animation: "rotate-slow 100s linear infinite" }}>
            <circle cx="160" cy="200" r="148" stroke="#C9A347" strokeWidth="0.4" strokeDasharray="1 6" opacity="0.45" />
            <circle cx="160" cy="200" r="148" stroke="#C9A347" strokeWidth="0.8" strokeDasharray="0 295 8 1000" opacity="0.9" />
          </g>

          {/* Static inner orbit */}
          <circle cx="160" cy="200" r="110" stroke="#C9A347" strokeWidth="0.4" opacity="0.25" />

          {/* Core glow — breathing */}
          <motion.circle
            cx="160"
            cy="200"
            r="70"
            fill="url(#coreGlow)"
            animate={{ opacity: [0.45, 0.8, 0.45] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Filter membrane — concentric lines */}
          <g opacity="0.65">
            <circle cx="160" cy="200" r="40" stroke="#C9A347" strokeWidth="0.5" />
            <circle cx="160" cy="200" r="32" stroke="#C9A347" strokeWidth="0.4" />
            <circle cx="160" cy="200" r="24" stroke="#C9A347" strokeWidth="0.3" />
            <circle cx="160" cy="200" r="16" stroke="#C9A347" strokeWidth="0.25" />
          </g>

          {/* IN path (left side, dirty blood) */}
          <motion.path
            d="M 30 200 Q 70 180 100 200 Q 130 220 160 200"
            stroke="url(#dirtyFlow)"
            strokeWidth="1.2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.3, ease: [0.2, 0.9, 0.1, 1] }}
          />
          {/* OUT path (right side, clean) */}
          <motion.path
            d="M 160 200 Q 190 180 220 200 Q 250 220 290 200"
            stroke="url(#cleanFlow)"
            strokeWidth="1.2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.6, ease: [0.2, 0.9, 0.1, 1] }}
          />

          {/* Animated particles — IN */}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={`in-${i}`} r="1.6" fill="#6B1D2E">
              <animateMotion
                dur={`${3.2 + i * 0.2}s`}
                repeatCount="indefinite"
                begin={`${i * 0.6}s`}
                path="M 30 200 Q 70 180 100 200 Q 130 220 160 200"
              />
              <animate attributeName="opacity" values="0;1;1;0.4" keyTimes="0;0.1;0.85;1" dur={`${3.2 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.6}s`} />
            </circle>
          ))}
          {/* Animated particles — OUT */}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={`out-${i}`} r="1.6" fill="#C9A347" filter="url(#soften)">
              <animateMotion
                dur={`${3.2 + i * 0.2}s`}
                repeatCount="indefinite"
                begin={`${1 + i * 0.6}s`}
                path="M 160 200 Q 190 180 220 200 Q 250 220 290 200"
              />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${3.2 + i * 0.2}s`} repeatCount="indefinite" begin={`${1 + i * 0.6}s`} />
            </circle>
          ))}

          {/* Endpoint nodes */}
          <circle cx="30" cy="200" r="3.5" fill="#6B1D2E" stroke="#6B1D2E" strokeWidth="6" strokeOpacity="0.15">
            <animate attributeName="strokeOpacity" values="0.1;0.3;0.1" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="290" cy="200" r="3.5" fill="#C9A347" stroke="#C9A347" strokeWidth="6" strokeOpacity="0.2">
            <animate attributeName="strokeOpacity" values="0.15;0.45;0.15" dur="2.5s" repeatCount="indefinite" />
          </circle>
          {/* Center pulse */}
          <circle cx="160" cy="200" r="4" fill="#F5F1E8">
            <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Top callouts */}
          <text x="22" y="178" fontFamily="JetBrains Mono" fontSize="7" fill="#9C9586" letterSpacing="1.2">IN · DEOX</text>
          <line x1="22" y1="182" x2="60" y2="182" stroke="#9C9586" strokeWidth="0.3" />
          <text x="262" y="178" fontFamily="JetBrains Mono" fontSize="7" fill="#C9A347" letterSpacing="1.2">OUT · O₃ + O₂</text>
          <line x1="262" y1="182" x2="300" y2="182" stroke="#C9A347" strokeWidth="0.3" />

          {/* Membrane label */}
          <text x="160" y="288" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="6.5" fill="#9C9586" letterSpacing="1.5">
            MEMBRANE · 0.2 μm
          </text>
        </svg>
      </div>

      {/* Caption */}
      <div className="absolute bottom-16 md:bottom-20 inset-x-5 md:inset-x-8 border-t border-[var(--line)] pt-4">
        <p className="font-display italic-display text-[12px] md:text-[14px] leading-snug text-ink-dim">
          <em className="text-gold not-italic font-medium">Fig. I.</em>{" "}
          &mdash; Schematic of extracorporeal circuit. Venous blood enters at{" "}
          <span className="text-gold">1.5 L/hr</span>; ozonated, oxygenated blood returns via opposite vein.
        </p>
      </div>

      {/* Bottom labels */}
      <div className="absolute bottom-5 inset-x-5 md:bottom-8 md:inset-x-8 flex justify-between font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-ink-faint">
        <span>HSW · LONDON</span>
        <span className="text-gold">READING · NORMAL</span>
      </div>
    </div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const map = {
    tl: "top-3 left-3 md:top-4 md:left-4 border-l border-t",
    tr: "top-3 right-3 md:top-4 md:right-4 border-r border-t",
    bl: "bottom-3 left-3 md:bottom-4 md:left-4 border-l border-b",
    br: "bottom-3 right-3 md:bottom-4 md:right-4 border-r border-b",
  };
  return <span className={`absolute w-5 h-5 md:w-6 md:h-6 border-gold z-[2] ${map[pos]}`} />;
}
