/**
 * Tap & Toggle — Central Site Configuration
 * Reference: BLUEPRINT.md (Section 4, Section 10, Section 18)
 * 
 * Rules:
 * - Rate card prices and WhatsApp number live as centralized constants.
 * - Do NOT use the word "insured" in any user-facing copy (platform insurance is deferred).
 */

export const SITE_CONFIG = {
  name: "Tap & Toggle",
  tagline: "Your building's plumber & electrician — one tap away.",
  description:
    "NIBM's own, gate-cleared plumbers & electricians. Free upfront estimate, one accountable bill, and a 7-day workmanship warranty.",
  
  // Single config constant for WhatsApp
  WHATSAPP_NUMBER: "+919517614940",
  
  // Geographic launch focus
  serviceArea: "NIBM, Nyati, Sus & Phase 1–2, Pune",

  // Platform Legal Positioning & Service Model Disclaimer
  platformModel: {
    role: "Professional Service Facilitation Platform",
    technicianStatus: "Independent, Vetted Trade Technicians",
    disclaimer:
      "Tap & Toggle operates as a technology and service booking facilitation platform connecting residential societies with independent, verified trade technicians. Physical plumbing and electrical repairs are performed directly by independent service professionals under platform quality standards. Tap & Toggle coordinates upfront estimates, gate clearance, and a 7-day labor rework guarantee, but does not assume direct or vicarious liability for physical execution or pre-existing infrastructure flaws.",
  },

  // Trust badges (strictly omitting 'insured' per non-negotiable rules)
  trustBadges: [
    {
      title: "Same-day in NIBM",
      description: "Fast, local response in your neighborhood",
    },
    {
      title: "Upfront pricing",
      description: "Clear rates & free upfront estimates",
    },
    {
      title: "7-day warranty",
      description: "Accountable workmanship guarantee on every job",
    },
    {
      title: "Vetted local pros",
      description: "ID-verified plumbers and electricians on bench",
    },
    {
      title: "No advance for estimate",
      description: "Pay only after the job is done and approved",
    },
  ],

  // DPDP Act 2023 & Platform Model Consent configuration for booking requests
  dpdpConsent: {
    version: "v2.0-2026",
    text: "I understand that Tap & Toggle is a professional service facilitation platform connecting me with independent, vetted trade technicians who perform the on-site work. I agree to the Terms of Service & Privacy Policy, and consent to service communication under the DPDP Act 2023.",
  },

  // Payment configuration (Direct UPI doorstep settlement + Razorpay ready)
  payments: {
    upiId: "tapandtoggle@icici",
    merchantName: "Tap & Toggle Services",
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
