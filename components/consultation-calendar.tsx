import { Suspense } from "react";
import { BookingEmbed } from "@/components/book/booking-embed";

/** The free online consultation calendar, embedded inline on the landing pages. */
export function ConsultationCalendar({ id = "book-call" }: { id?: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="relative border-t border-gold/20 py-20 md:py-28 scroll-mt-20"
    >
      <div className="relative max-w-[920px] mx-auto px-5 md:px-10">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold">
              Free online consultation
            </span>
            <span className="w-10 h-px bg-gold" />
          </div>
          <h2
            id={`${id}-heading`}
            className="font-display text-[34px] md:text-[50px] leading-[1.05] font-light text-ink mb-5"
          >
            Pick a time that <em className="italic text-gold">suits you.</em>
          </h2>
          <p className="max-w-[540px] mx-auto text-[14px] md:text-[15px] leading-[1.7] text-ink-dim font-light">
            A free, short online call with our wellness consultant. Ask anything about EBOO and find out whether it is right
            for you. No card, no deposit, no pressure.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="border border-gold/20 p-10 text-center font-mono text-[10px] tracking-[0.3em] uppercase text-ink-dim">
              Loading calendar
            </div>
          }
        >
          <BookingEmbed />
        </Suspense>
      </div>
    </section>
  );
}
