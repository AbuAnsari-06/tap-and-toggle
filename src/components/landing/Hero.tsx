import React from "react";
import { SITE_CONFIG } from "@/config/site";
import { Droplets, Zap, ShieldCheck, ArrowRight, MessageCircle, MapPin } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-teal-50/60 via-white to-brand-grey-50 pt-10 pb-14 sm:pt-16 sm:pb-20 border-b border-brand-teal-900/5">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-teal-200/20 via-brand-amber-200/15 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Hyperlocal Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal-100/80 border border-brand-teal-200 text-brand-teal-900 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
            <MapPin className="w-4 h-4 text-brand-teal-700" />
            <span>Serving NIBM, Nyati, Sus & Phase 1–2, Pune</span>
          </div>

          {/* Main Headline & Tagline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-brand-grey-900 tracking-tight leading-[1.15]">
              Your building&apos;s <span className="text-brand-teal-700 underline decoration-brand-teal-300 decoration-wavy decoration-2">plumber</span> &{" "}
              <span className="text-brand-amber-600 underline decoration-brand-amber-300 decoration-wavy decoration-2">electrician</span>
              <span className="block mt-1 sm:mt-2 text-brand-grey-800">one tap away.</span>
            </h1>

            {/* Core Promise Subtext (from Blueprint Section 4) */}
            <p className="text-base sm:text-xl text-brand-grey-600 font-medium max-w-2xl mx-auto leading-relaxed pt-2">
              Verified local pros · Free estimate before work · Pay after it&apos;s fixed · 7-day warranty
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a
              href="#booking-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-teal-700 hover:bg-brand-teal-800 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-brand-teal-500 focus:ring-offset-2 active:scale-[0.99]"
            >
              <span>Request a Visit</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-brand-grey-50 text-brand-grey-800 font-semibold text-base border border-brand-grey-200 shadow-sm transition-all hover:border-brand-grey-300 focus:ring-2 focus:ring-brand-teal-500 focus:ring-offset-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Micro Trust Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-brand-grey-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-teal-600" />
              Gate-cleared ID entry
            </span>
            <span className="hidden sm:inline text-brand-grey-300">•</span>
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-brand-teal-600" />
              Plumbing Specialists
            </span>
            <span className="hidden sm:inline text-brand-grey-300">•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-brand-amber-500 fill-brand-amber-500" />
              Certified Electricians
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
