"use client";

import React, { useState } from "react";
import { RATE_CARD_ITEMS, RATE_CARD_POLICY } from "@/config/rates";
import { Droplets, Zap, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

export function RateCard() {
  const [activeTab, setActiveTab] = useState<"all" | "plumbing" | "electrical">("all");

  const filteredItems = RATE_CARD_ITEMS.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  return (
    <section id="rate-card" className="py-16 bg-brand-grey-50 border-b border-brand-grey-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-brand-teal-100 text-brand-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            Upfront & Transparent
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-grey-900 tracking-tight">
            Clear, Standard Rate Card
          </h2>
          <p className="text-base text-brand-grey-600 mt-2">
            Know the labor cost before you book. No hidden doorstep surprises.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-brand-grey-200/80 border border-brand-grey-300/60 shadow-inner">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "all"
                  ? "bg-white text-brand-grey-900 shadow-sm"
                  : "text-brand-grey-600 hover:text-brand-grey-900"
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setActiveTab("plumbing")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "plumbing"
                  ? "bg-brand-teal-700 text-white shadow-sm"
                  : "text-brand-grey-600 hover:text-brand-teal-800"
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span>Plumbing (&quot;Tap&quot;)</span>
            </button>
            <button
              onClick={() => setActiveTab("electrical")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "electrical"
                  ? "bg-brand-amber-500 text-white shadow-sm"
                  : "text-brand-grey-600 hover:text-brand-amber-800"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Electrical (&quot;Toggle&quot;)</span>
            </button>
          </div>
        </div>

        {/* Rate Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredItems.map((item) => {
            const isPlumbing = item.category === "plumbing";
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-brand-grey-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isPlumbing
                          ? "bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-100"
                          : "bg-brand-amber-50 text-brand-amber-800 border border-brand-amber-100"
                      }`}
                    >
                      {isPlumbing ? <Droplets className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                      <span>{isPlumbing ? "Plumbing" : "Electrical"}</span>
                    </span>

                    {item.popular && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold uppercase tracking-wider">
                        Common
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-brand-grey-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-brand-grey-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-brand-grey-100 flex items-center justify-between">
                  <div>
                    {item.priceType === "fixed" ? (
                      <div>
                        <span className="text-xs text-brand-grey-400 block font-medium">Standard price</span>
                        <span className="text-xl font-extrabold text-brand-grey-900">₹{item.price}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs text-brand-amber-700 font-bold block">Free estimate</span>
                        <span className="text-xs text-brand-grey-500">Visit ₹199 (waived if you book)</span>
                      </div>
                    )}
                  </div>

                  <a
                    href="#booking-form"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-grey-100 hover:bg-brand-teal-50 hover:text-brand-teal-800 text-xs font-bold text-brand-grey-700 transition-colors"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Policy & Transparency Callout Banner */}
        <div className="bg-white rounded-2xl p-6 border-2 border-brand-teal-900/10 shadow-sm max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-teal-50 border border-brand-teal-200 flex items-center justify-center text-brand-teal-700 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-brand-grey-900">
                Transparent Parts & Warranty Policy
              </h4>
              <p className="text-xs text-brand-grey-600 leading-relaxed">
                {RATE_CARD_POLICY.partsPolicy} {RATE_CARD_POLICY.summaryNote}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-brand-teal-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal-600" />
                <span>Zero markup on pro-sourced hardware receipts</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
