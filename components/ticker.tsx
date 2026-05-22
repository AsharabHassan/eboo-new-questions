const ITEMS = [
  { text: "EXTRACORPOREAL BLOOD OXYGENATION", gold: false },
  { text: "Reset the engine", gold: true },
  { text: "HARLEY ST WELLNESS", gold: false },
  { text: "Filter the residue", gold: true },
  { text: "GMC · CQC · REGULATED", gold: false },
  { text: "Oxygenate the return", gold: true },
] as const;

export function Ticker() {
  const set = [...ITEMS, ...ITEMS];
  return (
    <div className="border-y border-[var(--line)] bg-[var(--bg-raised)] py-5 md:py-6 overflow-hidden">
      <div className="flex gap-12 md:gap-16 whitespace-nowrap animate-marquee">
        {set.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4">
            <span
              className={
                item.gold
                  ? "font-display italic-display text-[18px] md:text-[22px] text-gold"
                  : "font-display text-[18px] md:text-[22px] text-ink-dim"
              }
            >
              {item.text}
            </span>
            <span className="w-1 h-1 bg-gold rounded-full" />
          </span>
        ))}
      </div>
    </div>
  );
}
