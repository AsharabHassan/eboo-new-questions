"use client";

import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const VIDEO_SRC = "/videos/testimonial-harleystreetmedic.mp4";
const POSTER_SRC = "/videos/testimonial-harleystreetmedic-poster.jpg";

export function VideoTestimonial() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      try {
        await v.play();
        setPlaying(true);
        setStarted(true);
      } catch (err) {
        console.error("Video play failed:", err);
      }
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section
      aria-labelledby="video-testimonial-heading"
      className="relative border-t border-[var(--line)] bg-ground py-24 md:py-32 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at center, rgba(201,163,71,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          {/* Phone-frame video */}
          <div className="w-[300px] md:w-[340px] shrink-0">
            <div className="relative aspect-[9/16] bg-ground-deeper rounded-[28px] overflow-hidden border border-[var(--line)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
              {/* Subtle gold inner glow */}
              <div
                aria-hidden
                className="absolute inset-0 ring-1 ring-inset ring-gold/15 rounded-[28px] pointer-events-none z-10"
              />

              <video
                ref={videoRef}
                src={VIDEO_SRC}
                poster={POSTER_SRC}
                playsInline
                preload="metadata"
                onEnded={() => setPlaying(false)}
                onClick={togglePlay}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              />

              {/* Play overlay (visible until first play) */}
              {!started && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Play testimonial"
                  className="absolute inset-0 flex items-center justify-center bg-ground/30 backdrop-blur-[2px] hover:bg-ground/20 transition-colors z-20 group"
                >
                  <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold flex items-center justify-center shadow-[0_10px_40px_-5px_rgba(201,163,71,0.6)] group-hover:scale-105 transition-transform">
                    <Play size={28} className="text-ground ml-1" fill="currentColor" />
                  </span>
                </button>
              )}

              {/* Bottom controls — shown after first play */}
              {started && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={playing ? "Pause" : "Play"}
                    className="w-10 h-10 rounded-full bg-ground/70 backdrop-blur-md flex items-center justify-center text-ink hover:bg-ground/90 transition-colors"
                  >
                    {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute" : "Mute"}
                    className="w-10 h-10 rounded-full bg-ground/70 backdrop-blur-md flex items-center justify-center text-ink hover:bg-ground/90 transition-colors"
                  >
                    {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>
              )}

              {/* Corner tag */}
              <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 bg-ground/70 backdrop-blur-md px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-rouge animate-pulse" />
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink font-medium">
                  Client filmed
                </span>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="max-w-[560px] text-center md:text-left">
            <div className="inline-flex items-center gap-3.5 mb-7">
              <span className="w-8 h-px bg-gold-deep" />
              <span className="font-body text-[10px] tracking-[0.32em] uppercase text-gold font-medium">
                Client testimonial
              </span>
            </div>

            <h2
              id="video-testimonial-heading"
              className="font-display text-[36px] md:text-[52px] lg:text-[60px] leading-[1.02] font-light text-ink mb-7 display-tight"
            >
              &ldquo;An <em className="italic-display text-gold">incredible</em>{" "}
              treatment.&rdquo;
            </h2>

            <p className="text-[15px] md:text-[16px] leading-[1.75] text-ink-dim font-light mb-9">
              A client filmed her own experience inside the clinic — the procedure, the room,
              and what she noticed in the days that followed. We didn&apos;t script it. We
              didn&apos;t edit it. Press play with sound on.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 font-mono text-[10px] tracking-[0.28em] uppercase text-ink-faint">
              <span>Real client</span>
              <span className="text-gold">●</span>
              <span>Unedited</span>
              <span className="text-gold">●</span>
              <span>51 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
