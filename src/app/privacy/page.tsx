import React from "react";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/config/site";
import { ShieldCheck, Lock, Trash2, Camera, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Privacy Policy — ${SITE_CONFIG.name}`,
  description: "Plain language privacy policy and DPDP Act 2023 compliance notice.",
};

export default function PrivacyPage() {
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
          <strong>DRAFT: pending lawyer review.</strong> Provided for operational transparency under the Digital Personal Data Protection (DPDP) Act 2023.
        </span>
      </div>

      <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-brand-grey-200 shadow-sm text-brand-grey-800">
        
        {/* Header */}
        <div className="border-b border-brand-grey-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-50 text-brand-teal-800 text-xs font-bold uppercase tracking-wide mb-2">
            <ShieldCheck className="w-4 h-4 text-brand-teal-600" />
            <span>DPDP Act 2023 Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-grey-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-brand-grey-500 mt-1">
            Last updated: October 2026 · Plain language notice for apartment residents
          </p>
        </div>

        {/* 1. Introduction */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-brand-grey-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-teal-700" />
            <span>1. Our Privacy Commitment</span>
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            {SITE_CONFIG.name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your personal information. This Privacy Policy explains in plain, non-technical language what data we collect from apartment residents in {SITE_CONFIG.serviceArea}, why we collect it, how it is safeguarded, and how you can exercise your rights under India&apos;s <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>.
          </p>
        </section>

        {/* 2. What We Collect */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-grey-900">
            2. Personal Data We Collect
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            We only collect data strictly required to deliver plumbing and electrical repairs to your residence:
          </p>
          <ul className="space-y-2 text-sm text-brand-grey-700 pl-4 list-disc">
            <li><strong>Full Name:</strong> To address you and coordinate gate entry permissions.</li>
            <li><strong>Phone Number (WhatsApp/Call):</strong> Our primary channel for diagnostic quotes, free estimates, dispatch updates, and billing.</li>
            <li><strong>Flat / Unit Number & Housing Society:</strong> To route our vetted technician to your doorstep and comply with society security gates.</li>
            <li><strong>Repair Description:</strong> Technical details of the leak, electrical fault, or requested maintenance.</li>
            <li><strong>Optional Fixture Photos:</strong> Images submitted by you to assist diagnosis.</li>
          </ul>
        </section>

        {/* 3. Photo Notice */}
        <section className="p-5 rounded-2xl bg-brand-teal-50/70 border border-brand-teal-200 space-y-2">
          <div className="flex items-center gap-2 text-brand-teal-900 font-bold text-sm">
            <Camera className="w-5 h-5 text-brand-teal-700" />
            <span>3. Home Job Photos (Work Proof Only)</span>
          </div>
          <p className="text-xs sm:text-sm text-brand-teal-950 leading-relaxed">
            Any photos of fixtures, before/after repairs, or replacement parts submitted by you or captured by our technicians are used <strong>strictly as technical work proof, warranty verification, and transparent parts receipts</strong>. We never publish or use private residential photos for public marketing without your explicit written permission.
          </p>
        </section>

        {/* 4. Purpose & Non-Disclosure */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-brand-grey-900">
            4. Purpose of Data Processing
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            Your contact details are processed strictly for:
          </p>
          <ul className="space-y-1.5 text-sm text-brand-grey-700 pl-4 list-disc">
            <li>Providing free estimates and confirming repair appointment slots.</li>
            <li>Dispatching vetted, gate-cleared technicians.</li>
            <li>Delivering one consolidated digital bill after repair completion.</li>
            <li>Recording and honoring your 7-day workmanship warranty.</li>
          </ul>
          <p className="text-sm text-brand-grey-600 leading-relaxed pt-1">
            <strong>We do not sell, rent, or trade resident contact information to advertisers, marketing brokers, or external third parties.</strong>
          </p>
        </section>

        {/* 5. Data Retention & Deletion */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-brand-grey-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-brand-teal-700" />
            <span>5. Data Retention & Your Right to Erasure</span>
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            We retain your booking history and consent records for the duration of the active repair and the 7-day warranty window, and as necessary for accounting compliance.
          </p>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            Under the DPDP Act 2023, you have the right to request deletion of your customer record at any time. Simply send a WhatsApp message to our support line or email us.
          </p>
        </section>

        {/* 6. Contact */}
        <section className="border-t border-brand-grey-200 pt-6">
          <h2 className="text-lg font-bold text-brand-grey-900 flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-brand-teal-700" />
            <span>6. Contact & Grievance Redressal</span>
          </h2>
          <p className="text-sm text-brand-grey-600 leading-relaxed">
            If you have questions about this policy or wish to request data deletion, contact our team:
          </p>
          <div className="mt-3 text-xs sm:text-sm text-brand-grey-700 space-y-1">
            <p><strong>Brand:</strong> {SITE_CONFIG.name}</p>
            <p><strong>WhatsApp Support:</strong> {SITE_CONFIG.WHATSAPP_NUMBER}</p>
            <p><strong>Email:</strong> privacy@tapandtoggle.in (Placeholder)</p>
            <p><strong>Service Area:</strong> {SITE_CONFIG.serviceArea}</p>
          </div>
        </section>

      </div>
    </div>
  );
}
