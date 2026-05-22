"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuiz } from "@/lib/quiz-store";
import { QuizNav } from "./quiz-nav";
import { QuestionScreen } from "./question-screen";
import { EmailScreen } from "./email-screen";

const EASE = [0.2, 0.9, 0.1, 1] as [number, number, number, number];

export function QuizFlow() {
  const { current, step, totalQuestions, submissionId } = useQuiz();
  const router = useRouter();
  const [finishing, setFinishing] = useState(false);

  // When the email screen has fired the submission and advanced the step,
  // show the finishing animation and then navigate to the result page.
  // All POSTing happens inside EmailScreen.handleContinue — never here.
  useEffect(() => {
    if (step < totalQuestions || !submissionId) return;
    setFinishing(true);
    const t = setTimeout(() => router.push(`/result/${submissionId}`), 2200);
    return () => clearTimeout(t);
  }, [step, totalQuestions, submissionId, router]);

  return (
    <main className="relative min-h-[100svh] bg-ground vignette grain overflow-hidden">
      <QuizNav />

      <section className="relative pt-[110px] md:pt-[140px] pb-24 px-5 md:px-10">
        <AnimatePresence mode="wait">
          {finishing ? (
            <FinishingScreen key="finishing" />
          ) : current?.type === "email" ? (
            <EmailScreen key="email" />
          ) : current ? (
            <QuestionScreen key={current.id} question={current} />
          ) : null}
        </AnimatePresence>
      </section>
    </main>
  );
}

function FinishingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="w-full max-w-[560px] mx-auto text-center pt-12"
    >
      <div className="inline-flex items-center gap-3 mb-7">
        <span className="w-10 h-px bg-gold" />
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium">
          Calculating
        </span>
        <span className="w-10 h-px bg-gold" />
      </div>

      <h2 className="font-display display-tight text-[36px] md:text-[48px] leading-[1] font-light text-ink mb-6">
        Mapping your <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>load &amp; protocol</em>
      </h2>

      <p className="text-[14px] md:text-[15px] leading-[1.65] text-ink-dim font-light mb-12 max-w-[420px] mx-auto">
        Scoring four dimensions, matching to one of three protocol tracks, checking safety parameters.
      </p>

      {/* Indeterminate progress: shimmering gold bar */}
      <div className="relative h-px bg-[var(--line)] max-w-[280px] mx-auto overflow-hidden">
        <motion.span
          className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gold to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
