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
  
  // Single config constant for WhatsApp (Placeholder as per Blueprint Section 10 & Rules)
  WHATSAPP_NUMBER: "+919800000000",
  
  // Geographic launch focus
  serviceArea: "NIBM, Nyati, Sus & Phase 1–2, Pune",

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

  // DPDP Act 2023 Consent configuration for booking requests
  dpdpConsent: {
    version: "v1.0-2026",
    text: "I consent to Tap & Toggle contacting me via phone or WhatsApp regarding my service request, and processing my contact details in accordance with the DPDP Act 2023.",
  },

  // Payment configuration (Direct UPI doorstep settlement + Razorpay ready)
  payments: {
    upiId: "tapandtoggle@icici",
    merchantName: "Tap & Toggle Services",
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
