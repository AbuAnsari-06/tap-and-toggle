"use client";

import React, { useState } from "react";
import {
  Building,
  ShieldCheck,
  CheckCircle2,
  Search,
  ArrowRight,
  Sparkles,
  Vote,
  MessageSquare,
  Users,
  Send,
  Check,
  ChevronDown,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

const ACTIVE_SOCIETIES = [
  { name: "Nyati Chesterfield", status: "Active Pre-Approved Roster", area: "NIBM Undri Road" },
  { name: "Clover Highlands", status: "Active Pre-Approved Roster", area: "NIBM Road" },
  { name: "Raheja Vista Premiere", status: "Active Pre-Approved Roster", area: "Mohammadwadi" },
  { name: "Sunshree Emerald / Woods", status: "Active Pre-Approved Roster", area: "NIBM Road" },
  { name: "Bramha Majestic", status: "Active Pre-Approved Roster", area: "NIBM Post Office" },
  { name: "Ganga Florentina", status: "Active Pre-Approved Roster", area: "NIBM Annexe" },
  { name: "Marvel Isola", status: "Active Pre-Approved Roster", area: "Corinthians Club Rd" },
  { name: "Salunke Vihar Society", status: "Active Pre-Approved Roster", area: "Salunke Vihar" },
];

export function SocietyChecker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSociety, setSelectedSociety] = useState<string | null>(null);
  
  // Society Request / Vote Form State
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [societyNameInput, setSocietyNameInput] = useState("");
  const [areaInput, setAreaInput] = useState("NIBM Road");
  const [residentName, setResidentName] = useState("");
  const [residentPhone, setResidentPhone] = useState("");
  const [residentRole, setResidentRole] = useState("Flat Resident / Owner");
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const cleanNumber = SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");

  const filtered = ACTIVE_SOCIETIES.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!societyNameInput.trim() || !residentPhone.trim()) return;
    setVoteSubmitted(true);
  };

  const nominationWhatsAppUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    `Hi Tap & Toggle! 👋 I would like to request / vote to launch pre-cleared plumbers & electricians in my society:
🏢 *Society:* ${societyNameInput || searchTerm || "My Society"}
📍 *Area:* ${areaInput}
👤 *Nominated by:* ${residentName || "Resident"} (${residentRole})
📞 *Contact:* ${residentPhone}

Please contact our RWA committee / let me know when gate onboarding starts!`
  )}`;

  return (
    <section className="py-16 bg-brand-teal-950 text-white relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-teal-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-teal-900 border border-brand-teal-700 text-brand-teal-300 text-xs font-semibold mb-3">
            <Building className="w-3.5 h-3.5 text-brand-teal-400" />
            <span>Hyperlocal Gate Clearance · South Pune</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Check Your Building&apos;s Gate Clearance
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-brand-teal-200/80">
            Our hand-vetted plumbers and electricians operate on pre-cleared rosters across South Pune gated societies.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="p-5 sm:p-7 rounded-3xl bg-brand-teal-900/70 border border-brand-teal-800 backdrop-blur-md shadow-2xl space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-teal-300">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search your society (e.g. Nyati, Clover, Raheja, Sunshree)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedSociety(null);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-brand-teal-950/90 border border-brand-teal-700/80 text-white text-sm placeholder:text-brand-teal-400/60 focus:outline-none focus:ring-2 focus:ring-brand-amber-400 transition"
            />
          </div>

          {/* Quick Pre-Approved Societies Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {ACTIVE_SOCIETIES.slice(0, 5).map((soc) => (
              <button
                key={soc.name}
                type="button"
                onClick={() => {
                  setSearchTerm(soc.name);
                  setSelectedSociety(soc.name);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                  searchTerm === soc.name || selectedSociety === soc.name
                    ? "bg-brand-amber-500 text-black border-brand-amber-400 font-bold shadow"
                    : "bg-brand-teal-900/80 text-brand-teal-200 border-brand-teal-700/60 hover:bg-brand-teal-800"
                }`}
              >
                {soc.name}
              </button>
            ))}
          </div>

          {/* Search Result Card */}
          {searchTerm.trim().length > 0 && (
            <div className="pt-2 animate-in fade-in duration-200">
              {filtered.length > 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-bold text-white">
                        {filtered[0].name}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Pre-Approved Roster
                    </span>
                  </div>
                  <p className="text-xs text-brand-teal-200/90 leading-relaxed">
                    Gate entry pre-cleared for Tap &amp; Toggle pros in this society. Guards recognize our roster, ensuring zero entry delays.
                  </p>
                  <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                    <a
                      href="#booking-form"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-amber-400 hover:underline"
                    >
                      <span>Book a verified pro for this building</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-brand-amber-950/40 border border-brand-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-brand-amber-400 text-xs font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>Society in Coverage Area · Serviceable on Demand</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-brand-amber-400/20 text-brand-amber-300 text-[10px] font-bold">
                      South Pune
                    </span>
                  </div>
                  <p className="text-xs text-brand-teal-200/90 leading-relaxed">
                    We service all flats in NIBM, Mohammadwadi, and Undri. We will provide verified technician ID details in advance to easily clear at your society gate.
                  </p>
                  <div className="pt-1 flex items-center gap-4">
                    <a
                      href="#booking-form"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-amber-400 hover:underline"
                    >
                      <span>Request a visit for your flat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSocietyNameInput(searchTerm);
                        setIsVoteModalOpen(true);
                      }}
                      className="text-xs font-bold text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Vote className="w-3.5 h-3.5" />
                      <span>Vote to add regular roster in your society</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Qinbo-Style Society Nomination & Vote Banner */}
          <div className="pt-3 border-t border-brand-teal-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-brand-teal-200">
              <Vote className="w-4 h-4 text-brand-amber-400 shrink-0" />
              <span>Don&apos;t see your apartment building listed?</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (searchTerm && filtered.length === 0) {
                  setSocietyNameInput(searchTerm);
                }
                setIsVoteModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-700 text-brand-amber-300 font-bold border border-brand-teal-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Request Service in Your Society (Vote)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Society Vote / Request Modal */}
        {isVoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white text-brand-grey-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-teal-200 relative animate-in zoom-in-95 duration-200">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsVoteModalOpen(false);
                  setVoteSubmitted(false);
                }}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-brand-grey-100 text-brand-grey-400 hover:text-brand-grey-700 cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>

              {!voteSubmitted ? (
                <div>
                  <div className="flex items-center gap-2 text-brand-teal-800 mb-1">
                    <Vote className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Society Expansion Roster</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-brand-grey-900">
                    Nominate &amp; Vote for Your Society
                  </h3>
                  <p className="text-xs text-brand-grey-600 mt-1 mb-5">
                    We prioritize onboarding gated societies with the highest resident demand in South Pune. Submit your nomination below!
                  </p>

                  <form onSubmit={handleVoteSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-brand-grey-700 mb-1">
                        Society / Apartment Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Raheja Vista Premiere, Clover Palisades..."
                        value={societyNameInput}
                        onChange={(e) => setSocietyNameInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-brand-grey-300 text-sm focus:ring-2 focus:ring-brand-teal-600 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-grey-700 mb-1">
                          Neighborhood / Area *
                        </label>
                        <select
                          value={areaInput}
                          onChange={(e) => setAreaInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-brand-grey-300 text-sm focus:ring-2 focus:ring-brand-teal-600 outline-none bg-white"
                        >
                          <option value="NIBM Road">NIBM Road</option>
                          <option value="NIBM Undri Road">NIBM Undri Road</option>
                          <option value="Mohammadwadi">Mohammadwadi</option>
                          <option value="Salunke Vihar">Salunke Vihar</option>
                          <option value="Wanowrie">Wanowrie</option>
                          <option value="Corinthians Club Rd">Corinthians Club Rd</option>
                          <option value="Kondhwa">Kondhwa</option>
                          <option value="Other South Pune">Other South Pune</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-grey-700 mb-1">
                          Your Role in Society
                        </label>
                        <select
                          value={residentRole}
                          onChange={(e) => setResidentRole(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-brand-grey-300 text-sm focus:ring-2 focus:ring-brand-teal-600 outline-none bg-white"
                        >
                          <option value="Flat Resident / Owner">Flat Resident / Owner</option>
                          <option value="Tenant">Tenant</option>
                          <option value="RWA / Committee Member">RWA / Committee Member</option>
                          <option value="Society Secretary / Chairman">Society Secretary / Chairman</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-grey-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={residentName}
                          onChange={(e) => setResidentName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-brand-grey-300 text-sm focus:ring-2 focus:ring-brand-teal-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-grey-700 mb-1">
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit mobile"
                          value={residentPhone}
                          onChange={(e) => setResidentPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-brand-grey-300 text-sm focus:ring-2 focus:ring-brand-teal-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl bg-brand-teal-800 hover:bg-brand-teal-900 text-white font-bold text-xs sm:text-sm shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Vote className="w-4 h-4" />
                        <span>Submit Society Nomination</span>
                      </button>

                      <a
                        href={nominationWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                        <span>Submit &amp; Chat on WhatsApp Directly</span>
                      </a>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-brand-grey-900">
                    Nomination Recorded! 🎉
                  </h3>
                  <p className="text-xs text-brand-grey-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, {residentName || "neighbor"}! Your vote for <strong>{societyNameInput}</strong> has been logged. Our dispatch team will reach out to your RWA to set up pre-approved gate access.
                  </p>

                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={nominationWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
                      <span>Send Nomination on WhatsApp (+91 9517614940)</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setIsVoteModalOpen(false);
                        setVoteSubmitted(false);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-brand-grey-100 hover:bg-brand-grey-200 text-brand-grey-700 font-semibold text-xs transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
