import type { Metadata } from "next";
import { ArrowDown, ArrowRight, Check, Clock3, MapPin, Phone, ShieldCheck } from "lucide-react";
import { ProcedureFilm } from "@/components/retarget/procedure-film";
import { SessionWalkthrough } from "@/components/session-walkthrough";
import { ConsultationCalendar } from "@/components/consultation-calendar";
import styles from "./retarget.module.css";

const PAGE_URL = "https://eboo.harleystreetwellness.co.uk/retarget";

export const metadata: Metadata = {
  title: "First EBOO treatment £1,495 | London & Glasgow",
  description: "Explore your first EBOO treatment for £1,495 at Harley Street Medical Wellness in London or Glasgow. Start with an online pre-assessment; a clinician confirms suitability.",
  alternates: { canonical: PAGE_URL },
  robots: { index: false, follow: true },
  openGraph: {
    title: "A closer look at EBOO. First treatment £1,495.",
    description: "London & Glasgow. Medical supervision included. Begin with your online pre-assessment.",
    url: PAGE_URL,
    images: [{ url: "/eboo-machine.webp", width: 900, height: 600, alt: "EBOO treatment equipment" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "First EBOO treatment £1,495 | Harley Street Medical Wellness",
    description: "London & Glasgow. Start your online pre-assessment; a clinician confirms suitability.",
    images: ["/eboo-machine.webp"],
  },
};

const clinics = [
  { city: "London", area: "Belgravia", lines: ["2 Grosvenor Gardens", "Belgravia, London SW1W 0DH"], phone: "020 4628 3137", tel: "+442046283137" },
  { city: "Glasgow", area: "Merchant City", lines: ["5th Floor, Ingram House", "227 Ingram Street", "Glasgow G1 1DA"], phone: "0141 488 8985", tel: "+441414888985" },
];

const faqs = [
  { q: "What does the £1,495 offer cover?", a: "The offer is for your first EBOO treatment, with a 60–90 minute session and medical supervision included. You can book a free online consultation first. The clinic will explain any required testing or additional appointment charges before you proceed." },
  { q: "Does the pre-assessment confirm I can have EBOO?", a: "No. It is an initial enquiry that helps the team understand your circumstances and preferred clinic. It does not diagnose a condition or confirm medical suitability. A clinician reviews your health history and decides whether EBOO is appropriate, including whether tests are needed." },
  { q: "Do I have to pay to submit the pre-assessment?", a: "No payment is taken through the online pre-assessment. It starts a conversation with the clinic; it does not commit you to treatment." },
  { q: "Can I speak to the clinic first?", a: "Yes. Call the London or Glasgow team using the numbers below. They can discuss the first-treatment offer, the consultation process and your questions before you complete the pre-assessment." },
];

function AssessmentLink({ compact = false }: { compact?: boolean }) {
  return <a className={compact ? styles.compactCta : styles.cta} href="/quiz">{compact ? "Start pre-assessment" : "Start your pre-assessment"}<ArrowRight aria-hidden size={18} /></a>;
}

function ConsultationLink() {
  return <a className={styles.secondaryCta} href="#book-call">Free online consultation<ArrowRight aria-hidden size={17} /></a>;
}

export default function RetargetPage() {
  return (
    <main className={styles.page}>
      <a href="#offer" className={styles.skip}>Skip to offer</a>
      <header className={styles.header}>
        <a href="/" className={styles.brand} aria-label="Harley Street Medical Wellness home"><span className={styles.monogram}>HSW</span><span className={styles.brandName}>HARLEY STREET<br />MEDICAL WELLNESS</span></a>
        <nav aria-label="Page navigation" className={styles.nav}><a href="#procedure">The treatment</a><a href="#clinics">Our clinics</a><a href="#next-step" className={styles.headerCta}>Explore suitability <ArrowRight size={15} aria-hidden /></a></nav>
        <a href="#clinics" className={styles.mobileNav}>Our clinics <ArrowDown size={13} aria-hidden /></a>
      </header>

      <section id="offer" className={styles.hero} aria-labelledby="offer-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span />LONDON & GLASGOW · FIRST TREATMENT OFFER</p>
          <h1 id="offer-title">Curious about<br /><em>EBOO?</em></h1>
          <p className={styles.intro}>Take a closer look at the procedure.<br className={styles.desktopBreak} /> Then decide your next step with a clinician.</p>
          <div className={styles.offerPrice}><span>Your first EBOO treatment</span><strong>£1,495<span> / session</span></strong></div>
          <ul className={styles.offerFacts}><li><Clock3 size={16} aria-hidden />60–90 minute session</li><li><ShieldCheck size={17} aria-hidden />Medical supervision included</li></ul>
          <div className={styles.actionGroup}><AssessmentLink /><ConsultationLink /></div>
          <p className={styles.ctaNote}>A clinician confirms suitability before treatment.</p>
          <p className={styles.priceNote}>Any required testing or additional appointment charges will be discussed before you proceed.</p>
        </div>
        <div className={styles.heroVisual}>
          <span aria-hidden className={styles.visualWord}>EBOO</span>
          <div aria-hidden className={styles.orbit} /><div aria-hidden className={styles.orbitInner} />
          <div className={styles.visualLabel}><span />A CLOSER LOOK AT THE PROCEDURE</div>
          {/* Existing clinic equipment asset; no simulated outcome or blood-colour comparison. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/eboo-machine.webp" width="900" height="600" alt="EBOO treatment machine and external tubing" className={styles.machine} fetchPriority="high" />
          <div className={styles.visualCaption}><span>01 / THE EQUIPMENT</span><p>Extracorporeal blood<br />oxygenation & ozonation.</p></div>
          <a className={styles.watchLink} href="#full-session">Watch a full session <ArrowDown size={16} aria-hidden /></a>
        </div>
      </section>

      <div className={styles.editorialStrip}><span>YOUR QUESTIONS. OUR STARTING POINT.</span><p>Understand the procedure.<em> Make an informed choice.</em></p></div>

      <SessionWalkthrough id="full-session" />
      <ConsultationCalendar />

      <section id="procedure" className={styles.procedure} aria-labelledby="procedure-title">
        <div className={styles.filmColumn}><ProcedureFilm /><p className={styles.filmCaption}><span />REAL CLINIC FOOTAGE · 23 SECONDS</p></div>
        <div className={styles.procedureCopy}>
          <p className={styles.eyebrow}>01 / MEET THE PROCEDURE</p>
          <h2 id="procedure-title">Two lines.<br /><em>One external circuit.</em></h2>
          <p className={styles.bodyCopy}>EBOO circulates blood from the body through an external oxygen–ozone treatment circuit, then returns it to the body.</p>
          <p className={styles.bodyCopy}>Our short film takes you inside the clinic to see the equipment and follow the two lines.</p>
          <div className={styles.flow} aria-label="Blood flows from the body, through the EBOO circuit, then returns to the body"><span>FROM THE BODY</span><ArrowRight size={17} aria-hidden /><span>EBOO CIRCUIT</span><ArrowRight size={17} aria-hidden /><span>TO THE BODY</span></div>
          <div className={styles.clinicalNote}><ShieldCheck size={23} aria-hidden /><p>Whether EBOO is appropriate for you is a clinical decision. Your health history, any necessary testing, and the risks and potential benefits are discussed before treatment.</p></div>
        </div>
      </section>

      <section id="next-step" className={styles.nextSection} aria-labelledby="next-title">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>02 / YOUR NEXT STEP</p><h2 id="next-title">Start with a conversation.<br /><em>Not a commitment.</em></h2></div><p>There is no payment at the online pre-assessment stage. The clinic helps you understand what comes next.</p></div>
        <ol className={styles.steps}>
          <li><span className={styles.stepNumber}>01</span><h3>Pre-assessment</h3><p>Complete the online questions and choose London or Glasgow. Your answers help the team prepare for your enquiry.</p></li>
          <li><span className={styles.stepNumber}>02</span><h3>Clinical review</h3><p>Discuss your health history and questions. A clinician confirms suitability and any tests needed before treatment.</p></li>
          <li><span className={styles.stepNumber}>03</span><h3>Your decision</h3><p>Confirm your first-treatment offer, appointment and any additional charges with the clinic before you choose to proceed.</p></li>
        </ol>
        <div className={styles.nextCta}><div className={styles.actionGroup}><AssessmentLink /><ConsultationLink /></div><span><Check size={15} aria-hidden />No online payment required</span></div>
      </section>

      <section id="clinics" className={styles.clinicsSection} aria-labelledby="clinics-title">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>03 / TWO CLINICS. THE SAME FIRST STEP.</p><h2 id="clinics-title">London.<em> Glasgow.</em></h2></div><p>Choose your preferred clinic in the pre-assessment, or speak to the team directly.</p></div>
        <div className={styles.clinics}>{clinics.map((clinic, index) => <article className={styles.clinic} key={clinic.city}><div className={styles.clinicTop}><span className={styles.eyebrow}>0{index + 1} / {clinic.area.toUpperCase()}</span><MapPin size={19} aria-hidden /></div><h3>{clinic.city}</h3><address>{clinic.lines.map((line) => <span key={line}>{line}</span>)}</address><a href={`tel:${clinic.tel}`} className={styles.phone}><Phone size={17} aria-hidden />{clinic.phone}<ArrowRight size={17} aria-hidden /></a></article>)}</div>
      </section>

      <section className={styles.faqSection} aria-labelledby="faq-title"><div><p className={styles.eyebrow}>A LITTLE MORE CLARITY</p><h2 id="faq-title">Before you<br /><em>take the next step.</em></h2></div><div className={styles.faqList}>{faqs.map((faq) => <details key={faq.q}><summary>{faq.q}<span aria-hidden>+</span></summary><p>{faq.a}</p></details>)}</div></section>

      <section className={styles.closing} aria-labelledby="closing-title"><p className={styles.eyebrow}>FIRST EBOO TREATMENT · £1,495</p><h2 id="closing-title">The next step<br /><em>starts with you.</em></h2><div className={styles.actionGroup}><AssessmentLink /><ConsultationLink /></div><p>Your enquiry. Your questions. A clinician&apos;s guidance.</p></section>

      <footer className={styles.footer}><div><span className={styles.monogram}>HSW</span><p>HARLEY STREET MEDICAL WELLNESS</p></div><nav aria-label="Legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/cookies">Cookies</a></nav><p>© {new Date().getFullYear()} Harley Street Wellness Ltd</p></footer>
      <div className={styles.mobileBar}><div><span>FIRST TREATMENT</span><strong>£1,495</strong></div><AssessmentLink compact /><a className={styles.mobileConsultation} href="#book-call">Free online consultation<ArrowRight aria-hidden size={14} /></a></div>
    </main>
  );
}
