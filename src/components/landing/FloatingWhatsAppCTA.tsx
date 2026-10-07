"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, Sparkles, Droplets, Zap, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function FloatingWhatsAppCTA() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string>("Hi Tap & Toggle! I need an upfront estimate for a plumbing / electrical repair in my NIBM flat.");

  const cleanNumber = SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");

  const quickPrompts = [
    {
      label: "💧 Plumbing Leak",
      icon: Droplets,
      text: "Hi Tap & Toggle! I have a plumbing leakage issue in my flat. Can you share an upfront estimate?",
    },
    {
      label: "⚡ Electrical / MCB",
      icon: Zap,
      text: "Hi Tap & Toggle! I need an electrician for a switch/MCB/wiring issue. When can a pro visit?",
    },
    {
      label: "🚨 Urgent Emergency",
      icon: Sparkles,
      text: "🚨 URGENT: I need emergency technician dispatch for my society flat right away!",
    },
    {
      label: "📋 Free Estimate",
      icon: ShieldCheck,
      text: "Hi Tap & Toggle! I would like to get a free estimate and book a technician visit.",
    },
  ];

  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(selectedTopic)}`;

  return (
    <aside
      aria-label="WhatsApp direct assistance"
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto max-w-[calc(100vw-2.5rem)] sm:max-w-sm"
    >
      {/* Interactive Popup Card */}
      {isOpen && (
        <div className="w-full bg-white rounded-3xl shadow-2xl border border-brand-teal-100 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-teal-800 to-brand-teal-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <MessageSquare className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-brand-teal-800" />
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">Tap & Toggle Support</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-brand-teal-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span>Online · NIBM Dispatch Desk</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors"
              aria-label="Close WhatsApp chat popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-brand-grey-50/50">
            <div className="p-3 bg-white rounded-2xl border border-brand-grey-200 text-xs text-brand-grey-700 leading-relaxed shadow-sm">
              <p className="font-semibold text-brand-grey-900 mb-0.5">👋 Hi there!</p>
              <p>
                Need a vetted plumber or electrician at your doorstep? Tap below to send us a direct message on WhatsApp for instant pricing &amp; visit booking.
              </p>
            </div>

            {/* Quick Chips */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-brand-grey-500 uppercase tracking-wider px-1">
                Choose what you need:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTopic(item.text)}
                    className={`text-left p-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      selectedTopic === item.text
                        ? "bg-brand-teal-50 border-brand-teal-500 text-brand-teal-900 shadow-sm"
                        : "bg-white border-brand-grey-200 text-brand-grey-700 hover:border-brand-grey-300"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 text-brand-teal-700 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Send Message (+91 9517614940)</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 border border-emerald-400/40 transition-all hover:scale-105 active:scale-95"
        aria-label="Toggle WhatsApp chat popup"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>

        <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
        <span className="tracking-wide">{isOpen ? "Hide Chat" : "Chat on WhatsApp"}</span>
      </button>
    </aside>
  );
}
