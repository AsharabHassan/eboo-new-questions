import Link from "next/link";
import { Suspense } from "react";
import { BookingEmbed } from "@/components/book/booking-embed";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Book a free consultation · HSW EBOO",
  description:
    "Book a 15-minute video consultation with a Harley Street doctor. Free, no card required, no pressure to commit.",
};

export default function BookPage() {
  return (
    <main className="relative min-h-[100svh] bg-ground vignette grain overflow-hidden">
      <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl bg-ground/85 border-b border-[var(--line)]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-10 h-[64px] md:h-[76px] flex items-center justify-between">
          <Link href="/" className="text-center" aria-label="Home">
            <div className="font-display font-bold text-[20px] md:text-[22px] tracking-[0.32em] leading-none text-gold">
              HSW
            </div>
            <div className="font-mono text-[7.5px] tracking-[0.32em] text-ink-dim mt-1 hidden md:block">
              HARLEY STREET WELLNESS
            </div>
          </Link>
          <Link
            href="/science"
            className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-dim hover:text-gold transition-colors hidden md:inline-flex"
          >
            The Science
          </Link>
        </div>
      </header>

      <section className="relative pt-[120px] md:pt-[150px] pb-20 px-5 md:px-10 max-w-[920px] mx-auto">
        <div className="text-center mb-12 md:mb-14">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold font-medium">
              Free 15-min online consultation
            </span>
            <span className="w-10 h-px bg-gold" />
          </div>
          <h1 className="font-display display-tight text-[36px] sm:text-[48px] md:text-[64px] leading-[0.98] font-light text-ink mb-7 max-w-[22ch] mx-auto">
            Book your call with a{" "}
            <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
              Harley Street doctor.
            </em>
          </h1>
          <p className="max-w-[560px] mx-auto text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light">
            Pick a slot below. The call is free, takes 15 minutes, and you'll come away
            with clarity on whether EBOO is the right fit —{" "}
            <span className="text-ink">even if the answer is no</span>.
          </p>
        </div>

        {/* Three reassurances */}
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] mb-12 md:mb-16">
          {[
            {
              n: "01",
              title: "Free",
              body: "No card. No deposit. No catch.",
            },
            {
              n: "02",
              title: "Real doctor",
              body: "15 minutes with a GMC-registered physician. Not a sales call.",
            },
            {
              n: "03",
              title: "No pressure",
              body: "Honest assessment. We'll tell you if EBOO isn't right for you.",
            },
          ].map((b) => (
            <li key={b.n} className="bg-ground-raised/40 p-6 md:p-7">
              <div className="font-mono text-[10px] tracking-[0.22em] text-gold mb-3">— {b.n}</div>
              <h3 className="font-display text-[18px] md:text-[20px] font-normal text-ink mb-2">
                {b.title}
              </h3>
              <p className="text-[13px] leading-[1.65] text-ink-dim font-light">{b.body}</p>
            </li>
          ))}
        </ul>

        <Suspense fallback={<EmbedSkeleton />}>
          <BookingEmbed />
        </Suspense>
      </section>

      <SiteFooter />
    </main>
  );
}

function EmbedSkeleton() {
  return (
    <div className="border border-[var(--line)] bg-ground-raised/40 p-10 text-center">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-dim mb-2">
        Loading calendar
      </div>
      <div className="font-display text-[18px] text-ink-dim italic-display" style={{ fontStyle: "italic" }}>
        Fetching available slots...
      </div>
    </div>
  );
}
