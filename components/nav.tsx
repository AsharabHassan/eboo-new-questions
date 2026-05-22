"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

const LINKS = [
  { label: "What is EBOO", href: "/about-eboo" },
  { label: "The Science", href: "/science" },
  { label: "Book", href: "/book" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-ground/85 backdrop-blur-xl border-b border-[var(--line)]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 flex items-center justify-between h-[64px] md:h-[76px]">
          {/* Left meta — desktop only */}
          <div className="hidden md:flex items-center gap-3 text-[10px] font-mono tracking-[0.25em] text-ink-dim">
            <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_12px_var(--gold)]" />
            EST · LONDON W1
          </div>

          {/* Logo — center on mobile, normal on desktop */}
          <a
            href="#"
            className="md:absolute md:left-1/2 md:-translate-x-1/2 text-center group"
            aria-label="Harley Street Wellness"
          >
            <div className="font-display font-bold text-[22px] md:text-[26px] tracking-[0.32em] leading-none text-gold">
              HSW
            </div>
            <div className="font-mono text-[8px] tracking-[0.32em] text-ink-dim mt-1 hidden md:block">
              HARLEY STREET WELLNESS
            </div>
          </a>

          {/* Right links — desktop */}
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[11px] tracking-[0.18em] uppercase text-ink hover:text-gold transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/quiz"
              className="font-mono text-[10px] tracking-[0.2em] uppercase border border-gold text-gold px-4 py-2.5 hover:bg-gold hover:text-ground transition-all duration-300"
            >
              Begin Assessment
            </a>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="md:hidden w-11 h-11 -mr-2 flex items-center justify-center text-ink"
          >
            <Menu size={22} strokeWidth={1.25} />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-ground md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between h-[64px] px-5 border-b border-[var(--line)]">
              <div className="font-display font-bold text-[22px] tracking-[0.32em] text-gold">
                HSW
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="w-11 h-11 -mr-2 flex items-center justify-center text-ink"
              >
                <X size={22} strokeWidth={1.25} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-between px-6 py-12">
              <ul className="flex flex-col gap-7">
                {LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.2, 0.9, 0.1, 1] }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-[40px] leading-none text-ink hover:text-gold transition-colors"
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.a
                href="/quiz"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="block text-center font-mono text-[11px] tracking-[0.25em] uppercase bg-gold text-ground py-5"
              >
                Begin the Assessment →
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
