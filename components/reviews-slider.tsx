import { REVIEWS, REVIEW_STATS, type Review } from "@/lib/reviews";

export function ReviewsSlider() {
  const set = [...REVIEWS, ...REVIEWS];

  return (
    <section
      aria-labelledby="reviews-heading"
      className="relative border-t border-[var(--line)] bg-ground-deeper py-24 md:py-32 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at center top, rgba(201,163,71,0.06) 0%, transparent 65%)",
        }}
      />

      {/* Eyebrow + heading */}
      <div className="relative max-w-[1280px] mx-auto px-5 md:px-10 text-center mb-14 md:mb-16">
        <div className="inline-flex items-center gap-3.5 mb-7">
          <span className="w-8 h-px bg-gold-deep" />
          <span className="font-body text-[10px] tracking-[0.32em] uppercase text-gold font-medium">
            What clients say
          </span>
          <span className="w-8 h-px bg-gold-deep" />
        </div>

        <h2
          id="reviews-heading"
          className="font-display text-[36px] md:text-[52px] lg:text-[64px] leading-[1.02] font-light text-ink mb-6 display-tight"
        >
          Reviewed on <em className="italic-display text-gold">Google</em>
        </h2>

        {/* Rating summary */}
        <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-ink-dim">
          <Stars value={REVIEW_STATS.rating} />
          <span className="text-gold font-medium">{REVIEW_STATS.rating.toFixed(1)}</span>
          <span className="text-ink-faint">·</span>
          <span>Based on {REVIEW_STATS.count}+ Google reviews</span>
        </div>
      </div>

      {/* Marquee — pause on hover via group */}
      <div className="group relative">
        {/* Fade edges */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-12 md:w-24 z-10 bg-gradient-to-r from-ground-deeper to-transparent pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-12 md:w-24 z-10 bg-gradient-to-l from-ground-deeper to-transparent pointer-events-none"
        />

        <div className="flex gap-5 md:gap-7 animate-marquee-slow w-max">
          {set.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="shrink-0 w-[300px] md:w-[360px] bg-[var(--bg-raised)] border border-[var(--line)] p-6 md:p-7 flex flex-col gap-4 hover:border-gold/40 transition-colors">
      {/* Header row: avatar + name + Google badge */}
      <header className="flex items-start gap-3">
        <div
          aria-hidden
          className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-deep flex items-center justify-center font-display text-[16px] text-ground font-medium shrink-0"
        >
          {review.initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-body text-[14px] text-ink font-medium leading-tight">
            {review.name}
          </div>
          <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-faint mt-0.5">
            {review.clinic} · {review.date}
          </div>
        </div>
        <GoogleMark />
      </header>

      {/* Stars */}
      <Stars value={review.rating} />

      {/* Review text */}
      <p className="font-body text-[13.5px] leading-[1.65] text-ink-dim font-light">
        &ldquo;{review.text}&rdquo;
      </p>
    </article>
  );
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const filled = hasHalf ? full + 1 : full;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < filled} />
      ))}
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill={filled ? "#E4C97A" : "none"}
      stroke={filled ? "#E4C97A" : "#4A4636"}
      strokeWidth="1.4"
      aria-hidden
    >
      <path d="M10 1.5l2.6 5.5 5.9.6-4.4 4.2 1.2 5.9L10 14.9l-5.3 2.8 1.2-5.9L1.5 7.6l5.9-.6L10 1.5z" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-label="Google"
      className="shrink-0"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.95l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
