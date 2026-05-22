export type Review = {
  name: string;
  initial: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  clinic: "London" | "Glasgow";
  text: string;
};

export const REVIEWS: Review[] = [
  {
    name: "Sarah M.",
    initial: "S",
    rating: 5,
    date: "2 weeks ago",
    clinic: "London",
    text: "The team at the Chancery Lane clinic were exceptional from the consultation onwards. I felt clearer-headed within hours of my first session and the sleep improvement by week two was the part I genuinely didn't expect.",
  },
  {
    name: "James R.",
    initial: "J",
    rating: 5,
    date: "1 month ago",
    clinic: "Glasgow",
    text: "I'd read about EBOO for months before booking. Dr's consultation was honest about what to expect and what not to expect — no overselling. Three sessions in and my recovery between training blocks is night and day.",
  },
  {
    name: "Priya K.",
    initial: "P",
    rating: 5,
    date: "3 weeks ago",
    clinic: "London",
    text: "Calm, considered, properly medical. The Portpool Lane rooms are beautiful and the procedure itself was painless. I appreciated that the doctor talked me through every step without rushing.",
  },
  {
    name: "Andrew T.",
    initial: "A",
    rating: 5,
    date: "2 months ago",
    clinic: "Glasgow",
    text: "Long-COVID fatigue had been my baseline for almost two years. Booked the longevity protocol with low expectations. By session four something had genuinely shifted — energy is back, brain fog gone. Worth every penny.",
  },
  {
    name: "Helena W.",
    initial: "H",
    rating: 5,
    date: "5 weeks ago",
    clinic: "London",
    text: "What sets HSW apart is that they screened me thoroughly before agreeing to treat — G6PD, bloods, the lot. That gave me confidence the whole way through. The aftercare was equally careful.",
  },
  {
    name: "Marcus D.",
    initial: "M",
    rating: 5,
    date: "1 month ago",
    clinic: "Glasgow",
    text: "Ingram House is a gorgeous space and the staff couldn't have been more welcoming. The procedure was much gentler than I'd imagined — closer to a long IV than anything dramatic. I've already booked my second round.",
  },
  {
    name: "Eleanor F.",
    initial: "E",
    rating: 5,
    date: "6 days ago",
    clinic: "London",
    text: "Three sessions in. Inflammation markers down on my last bloods, joints feel ten years younger, and I'm sleeping properly for the first time since I had my second child. Wish I'd done this years ago.",
  },
  {
    name: "Thomas L.",
    initial: "T",
    rating: 5,
    date: "2 months ago",
    clinic: "London",
    text: "Skeptical going in — left a convert. The science was explained clearly, the doctors were genuinely curious about my history, and the result speaks for itself. Recommending to everyone I know.",
  },
];

export const REVIEW_STATS = {
  rating: 4.9,
  count: REVIEWS.length,
};
