"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { useQuiz } from "@/lib/quiz-store";
import type { Question } from "@/lib/quiz-data";

const EASE = [0.2, 0.9, 0.1, 1] as [number, number, number, number];

export function QuestionScreen({ question }: { question: Question }) {
  const { answers, setAnswer, next } = useQuiz();
  const existing = answers[question.id];
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(existing) ? existing : existing ? [existing] : []
  );

  // Reset when question changes
  useEffect(() => {
    const e = answers[question.id];
    setSelected(Array.isArray(e) ? e : e ? [e] : []);
  }, [question.id, answers]);

  const isMulti = question.type === "multi";
  const canContinue = selected.length > 0;

  const handleSelect = (value: string) => {
    if (isMulti) {
      let nextSel: string[];
      if (value === "none") {
        nextSel = selected.includes("none") ? [] : ["none"];
      } else {
        const without = selected.filter((v) => v !== "none");
        nextSel = without.includes(value)
          ? without.filter((v) => v !== value)
          : [...without, value];
      }
      setSelected(nextSel);
      setAnswer(question.id, nextSel);
    } else {
      setSelected([value]);
      setAnswer(question.id, value);
      // Auto-advance on single-select after a brief beat for the visual to register
      setTimeout(() => next(), 380);
    }
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="w-full max-w-[760px] mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
        className="inline-flex items-center gap-3 mb-6 md:mb-8"
      >
        <span className="w-10 md:w-12 h-px bg-gold" />
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium">
          {question.eyebrow}
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="font-display display-tight text-[32px] sm:text-[40px] md:text-[52px] lg:text-[60px] leading-[1.02] font-light text-ink mb-4 md:mb-6"
      >
        {question.prompt}
      </motion.h1>

      {question.subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
          className="text-[14px] md:text-[15px] leading-[1.65] text-ink-dim font-light mb-9 md:mb-12 max-w-[540px]"
        >
          {question.subtitle}
        </motion.p>
      )}

      <ul className="flex flex-col gap-3">
        {question.options?.map((opt, i) => {
          const isSelected = selected.includes(opt.value);
          return (
            <motion.li
              key={opt.value}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.04, ease: EASE }}
            >
              <button
                onClick={() => handleSelect(opt.value)}
                className={`group w-full text-left px-5 md:px-7 py-4 md:py-5 border transition-all duration-300 flex items-center gap-4 min-h-[60px] ${
                  isSelected
                    ? "border-gold bg-gold/[0.08] text-ink"
                    : "border-[var(--line)] bg-ground-raised/30 text-ink-dim hover:border-gold/40 hover:bg-ground-raised/60 hover:text-ink"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-5 h-5 ${
                    isMulti ? "rounded-[3px]" : "rounded-full"
                  } border flex items-center justify-center transition-all duration-300 ${
                    isSelected ? "border-gold bg-gold" : "border-ink-faint"
                  }`}
                >
                  {isSelected && (isMulti ? (
                    <Check size={12} strokeWidth={3} className="text-ground" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-ground" />
                  ))}
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] md:text-[16px] font-normal leading-snug">
                    {opt.label}
                  </span>
                  {opt.hint && (
                    <span className="block text-[12px] md:text-[13px] text-ink-faint mt-1 leading-snug">
                      {opt.hint}
                    </span>
                  )}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      {isMulti && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
          className="mt-8 flex items-center gap-5"
        >
          <button
            onClick={() => next()}
            disabled={!canContinue}
            className="group relative inline-flex items-center gap-3 bg-gold text-ground px-7 py-4 font-mono text-[11px] md:text-[12px] tracking-[0.25em] font-medium overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(201,163,71,0.5)] disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <span className="relative z-10">CONTINUE</span>
            <ArrowRight size={16} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1" />
            <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.5)_50%,transparent_70%)] -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
          <span className="font-mono text-[10px] tracking-[0.2em] text-ink-faint">
            {selected.length === 0
              ? "SELECT ANY THAT APPLY"
              : `${selected.length} SELECTED`}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
