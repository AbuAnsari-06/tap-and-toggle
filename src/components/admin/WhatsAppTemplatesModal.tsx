"use client";

import React, { useState } from "react";
import {
  X,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Wrench,
  Clock,
  DollarSign,
  UserCheck,
} from "lucide-react";
import { AdminJobView } from "@/app/actions/adminJobs";
import { Pro } from "@/types/database";
import { SITE_CONFIG } from "@/config/site";
import { generateWhatsAppDispatchLink } from "@/lib/dispatch/whatsappDispatch";

interface WhatsAppTemplatesModalProps {
  job: AdminJobView;
  pros: Pro[];
  onClose: () => void;
}

type TemplateType = "estimate" | "pro_assigned" | "parts_delay" | "warranty" | "pro_dispatch";

export function WhatsAppTemplatesModal({
  job,
  pros,
  onClose,
}: WhatsAppTemplatesModalProps) {
  const [activeTab, setActiveTab] = useState<TemplateType>("estimate");
  const [copied, setCopied] = useState(false);

  // Editable parameters for dynamic tweaking
  const [estimateAmt, setEstimateAmt] = useState(job.estimate_amount || 250);
  const [partsAmt, setPartsAmt] = useState(job.parts_amount || 0);
  const [handlingAmt, setHandlingAmt] = useState(job.handling_fee || 30);
  const [etaMins, setEtaMins] = useState(25);
  const [selectedProId, setSelectedProId] = useState(job.pro_id || (pros[0]?.id ?? ""));

  const assignedPro = pros.find((p) => p.id === selectedProId);
  const shortId = job.id.slice(0, 8);
  const cleanCustomerPhone = job.customer_phone.replace(/[^0-9]/g, "");
  const targetCustomerPhone = cleanCustomerPhone.length === 10 ? `91${cleanCustomerPhone}` : cleanCustomerPhone;

  // Build message templates
  const getMessageContent = (): { title: string; text: string; waUrl: string } => {
    switch (activeTab) {
      case "estimate": {
        const text = `Hello *${job.customer_name}*! 👋
This is your dispatch coordinator from *Tap & Toggle (NIBM)*.

Here is your upfront estimate for Ticket *#${shortId}*:
━━━━━━━━━━━━━━━━━━━━
🛠️ *Service:* ${job.service.toUpperCase()}
📍 *Site:* ${job.society_name}, Flat ${job.flat_no || "Unit"}
💰 *Upfront Labor Quote:* *₹${estimateAmt}*
🛡️ *Promise:* No surprise fees · Pay after work · 7-day warranty

👉 *Approve on Live Tracker:* https://tap-and-toggle.vercel.app/track/${job.id}

_Reply *APPROVED* to this message to dispatch our nearest vetted pro._`;

        return {
          title: "Upfront Estimate Quote to Resident",
          text,
          waUrl: `https://wa.me/${targetCustomerPhone}?text=${encodeURIComponent(text)}`,
        };
      }

      case "pro_assigned": {
        const proName = assignedPro ? assignedPro.name : "Tap & Toggle Pro";
        const proRating = assignedPro?.health_score || 5.0;
        const text = `✅ *Pro Dispatched for Ticket #${shortId}*
━━━━━━━━━━━━━━━━━━━━
Hi *${job.customer_name}*, your vetted technician is on the way to *${job.society_name}*:

👨‍🔧 *Technician:* ${proName}
⭐ *Rating:* ${proRating} / 5.0 (Aadhaar Verified & Police Cleared)
⏱️ *ETA:* ~${etaMins} minutes

🛡️ *Gate Clearance:* Pre-approved for Tap & Toggle. Please tap *Approve* if security rings on MyGate / NoBrokerHood.

👉 *Live Tracking:* https://tap-and-toggle.vercel.app/track/${job.id}`;

        return {
          title: "Technician Dispatched & ETA to Resident",
          text,
          waUrl: `https://wa.me/${targetCustomerPhone}?text=${encodeURIComponent(text)}`,
        };
      }

      case "parts_delay": {
        const text = `🔧 *Parts Procurement Update: Ticket #${shortId}*
━━━━━━━━━━━━━━━━━━━━
Hi *${job.customer_name}*, our technician at *${job.society_name}* has completed diagnostics.

We are sourcing the required replacement parts from our local NIBM supplier to ensure genuine manufacturer grade.

💰 *Parts Cost:* ₹${partsAmt} (Actual market cost with receipt)
⏱️ *Estimated Resumption:* ~30-45 mins

👉 *Track Live Progress:* https://tap-and-toggle.vercel.app/track/${job.id}`;

        return {
          title: "Parts Procurement / Delay Update to Resident",
          text,
          waUrl: `https://wa.me/${targetCustomerPhone}?text=${encodeURIComponent(text)}`,
        };
      }

      case "warranty": {
        const totalPaid = Number(estimateAmt) + Number(partsAmt) + Number(handlingAmt);
        const text = `🎉 *Job Completed & 7-Day Warranty Activated!*
━━━━━━━━━━━━━━━━━━━━
Hi *${job.customer_name}*, thank you for choosing *Tap & Toggle*.

🎫 *Ticket ID:* #${shortId}
💵 *Amount Settled:* ₹${totalPaid}
🛡️ *7-Day Warranty:* Valid for next 7 days across ${job.society_name}.

If you notice any recurring leakage or loose connection, simply message this WhatsApp chat for a free revisit:
👉 *Warranty Certificate:* https://tap-and-toggle.vercel.app/track/${job.id}

Have a wonderful day!`;

        return {
          title: "Paid Receipt & 7-Day Warranty to Resident",
          text,
          waUrl: `https://wa.me/${targetCustomerPhone}?text=${encodeURIComponent(text)}`,
        };
      }

      case "pro_dispatch": {
        if (!assignedPro) {
          return {
            title: "Technician Work Order",
            text: "Please assign a pro from the dropdown to generate the work order.",
            waUrl: "#",
          };
        }
        const waLink = generateWhatsAppDispatchLink({
          proPhone: assignedPro.phone,
          proName: assignedPro.name,
          customerName: job.customer_name,
          customerPhone: job.customer_phone,
          societyName: job.society_name,
          flatNo: job.flat_no,
          service: job.service,
          description: job.description,
          isEmergency: job.is_emergency,
          jobId: job.id,
        });

        // Extract raw message text
        const decoded = decodeURIComponent(waLink.split("?text=")[1] || "");
        return {
          title: `Work Order Briefing to ${assignedPro.name}`,
          text: decoded,
          waUrl: waLink,
        };
      }
    }
  };

  const currentTemplate = getMessageContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTemplate.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-brand-grey-900 border border-brand-grey-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-brand-grey-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                WhatsApp Dispatch Communication Hub
              </h3>
              <p className="text-xs text-brand-grey-400">
                Ticket #{shortId} &bull; {job.customer_name} ({job.society_name})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-brand-grey-400 hover:text-white hover:bg-brand-grey-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-brand-grey-800 p-2 gap-1.5 bg-brand-grey-950">
          <button
            type="button"
            onClick={() => setActiveTab("estimate")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === "estimate"
                ? "bg-brand-teal-600 text-white"
                : "text-brand-grey-400 hover:text-white hover:bg-brand-grey-800"
            }`}
          >
            1. Estimate Quote
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pro_assigned")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === "pro_assigned"
                ? "bg-brand-teal-600 text-white"
                : "text-brand-grey-400 hover:text-white hover:bg-brand-grey-800"
            }`}
          >
            2. Pro Dispatched
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("parts_delay")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === "parts_delay"
                ? "bg-brand-teal-600 text-white"
                : "text-brand-grey-400 hover:text-white hover:bg-brand-grey-800"
            }`}
          >
            3. Parts Update
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("warranty")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === "warranty"
                ? "bg-brand-teal-600 text-white"
                : "text-brand-grey-400 hover:text-white hover:bg-brand-grey-800"
            }`}
          >
            4. Warranty Receipt
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pro_dispatch")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === "pro_dispatch"
                ? "bg-emerald-600 text-white"
                : "text-emerald-400 hover:bg-emerald-950"
            }`}
          >
            5. Work Order (to Pro)
          </button>
        </div>

        {/* Content & Parameter Customization */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Dynamic Parameters Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-brand-grey-950 p-3 rounded-2xl border border-brand-grey-800 text-xs">
            <div>
              <label className="text-[10px] text-brand-grey-400 block mb-1">Labor Quote (₹)</label>
              <input
                type="number"
                value={estimateAmt}
                onChange={(e) => setEstimateAmt(Number(e.target.value))}
                className="w-full px-2.5 py-1 rounded bg-brand-grey-900 border border-brand-grey-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-brand-grey-400 block mb-1">Parts Cost (₹)</label>
              <input
                type="number"
                value={partsAmt}
                onChange={(e) => setPartsAmt(Number(e.target.value))}
                className="w-full px-2.5 py-1 rounded bg-brand-grey-900 border border-brand-grey-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-brand-grey-400 block mb-1">ETA (Minutes)</label>
              <input
                type="number"
                value={etaMins}
                onChange={(e) => setEtaMins(Number(e.target.value))}
                className="w-full px-2.5 py-1 rounded bg-brand-grey-900 border border-brand-grey-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-brand-grey-400 block mb-1">Assigned Pro</label>
              <select
                value={selectedProId}
                onChange={(e) => setSelectedProId(e.target.value)}
                className="w-full px-2.5 py-1 rounded bg-brand-grey-900 border border-brand-grey-700 text-white text-xs"
              >
                {pros.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Message Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-brand-grey-300">
                {currentTemplate.title}
              </span>
              <span className="text-[10px] font-mono text-brand-grey-500">
                Recipient: {activeTab === "pro_dispatch" ? assignedPro?.name || "Pro" : job.customer_phone}
              </span>
            </div>
            <pre className="p-4 rounded-2xl bg-[#0b141a] text-[#e9edef] font-sans text-xs leading-relaxed border border-[#202c33] whitespace-pre-wrap select-all shadow-inner">
              {currentTemplate.text}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-brand-grey-800 bg-brand-grey-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-grey-800 hover:bg-brand-grey-700 text-brand-grey-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Message Text</span>
              </>
            )}
          </button>

          <a
            href={currentTemplate.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition shadow-lg flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open in WhatsApp Web / App</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
