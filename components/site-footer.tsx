import Link from "next/link";

const NAV = [
  { label: "What is EBOO", href: "/about-eboo" },
  { label: "The Science", href: "/science" },
  { label: "Begin Assessment", href: "/quiz" },
  { label: "Book a call", href: "/book" },
];

const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-[var(--line)] bg-ground-deeper">
      {/* Top band — large brand mark + columns */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 md:gap-16">
          {/* Brand */}
          <div>
            <div className="font-display font-bold text-[34px] tracking-[0.34em] leading-none text-gold mb-2">
              HSW
            </div>
            <div className="font-mono text-[9px] tracking-[0.32em] text-ink-dim mb-6">
              HARLEY STREET WELLNESS
            </div>
            <p className="text-[13px] leading-[1.7] text-ink-dim font-light max-w-[320px]">
              EBOO and integrative wellness, delivered from one of London's most established
              medical addresses.
            </p>
            <div className="mt-7 space-y-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-1">
                  London
                </p>
                <p className="text-[12px] leading-[1.6] text-ink-faint font-light not-italic">
                  London Medical Rooms<br />
                  Ground Floor, 1–5 Portpool Lane<br />
                  Chancery Lane, London EC1N 7UU
                </p>
                <a
                  href="tel:+442046283137"
                  className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-dim hover:text-gold transition-colors mt-1 inline-block"
                >
                  020 4628 3137
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-1">
                  Glasgow
                </p>
                <p className="text-[12px] leading-[1.6] text-ink-faint font-light not-italic">
                  5th Floor, Ingram House<br />
                  227 Ingram Street<br />
                  Glasgow G1 1DA
                </p>
                <a
                  href="tel:+441414888985"
                  className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-dim hover:text-gold transition-colors mt-1 inline-block"
                >
                  0141 488 8985
                </a>
              </div>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-faint pt-1">
                Mon–Fri · 09:00–18:00 GMT
              </p>
            </div>
          </div>

          {/* Site nav */}
          <FooterColumn title="Explore">
            {NAV.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Contact */}
          <FooterColumn title="Contact">
            <FooterLink href="tel:+442046283137">London · 020 4628 3137</FooterLink>
            <FooterLink href="tel:+441414888985">Glasgow · 0141 488 8985</FooterLink>
            <FooterLink href="mailto:hello@harleystreetmedicalwellness.co.uk">hello@harleystreetmedicalwellness.co.uk</FooterLink>
          </FooterColumn>

          {/* Legal */}
          <FooterColumn title="Legal">
            {LEGAL.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>
      </div>

      {/* Hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Bottom plate */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-faint">
          © {year} Harley Street Wellness Ltd
        </p>
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-faint flex flex-wrap items-center gap-2">
          <span>GMC-registered doctors</span>
          <span className="text-gold">●</span>
          <span>CQC-regulated clinic</span>
        </p>
      </div>
      <p className="max-w-[1280px] mx-auto px-5 md:px-10 pb-8 text-[11px] leading-[1.7] text-ink-faint italic font-light">
        EBOO is offered at HSW as a wellness procedure that supports the body's restorative
        capacity. It is not a diagnosis or a cure for any condition. Any decision to undergo
        treatment is made together with a qualified physician at consultation. Nothing on
        this site constitutes medical advice.
      </p>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-5">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("mailto:") || href.startsWith("http");
  return (
    <li>
      {external ? (
        <a
          href={href}
          className="text-[13px] text-ink-dim hover:text-gold transition-colors font-light"
        >
          {children}
        </a>
      ) : (
        <Link
          href={href}
          className="text-[13px] text-ink-dim hover:text-gold transition-colors font-light"
        >
          {children}
        </Link>
      )}
    </li>
  );
}
