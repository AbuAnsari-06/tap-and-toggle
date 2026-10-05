export interface FAQItem {
  question: string;
  answer: string;
  category: "trust" | "gate" | "pricing" | "warranty";
}

export const FAQS: FAQItem[] = [
  {
    question: "Who are the technicians entering my apartment?",
    answer:
      "Every plumber and electrician on Tap & Toggle is personally hand-vetted by our founding team. We do not operate an open contractor marketplace. Pros undergo Aadhaar identity validation, police background checks, skill assessments, and carry verified personal accident cover. Most are familiar faces who have serviced NIBM communities for years.",
    category: "trust",
  },
  {
    question: "How does gate security (MyGate / NoBrokerHood) work?",
    answer:
      "When a technician is dispatched, your Live Tracking link automatically provides their full name, specialty, and entry details to pre-clear at your society gate. In partner societies, Tap & Toggle technicians enter under our pre-approved vendor roster, meaning zero gate delays or surprise visitor calls.",
    category: "gate",
  },
  {
    question: "How does spare parts billing work? Are there hidden markups?",
    answer:
      "Zero hidden markups, guaranteed. Technicians procure spare parts directly from neighborhood hardware stores at real store prices. They snap a photo of the physical shop receipt into your digital job sheet. We only apply a transparent flat ₹30 arrangement/procurement fee to cover the technician's market trip.",
    category: "pricing",
  },
  {
    question: "What does the 7-Day Workmanship Warranty cover?",
    answer:
      "If the exact same plumbing leak or electrical fault recurs within 7 days of completion, our technician will revisit your flat and resolve it at ₹0 additional labor charge. Your digital warranty certificate is generated automatically upon doorstep UPI payment.",
    category: "warranty",
  },
  {
    question: "When and how do I pay?",
    answer:
      "You only pay after the repair is completed and tested in your presence. Tap & Toggle acts as the merchant of record — you can pay instantly via any UPI app (Google Pay, PhonePe, Paytm, BHIM) by scanning the technician's doorstep QR code or tapping the deep-link in your Live Tracker.",
    category: "pricing",
  },
  {
    question: "What if I have an emergency water leak or electrical hazard?",
    answer:
      "Toggle the 'Priority Emergency Hazard' option in our booking form or message our dispatch hotline immediately. Emergency tickets bypass normal scheduling and are assigned to the closest available technician within a 3-kilometer radius in NIBM.",
    category: "trust",
  },
];
