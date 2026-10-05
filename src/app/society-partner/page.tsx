"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Wrench,
  Users,
  Send,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function SocietyPartnerPage() {
  const [societyName, setSocietyName] = useState("");
  const [locality, setLocality] = useState("NIBM Undri Road");
  const [units, setUnits] = useState("150 - 300 flats");
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("Managing Committee Member");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("Free Weekend Repair Camp for Residents");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Build WhatsApp message for direct RWA onboarding
    const text = encodeURIComponent(
      `Hi Tap & Toggle Operations! I am ${contactName} (${contactRole}) from ${societyName} (${units}, ${locality}). We are interested in: ${interest}. Let's discuss onboarding our building.`
    );
    const waUrl = `https://wa.me/918050959001?text=${text}`;

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.open(waUrl, "_blank");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-brand-grey-50 text-brand-grey-900 pb-20">
      {/* Header Banner */}
      <section className="bg-brand-teal-950 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-teal-800/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-teal-900/90 border border-brand-teal-700 text-brand-teal-300 text-xs font-semibold mb-4">
            <Building className="w-4 h-4 text-brand-amber-400" />
            <span>Society Managing Committees &amp; RWAs · NIBM Pune</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Bring Tap &amp; Toggle to Your Housing Society
          </h1>

          <p className="mt-4 text-sm sm:text-base text-brand-teal-200/90 max-w-2xl mx-auto leading-relaxed">
            Eliminate gate friction, protect residents with vetted &amp; insured technicians, receive welfare corpus contributions, and get free common-area repairs.
          </p>
        </div>
      </section>

      {/* 4 Core Pillars for Society Committees */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-brand-grey-200 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-teal-50 border border-brand-teal-100 flex items-center justify-center text-brand-teal-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-brand-teal-950">
              Pre-Approved Gate Roster
            </h3>
            <p className="text-xs text-brand-grey-600 leading-relaxed">
              Every pro carries verified Aadhaar, police check, and photo ID for MyGate &amp; NoBrokerHood. Zero unauthorized wandering.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-brand-grey-200 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-amber-50 border border-brand-amber-100 flex items-center justify-center text-brand-amber-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-brand-teal-950">
              Society Corpus Contribution
            </h3>
            <p className="text-xs text-brand-grey-600 leading-relaxed">
              We donate a micro-percentage of every completed flat repair directly to your society&apos;s maintenance corpus fund.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-brand-grey-200 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-brand-teal-950">
              Free Common-Area Checks
            </h3>
            <p className="text-xs text-brand-grey-600 leading-relaxed">
              Complimentary quarterly audit for society water pump rooms, overhead tanks, and clubhouse electrical panels.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-brand-grey-200 shadow-md space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-brand-teal-950">
              7-Day Written Warranty
            </h3>
            <p className="text-xs text-brand-grey-600 leading-relaxed">
              Zero resident complaints to the committee. If a repair recurs, Tap &amp; Toggle revisits free of charge under warranty.
            </p>
          </div>
        </div>
      </section>

      {/* Society Partnership Onboarding Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-grey-200 shadow-xl space-y-6">
          <div className="border-b border-brand-grey-100 pb-4">
            <span className="text-xs font-bold text-brand-teal-800 uppercase tracking-wider block">
              Society RWA Partnership Inquiry
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-brand-teal-950 mt-1">
              Connect with Tap &amp; Toggle Community Operations
            </h2>
            <p className="text-xs sm:text-sm text-brand-grey-600 mt-1">
              Fill out this quick form — our operations founder will visit your committee or WhatsApp you within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-950">Inquiry Sent Successfully!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Thank you, {contactName}. We have prepared the briefing for {societyName}. If WhatsApp did not open automatically, click the button below.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/918050959001?text=Hi%20Tap%20%26%20Toggle!%20We%20just%20submitted%20a%20society%20partner%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition inline-flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Direct</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Society Name */}
                <div>
                  <label className="block text-xs font-semibold text-brand-grey-700 mb-1.5">
                    Housing Society Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nyati Chesterfield / Clover Highlands"
                    value={societyName}
                    onChange={(e) => setSocietyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-50 border border-brand-grey-300 text-sm text-brand-grey-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-600"
                  />
                </div>

                {/* Locality */}
                <div>
                  <label className="block text-xs font-semibold text-brand-grey-700 mb-1.5">
                    Locality / Area
                  </label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-50 border border-brand-grey-300 text-sm text-brand-grey-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-600 cursor-pointer"
                  >
                    <option value="NIBM Undri Road">NIBM Undri Road</option>
                    <option value="NIBM Road">NIBM Road</option>
                    <option value="Mohammadwadi">Mohammadwadi</option>
                    <option value="Salunke Vihar">Salunke Vihar</option>
                    <option value="Kondhwa / Wanowrie">Kondhwa / Wanowrie</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Name */}
                <div>
                  <label className="block text-xs font-semibold text-brand-grey-700 mb-1.5">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-50 border border-brand-grey-300 text-sm text-brand-grey-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-600"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-brand-grey-700 mb-1.5">
                    Your Role in Society
                  </label>
                  <select
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-50 border border-brand-grey-300 text-sm text-brand-grey-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-600 cursor-pointer"
                  >
                    <option value="Chairman">Chairman</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Managing Committee Member">Managing Committee Member</option>
                    <option value="Facility Manager">Facility Manager</option>
                    <option value="Resident Advocate">Concerned Resident</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-brand-grey-700 mb-1.5">
                    WhatsApp Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="98220 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-50 border border-brand-grey-300 text-sm text-brand-grey-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-600 font-mono"
                  />
                </div>

                {/* Units */}
                <div>
                  <label className="block text-xs font-semibold text-brand-grey-700 mb-1.5">
                    Number of Flats / Units
                  </label>
                  <select
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-50 border border-brand-grey-300 text-sm text-brand-grey-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-600 cursor-pointer"
                  >
                    <option value="50 - 150 flats">50 - 150 flats</option>
                    <option value="150 - 300 flats">150 - 300 flats</option>
                    <option value="300 - 600 flats">300 - 600 flats</option>
                    <option value="600+ flats (Large Township)">600+ flats (Large Township)</option>
                  </select>
                </div>
              </div>

              {/* What interest you */}
              <div>
                <label className="block text-xs font-semibold text-brand-grey-700 mb-1.5">
                  How can Tap &amp; Toggle best support your society?
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-50 border border-brand-grey-300 text-sm text-brand-grey-900 focus:outline-none focus:ring-2 focus:ring-brand-teal-600 cursor-pointer"
                >
                  <option value="Free Weekend Repair Camp for Residents">
                    Host a Free Weekend Repair Camp for Residents
                  </option>
                  <option value="Pre-Approved Gate Roster MoU">
                    Set up Pre-Approved Gate Roster for MyGate / NoBrokerHood
                  </option>
                  <option value="Lift QR Posters & Resident Welfare Contribution">
                    Supply Free Lift QR Posters &amp; Society Corpus Contribution
                  </option>
                  <option value="Common-Area Pump Room / Panel Audit">
                    Schedule Free Common-Area Pump Room / Electrical Audit
                  </option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-brand-teal-700 hover:bg-brand-teal-800 text-white font-extrabold text-sm shadow-xl shadow-brand-teal-900/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Society Partnership Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
