"use client";

import React, { useState } from "react";
import { Droplets, Zap, ShieldCheck, Star, MapPin, Clock, MessageSquare, CheckCircle } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

interface RecentRepair {
  id: string;
  service: "plumbing" | "electrical";
  title: string;
  society: string;
  area: string;
  timeAgo: string;
  amount: number;
  review: string;
  residentInitial: string;
  warrantyActive: boolean;
}

const RECENT_REPAIRS: RecentRepair[] = [
  {
    id: "REP-101",
    service: "plumbing",
    title: "Sink Mixer Tap & Angle Cock Replacement",
    society: "Nyati Chesterfield",
    area: "NIBM Undri Road",
    timeAgo: "25 mins ago",
    amount: 249,
    review: "Technician arrived in 20 mins. Identified the faulty cartridge immediately and fixed it with zero mess.",
    residentInitial: "Priya S.",
    warrantyActive: true,
  },
  {
    id: "REP-102",
    service: "electrical",
    title: "16A Geyser MCB Tripping & Burnt Socket",
    society: "Clover Highlands",
    area: "NIBM Road",
    timeAgo: "1 hour ago",
    amount: 299,
    review: "Guards let the pro in right away with his Tap & Toggle ID. Honest bill with genuine shop receipt for the MCB.",
    residentInitial: "Rohit K.",
    warrantyActive: true,
  },
  {
    id: "REP-103",
    service: "plumbing",
    title: "Concealed Flush Tank Continuous Overflow",
    society: "Raheja Vista Premiere",
    area: "Mohammadwadi",
    timeAgo: "3 hours ago",
    amount: 349,
    review: "Saved thousands compared to what the builder's agency quoted. 7-day warranty certificate received on WhatsApp!",
    residentInitial: "Anand M.",
    warrantyActive: true,
  },
  {
    id: "REP-104",
    service: "electrical",
    title: "Ceiling Fan Installation & Switchboard Fix",
    society: "Sunshree Woods",
    area: "NIBM Road",
    timeAgo: "Today",
    amount: 199,
    review: "No haggling, prompt WhatsApp updates, and polite technician. Highly recommended for NIBM residents.",
    residentInitial: "Meera D.",
    warrantyActive: true,
  },
  {
    id: "REP-105",
    service: "plumbing",
    title: "Bathroom Floor Drain Blockage & Jet Spray",
    society: "Ganga Florentina",
    area: "NIBM Annexe",
    timeAgo: "Today",
    amount: 249,
    review: "Water was backing up into the master bath. Pro cleared the line and replaced the jet pipe quickly.",
    residentInitial: "Sanjay T.",
    warrantyActive: true,
  },
  {
    id: "REP-106",
    service: "electrical",
    title: "Inverter Line Wiring & Heavy Load Isolation",
    society: "Marvel Isola",
    area: "Corinthians Club Rd",
    timeAgo: "Yesterday",
    amount: 449,
    review: "Very professional electrician who knew the society's internal DB layout well.",
    residentInitial: "Vikram N.",
    warrantyActive: true,
  },
];

export function RecentRepairsFeed() {
  const [filter, setFilter] = useState<"all" | "plumbing" | "electrical">("all");
  const cleanNumber = SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");

  const filtered = RECENT_REPAIRS.filter((r) => {
    if (filter === "all") return true;
    return r.service === filter;
  });

  return (
    <section className="py-16 bg-brand-grey-50 border-b border-brand-grey-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span>Live Hyperlocal Activity</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-grey-900 tracking-tight">
              Recent Repairs in NIBM Societies
            </h2>
            <p className="text-sm sm:text-base text-brand-grey-600 mt-1">
              See what our vetted trade technicians have fixed across your neighborhood today.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-brand-grey-200 shadow-xs self-start md:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-brand-teal-800 text-white shadow-xs"
                  : "text-brand-grey-600 hover:text-brand-grey-900"
              }`}
            >
              All Repairs
            </button>
            <button
              onClick={() => setFilter("plumbing")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === "plumbing"
                  ? "bg-brand-teal-700 text-white shadow-xs"
                  : "text-brand-grey-600 hover:text-brand-teal-800"
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Plumbing</span>
            </button>
            <button
              onClick={() => setFilter("electrical")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === "electrical"
                  ? "bg-brand-amber-500 text-white shadow-xs"
                  : "text-brand-grey-600 hover:text-brand-amber-800"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Electrical</span>
            </button>
          </div>
        </div>

        {/* Repair Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const isPlumb = item.service === "plumbing";
            const waQuoteUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
              `Hi Tap & Toggle! I saw your recent repair for *${item.title}* at ${item.society}. I have a similar issue in my flat. Can you share an estimate?`
            )}`;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-brand-grey-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Meta */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isPlumb
                          ? "bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-100"
                          : "bg-brand-amber-50 text-brand-amber-800 border border-brand-amber-100"
                      }`}
                    >
                      {isPlumb ? <Droplets className="w-3 h-3" /> : <Zap className="w-3 h-3 text-brand-amber-600" />}
                      <span>{isPlumb ? "Plumbing" : "Electrical"}</span>
                    </span>

                    <div className="flex items-center gap-1 text-[11px] text-brand-grey-400 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{item.timeAgo}</span>
                    </div>
                  </div>

                  {/* Title & Society */}
                  <div>
                    <h3 className="font-bold text-sm text-brand-grey-900 leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-semibold text-brand-teal-700 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-teal-600 shrink-0" />
                      <span>{item.society}</span>
                      <span className="text-brand-grey-300">·</span>
                      <span className="text-brand-grey-500 text-[11px] font-normal">{item.area}</span>
                    </div>
                  </div>

                  {/* Review Quote */}
                  <div className="p-3 rounded-2xl bg-brand-grey-50 border border-brand-grey-100 text-xs text-brand-grey-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-brand-grey-500">
                        {item.residentInitial}
                      </span>
                    </div>
                    <p className="italic text-[11px] text-brand-grey-600 leading-relaxed">
                      &ldquo;{item.review}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Bottom Bar: Amount & 1-Tap CTA */}
                <div className="pt-3 border-t border-brand-grey-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-brand-grey-400 block font-medium">Settled Amount</span>
                    <span className="font-extrabold text-sm text-brand-grey-900">₹{item.amount}</span>
                  </div>

                  <a
                    href={waQuoteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-transform hover:scale-105"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white text-emerald-600" />
                    <span>Get Similar Quote</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hyperlocal Trust Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-brand-grey-600 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            100% Gate-Cleared Entries
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            7-Day Workmanship Revisit Guarantee
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Free Estimate Before Technician Dispatched
          </span>
        </div>

      </div>
    </section>
  );
}
