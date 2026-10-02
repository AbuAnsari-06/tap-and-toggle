import React from "react";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/config/site";
import { ShieldCheck, FileText, Wrench, AlertCircle, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Terms of Service — ${SITE_CONFIG.name}`,
  description: "Terms of service, estimate guidelines, billing rules, and 7-day warranty terms.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal-700 hover:text-brand-teal-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Mandatory Top Draft Banner */}
      <div className="p-4 mb-8 rounded-2xl bg-brand-amber-50 border border-brand-amber-300 text-brand-amber-900 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-sm">
        <span className="px-2 py-0.5 rounded bg-brand-amber-200 text-brand-amber-950 font-bold uppercase text-[10px] shrink-0">
          Notice
        </span>
        <span>
          <strong>DRAFT: pending lawyer review.</strong> Standard terms for residential repair services.
        </span>
      </div>

      <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-brand-grey-200 shadow-sm text-brand-grey-800">
        
        {/* Header */}
        <div className="border-b border-brand-grey-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-50 text-brand-teal-800 text-xs font-bold uppercase tracking-wide mb-2">
            <FileText className="w-4 h-4 text-brand-teal-600" />
            <span>Customer Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-grey-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-brand-grey-500 mt-1">
            Effective: October 2026 · Managed home service dispatch for apartment communities
          </p>
        </div>

        {/* 1. Service Description */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-brand-grey-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-brand-teal-700" />
            <span>1. Service Description & Scope</span>
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            {SITE_CONFIG.name} provides managed home repair services exclusively for <strong>Plumbing</strong> and <strong>Electrical</strong> maintenance across residential housing societies in {SITE_CONFIG.serviceArea}. {SITE_CONFIG.name} operates as the accountable merchant of record for all bookings dispatched through our website or official WhatsApp channel.
          </p>
        </section>

        {/* 2. Free Estimates & Visit Charge */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-brand-grey-900">
            2. Estimates & Transparent Pricing
          </h2>
          <ul className="space-y-2 text-sm text-brand-grey-700 pl-4 list-disc">
            <li>
              <strong>Free Upfront Estimates:</strong> For all standard and variable tasks, an upfront price estimate is provided before repair work begins. Work starts only after your explicit approval.
            </li>
            <li>
              <strong>Inspection Policy:</strong> Standard diagnostics and visits are covered under a nominal ₹199 inspection charge, which is <strong>100% waived/adjusted</strong> into your final invoice when you proceed with the repair.
            </li>
            <li>
              <strong>No Advance Payments:</strong> You pay only after the job is completed and inspected.
            </li>
          </ul>
        </section>

        {/* 3. Parts & Consolidated Billing */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-brand-grey-900">
            3. Parts Sourcing & Billing
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            When replacement hardware (e.g. taps, valves, modular switches, capacitors) is required, technicians source genuine parts from local vendor stores. You will receive <strong>one consolidated bill</strong> containing:
          </p>
          <ol className="space-y-1.5 text-sm text-brand-grey-700 pl-4 list-decimal">
            <li>Standard labor service charge as per our rate card.</li>
            <li>Hardware/parts billed strictly at actual store receipt value.</li>
            <li>A nominal arrangement/handling fee (₹20–50).</li>
          </ol>
        </section>

        {/* 4. 7-Day Workmanship Warranty */}
        <section className="p-5 rounded-2xl bg-brand-teal-50/70 border border-brand-teal-200 space-y-2">
          <div className="flex items-center gap-2 text-brand-teal-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-brand-teal-700" />
            <span>4. 7-Day Workmanship Warranty</span>
          </div>
          <p className="text-xs sm:text-sm text-brand-teal-950 leading-relaxed">
            Every completed repair carries our <strong>7-day workmanship guarantee</strong>. If the exact repair done by our technician fails or leaks within 7 calendar days, we will dispatch a technician for a priority re-inspection and fix at zero additional labor cost.
          </p>
          <p className="text-xs text-brand-teal-900/80 leading-relaxed font-medium">
            <em>Warranty Distinction:</em> Workmanship quality is warranted by {SITE_CONFIG.name}. Replacement physical parts and appliances carry the warranty provided by their respective manufacturer or vendor.
          </p>
        </section>

        {/* 5. Limitation of Liability */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-brand-grey-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-brand-amber-600" />
            <span>5. Fair Limitation of Liability</span>
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            {SITE_CONFIG.name} exercises reasonable care by vetting technician identification, police documentation, and technical experience before dispatch.
          </p>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            To the maximum extent permitted by applicable law, our total financial liability for any direct or indirect damage arising from a service visit is strictly capped at the total amount billed on the corresponding job invoice ticket.
          </p>
        </section>

        {/* 6. Complaint Process (SOP) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-brand-grey-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-teal-700" />
            <span>6. Feedback & Complaint Resolution SOP</span>
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            Your satisfaction is our priority. If you encounter any dissatisfaction with service behavior, timing, or repair quality:
          </p>
          <ol className="space-y-1.5 text-sm text-brand-grey-700 pl-4 list-decimal">
            <li>Message our support channel on WhatsApp within 7 days of the completed job.</li>
            <li>Our dispatch manager will review the job notes, photos, and invoice.</li>
            <li>A priority resolution or re-inspection visit will be scheduled within 24 hours.</li>
          </ol>
        </section>

        {/* Footer info */}
        <div className="border-t border-brand-grey-200 pt-6 text-xs text-brand-grey-500">
          <p>For questions regarding these terms, contact {SITE_CONFIG.name} at {SITE_CONFIG.WHATSAPP_NUMBER} or support@tapandtoggle.in.</p>
        </div>

      </div>
    </div>
  );
}
