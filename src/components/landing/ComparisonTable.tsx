"use client";

import React from "react";
import { Check, X, AlertTriangle, ShieldCheck, Sparkles, MessageSquare, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

interface ComparisonRow {
  feature: string;
  category: string;
  tapAndToggle: {
    text: string;
    sub: string;
    positive: boolean;
  };
  urbanCompany: {
    text: string;
    sub: string;
    status: "negative" | "neutral";
  };
  localHandyman: {
    text: string;
    sub: string;
    status: "negative" | "neutral";
  };
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    feature: "Gate Clearance & Security",
    category: "Safety",
    tapAndToggle: {
      text: "Pre-Approved Society Roster",
      sub: "Aadhaar verified, police cleared & recognized by guards",
      positive: true,
    },
    urbanCompany: {
      text: "Random Outsider Every Visit",
      sub: "Unknown technicians dispatched from across Pune",
      status: "neutral",
    },
    localHandyman: {
      text: "No Identity Records",
      sub: "No background verification or police registry",
      status: "negative",
    },
  },
  {
    feature: "Pricing & Doorstep Fees",
    category: "Pricing",
    tapAndToggle: {
      text: "Free Upfront Quote",
      sub: "Clear rate card · No surge pricing · Zero hidden fees",
      positive: true,
    },
    urbanCompany: {
      text: "Surge & Convenience Fees",
      sub: "Platform booking charges + mandatory inspection fees",
      status: "negative",
    },
    localHandyman: {
      text: "Unpredictable Haggling",
      sub: "Price changes on-site based on flat size/urgency",
      status: "negative",
    },
  },
  {
    feature: "Workmanship Warranty",
    category: "Accountability",
    tapAndToggle: {
      text: "7-Day Free Revisit Warranty",
      sub: "Accountable platform certificate with single WhatsApp ticket",
      positive: true,
    },
    urbanCompany: {
      text: "Complex Dispute Process",
      sub: "Multi-day ticket queues & strict app dispute clauses",
      status: "neutral",
    },
    localHandyman: {
      text: "Zero Warranty",
      sub: "Vanishes after payment · No revisit commitment",
      status: "negative",
    },
  },
  {
    feature: "Communication Speed",
    category: "Convenience",
    tapAndToggle: {
      text: "2-Min Human WhatsApp Desk",
      sub: "Direct operator chat with live tracking link",
      positive: true,
    },
    urbanCompany: {
      text: "Automated Chatbots & IVR",
      sub: "Lengthy automated decision trees and delays",
      status: "negative",
    },
    localHandyman: {
      text: "Hard to Reach",
      sub: "Phone often switched off or delayed with \"coming tomorrow\"",
      status: "negative",
    },
  },
  {
    feature: "Spare Parts Billing",
    category: "Transparency",
    tapAndToggle: {
      text: "Actual Shop Receipts Only",
      sub: "Zero parts markup · You only pay genuine hardware cost",
      positive: true,
    },
    urbanCompany: {
      text: "Marked-Up App Inventory",
      sub: "Pre-set internal part pricing often higher than market",
      status: "neutral",
    },
    localHandyman: {
      text: "Duplicate Parts Risk",
      sub: "No hardware bill or warranty guarantee on spares",
      status: "negative",
    },
  },
];

export function ComparisonTable() {
  const cleanNumber = SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");

  return (
    <section className="py-16 bg-white border-b border-brand-grey-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-teal-100 text-brand-teal-900 border border-brand-teal-200 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-teal-700" />
            <span>The Hyperlocal Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-grey-900 tracking-tight">
            How Tap &amp; Toggle Compares
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brand-grey-600 leading-relaxed max-w-xl mx-auto">
            The safety and gate accountability of an organized platform, without the surge pricing or robotic chatbots of large aggregators.
          </p>
        </div>

        {/* Comparison Table Desktop & Tablet Container */}
        <div className="overflow-x-auto rounded-3xl border-2 border-brand-teal-100 shadow-xl bg-white">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-brand-grey-200">
                <th className="p-5 bg-brand-grey-50 text-xs font-extrabold text-brand-grey-600 uppercase tracking-wider w-1/4">
                  Feature / Guarantee
                </th>
                <th className="p-5 bg-gradient-to-b from-brand-teal-900 to-brand-teal-800 text-white w-2/5 shadow-md relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-amber-300 block">
                        Hyperlocal NIBM
                      </span>
                      <span className="text-base sm:text-lg font-black">{SITE_CONFIG.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-extrabold uppercase">
                      Recommended
                    </span>
                  </div>
                </th>
                <th className="p-5 bg-brand-grey-100/70 text-brand-grey-800 text-xs sm:text-sm font-bold w-1/4">
                  Urban Company / Apps
                </th>
                <th className="p-5 bg-brand-grey-50 text-brand-grey-700 text-xs sm:text-sm font-bold w-1/4">
                  Corner / Informal Handyman
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-grey-100 text-xs sm:text-sm">
              {COMPARISON_DATA.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors hover:bg-brand-teal-50/20 ${
                    idx % 2 === 0 ? "bg-white" : "bg-brand-grey-50/40"
                  }`}
                >
                  {/* Feature Label */}
                  <td className="p-5 font-bold text-brand-grey-900 align-top">
                    <span>{row.feature}</span>
                    <span className="block text-[10px] text-brand-grey-400 font-semibold uppercase mt-0.5">
                      {row.category}
                    </span>
                  </td>

                  {/* Tap & Toggle Column (Highlighted) */}
                  <td className="p-5 bg-brand-teal-50/50 border-x-2 border-brand-teal-500/30 text-brand-teal-950 align-top">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <strong className="block font-black text-xs sm:text-sm text-brand-teal-950">
                          {row.tapAndToggle.text}
                        </strong>
                        <span className="text-[11px] sm:text-xs text-brand-teal-900/80 leading-relaxed block mt-0.5">
                          {row.tapAndToggle.sub}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Urban Company Column */}
                  <td className="p-5 text-brand-grey-700 align-top">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-brand-grey-800 block">
                          {row.urbanCompany.text}
                        </span>
                        <span className="text-[11px] text-brand-grey-500 block mt-0.5">
                          {row.urbanCompany.sub}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Local Corner Handyman */}
                  <td className="p-5 text-brand-grey-600 align-top">
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-brand-grey-700 block">
                          {row.localHandyman.text}
                        </span>
                        <span className="text-[11px] text-brand-grey-500 block mt-0.5">
                          {row.localHandyman.sub}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-8 p-6 rounded-3xl bg-brand-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold">
              Ready for accountable, gate-cleared repairs in your society?
            </h4>
            <p className="text-xs text-brand-teal-200">
              Get an upfront estimate in 2 minutes on WhatsApp before any technician visit.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent("Hi Tap & Toggle! I would like to get a free estimate for a repair in my flat.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
              <span>WhatsApp Us (1-Tap)</span>
            </a>

            <a
              href="#booking-form"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-brand-amber-500 hover:bg-brand-amber-600 text-brand-grey-950 font-bold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Book a Pro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
