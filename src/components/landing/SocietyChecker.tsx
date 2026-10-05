"use client";

import React, { useState } from "react";
import { Building, ShieldCheck, CheckCircle2, Search, ArrowRight, Sparkles } from "lucide-react";

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

  const filtered = ACTIVE_SOCIETIES.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-14 bg-brand-teal-950 text-white relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-teal-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal-900 border border-brand-teal-700 text-brand-teal-300 text-xs font-semibold mb-3">
            <Building className="w-3.5 h-3.5 text-brand-teal-400" />
            <span>Hyperlocal Society Coverage · NIBM Pune</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Check Your Building&apos;s Gate Clearance
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-brand-teal-200/80">
            Our hand-vetted plumbers and electricians operate on pre-cleared rosters across South Pune.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="p-4 sm:p-6 rounded-3xl bg-brand-teal-900/60 border border-brand-teal-800 backdrop-blur-md shadow-2xl space-y-4">
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
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-brand-teal-950/80 border border-brand-teal-700/80 text-white text-sm placeholder:text-brand-teal-400/60 focus:outline-none focus:ring-2 focus:ring-brand-amber-400 transition"
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

          {/* Result Card */}
          {searchTerm.trim().length > 0 && (
            <div className="pt-2 animate-in fade-in duration-200">
              {filtered.length > 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
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
                  <div className="pt-1">
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
                <div className="p-4 rounded-2xl bg-brand-amber-950/30 border border-brand-amber-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-brand-amber-400 text-xs font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>Society in NIBM Coverage Area</span>
                  </div>
                  <p className="text-xs text-brand-teal-200/90 leading-relaxed">
                    We service all flats in NIBM, Mohammadwadi, and Undri. We will send you technician ID details in advance to easily clear at your society security gate.
                  </p>
                  <div className="pt-1">
                    <a
                      href="#booking-form"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-amber-400 hover:underline"
                    >
                      <span>Request a visit for your flat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
