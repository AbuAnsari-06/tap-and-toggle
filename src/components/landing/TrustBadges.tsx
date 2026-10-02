import React from "react";
import { SITE_CONFIG } from "@/config/site";
import { Clock, Tag, ShieldCheck, UserCheck, CheckCircle2 } from "lucide-react";

const ICONS = [Clock, Tag, ShieldCheck, UserCheck, CheckCircle2];

export function TrustBadges() {
  return (
    <section className="py-12 bg-white border-b border-brand-grey-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-teal-700">
            Neighbourhood Guarantee
          </h2>
          <p className="text-2xl font-bold text-brand-grey-900 mt-1">
            Why residents trust Tap & Toggle
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SITE_CONFIG.trustBadges.map((badge, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-brand-grey-50/70 border border-brand-grey-200 hover:border-brand-teal-300 hover:bg-brand-teal-50/30 transition-all duration-200 flex flex-col items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-brand-grey-200/80 flex items-center justify-center text-brand-teal-700 shadow-sm shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-grey-900 leading-snug">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-brand-grey-600 mt-1 leading-relaxed">
                    {badge.description}
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
