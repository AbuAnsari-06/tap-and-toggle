"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { FAQS } from "@/config/faq";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-brand-grey-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal-50 border border-brand-teal-100 text-brand-teal-800 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-brand-teal-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-teal-950 tracking-tight">
            Everything you need to know about our home service
          </h2>
          <p className="mt-2 text-sm text-brand-grey-600">
            Clear answers about technician vetting, gate permissions, spare parts receipts, and the 7-day warranty.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-brand-grey-200 bg-brand-grey-50/50 overflow-hidden transition-all duration-200 hover:border-brand-teal-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-brand-teal-950">
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-brand-teal-700 text-white rotate-180"
                        : "bg-white text-brand-grey-500 border border-brand-grey-200"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-brand-grey-600 leading-relaxed border-t border-brand-grey-100 animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Support Prompt */}
        <div className="mt-10 p-6 rounded-3xl bg-brand-teal-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-base font-bold leading-tight">Have a custom repair question?</h3>
            <p className="text-xs text-brand-teal-200 mt-0.5">
              Our NIBM dispatch team replies within minutes on WhatsApp.
            </p>
          </div>
          <a
            href="https://wa.me/918050959001?text=Hi%20Tap%20%26%20Toggle!%20I%20have%20a%20question%20about%20a%20repair%20in%20my%20society."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-400 text-black font-bold text-xs shadow-md transition shrink-0"
          >
            Ask Operations on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
