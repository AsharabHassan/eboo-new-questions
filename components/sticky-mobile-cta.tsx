"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";

export function StickyMobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.9, 0.1, 1] }}
          className="md:hidden fixed bottom-0 inset-x-0 z-30 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3"
        >
          <div className="bg-ground/95 backdrop-blur-xl border border-[var(--line)] rounded-sm p-3 shadow-[0_-12px_40px_rgba(0,0,0,0.45)]">
            <a
              href="/quiz"
              className="plausible-event-name=quiz_start plausible-event-source=sticky-mobile flex items-center justify-between gap-3 bg-gold text-ground px-5 py-4 font-mono text-[11px] tracking-[0.22em] font-medium"
            >
              <span>BEGIN ASSESSMENT · 3 MIN</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
