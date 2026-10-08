"use client";

import { useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";

const VIDEO_SRC = "/videos/eboo-session-walkthrough.mp4";
const POSTER_SRC = "/videos/eboo-session-walkthrough-poster.jpg";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Full EBOO session filmed with our medical director as the patient.
 * The 3-minute MP4 is only requested after the visitor presses play.
 * If the Meta Pixel is loaded (cookie consent given), a "WatchedSessionVideo"
 * custom event fires once at 50% so video viewers can be retargeted.
 */
export function SessionWalkthrough({ id = "session" }: { id?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const halfwaySent = useRef(false);

  const start = () => {
    setStarted(true);
    // The video element mounts with autoPlay; this covers browsers that ignore it
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || halfwaySent.current || !v.duration) return;
    if (v.currentTime / v.duration >= 0.5) {
      halfwaySent.current = true;
      window.fbq?.("trackCustom", "WatchedSessionVideo", { video: "eboo_session_walkthrough" });
    }
  };

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="relative border-t border-gold/20 py-20 md:py-28 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 50% at 30% 50%, rgba(201,163,71,0.10) 0%, transparent 65%)" }}
      />

      <div className="relative max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          <div className="w-full max-w-[340px] shrink-0">
            <div className="relative aspect-[9/16] bg-black rounded-[24px] overflow-hidden border border-gold/30 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
              {started ? (
                <video
                  ref={videoRef}
                  src={VIDEO_SRC}
                  poster={POSTER_SRC}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  onTimeUpdate={onTimeUpdate}
                  aria-label="Full EBOO session walkthrough with our medical director"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <button
                  type="button"
                  onClick={start}
                  aria-label="Play the full EBOO session walkthrough, 3 minutes"
                  className="group absolute inset-0 w-full h-full cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={POSTER_SRC}
                    alt="Dr Ahmad, medical director, in the treatment chair during his own EBOO session"
                    width={720}
                    height={1280}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                  <span className="absolute left-1/2 top-[68%] -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] rounded-full bg-gold flex items-center justify-center shadow-[0_0_0_12px_rgba(201,163,71,0.18)] group-hover:scale-105 transition-transform">
                    <Play size={28} className="text-black ml-1" fill="currentColor" />
                  </span>
                  <span className="absolute left-4 right-4 bottom-5 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-gold">
                    Watch the full session <span className="text-ink">03:00</span>
                  </span>
                </button>
              )}

              {!started && (
                <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full font-mono text-[9px] tracking-[0.18em] uppercase text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Filmed in our clinic
                </span>
              )}
            </div>
          </div>

          <div className="max-w-[540px] text-center md:text-left">
            <div className="inline-flex items-center gap-3.5 mb-6">
              <span className="w-8 h-px bg-gold" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold">
                Full session walkthrough
              </span>
            </div>

            <h2
              id={`${id}-heading`}
              className="font-display text-[34px] md:text-[50px] leading-[1.05] font-light text-ink mb-6"
            >
              Our medical director, <em className="italic text-gold">in the chair.</em>
            </h2>

            <p className="text-[15px] md:text-[16px] leading-[1.75] text-ink-dim font-light mb-4">
              Before we ask you to trust EBOO, Dr Ahmad, our medical director, had the treatment himself, on camera.
              Watch a complete session from start to finish: the lines going in, the blood passing through
              the external circuit, and the return to the body.
            </p>
            <p className="text-[15px] md:text-[16px] leading-[1.75] text-ink-dim font-light mb-9">
              Nothing staged. Three minutes, with sound on.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <a
                href="/quiz"
                className="inline-flex items-center justify-center gap-6 bg-gold text-black min-h-[52px] px-6 text-[13px] font-medium hover:bg-gold-soft transition-colors"
              >
                Start your pre-assessment <ArrowRight size={17} aria-hidden />
              </a>
              <a
                href="#book-call"
                className="inline-flex items-center justify-center gap-3 border border-gold/40 text-gold min-h-[52px] px-6 text-[13px] hover:bg-gold/10 transition-colors"
              >
                Free online consultation <ArrowRight size={16} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
