/**
 * WhatsApp Dispatch Briefing Message Generator
 * Formats a standardized technician work order and returns a direct wa.me link.
 */

export interface DispatchBriefingInput {
  proPhone: string;
  proName: string;
  customerName: string;
  customerPhone: string;
  societyName: string;
  flatNo: string;
  service: "plumbing" | "electrical";
  description: string;
  isEmergency: boolean;
  jobId: string;
  requestedSlot?: string | null;
}

export function generateWhatsAppDispatchLink(input: DispatchBriefingInput): string {
  // Normalize technician phone number for wa.me (remove spaces, symbols; ensure 91 country code)
  let cleanPhone = input.proPhone.replace(/[^0-9]/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  }

  const urgencyEmoji = input.isEmergency ? "🚨 URGENT EMERGENCY (<30 MINS)" : "Standard Visit";
  const serviceLabel = input.service.toUpperCase();
  const mapsQuery = encodeURIComponent(`${input.societyName} NIBM Pune`);
  const mapsLink = `https://maps.google.com/?q=${mapsQuery}`;

  const message = `🛠️ *TAP & TOGGLE — TECHNICIAN DISPATCH ORDER*
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Assigned To:* ${input.proName}
⚡ *Service:* ${serviceLabel}
⚠️ *Urgency:* ${urgencyEmoji}
🎫 *Ticket ID:* #${input.jobId.slice(0, 8)}

📍 *SITE ADDRESS:*
• *Society:* ${input.societyName}
• *Unit / Flat:* ${input.flatNo || "Pending confirmation"}
• *Maps:* ${mapsLink}

👤 *RESIDENT CONTACT:*
• *Name:* ${input.customerName}
• *Phone:* ${input.customerPhone}

📝 *REPORTED FAULT:*
${input.description}

🛡️ *GATE ENTRY PROTOCOL:*
• Announce: "Tap & Toggle service technician for ${input.flatNo || "resident"}".
• Pre-approved vendor entry on MyGate / NoBrokerHood.

━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 *Reply "ON THE WAY" as soon as you depart!*`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
