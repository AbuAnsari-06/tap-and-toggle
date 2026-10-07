import { SITE_CONFIG } from "@/config/site";

export interface WhatsAppJobPayload {
  jobId: string;
  customerName: string;
  customerPhone?: string;
  societyName: string;
  flatNo?: string;
  service: "plumbing" | "electrical";
  description?: string;
  isEmergency?: boolean;
  estimateAmount?: number;
  finalAmount?: number;
  proName?: string;
  proPhone?: string;
  proRating?: number;
  etaMins?: number;
}

function getCleanPhone(phone: string): string {
  let clean = phone.replace(/[^0-9]/g, "");
  if (clean.length === 10) {
    clean = "91" + clean;
  }
  return clean;
}

/**
 * 1. Resident Initiates Chat after Request Submission
 */
export function generateCustomerConfirmationWhatsAppUrl(job: WhatsAppJobPayload): string {
  const shortId = job.jobId ? job.jobId.slice(0, 8) : "NIBM";
  const cleanNumber = SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  const serviceLabel = job.service === "plumbing" ? "Plumbing 💧" : "Electrical ⚡";
  const emergencyTag = job.isEmergency ? "🚨 URGENT EMERGENCY" : "Standard Visit";
  const phoneTag = job.customerPhone ? `\n📞 *Phone:* ${job.customerPhone}` : "";

  const message = `Hi *Tap & Toggle* team! 👋
I just submitted a service request on your website.

🎫 *Ticket ID:* #${shortId}
👤 *Name:* ${job.customerName}${phoneTag}
🛠️ *Service:* ${serviceLabel}
⚠️ *Priority:* ${emergencyTag}
📍 *Location:* ${job.societyName}${job.flatNo ? `, Flat ${job.flatNo}` : ""}
📝 *Issue:* ${job.description || "As described in ticket"}

👉 *Live Tracker:* https://tap-and-toggle.vercel.app/track/${job.jobId}

Please confirm and send me the free estimate!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * 2. Operator sends Free Estimate Quote to Resident
 */
export function generateEstimateQuoteWhatsAppUrl(job: WhatsAppJobPayload): string {
  if (!job.customerPhone) return "";
  const shortId = job.jobId.slice(0, 8);
  const targetPhone = getCleanPhone(job.customerPhone);

  const message = `Hello *${job.customerName}*! 👋
This is your dispatch coordinator from *Tap & Toggle (NIBM)*.

Here is your upfront estimate for Ticket *#${shortId}*:
━━━━━━━━━━━━━━━━━━━━
🛠️ *Service:* ${job.service.toUpperCase()}
📍 *Site:* ${job.societyName}, Flat ${job.flatNo || ""}
💰 *Upfront Estimate:* *₹${job.estimateAmount || 0}* (Labor)
🛡️ *Promise:* No surprise fees · Pay after work · 7-day warranty

👉 *Approve Estimate:* https://tap-and-toggle.vercel.app/track/${job.jobId}

_Reply *APPROVED* to this message to dispatch our nearest vetted pro._`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * 3. Operator notifies Resident that Pro is Assigned & Dispatched
 */
export function generateProAssignedWhatsAppUrl(job: WhatsAppJobPayload): string {
  if (!job.customerPhone) return "";
  const shortId = job.jobId.slice(0, 8);
  const targetPhone = getCleanPhone(job.customerPhone);

  const message = `✅ *Pro Dispatched for Ticket #${shortId}*
━━━━━━━━━━━━━━━━━━━━
Hi *${job.customerName}*, your vetted technician is on the way to *${job.societyName}*:

👨‍🔧 *Technician:* ${job.proName || "Tap & Toggle Pro"}
⭐ *Rating:* ${job.proRating || 5.0} / 5.0 (Vetted & Police Cleared)
📞 *Phone:* ${job.proPhone || "Available via dispatch"}
⏱️ *ETA:* ~${job.etaMins || 25} minutes

🛡️ *Gate Entry:* Pre-approved for Tap & Toggle. Please tap *Approve* if security calls on MyGate / NoBrokerHood.

👉 *Live Tracking:* https://tap-and-toggle.vercel.app/track/${job.jobId}`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * 4. Post-Service Receipt & 7-Day Warranty Certificate
 */
export function generateWarrantyReceiptWhatsAppUrl(job: WhatsAppJobPayload): string {
  if (!job.customerPhone) return "";
  const shortId = job.jobId.slice(0, 8);
  const targetPhone = getCleanPhone(job.customerPhone);

  const message = `🎉 *Job Completed & 7-Day Warranty Activated!*
━━━━━━━━━━━━━━━━━━━━
Hi *${job.customerName}*, thank you for choosing *Tap & Toggle*.

🎫 *Ticket ID:* #${shortId}
💵 *Amount Paid:* ₹${job.finalAmount || job.estimateAmount || 0}
🛡️ *7-Day Warranty:* Valid for next 7 days across ${job.societyName}.

If you notice any recurring fault, simply reply to this WhatsApp chat or visit your warranty page:
👉 https://tap-and-toggle.vercel.app/track/${job.jobId}

Have a wonderful day!`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}
