"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useQuiz } from "@/lib/quiz-store";
import { computeScore, computeTrack, computeSafetyFlags, scoreBand } from "@/lib/quiz-data";
import { captureAttribution } from "@/lib/attribution";
import { normalisePhoneE164 } from "@/lib/phone";
import { META_LEAD_RECEIPT_KEY } from "@/lib/meta-lead-receipt";

const EASE = [0.2, 0.9, 0.1, 1] as [number, number, number, number];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [submitError, setSubmitError] = useState("");
  const [metaLeadConsent, setMetaLeadConsent] = useState(false);
  const measurementAvailable = process.env.NEXT_PUBLIC_META_LEAD_ENABLED === "true";
  /** Single-fire guard — survives React Strict Mode and rapid double-clicks. */
  const firedRef = useRef(false);
  const attemptRef = useRef<{ id: string; signature: string } | null>(null);

  const score = computeScore(answers);
  const band = scoreBand(score);
  const emailValid = EMAIL_RE.test(localEmail.trim());
  const phoneValid = Boolean(normalisePhoneE164(localPhone));
  const canContinue = emailValid && phoneValid && localName.trim().length > 1;

  const handleContinue = async () => {
    setTouched(true);
    if (!canContinue || firedRef.current) return;
    firedRef.current = true;
    setSubmitting(true);
    setSubmitError("");

    const trimmedName = localName.trim();
    const trimmedEmail = localEmail.trim();
    const trimmedPhone = localPhone.trim();

    setEmail(trimmedEmail);
    setName(trimmedName);
    setPhone(trimmedPhone);

    const signature = JSON.stringify([trimmedName, trimmedEmail, trimmedPhone, answers]);
    if (attemptRef.current?.signature !== signature) {
      attemptRef.current = { id: `q_${crypto.randomUUID()}`, signature };
    }
    const id = attemptRef.current.id;
    const track = computeTrack(answers);
    const safety = computeSafetyFlags(answers);
    let failureMessage = "We could not confirm your enquiry was saved. Please check your connection and try again.";

    try {
      // Preserve one submission ID across a retry; never fire a conversion before CRM receipt.
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify({
          id, name: trimmedName, email: trimmedEmail, phone: trimmedPhone, answers,
          attribution: captureAttribution(),
          metaLeadConsent: measurementAvailable && metaLeadConsent,
        }),
      });
      const receipt = await response.json().catch(() => null);
      if (!response.ok || receipt?.ok !== true || receipt?.ghl?.sent !== true || receipt?.id !== id) {
        if (typeof receipt?.error === "string") failureMessage = receipt.error;
        throw new Error("Intake not confirmed");
      }
      // Make results available only after the server confirms the clinic handoff.
      try {
        sessionStorage.removeItem(META_LEAD_RECEIPT_KEY);
        if (metaLeadConsent && receipt.meta?.eventId === id && /^\d+$/.test(receipt.meta?.pixelId || "")) {
          sessionStorage.setItem(META_LEAD_RECEIPT_KEY, JSON.stringify({
            eventId: id, pixelId: receipt.meta.pixelId, createdAt: Date.now(),
          }));
        }
      } catch { /* CRM success and results do not depend on optional measurement storage. */ }
      try {
        window.sessionStorage.setItem(
          `hsw:${id}`,
          JSON.stringify({
            id, score, track, safety, answers,
            email: trimmedEmail, name: trimmedName, phone: trimmedPhone,
            createdAt: new Date().toISOString(),
          }),
        );
        window.localStorage.setItem("hsw:last", id);
      } catch { /* the result page has a storage-disabled fallback */ }
      setSubmissionId(id);
      next();
    } catch {
      firedRef.current = false;
      setSubmitting(false);
      setSubmitError(failureMessage);
    }
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

      {submitError && <p role="alert" className="mt-6 text-sm text-rouge">{submitError}</p>}

      {measurementAvailable && (
        <label className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-ink-dim">
          <input type="checkbox" checked={metaLeadConsent}
            onChange={(event) => setMetaLeadConsent(event.target.checked)} className="mt-1" />
          <span>Optional: allow Meta to measure this enquiry using a Lead event,
            hashed email and phone, advertising identifiers and IP/browser details.
            Assessment answers, scores and results are excluded. Your report is available
            with either choice. <a href="/cookies" className="underline">Measurement details</a>.</span>
        </label>
      )}

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
