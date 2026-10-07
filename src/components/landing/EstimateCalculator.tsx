"use client";

import React, { useState } from "react";
import { Calculator, Plus, Minus, MessageSquare, ArrowRight, ShieldCheck, Check, RotateCcw } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

interface CalculableItem {
  id: string;
  category: "plumbing" | "electrical";
  title: string;
  price: number;
  unit: string;
}

const CALCULATOR_ITEMS: CalculableItem[] = [
  { id: "tap", category: "plumbing", title: "Tap / Mixer Repair & Cartridge", price: 149, unit: "tap" },
  { id: "flush", category: "plumbing", title: "Flush Tank / Cistern Leakage", price: 249, unit: "tank" },
  { id: "jet", category: "plumbing", title: "Jet Spray / Angle Valve Fitting", price: 99, unit: "valve" },
  { id: "switch", category: "electrical", title: "Switch / Socket / MCB Breaker", price: 99, unit: "point" },
  { id: "fan", category: "electrical", title: "Ceiling Fan Installation & Regulator", price: 199, unit: "fan" },
  { id: "light", category: "electrical", title: "LED Light / Batten / Exhaust Fitting", price: 149, unit: "fixture" },
];

export function EstimateCalculator() {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    tap: 0,
    flush: 0,
    jet: 0,
    switch: 0,
    fan: 0,
    light: 0,
  });

  const cleanNumber = SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const resetAll = () => {
    setQuantities({
      tap: 0,
      flush: 0,
      jet: 0,
      switch: 0,
      fan: 0,
      light: 0,
    });
  };

  const selectedItems = CALCULATOR_ITEMS.filter((item) => (quantities[item.id] || 0) > 0);
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 0),
    0
  );
  const totalItemCount = selectedItems.reduce(
    (sum, item) => sum + (quantities[item.id] || 0),
    0
  );

  const bundleSummaryString = selectedItems
    .map((item) => `${quantities[item.id]}x ${item.title} (₹${item.price * quantities[item.id]})`)
    .join(", ");

  const waBundleUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    `Hi Tap & Toggle! I calculated an estimate bundle on your website:
📋 *Services Selected:* ${bundleSummaryString || "Custom Estimate"}
💰 *Estimated Labor Total:* ₹${totalAmount}
🛡️ *7-Day Warranty Included*

When is the earliest a vetted technician can visit my society flat?`
  )}`;

  return (
    <section className="py-16 bg-white border-b border-brand-grey-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-amber-100 text-brand-amber-900 border border-brand-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5 text-brand-amber-700" />
            <span>Multi-Item Cost Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-grey-900 tracking-tight">
            Calculate Your Upfront Estimate
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brand-grey-600 leading-relaxed max-w-xl mx-auto">
            Have multiple repairs needed around your apartment? Select your items below to calculate your estimated labor bill before booking.
          </p>
        </div>

        {/* Calculator Widget Container */}
        <div className="bg-brand-grey-50 rounded-3xl border-2 border-brand-teal-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Items Selector List */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 border-b lg:border-b-0 lg:border-r border-brand-grey-200 bg-white">
              <div className="flex items-center justify-between pb-2 border-b border-brand-grey-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-grey-500">
                  Select repair items:
                </span>
                {totalItemCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-xs text-brand-grey-500 hover:text-brand-grey-900 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {CALCULATOR_ITEMS.map((item) => {
                  const qty = quantities[item.id] || 0;
                  const isPlumb = item.category === "plumbing";
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        qty > 0
                          ? "bg-brand-teal-50/70 border-brand-teal-400 shadow-xs"
                          : "bg-white border-brand-grey-200 hover:border-brand-grey-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isPlumb ? "bg-brand-teal-600" : "bg-brand-amber-500"
                          }`}
                        />
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-brand-grey-900 leading-snug">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-brand-grey-500 font-medium">
                            ₹{item.price} / {item.unit}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded-lg bg-brand-grey-100 hover:bg-brand-grey-200 disabled:opacity-30 text-brand-grey-800 font-bold flex items-center justify-center transition cursor-pointer"
                          aria-label={`Decrease ${item.title}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-extrabold text-xs sm:text-sm text-brand-grey-900">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-brand-teal-800 hover:bg-brand-teal-700 text-white font-bold flex items-center justify-center transition cursor-pointer shadow-xs"
                          aria-label={`Increase ${item.title}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Summary & WhatsApp 1-Tap Booking Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-brand-teal-900 via-brand-teal-950 to-brand-grey-950 text-white space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-300">
                    Calculated Summary
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {totalItemCount} {totalItemCount === 1 ? "Job" : "Jobs"}
                  </span>
                </div>

                {/* Amount Highlight */}
                <div className="p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs space-y-2">
                  <span className="text-xs text-brand-teal-200 block font-medium">Estimated Labor Total:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">
                      ₹{totalAmount > 0 ? totalAmount : 0}
                    </span>
                    {totalAmount === 0 && (
                      <span className="text-xs text-brand-teal-300 italic">
                        (Select items on the left)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-brand-teal-200 leading-relaxed border-t border-white/10 pt-2">
                    Includes gate clearance, diagnostics, and 7-day warranty protection.
                  </p>
                </div>

                {/* Value Highlights */}
                <div className="space-y-1.5 text-xs text-brand-teal-100">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pay only after work is done and approved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Zero parts markup (actual receipt only)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>7-Day free workmanship revisit warranty</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <a
                  href={waBundleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                    totalAmount > 0
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-emerald-700/80 hover:bg-emerald-600 text-white"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Book this Estimate on WhatsApp</span>
                </a>

                <a
                  href="#booking-form"
                  className="w-full py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>Book via Online Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
