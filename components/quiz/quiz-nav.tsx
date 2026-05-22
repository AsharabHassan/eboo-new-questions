"use client";

import Link from "next/link";
import { useQuiz } from "@/lib/quiz-store";
import { ChevronLeft, X } from "lucide-react";
import { motion } from "motion/react";

export function QuizNav() {
  const { step, totalQuestions, progress, back } = useQuiz();

  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl bg-ground/85 border-b border-[var(--line)]">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10 h-[64px] md:h-[76px] flex items-center justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          aria-label="Back"
          className="flex items-center gap-2 text-[10px] tracking-[0.22em] font-mono uppercase text-ink-dim hover:text-gold disabled:opacity-30 transition-colors min-h-11"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
          <span className="hidden md:inline">Back</span>
        </button>

        <Link
          href="/"
          aria-label="Harley Street Wellness"
          className="text-center group"
        >
          <div className="font-display font-bold text-[20px] md:text-[22px] tracking-[0.32em] leading-none text-gold">
            HSW
          </div>
          <div className="font-mono text-[7.5px] tracking-[0.32em] text-ink-dim mt-1 hidden md:block">
            HARLEY STREET WELLNESS
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:block font-mono text-[10px] tracking-[0.2em] text-ink-dim">
            <span className="text-gold">
              {String(Math.min(step + 1, totalQuestions)).padStart(2, "0")}
            </span>
            <span className="text-ink-faint"> / {String(totalQuestions).padStart(2, "0")}</span>
          </div>
          <Link
            href="/"
            aria-label="Exit assessment"
            className="w-11 h-11 -mr-2 flex items-center justify-center text-ink-dim hover:text-gold transition-colors"
          >
            <X size={20} strokeWidth={1.25} />
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-px bg-[var(--line)]">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/60 via-gold to-gold-soft"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.6, ease: [0.2, 0.9, 0.1, 1] }}
        />
      </div>
    </header>
  );
}
