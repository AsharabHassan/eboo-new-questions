import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export function LegalShell({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
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
            href="/quiz"
            className="font-mono text-[10px] tracking-[0.22em] uppercase border border-gold text-gold px-4 py-2.5 hover:bg-gold hover:text-ground transition-all duration-300"
          >
            Begin Assessment
          </Link>
        </div>
      </header>

      <section className="relative pt-[140px] md:pt-[180px] pb-16 md:pb-20 px-5 md:px-10 max-w-[820px] mx-auto">
        <div className="inline-flex items-center gap-3 mb-7">
          <span className="w-10 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold font-medium">
            {eyebrow}
          </span>
        </div>
        <h1 className="font-display display-tight text-[40px] sm:text-[52px] md:text-[72px] leading-[0.96] font-light text-ink mb-6 max-w-[20ch]">
          {title}
        </h1>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint">
          Last updated · {updated}
        </p>
      </section>

      <article className="relative border-t border-[var(--line)] px-5 md:px-10 py-16 md:py-20 max-w-[820px] mx-auto prose-legal">
        {children}
      </article>

      {/* prose styles */}
      <style>{`
        .prose-legal h2 {
          font-family: var(--font-fraunces), Georgia, serif;
          font-weight: 300;
          font-size: clamp(24px, 4vw, 36px);
          line-height: 1.1;
          color: var(--ink);
          margin-top: 48px;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .prose-legal h2:first-child { margin-top: 0; }
        .prose-legal h3 {
          font-family: var(--font-fraunces), Georgia, serif;
          font-weight: 400;
          font-size: 19px;
          line-height: 1.2;
          color: var(--ink);
          margin-top: 32px;
          margin-bottom: 10px;
        }
        .prose-legal h2 em, .prose-legal h3 em {
          font-style: italic;
          color: var(--gold);
          font-variation-settings: 'opsz' 144, 'SOFT' 80;
        }
        .prose-legal p {
          font-size: 15px;
          line-height: 1.75;
          color: var(--ink-dim);
          margin-bottom: 16px;
          font-weight: 300;
          max-width: 68ch;
        }
        .prose-legal p strong { color: var(--ink); font-weight: 400; }
        .prose-legal ul {
          font-size: 15px;
          line-height: 1.75;
          color: var(--ink-dim);
          margin-bottom: 18px;
          padding-left: 0;
          list-style: none;
        }
        .prose-legal ul li {
          padding-left: 24px;
          position: relative;
          margin-bottom: 8px;
        }
        .prose-legal ul li::before {
          content: '·';
          position: absolute;
          left: 8px;
          color: var(--gold);
          font-weight: 600;
        }
        .prose-legal a {
          color: var(--gold);
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color 0.2s;
        }
        .prose-legal a:hover { color: var(--gold-soft); }
        .prose-legal table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 14px;
        }
        .prose-legal table th, .prose-legal table td {
          text-align: left;
          padding: 12px 16px;
          border-bottom: 1px solid var(--line);
          vertical-align: top;
        }
        .prose-legal table th {
          font-family: var(--font-jetbrains), monospace;
          font-weight: 500;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .prose-legal table td { color: var(--ink-dim); line-height: 1.6; }
      `}</style>

      <SiteFooter />
    </main>
  );
}
