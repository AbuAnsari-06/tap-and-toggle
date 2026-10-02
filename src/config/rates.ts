/**
 * PLACEHOLDER PRICES. Validate with the pro bench before launch.
 * Reference: BLUEPRINT.md (Section 23 - Rate Card) & Rules.md
 * 
 * Rules:
 * - Rate card prices live in one centralized config file.
 * - Hybrid display: fixed prices for standard visitable jobs; free estimate for variable jobs.
 * - Every job: visit/inspection charge (₹199) is waived when service is booked.
 * - Parts at actuals + small handling fee (₹20-50). 7-day workmanship warranty.
 */

export interface RateItem {
  id: string;
  title: string;
  description: string;
  priceType: "fixed" | "estimate";
  price?: number;
  estimateText?: string;
  category: "plumbing" | "electrical";
  popular?: boolean;
}

export const RATE_CARD_POLICY = {
  visitChargeText: "Free estimate · visit ₹199 (waived if you book)",
  partsPolicy: "Parts at actuals + small handling fee (₹20–50). 7-day workmanship warranty.",
  summaryNote: "Every job: visit/inspection charge is fully adjusted into your final bill.",
};

export const RATE_CARD_ITEMS: RateItem[] = [
  // ==========================================
  // PLUMBING SERVICES ("Tap")
  // ==========================================
  {
    id: "plumb-leak-tap",
    title: "Leaking Tap Repair",
    description: "Washer replacement, spindle repair, or tightening",
    priceType: "fixed",
    price: 150,
    category: "plumbing",
    popular: true,
  },
  {
    id: "plumb-tap-replace",
    title: "Tap Replacement",
    description: "Installation of new bib tap, pillar tap, or angle valve",
    priceType: "fixed",
    price: 250,
    category: "plumbing",
  },
  {
    id: "plumb-wash-basin",
    title: "Wash Basin Fitting / Repair",
    description: "Waste coupling, bottle trap, or bracket adjustment",
    priceType: "fixed",
    price: 250,
    category: "plumbing",
  },
  {
    id: "plumb-blocked-drain",
    title: "Blocked Drain / Sink Clearance",
    description: "Unclogging kitchen sink, bathroom trap, or floor drain",
    priceType: "fixed",
    price: 400,
    category: "plumbing",
    popular: true,
  },
  {
    id: "plumb-flush-cistern",
    title: "Flush Cistern Repair",
    description: "Syphon replacement, inlet valve fix, or flush button tune-up",
    priceType: "fixed",
    price: 200,
    category: "plumbing",
  },
  {
    id: "plumb-geyser-piping",
    title: "Geyser & RO Piping Setup",
    description: "Inlet/outlet connection, braided hose fitting, or line extension",
    priceType: "estimate",
    estimateText: RATE_CARD_POLICY.visitChargeText,
    category: "plumbing",
  },
  {
    id: "plumb-motor-pump",
    title: "Water Motor & Pump Repair",
    description: "Motor prime diagnosis, pressure check, or pump overhaul",
    priceType: "estimate",
    estimateText: RATE_CARD_POLICY.visitChargeText,
    category: "plumbing",
  },

  // ==========================================
  // ELECTRICAL SERVICES ("Toggle")
  // ==========================================
  {
    id: "elec-switch-socket",
    title: "Switch / Socket Replacement",
    description: "Replacement of 6A/16A switches, sockets, or modular plates",
    priceType: "fixed",
    price: 120,
    category: "electrical",
    popular: true,
  },
  {
    id: "elec-board-fault",
    title: "Switchboard Fault Repair",
    description: "Internal rewiring, sparking fix, or master gang repair",
    priceType: "fixed",
    price: 250,
    category: "electrical",
  },
  {
    id: "elec-mcb-trip",
    title: "MCB Trip / Replacement",
    description: "Trip diagnosis, breaker replacement, or load balancing",
    priceType: "fixed",
    price: 150,
    category: "electrical",
    popular: true,
  },
  {
    id: "elec-fan-fitting",
    title: "Ceiling Fan Fitting & Servicing",
    description: "Installation, capacitor replacement, or regulator fix",
    priceType: "fixed",
    price: 200,
    category: "electrical",
  },
  {
    id: "elec-light-point",
    title: "Light & Batten Point Fitting",
    description: "Tubelight, spotlight, chandelier, or fixture point setup",
    priceType: "fixed",
    price: 150,
    category: "electrical",
  },
  {
    id: "elec-wiring-repair",
    title: "Concealed Wiring & Short Circuit",
    description: "Line testing, neutral fault rectification, or new wiring pull",
    priceType: "estimate",
    estimateText: RATE_CARD_POLICY.visitChargeText,
    category: "electrical",
  },
  {
    id: "elec-inverter-point",
    title: "Inverter Point & Backup Wiring",
    description: "Battery/inverter bypass setup or dedicated line connection",
    priceType: "estimate",
    estimateText: RATE_CARD_POLICY.visitChargeText,
    category: "electrical",
  },
];
