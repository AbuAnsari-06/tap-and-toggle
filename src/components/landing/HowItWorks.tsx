import React from "react";
import { Send, Calculator, UserCheck, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Send,
    title: "1-Tap Request",
    description: "Tell us what's leaking or sparking and your preferred time slot in under a minute.",
    color: "teal",
  },
  {
    number: "02",
    icon: Calculator,
    title: "Free Upfront Estimate",
    description: "We diagnose the repair and confirm the exact quote before any tool touches your fixture.",
    color: "amber",
  },
  {
    number: "03",
    icon: UserCheck,
    title: "Gate-Cleared Pro Arrives",
    description: "A vetted, ID-verified local pro arrives at your flat on time with the right equipment.",
    color: "teal",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Pay After It's Fixed",
    description: "Inspect the repair, pay one transparent bill via UPI, backed by our 7-day warranty.",
    color: "amber",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-brand-grey-50/50 border-b border-brand-grey-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-brand-teal-100 text-brand-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            Simple & Accountable
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-grey-900 tracking-tight">
            How Tap & Toggle works
          </h2>
          <p className="text-base text-brand-grey-600 mt-2">
            No endless phone calls, no mystery pricing. Just reliable neighborhood service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isTeal = step.color === "teal";
            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-6 border border-brand-grey-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Step Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                      isTeal
                        ? "bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200"
                        : "bg-brand-amber-50 text-brand-amber-700 border border-brand-amber-200"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-brand-grey-300 font-mono">
                    {step.number}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-brand-grey-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-brand-grey-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
