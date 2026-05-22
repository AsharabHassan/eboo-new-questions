import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { ebooProcedureJsonLd, faqJsonLd, jsonLd } from "@/lib/structured-data";

const FAQS = [
  { q: "Does it hurt?", a: "Two IV cannulas — a quick pinch each. During the session itself the blood draw is gentle and most clients describe it as 'nothing'." },
  { q: "How long until I notice something?", a: "Most clients report a shift in energy or clarity within a few hours. The fuller anti-inflammatory effect builds over the following week as your antioxidant gene expression peaks." },
  { q: "How many sessions do I need?", a: "That's specifically what the consultation is for. Number of sessions, cadence, and any adjunct interventions are determined by the doctor after reviewing your full picture — not by an algorithm or a generic protocol." },
  { q: "Is it safe?", a: "Yes for the vast majority of healthy adults. We screen explicitly for the three medical contraindications and re-verify them at the consultation before any treatment is scheduled." },
  { q: "Is EBOO regulated in the UK?", a: "EBOO is a complementary medicine procedure performed by GMC-registered doctors in CQC-regulated clinics. It is not currently a NICE-approved NHS treatment." },
  { q: "How much does it cost?", a: "Individual sessions and protocol packages — pricing is discussed during your free consultation so we can give you the right protocol for your situation, not a generic quote." },
  { q: "Where are you?", a: "Two locations. London: London Medical Rooms, Ground Floor, 1–5 Portpool Lane, Chancery Lane, London EC1N 7UU (020 4628 3137). Glasgow: 5th Floor, Ingram House, 227 Ingram Street, Glasgow G1 1DA (0141 488 8985)." },
];

export const metadata = {
  title: "What is EBOO Therapy? · HSW Harley Street, London",
  description:
    "EBOO (Extracorporeal Blood Oxygenation and Ozonation) explained: how the procedure works, what it does in the body, what conditions it supports, safety profile, and what to expect at HSW on Harley Street.",
};

const TOC = [
  { id: "what", label: "What EBOO is" },
  { id: "how", label: "How it works" },
  { id: "what-it-does", label: "What it does in the body" },
  { id: "conditions", label: "Conditions it supports" },
  { id: "what-to-expect", label: "What to expect" },
  { id: "safety", label: "Safety" },
  { id: "faq", label: "FAQ" },
];

export default function AboutEbooPage() {
  return (
    <main className="relative min-h-[100svh] bg-ground vignette grain overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(ebooProcedureJsonLd())}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(faqJsonLd(FAQS))}
      />
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
          <div className="flex items-center gap-6">
            <Link
              href="/science"
              className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-dim hover:text-gold transition-colors hidden md:inline-flex"
            >
              The Science
            </Link>
            <Link
              href="/quiz"
              className="font-mono text-[10px] tracking-[0.22em] uppercase border border-gold text-gold px-4 py-2.5 hover:bg-gold hover:text-ground transition-all duration-300"
            >
              Begin Assessment
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-[140px] md:pt-[180px] pb-16 md:pb-20 px-5 md:px-10 max-w-[1100px] mx-auto">
        <div className="inline-flex items-center gap-3 mb-7">
          <span className="w-10 h-px bg-gold" />
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold font-medium">
            What is EBOO
          </span>
        </div>
        <h1 className="font-display display-tight text-[44px] sm:text-[60px] md:text-[88px] lg:text-[108px] leading-[0.92] font-light text-ink max-w-[14ch]">
          A human{" "}
          <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
            oil change.
          </em>{" "}
          Explained.
        </h1>
        <p className="mt-9 md:mt-11 max-w-[640px] text-[15px] md:text-[17px] leading-[1.7] text-ink-dim font-light">
          EBOO — <em>Extracorporeal Blood Oxygenation and Ozonation</em> — is a one-hour medical procedure that filters your blood through a dialysis-grade membrane and re-oxygenates it with medical-grade ozone before returning it to your circulation. This is the long explanation. The short one is on the homepage.
        </p>
      </section>

      {/* Table of contents */}
      <section className="border-y border-[var(--line)] bg-ground-raised/30">
        <nav className="max-w-[1100px] mx-auto px-5 md:px-10 py-5 md:py-6 flex flex-wrap gap-x-7 gap-y-2.5">
          {TOC.map((t, i) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-ink-dim hover:text-gold transition-colors inline-flex items-baseline gap-1.5"
            >
              <span className="text-gold">{String(i + 1).padStart(2, "0")}</span>
              {t.label}
            </a>
          ))}
        </nav>
      </section>

      {/* ====================== WHAT EBOO IS ====================== */}
      <Section id="what" plate="Pl. I" eyebrow="What it is">
        <Heading>
          A medical-grade <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>blood filtration</em> circuit, run for an hour.
        </Heading>
        <Prose>
          <p>
            EBOO is performed using a closed-loop circuit. A small IV draws blood from a vein in one arm, runs it through a sealed dialysis-grade membrane while simultaneously infusing it with medical ozone, and returns the cleaned, oxygenated blood through a second IV in the other arm. The blood never touches outside air. The filter, tubing, and ozonator are sterile, single-patient, and disposed of after each session.
          </p>
          <p>
            One to two litres of your blood pass through the circuit during a typical session. That's roughly a third of your total volume cycled through filtration and ozonation in one sitting — which is why a single EBOO session is often described as the equivalent of dozens of standard ozone autohaemotherapy treatments.
          </p>
          <p>
            It's not new science. Extracorporeal ozonation has been used clinically since the 1980s, predominantly in European integrative medicine. What's new is the equipment: modern membrane materials, precision-controlled ozone concentrations, and reliable flow rates have made the procedure faster, safer, and more reproducible than the early autohaemotherapy techniques it evolved from.
          </p>
        </Prose>
      </Section>

      {/* ====================== HOW IT WORKS ====================== */}
      <Section id="how" plate="Pl. II" eyebrow="How it works">
        <Heading>
          Four stages, <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>one continuous loop.</em>
        </Heading>
        <ol className="flex flex-col">
          {[
            {
              n: "01",
              titlePre: "Blood is",
              title: "drawn.",
              body:
                "A single IV in your left arm. Flow rate is gentle — about 1.5 litres per hour — so you'll feel almost nothing. Most clients read, work, or simply rest during the session.",
            },
            {
              n: "02",
              titlePre: "It passes through a",
              title: "filter.",
              body:
                "A medical-grade dialysis membrane (typically 0.2 micron) catches the residue your body has been carrying: inflammatory proteins, oxidised lipids, AGEs (advanced glycation end-products), heavy metal complexes, and microplastic particles. The membrane is single-use and sealed.",
            },
            {
              n: "03",
              titlePre: "It is",
              title: "ozonated.",
              body:
                "Medical ozone (O₃) is dissolved into the filtered blood at a precisely calibrated dose — usually 40 micrograms per millilitre, within the established therapeutic window. Ozone is a strong but short-lived oxidiser; it reacts immediately with lipids and proteins, generating signalling molecules that activate the body's own antioxidant defence system.",
            },
            {
              n: "04",
              titlePre: "It returns,",
              title: "oxygenated.",
              body:
                "Through a second IV in your right arm. The blood that re-enters circulation carries more dissolved oxygen, fewer accumulated metabolites, and a freshly activated NRF2 / Keap1 signalling cascade that propagates the anti-inflammatory effect for days afterwards.",
            },
          ].map((s) => (
            <li
              key={s.n}
              className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] gap-x-6 md:gap-x-10 py-8 md:py-10 border-b border-[var(--line)] last:border-b-0"
            >
              <div className="font-mono text-[11px] tracking-[0.2em] text-gold pt-1.5">— {s.n}</div>
              <div>
                <h3 className="font-display text-[24px] md:text-[32px] leading-[1.1] font-normal text-ink mb-3">
                  {s.titlePre}{" "}
                  <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
                    {s.title}
                  </em>
                </h3>
                <p className="text-[14px] md:text-[15px] leading-[1.75] text-ink-dim font-light max-w-[60ch]">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ====================== WHAT IT DOES ====================== */}
      <Section id="what-it-does" plate="Pl. III" eyebrow="What it does in the body">
        <Heading>
          Three measurable <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>biological shifts.</em>
        </Heading>
        <Prose>
          <p>
            EBOO's therapeutic effect isn't one mechanism — it's a sequence. The same hour-long procedure triggers three different responses, each on its own timeline.
          </p>
        </Prose>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] mt-10">
          {[
            {
              n: "01",
              title: "NRF2 activation",
              body:
                "Ozone's controlled oxidative stress signals the cell's master antioxidant transcription factor (NRF2) to activate. NRF2 upregulates dozens of cytoprotective enzymes — glutathione synthesis, heme oxygenase-1, catalase. The effect peaks 24–72 hours after the session.",
            },
            {
              n: "02",
              title: "Reduced inflammatory load",
              body:
                "The dialysis stage physically removes circulating inflammatory mediators and oxidised lipids. Measured CRP (C-reactive protein) typically drops modestly after a session; the larger effect comes from the cumulative course your doctor designs for you.",
            },
            {
              n: "03",
              title: "Improved oxygen delivery",
              body:
                "Re-oxygenated blood briefly raises plasma oxygen saturation and shifts the oxygen-haemoglobin dissociation curve. The mitochondrial effect — improved ATP generation per oxygen molecule — accounts for the energy and clarity many clients report within hours.",
            },
          ].map((b) => (
            <li key={b.n} className="bg-ground-raised/40 p-7 md:p-9">
              <div className="font-mono text-[10px] tracking-[0.25em] text-gold mb-3">— {b.n}</div>
              <h3 className="font-display text-[20px] md:text-[24px] font-normal text-ink mb-3">{b.title}</h3>
              <p className="text-[13px] md:text-[14px] leading-[1.7] text-ink-dim font-light">{b.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-9 text-[13px] md:text-[14px] leading-[1.7] text-ink-dim font-light">
          For the full mechanism breakdown, citations, and the assessment methodology, see{" "}
          <Link href="/science" className="text-gold hover:text-gold-soft underline-offset-4 hover:underline">
            the science page
          </Link>
          .
        </p>
      </Section>

      {/* ====================== CONDITIONS ====================== */}
      <Section id="conditions" plate="Pl. IV" eyebrow="Conditions it supports">
        <Heading>
          What we see, <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>in practice.</em>
        </Heading>
        <Prose>
          <p>
            EBOO doesn't treat conditions in the way a pharmaceutical does. It restores the body's underlying antioxidant capacity and lowers inflammatory burden — which means it shifts the substrate that many chronic conditions sit on top of. The clinical evidence base is uneven (this is well-trodden in some areas, exploratory in others) but the practical pattern of who responds is consistent.
          </p>
        </Prose>
        <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
          {[
            {
              cat: "Strong response",
              items: [
                "Chronic fatigue syndrome / ME-CFS",
                "Fibromyalgia",
                "Post-viral fatigue (Long COVID / PASC)",
                "Recurrent infections and immune dysregulation",
              ],
            },
            {
              cat: "Supportive role",
              items: [
                "Autoimmune flare management (RA, Hashimoto's, MS)",
                "Lyme disease and co-infections",
                "Chronic inflammatory states",
                "Pre- and post-surgical recovery",
              ],
            },
            {
              cat: "Performance & longevity",
              items: [
                "Elite training recovery and oxidative stress reset",
                "Cognitive performance and focus optimisation",
                "Anti-aging protocols (with NAD+, peptides, HBOT)",
                "Pre-conditioning before high-stakes events",
              ],
            },
            {
              cat: "Investigational",
              items: [
                "Cardiovascular plaque burden",
                "Mould and biotoxin illness",
                "Heavy metal load (with chelation)",
                "Skin inflammation and dermatological conditions",
              ],
            },
          ].map((c) => (
            <li key={c.cat} className="bg-ground-raised/40 p-7 md:p-8">
              <div className="font-mono text-[10px] tracking-[0.25em] text-gold mb-4 uppercase">{c.cat}</div>
              <ul className="flex flex-col gap-2">
                {c.items.map((i) => (
                  <li key={i} className="text-[13px] md:text-[14px] leading-[1.6] text-ink font-light flex gap-3">
                    <span className="text-gold">·</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[12px] md:text-[13px] leading-[1.7] text-ink-faint font-light italic">
          Note: HSW makes no claim that EBOO cures or treats any condition. EBOO is offered as a wellness procedure that supports the body's own restorative capacity. Whether it is appropriate for any individual is a clinical decision made by your consulting physician.
        </p>
      </Section>

      {/* ====================== WHAT TO EXPECT ====================== */}
      <Section id="what-to-expect" plate="Pl. V" eyebrow="What to expect">
        <Heading>
          From walk-in to <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>walk-out.</em>
        </Heading>
        <ol className="flex flex-col mt-8">
          {[
            { time: "10 min", title: "Arrival and intake", body: "Brief health questionnaire if it's your first session, blood pressure, and a quick wellbeing check." },
            { time: "5 min", title: "IV access", body: "A nurse places two small IV cannulas — one in each arm. Standard hospital-grade kit." },
            { time: "60 min", title: "The session itself", body: "Blood cycles through the EBOO machine for around an hour. You sit in a private treatment room with a recliner, a screen, Wi-Fi, and refreshments. Most clients read or work." },
            { time: "10 min", title: "Recovery and exit", body: "Cannulas removed, brief observation, and you're free to go. No driving restriction. Most return to their day immediately." },
            { time: "1–7 days", title: "What you'll notice", body: "Energy and clarity often shift within hours. The fuller anti-inflammatory effect builds over the following 3–7 days as NRF2-driven enzyme expression peaks." },
          ].map((s) => (
            <li
              key={s.title}
              className="grid grid-cols-[90px_1fr] md:grid-cols-[120px_1fr] gap-x-5 md:gap-x-8 py-6 md:py-7 border-b border-[var(--line)] last:border-b-0"
            >
              <div className="font-mono text-[11px] tracking-[0.2em] text-gold pt-1.5">{s.time}</div>
              <div>
                <h3 className="font-display text-[18px] md:text-[22px] font-normal text-ink mb-1.5">{s.title}</h3>
                <p className="text-[13px] md:text-[14px] leading-[1.7] text-ink-dim font-light max-w-[60ch]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ====================== SAFETY ====================== */}
      <Section id="safety" plate="Pl. VI" eyebrow="Safety">
        <Heading>
          What we <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>screen for.</em>
        </Heading>
        <Prose>
          <p>
            The procedure itself has a strong safety record when performed by trained physicians using sterile single-use equipment. The risk profile is comparable to a standard dialysis or blood-donation procedure — primarily limited to IV access and the venous return.
          </p>
          <p>
            That said, three contraindications are non-negotiable. We screen for them in the assessment and again at the consultation:
          </p>
        </Prose>
        <ul className="mt-8 flex flex-col gap-px bg-[var(--line)] border border-[var(--line)]">
          {[
            {
              title: "G6PD deficiency / favism",
              body:
                "A genetic condition in which red blood cells lack adequate glutathione regeneration. Standard contraindication to all ozone therapies. Often undiagnosed — we ask explicitly and refer for testing when there's a family history.",
            },
            {
              title: "Pregnancy and trying to conceive",
              body:
                "EBOO hasn't been demonstrated unsafe in pregnancy, but it hasn't been adequately studied for safety either. Standard precaution: no treatment during pregnancy or active TTC cycles.",
            },
            {
              title: "Anticoagulant therapy and bleeding disorders",
              body:
                "Active anticoagulation or known bleeding disorders need physician review before treatment. This isn't an automatic exclusion — it usually means an adjusted protocol or a delay until medication is reviewed.",
            },
          ].map((s) => (
            <li key={s.title} className="bg-ground-raised/40 p-6 md:p-8">
              <h3 className="font-display text-[18px] md:text-[22px] font-normal text-ink mb-2">{s.title}</h3>
              <p className="text-[13px] md:text-[14px] leading-[1.7] text-ink-dim font-light max-w-[68ch]">{s.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ====================== FAQ ====================== */}
      <Section id="faq" plate="Pl. VII" eyebrow="FAQ">
        <Heading>
          Questions we get <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>most often.</em>
        </Heading>
        <dl className="mt-8 flex flex-col gap-px bg-[var(--line)] border border-[var(--line)]">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="bg-ground-raised/40 p-6 md:p-8">
              <dt className="font-display text-[18px] md:text-[22px] font-normal text-ink mb-2">{q}</dt>
              <dd className="text-[13px] md:text-[14px] leading-[1.7] text-ink-dim font-light max-w-[68ch]">{a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* CTA */}
      <section className="relative border-t border-[var(--line)] px-5 md:px-10 py-24 md:py-32 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at center top, rgba(201,163,71,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-[680px] mx-auto">
          <div className="inline-flex items-center gap-3 mb-7">
            <span className="w-10 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-gold font-medium">
              See where you stand
            </span>
            <span className="w-10 h-px bg-gold" />
          </div>
          <h3 className="font-display display-tight text-[36px] md:text-[60px] leading-[0.98] font-light text-ink mb-9">
            Eight questions.{" "}
            <em className="italic-display text-gold" style={{ fontStyle: "italic" }}>
              A clear answer.
            </em>
          </h3>
          <Link
            href="/quiz"
            className="plausible-event-name=quiz_start plausible-event-source=about-eboo group relative inline-flex items-center gap-4 bg-gold text-ground px-8 py-5 md:py-6 font-mono text-[11px] md:text-[12px] tracking-[0.28em] font-medium overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-15px_rgba(201,163,71,0.55)]"
          >
            <span className="relative z-10">BEGIN THE ASSESSMENT</span>
            <ArrowRight
              size={16}
              className="relative z-10 transition-transform duration-500 group-hover:translate-x-1.5"
            />
            <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

/* ---------- Layout primitives ---------- */

function Section({
  id,
  plate,
  eyebrow,
  children,
}: {
  id: string;
  plate: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative border-t border-[var(--line)] px-5 md:px-10 py-20 md:py-28 max-w-[1100px] mx-auto scroll-mt-24"
    >
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-7">
        {plate} — {eyebrow}
      </div>
      {children}
    </section>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display display-tight text-[32px] md:text-[48px] leading-[1] font-light text-ink mb-10 md:mb-12 max-w-[24ch]">
      {children}
    </h2>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[68ch] text-[14px] md:text-[15px] leading-[1.75] text-ink-dim font-light space-y-5">
      {children}
    </div>
  );
}
