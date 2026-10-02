import React from "react";
import { Droplets, Zap, Check, ArrowRight } from "lucide-react";

export function ServicesSection() {
  return (
    <section className="py-16 bg-white border-b border-brand-grey-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-brand-amber-100 text-brand-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            Specialized Care
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-grey-900 tracking-tight">
            Our Two Core Services
          </h2>
          <p className="text-base text-brand-grey-600 mt-2">
            We focus exclusively on plumbing and electrical repairs so you get vetted experts who solve it right the first time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Plumbing Card ("Tap") */}
          <div className="relative bg-gradient-to-br from-brand-teal-50/50 via-white to-brand-teal-50/20 rounded-3xl p-8 border-2 border-brand-teal-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-teal-700 text-white flex items-center justify-center shadow-md">
                  <Droplets className="w-7 h-7 text-brand-teal-100" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-brand-teal-100 text-brand-teal-900 text-xs font-bold">
                  The &quot;Tap&quot; in our name
                </span>
              </div>

              <h3 className="text-2xl font-bold text-brand-teal-950 mb-3">
                Plumbing & Sanitary Repairs
              </h3>
              <p className="text-sm text-brand-grey-600 leading-relaxed mb-6">
                From persistent drippy taps to messy drain blockages, our experienced plumbers handle residential fixtures with clean precision.
              </p>

              <div className="space-y-2.5 mb-8">
                {[
                  "Leaking taps, spindles & valve replacements",
                  "Blocked sink, wash-basin & bathroom drain clearance",
                  "Flush cistern repair, syphon & ball-valve tune-ups",
                  "Geyser connection & RO filter piping extensions",
                  "Water motor priming & booster pump repairs",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-brand-grey-700">
                    <Check className="w-4 h-4 text-brand-teal-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-brand-teal-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-brand-grey-500 block">Standard repairs from</span>
                <span className="text-xl font-black text-brand-teal-900">₹150</span>
              </div>
              <a
                href="#rate-card"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal-700 hover:text-brand-teal-900 hover:underline"
              >
                <span>View Plumbing Rates</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Electrical Card ("Toggle") */}
          <div className="relative bg-gradient-to-br from-brand-amber-50/50 via-white to-brand-amber-50/20 rounded-3xl p-8 border-2 border-brand-amber-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-amber-500 text-white flex items-center justify-center shadow-md">
                  <Zap className="w-7 h-7 text-white fill-white" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-brand-amber-100 text-brand-amber-900 text-xs font-bold">
                  The &quot;Toggle&quot; in our name
                </span>
              </div>

              <h3 className="text-2xl font-bold text-brand-amber-950 mb-3">
                Electrical & Appliance Points
              </h3>
              <p className="text-sm text-brand-grey-600 leading-relaxed mb-6">
                Safe, certified diagnostics for sparking boards, tripping breakers, ceiling fan fittings, and home electrical wiring.
              </p>

              <div className="space-y-2.5 mb-8">
                {[
                  "Switch, socket & modular plate replacements",
                  "Tripping MCB diagnosis & main breaker changes",
                  "Switchboard sparking & neutral fault rectifications",
                  "Ceiling fan installation, regulator & capacitor fixes",
                  "Inverter bypass points & concealed wire repair",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-brand-grey-700">
                    <Check className="w-4 h-4 text-brand-amber-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-brand-amber-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-brand-grey-500 block">Standard repairs from</span>
                <span className="text-xl font-black text-brand-amber-900">₹120</span>
              </div>
              <a
                href="#rate-card"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-amber-700 hover:text-brand-amber-900 hover:underline"
              >
                <span>View Electrical Rates</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
