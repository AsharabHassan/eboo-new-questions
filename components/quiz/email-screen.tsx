"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useQuiz } from "@/lib/quiz-store";
import { computeScore, computeTrack, computeSafetyFlags, scoreBand } from "@/lib/quiz-data";
import { trackPixelEvent } from "@/components/meta-pixel";

const EASE = [0.2, 0.9, 0.1, 1] as [number, number, number, number];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns true if at least 10 digits — covers UK landline & mobile, with or without +44. */
function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function EmailScreen() {
  const {
    answers,
    email,
    name,
    phone,
    setEmail,
    setName,
    setPhone,
    setSubmissionId,
    next,
  } = useQuiz();
  const [localEmail, setLocalEmail] = useState(email);
  const [localName, setLocalName] = useState(name);
  const [localPhone, setLocalPhone] = useState(phone);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  /** Single-fire guard — survives React Strict Mode and rapid double-clicks. */
  const firedRef = useRef(false);

  const score = computeScore(answers);
  const band = scoreBand(score);
  const emailValid = EMAIL_RE.test(localEmail);
  const phoneValid = isValidPhone(localPhone);
  const canContinue = emailValid && phoneValid && localName.trim().length > 1;

  const handleContinue = () => {
    setTouched(true);
    if (!canContinue || firedRef.current) return;
    firedRef.current = true;
    setSubmitting(true);

    const trimmedName = localName.trim();
    const trimmedEmail = localEmail.trim();
    const trimmedPhone = localPhone.trim();

    setEmail(trimmedEmail);
    setName(trimmedName);
    setPhone(trimmedPhone);

    const id = `q_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const track = computeTrack(answers);
    const safety = computeSafetyFlags(answers);

    // Persist the full submission so the result page can read it.
    try {
      window.sessionStorage.setItem(
        `hsw:${id}`,
        JSON.stringify({
          id,
          score,
          track,
          safety,
          answers,
          email: trimmedEmail,
          name: trimmedName,
          phone: trimmedPhone,
          createdAt: new Date().toISOString(),
        }),
      );
      window.localStorage.setItem("hsw:last", id);
    } catch {
      /* storage may be disabled; result page falls back gracefully */
    }

    // Fire Meta Pixel `Lead` event in the browser. The same `id` is sent
    // to the server so the matching CAPI event dedupes against this one.
    trackPixelEvent(
      "Lead",
      {
        currency: "GBP",
        value: 0,
        content_name: "EBOO Assessment",
        content_category: track,
        toxic_load_score: score,
        protocol_track: track,
      },
      id,
    );

    // Single POST to /api/lead — fired once per click.
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        answers,
        score,
        track,
        safety,
        metaEventId: id,
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      }),
    }).catch((err) => {
      console.warn("[quiz] /api/lead failed (non-blocking)", err);
    });

    setSubmissionId(id);
    next();
  };

  return (
    <motion.div
      key="email-screen"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="w-full max-w-[680px] mx-auto"
    >
      {/* Score preview card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative border border-gold/40 bg-ground-raised/40 p-7 md:p-10 mb-10 md:mb-12"
      >
        <div
          aria-hidden
          className="absolute -inset-px pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(228,201,122,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4 md:mb-5">
            <span className="w-10 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium">
              Assessment complete
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-display text-[64px] md:text-[88px] leading-none font-light text-ink display-tight">
              {score}
            </span>
            <span className="font-mono text-[12px] tracking-[0.2em] text-ink-dim">
              / 100
            </span>
          </div>
          <div className="font-mono text-[11px] tracking-[0.32em] uppercase text-gold font-medium">
            {band.label}
          </div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="font-display display-tight text-[32px] sm:text-[40px] md:text-[52px] leading-[1.02] font-light text-ink mb-4 md:mb-6"
      >
        Where should we send your <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>full report?</em>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
        className="text-[14px] md:text-[15px] leading-[1.65] text-ink-dim font-light mb-9 md:mb-10 max-w-[520px]"
      >
        Your score and protocol are ready. Tell us where to send them and we&apos;ll unlock your full breakdown.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
        className="flex flex-col gap-4 md:gap-5"
      >
        <label className="block">
          <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-dim mb-2">
            First name
          </span>
          <input
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Eleanor"
            autoComplete="given-name"
            className="w-full bg-transparent border-b border-[var(--line)] focus:border-gold pb-3 pt-2 text-[18px] md:text-[20px] font-light text-ink placeholder:text-ink-faint outline-none transition-colors"
          />
        </label>
        <label className="block">
          <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-dim mb-2">
            Email
          </span>
          <input
            type="email"
            inputMode="email"
            value={localEmail}
            onChange={(e) => setLocalEmail(e.target.value)}
            placeholder="eleanor@example.com"
            autoComplete="email"
            className="w-full bg-transparent border-b border-[var(--line)] focus:border-gold pb-3 pt-2 text-[18px] md:text-[20px] font-light text-ink placeholder:text-ink-faint outline-none transition-colors"
          />
          {touched && !emailValid && (
            <span className="block mt-2 font-mono text-[10px] tracking-[0.15em] text-rouge">
              Please enter a valid email
            </span>
          )}
        </label>
        <label className="block">
          <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-dim mb-2">
            Phone
          </span>
          <input
            type="tel"
            inputMode="tel"
            value={localPhone}
            onChange={(e) => setLocalPhone(e.target.value)}
            placeholder="07700 900123"
            autoComplete="tel"
            className="w-full bg-transparent border-b border-[var(--line)] focus:border-gold pb-3 pt-2 text-[18px] md:text-[20px] font-light text-ink placeholder:text-ink-faint outline-none transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleContinue();
            }}
          />
          {touched && !phoneValid && (
            <span className="block mt-2 font-mono text-[10px] tracking-[0.15em] text-rouge">
              Please enter a valid phone number
            </span>
          )}
        </label>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.34, ease: EASE }}
        className="mt-9 md:mt-11 flex flex-col sm:flex-row sm:items-center gap-5"
      >
        <button
          onClick={handleContinue}
          disabled={!canContinue || submitting}
          className="plausible-event-name=quiz_email_capture group relative inline-flex items-center justify-between gap-4 bg-gold text-ground px-7 py-4 md:py-5 font-mono text-[11px] md:text-[12px] tracking-[0.28em] font-medium overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(201,163,71,0.5)] disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
        >
          <span className="relative z-10">{submitting ? "SENDING…" : "REVEAL MY RESULTS"}</span>
          <ArrowRight size={16} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1" />
          <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.5)_50%,transparent_70%)] -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
        <span className="font-mono text-[10px] tracking-[0.2em] text-ink-faint">
          NO SPAM · 1-CLICK UNSUBSCRIBE
        </span>
      </motion.div>
    </motion.div>
  );
}
