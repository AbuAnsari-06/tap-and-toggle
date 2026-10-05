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

      {/* Mandatory Legal Status & Platform Model Banner */}
      <div className="p-4 mb-8 rounded-2xl bg-brand-teal-50 border border-brand-teal-300 text-brand-teal-950 text-xs sm:text-sm font-medium flex items-start gap-3 shadow-sm">
        <span className="px-2 py-0.5 rounded bg-brand-teal-700 text-white font-bold uppercase text-[10px] shrink-0 mt-0.5">
          Platform Model
        </span>
        <span className="leading-relaxed">
          <strong>Service Facilitation Notice:</strong> {SITE_CONFIG.name} is a technology and service booking facilitation platform connecting residential communities with independent, verified trade technicians. On-site physical services are performed directly by independent service pros.
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
            Effective: October 2026 · Professional service facilitation &amp; dispatch platform for apartment communities
          </p>
        </div>

        {/* 1. Platform Role & Nature of Services */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-grey-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-brand-teal-700" />
            <span>1. Platform Role &amp; Nature of Services</span>
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            {SITE_CONFIG.name} (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;) operates as a technology-enabled service facilitation and dispatch platform connecting residents of housing societies with independent, verified trade technicians (plumbers and electricians) across {SITE_CONFIG.serviceArea}.
          </p>
          <div className="p-4 rounded-xl bg-brand-grey-50 border border-brand-grey-200 text-xs text-brand-grey-700 space-y-2">
            <p>
              <strong>Independent Contractor Relationship:</strong> Dispatched technicians are independent skilled trade professionals and are not employees, agents, or joint venturers of {SITE_CONFIG.name}. The physical execution of diagnosis, installation, repair, and replacement is contracted directly between the customer and the dispatched technician.
            </p>
            <p>
              <strong>Platform Scope:</strong> {SITE_CONFIG.name}&apos;s responsibilities are strictly confined to: (a) verifying technician identity, background documents, and skills before bench admission, (b) standardizing upfront pricing and rate schedules, (c) coordinating society gate clearances, (d) managing invoicing and consolidated payment settlement, and (e) facilitating customer support and our 7-day labor rework policy.
            </p>
          </div>
        </section>

        {/* 2. Free Estimates & Visit Charge */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-brand-grey-900">
            2. Estimates &amp; Transparent Pricing
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
            3. Parts Sourcing &amp; Manufacturer Warranties
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            When replacement hardware (e.g. taps, valves, modular switches, capacitors) is required, technicians source genuine parts from local vendor stores. You will receive <strong>one consolidated bill</strong> containing:
          </p>
          <ol className="space-y-1.5 text-sm text-brand-grey-700 pl-4 list-decimal">
            <li>Standard labor service charge as per our rate card.</li>
            <li>Hardware/parts billed strictly at actual store receipt value.</li>
            <li>A nominal arrangement/procurement fee (capped at ₹30).</li>
          </ol>
          <p className="text-xs text-brand-grey-500 mt-1 italic">
            Note: Neither {SITE_CONFIG.name} nor the technician manufactures hardware components. Any warranty on parts, fixtures, or materials is provided solely by the respective manufacturer or retail vendor.
          </p>
        </section>

        {/* 4. 7-Day Workmanship Rework Policy */}
        <section className="p-5 rounded-2xl bg-brand-teal-50/70 border border-brand-teal-200 space-y-2">
          <div className="flex items-center gap-2 text-brand-teal-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-brand-teal-700" />
            <span>4. 7-Day Workmanship Rework Policy</span>
          </div>
          <p className="text-xs sm:text-sm text-brand-teal-950 leading-relaxed">
            To ensure complete peace of mind, {SITE_CONFIG.name} coordinates a <strong>7-day workmanship labor rework guarantee</strong> on completed tickets. If the exact repair performed fails or leaks within 7 calendar days due to a workmanship defect, {SITE_CONFIG.name} will arrange a priority re-inspection and corrective repair by a technician at zero additional labor cost.
          </p>
          <p className="text-xs text-brand-teal-900/80 leading-relaxed font-medium">
            This rework coordination is the exclusive remedy provided by the platform for service quality claims.
          </p>
        </section>

        {/* 5. Limitation of Responsibility & Liability Disclaimer */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-grey-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-brand-amber-600" />
            <span>5. Disclaimer of Direct Execution Responsibility &amp; Liability Cap</span>
          </h2>
          <div className="text-sm text-brand-grey-600 space-y-2.5 leading-relaxed">
            <p>
              <strong>Execution by Independent Technicians:</strong> Because physical services are executed directly by independent technicians, {SITE_CONFIG.name} disclaims all direct or vicarious liability for the physical craftsmanship, conduct, or omissions of technicians beyond our stated 7-day labor rework policy.
            </p>
            <p>
              <strong>Pre-Existing &amp; Concealed Infrastructure:</strong> Neither {SITE_CONFIG.name} nor dispatched technicians shall be held liable for damage stemming from pre-existing, latent, or concealed building defects, including corroded internal concealed plumbing, aged wiring insulation, brittle tiles, abnormal municipal water pressure surges, or power grid voltage spikes.
            </p>
            <p>
              <strong>Consequential Damages:</strong> To the maximum extent permitted under applicable law, {SITE_CONFIG.name} shall not be liable for any indirect, incidental, punitive, or consequential damages, including water seepage damage, appliance downtime, or electrical outages.
            </p>
            <p className="p-3 rounded-xl bg-brand-amber-50 border border-brand-amber-200 text-xs font-semibold text-brand-amber-950">
              <strong>Total Liability Cap:</strong> In all events, {SITE_CONFIG.name}&apos;s aggregate liability arising out of or related to any booking shall be strictly capped at the total amount actually paid by the customer for that specific booking ticket.
            </p>
          </div>
        </section>

        {/* 6. Prohibition of Off-Platform Work */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-brand-grey-900">
            6. Official Dispatch &amp; Prohibition of Off-Platform Work
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            All service requests must be placed and logged through official {SITE_CONFIG.name} channels (our website or verified WhatsApp hotline). If a customer engages a technician for additional private, unrecorded work off-platform, such arrangements are entirely at the customer&apos;s own risk and are strictly excluded from platform support, receipts, invoicing, gate clearances, and warranty protection.
          </p>
        </section>

        {/* 7. Complaint Process (SOP) */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-brand-grey-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-teal-700" />
            <span>7. Feedback &amp; Dispute Resolution SOP</span>
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            If you encounter any dissatisfaction with service scheduling, billing, or technician conduct:
          </p>
          <ol className="space-y-1.5 text-sm text-brand-grey-700 pl-4 list-decimal">
            <li>Message our support channel on WhatsApp within 7 days of the completed job.</li>
            <li>Our dispatch manager will review the job sheet, photos, parts receipts, and notes.</li>
            <li>A priority re-inspection or resolution will be coordinated within 24 hours.</li>
          </ol>
        </section>

        {/* Footer info */}
        <div className="border-t border-brand-grey-200 pt-6 text-xs text-brand-grey-500">
          <p>For legal queries regarding these terms, contact {SITE_CONFIG.name} at {SITE_CONFIG.WHATSAPP_NUMBER} or support@tapandtoggle.in.</p>
        </div>

      </div>
    </div>
  );
}
