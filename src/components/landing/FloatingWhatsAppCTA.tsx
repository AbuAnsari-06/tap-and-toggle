"use client";

import React from "react";
import { MessageSquare, Zap } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function FloatingWhatsAppCTA() {
  const cleanNumber = SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  const defaultMessage = encodeURIComponent(
    "Hi Tap & Toggle! I need an upfront estimate for a plumbing / electrical repair in my NIBM flat."
  );
  const waUrl = `https://wa.me/${cleanNumber}?text=${defaultMessage}`;

  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Floating Pill */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 border border-emerald-400/40 transition-all hover:scale-105 active:scale-95"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>

        <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
        <span className="tracking-wide">Chat on WhatsApp</span>
      </a>
    </aside>
  );
}
