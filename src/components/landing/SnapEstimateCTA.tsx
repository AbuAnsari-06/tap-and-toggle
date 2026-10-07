"use client";

import React, { useState } from "react";
import { Camera, Video, MessageSquare, ArrowRight, Droplets, Zap, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

interface ExampleCard {
  title: string;
  category: "plumbing" | "electrical";
  diagnosis: string;
  samplePrompt: string;
  badge: string;
}

const EXAMPLE_CASES: ExampleCard[] = [
  {
    title: "Leaking Tap / Angle Valve",
    category: "plumbing",
    diagnosis: "We check whether it's an internal cartridge leak, spindle wear, or teflon tape joint issue.",
    samplePrompt: "Hi Tap & Toggle! Here is a photo of my leaking tap/sink. Please share a free estimate and dispatch availability.",
    badge: "Most Common",
  },
  {
    title: "Flush Tank & Concealed Cistern",
    category: "plumbing",
    diagnosis: "We diagnose if the ball-valve siphon, overflow pipe, or flush push-button needs replacement.",
    samplePrompt: "Hi Tap & Toggle! Here is a video of my flush tank leaking water into the commode. Please quote an estimate.",
    badge: "Plumbing",
  },
  {
    title: "Burnt Socket / MCB Tripping",
    category: "electrical",
    diagnosis: "We check the electrical load, wiring insulation, and breaker capacity (6A vs 16A).",
    samplePrompt: "Hi Tap & Toggle! Here is a photo of my switchboard/MCB tripping repeatedly. When can an electrician inspect?",
    badge: "Electrical",
  },
  {
    title: "Geyser Inlet / Pipe Connection",
    category: "plumbing",
    diagnosis: "We inspect the flexible SS hose pipe, angle valve pressure, and thermostat fitting.",
    samplePrompt: "Hi Tap & Toggle! Here is a photo of my geyser connection. I need a technician to inspect and fix the leak.",
    badge: "Fast Dispatch",
  },
];

export function SnapEstimateCTA() {
  const [selectedCase, setSelectedCase] = useState<number>(0);
  const cleanNumber = SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");

  const activeCase = EXAMPLE_CASES[selectedCase];
  const customWaUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(activeCase.samplePrompt)}`;
  const genericWaUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    "Hi Tap & Toggle! I am sending a photo/video of the issue in my flat. Please identify the problem and share a free upfront estimate!"
  )}`;

  return (
    <section className="py-16 bg-gradient-to-b from-brand-grey-50 via-white to-brand-teal-50/40 border-b border-brand-teal-900/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-brand-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-brand-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>2-Minute WhatsApp Diagnosis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-grey-900 tracking-tight leading-tight">
            Not Sure What’s Broken? <br className="hidden sm:inline" />
            <span className="text-brand-teal-700 underline decoration-brand-teal-300 decoration-wavy decoration-2">
              Snap a Photo or 5-Sec Video
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brand-grey-600 leading-relaxed max-w-xl mx-auto">
            Don&apos;t worry about technical plumbing or electrical jargon. Just click a quick picture of your issue and message us on WhatsApp for a <strong>free, upfront quote in 2 minutes</strong>.
          </p>
        </div>

        {/* Interactive Feature Card */}
        <div className="bg-white rounded-3xl border-2 border-brand-teal-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Interactive Example Selection */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 border-b lg:border-b-0 lg:border-r border-brand-grey-200 bg-brand-grey-50/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-grey-500">
                  Select a common problem:
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ⚡ 2-min reply
                </span>
              </div>

              {/* Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EXAMPLE_CASES.map((item, idx) => {
                  const isSelected = selectedCase === idx;
                  const isPlumb = item.category === "plumbing";
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedCase(idx)}
                      className={`text-left p-3.5 rounded-2xl border transition-all text-xs flex flex-col justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? "bg-brand-teal-800 text-white border-brand-teal-800 shadow-md scale-[1.02]"
                          : "bg-white text-brand-grey-800 border-brand-grey-200 hover:border-brand-teal-300 hover:bg-brand-teal-50/30"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`p-1.5 rounded-xl ${
                            isSelected
                              ? "bg-white/10 text-white"
                              : isPlumb
                              ? "bg-brand-teal-100 text-brand-teal-800"
                              : "bg-brand-amber-100 text-brand-amber-800"
                          }`}
                        >
                          {isPlumb ? <Droplets className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-brand-amber-400 text-brand-grey-950"
                              : "bg-brand-grey-100 text-brand-grey-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <span className="font-bold text-sm leading-snug">
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Diagnostic Explanation Preview */}
              <div className="p-4 rounded-2xl bg-white border border-brand-teal-100 text-xs text-brand-grey-700 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 font-bold text-brand-teal-900">
                  <ShieldCheck className="w-4 h-4 text-brand-teal-600" />
                  <span>How our dispatch desk diagnoses this:</span>
                </div>
                <p className="text-brand-grey-600 leading-relaxed text-[11px] sm:text-xs">
                  {activeCase.diagnosis}
                </p>
              </div>
            </div>

            {/* Right Column: 1-Tap WhatsApp Action */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-brand-teal-900 via-brand-teal-950 to-brand-grey-950 text-white space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Instant WhatsApp Quote</h3>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                      <Clock className="w-3 h-3" />
                      <span>Typical response: &lt; 2 mins</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 text-xs text-brand-teal-100 leading-relaxed">
                  <p className="font-semibold text-white mb-1">💬 Pre-filled Message:</p>
                  <p className="italic text-[11px] text-brand-teal-200 line-clamp-3">
                    &ldquo;{activeCase.samplePrompt}&rdquo;
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5">
                <a
                  href={customWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Send Photo on WhatsApp (1-Tap)</span>
                </a>

                <a
                  href={genericWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-brand-amber-300" />
                  <span>Send Custom Video / Photo</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* 3 Step Micro Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto text-center text-xs text-brand-grey-600">
          <div className="p-3 bg-white/80 rounded-2xl border border-brand-grey-200">
            <span className="font-bold text-brand-teal-800 block text-sm mb-0.5">1. Snap Photo</span>
            <span>Take a quick photo of your broken tap or switch</span>
          </div>
          <div className="p-3 bg-white/80 rounded-2xl border border-brand-grey-200">
            <span className="font-bold text-brand-teal-800 block text-sm mb-0.5">2. Get Quote</span>
            <span>Receive an upfront labor estimate in 2 minutes</span>
          </div>
          <div className="p-3 bg-white/80 rounded-2xl border border-brand-grey-200">
            <span className="font-bold text-brand-teal-800 block text-sm mb-0.5">3. Pro Dispatched</span>
            <span>Gate-cleared pro arrives with genuine parts</span>
          </div>
        </div>

      </div>
    </section>
  );
}
