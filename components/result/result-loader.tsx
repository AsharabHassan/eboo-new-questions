"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ResultPage } from "./result-page";
import type { Answers, SafetyFlag, TrackKey } from "@/lib/quiz-data";

type Stored = {
  id: string;
  score: number;
  track: TrackKey;
  safety: SafetyFlag[];
  name: string;
  email: string;
  answers: Answers;
};

export function ResultLoader({ id }: { id: string }) {
  const [data, setData] = useState<Stored | null | "missing">(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(`hsw:${id}`);
      if (!raw) {
        setData("missing");
        return;
      }
      const parsed = JSON.parse(raw) as Stored;
      setData(parsed);
    } catch {
      setData("missing");
    }
  }, [id]);

  if (data === null) {
    return (
      <main className="min-h-[100svh] bg-ground flex items-center justify-center vignette grain">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-dim">
          Loading report
        </div>
      </main>
    );
  }

  if (data === "missing") {
    return (
      <main className="min-h-[100svh] bg-ground flex items-center justify-center vignette grain px-6">
        <div className="max-w-[480px] text-center">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-rouge mb-4">
            Report not found
          </div>
          <h1 className="font-display text-[28px] md:text-[36px] leading-[1.05] font-light text-ink mb-4">
            We can't find that assessment.
          </h1>
          <p className="text-[14px] leading-[1.7] text-ink-dim mb-7">
            Reports are kept in your browser's session. If you cleared your
            history or opened the link on a different device, you'll need to take the assessment again.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-3 bg-gold text-ground px-6 py-4 font-mono text-[11px] tracking-[0.25em] font-medium"
          >
            TAKE THE ASSESSMENT →
          </Link>
        </div>
      </main>
    );
  }

  return <ResultPage data={data} />;
}
