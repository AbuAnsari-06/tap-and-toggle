"use client";

import React, { useState } from "react";
import { RATE_CARD_ITEMS, RATE_CARD_POLICY } from "@/config/rates";
import { Droplets, Zap, ShieldAlert, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function RateCard() {
  const [activeTab, setActiveTab] = useState<"all" | "plumbing" | "electrical">("all");
  const cleanNumber = SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");

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
            Upfront &amp; Transparent
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-grey-900 tracking-tight">
            Clear, Standard Rate Card
          </h2>
          <p className="text-base text-brand-grey-600 mt-2">
            Know the labor cost before you book. 1-click book any service on WhatsApp or via our booking form.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-brand-grey-200/80 border border-brand-grey-300/60 shadow-inner">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-brand-grey-900 shadow-sm"
                  : "text-brand-grey-600 hover:text-brand-grey-900"
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setActiveTab("plumbing")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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

        {/* Rate Items Grid with Direct 1-Click WhatsApp Booking */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredItems.map((item) => {
            const isPlumbing = item.category === "plumbing";
            const priceText = item.priceType === "fixed" ? `₹${item.price}` : "Free Estimate";
            const waBookingUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
              `Hi Tap & Toggle! I would like to book: *${item.title}* (${priceText}). When is the earliest a vetted technician can visit my society flat?`
            )}`;

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
                        Popular
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

                <div className="pt-4 mt-4 border-t border-brand-grey-100 flex items-center justify-between gap-2">
                  <div>
                    {item.priceType === "fixed" ? (
                      <div>
                        <span className="text-[11px] text-brand-grey-400 block font-medium">Standard Labor</span>
                        <span className="text-lg sm:text-xl font-extrabold text-brand-grey-900">₹{item.price}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[11px] text-brand-amber-700 font-bold block">Free Estimate</span>
                        <span className="text-[11px] text-brand-grey-500">Visit ₹199 (waived on booking)</span>
                      </div>
                    )}
                  </div>

                  {/* 1-Click WhatsApp Action and Web Booking */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={waBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-transform hover:scale-105 active:scale-95"
                      title="Book this specific service instantly on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href="#booking-form"
                      className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-brand-grey-100 hover:bg-brand-teal-50 hover:text-brand-teal-900 text-xs font-semibold text-brand-grey-700 transition-colors"
                      title="Book via on-site request form"
                    >
                      <span>Form</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
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
                Transparent Parts &amp; Warranty Policy
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
