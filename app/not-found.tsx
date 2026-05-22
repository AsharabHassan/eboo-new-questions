import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="relative min-h-[100svh] bg-ground vignette grain overflow-hidden flex flex-col">
      {/* Top bar */}
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
            href="/quiz"
            className="font-mono text-[10px] tracking-[0.22em] uppercase border border-gold text-gold px-4 py-2.5 hover:bg-gold hover:text-ground transition-all duration-300"
          >
            Begin Assessment
          </Link>
        </div>
      </header>

      {/* Centred content */}
      <section className="relative flex-1 flex items-center justify-center px-6 py-[140px] md:py-[180px]">
        <div className="max-w-[680px] text-center">
          <div className="font-display display-tight text-[120px] sm:text-[160px] md:text-[200px] leading-[0.85] font-light text-ink-faint mb-4">
            404
          </div>
          <div className="inline-flex items-center gap-3 mb-7">
            <span className="w-10 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold font-medium">
              Off the map
            </span>
            <span className="w-10 h-px bg-gold" />
          </div>
          <h1 className="font-display display-tight text-[32px] sm:text-[44px] md:text-[60px] leading-[0.98] font-light text-ink mb-7 max-w-[20ch] mx-auto">
            We can't find that{" "}
            <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
              page.
            </em>
          </h1>
          <p className="max-w-[460px] mx-auto text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light mb-11">
            The link may be old, mistyped, or moved. Try the assessment or return to the
            homepage — most things on the site live one click from either.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link
              href="/quiz"
              className="group relative inline-flex items-center gap-4 bg-gold text-ground px-7 py-5 font-mono text-[11px] md:text-[12px] tracking-[0.28em] font-medium overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-15px_rgba(201,163,71,0.55)] plausible-event-name=quiz_start plausible-event-source=404"
            >
              <span className="relative z-10">BEGIN THE ASSESSMENT</span>
              <ArrowRight
                size={16}
                className="relative z-10 transition-transform duration-500 group-hover:translate-x-1.5"
              />
              <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link
              href="/"
              className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-ink-dim hover:text-gold transition-colors border-b border-[var(--line)] hover:border-gold pb-1"
            >
              Return home
            </Link>
          </div>

          {/* Quick links to anchor the user */}
          <div className="mt-16 pt-8 border-t border-[var(--line)] flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-faint">
            <Link href="/about-eboo" className="hover:text-gold transition-colors">
              What is EBOO
            </Link>
            <span className="text-gold">●</span>
            <Link href="/science" className="hover:text-gold transition-colors">
              The Science
            </Link>
            <span className="text-gold">●</span>
            <Link href="/book" className="hover:text-gold transition-colors">
              Book a call
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
