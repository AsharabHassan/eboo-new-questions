"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Answers, AnswerValue } from "./quiz-data";
import { QUESTIONS, TOTAL_QUESTIONS } from "./quiz-data";

type QuizState = {
  step: number; // 0..TOTAL_QUESTIONS (TOTAL = "computing/done")
  answers: Answers;
  email: string;
  name: string;
  phone: string;
  /** Set by EmailScreen once the lead has been POSTed to /api/lead. */
  submissionId: string;
};

type QuizContextValue = QuizState & {
  current: typeof QUESTIONS[number] | null;
  totalQuestions: number;
  progress: number; // 0..1
  setAnswer: (id: string, value: AnswerValue) => void;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setSubmissionId: (id: string) => void;
  next: () => void;
  back: () => void;
  jumpTo: (step: number) => void;
};

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submissionId, setSubmissionId] = useState("");

  const setAnswer = useCallback((id: string, value: AnswerValue) => {
    setAnswers((a) => ({ ...a, [id]: value }));
  }, []);

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_QUESTIONS));
  }, []);

  const back = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const jumpTo = useCallback((s: number) => {
    setStep(Math.max(0, Math.min(s, TOTAL_QUESTIONS)));
  }, []);

  const current = step < TOTAL_QUESTIONS ? QUESTIONS[step] : null;
  const progress = step / TOTAL_QUESTIONS;

  const value = useMemo<QuizContextValue>(
    () => ({
      step,
      answers,
      email,
      name,
      phone,
      submissionId,
      current,
      totalQuestions: TOTAL_QUESTIONS,
      progress,
      setAnswer,
      setEmail,
      setName,
      setPhone,
      setSubmissionId,
      next,
      back,
      jumpTo,
    }),
    [step, answers, email, name, phone, submissionId, current, progress, setAnswer, next, back, jumpTo]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside QuizProvider");
  return ctx;
}
