"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Wrench,
  Zap,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Phone,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  DollarSign,
  Star,
  RefreshCw,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { JobStatus } from "@/types/database";
import {
  CustomerTrackingData,
  fetchCustomerTrackingAction,
} from "@/app/actions/trackJob";

const TRACKING_STAGES = [
  { id: 1, label: "Request Logged", desc: "Ticket received by NIBM dispatch" },
  { id: 2, label: "Estimate Ready", desc: "Upfront price agreed" },
  { id: 3, label: "Pro Dispatched", desc: "Vetted pro en route to gate" },
  { id: 4, label: "Repair Active", desc: "Work in progress in flat" },
  { id: 5, label: "Done & Protected", desc: "7-day warranty activated" },
];

function getStageIndex(status: JobStatus): number {
  switch (status) {
    case "New":
    case "Contacted":
      return 1;
    case "Estimated":
    case "Approved":
    case "Scheduled":
    case "Rescheduled":
      return 2;
    case "Assigned":
    case "On the way":
      return 3;
    case "Arrived":
    case "In Progress":
    case "Partial":
      return 4;
    case "Done":
    case "Paid":
    case "Warranty":
    case "Closed":
      return 5;
    case "Cancelled":
    case "No-show":
      return 0;
    default:
      return 1;
  }
}

export default function CustomerTrackingPage() {
  const params = useParams();
  const rawJobId = params?.jobId as string;
  const jobId = Array.isArray(rawJobId) ? rawJobId[0] : rawJobId;

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<CustomerTrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTicket = async () => {
    setLoading(true);
    setError(null);
    if (!jobId) {
      setError("Invalid tracking link.");
      setLoading(false);
      return;
    }

    const res = await fetchCustomerTrackingAction(jobId);
    if (res.success && res.data) {
      setTicket(res.data);
    } else {
      setError(res.error || "Unable to locate service ticket.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTicket();
  }, [jobId]);

  const currentStage = ticket ? getStageIndex(ticket.status) : 1;

  // WhatsApp Support Link
  const waSupportLink = `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Tap & Toggle team, checking on ticket #${ticket?.id.slice(0, 8) || "NIBM"} at ${
      ticket?.society_name || "NIBM"
    } (${ticket?.flat_no || ""}).`
  )}`;

  return (
    <div className="min-h-screen bg-brand-grey-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-grey-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-teal-800 hover:text-brand-teal-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tap &amp; Toggle</span>
          </Link>

          <button
            type="button"
            onClick={loadTicket}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-brand-grey-200 text-xs font-semibold text-brand-grey-700 hover:bg-brand-grey-100 transition shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && !ticket && (
          <div className="p-12 text-center bg-white rounded-3xl border border-brand-grey-200 shadow-sm space-y-3">
            <div className="w-10 h-10 border-3 border-brand-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-brand-grey-700">
              Retrieving live dispatch status...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !ticket && (
          <div className="p-8 text-center bg-white rounded-3xl border border-brand-grey-200 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-amber-600" />
            </div>
            <h2 className="text-xl font-extrabold text-brand-grey-900">Ticket Not Found</h2>
            <p className="text-xs text-brand-grey-600 max-w-md mx-auto">{error}</p>
            <a
              href={`https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=Hi%20Tap%20%26%20Toggle,%20I%20need%20help%20tracking%20my%20service%20ticket.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message Dispatch on WhatsApp</span>
            </a>
          </div>
        )}

        {/* Live Ticket Card */}
        {ticket && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Ticket Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-grey-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-brand-grey-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        ticket.service === "plumbing"
                          ? "bg-brand-teal-100 text-brand-teal-900"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {ticket.service === "plumbing" ? (
                        <Wrench className="w-3 h-3 text-brand-teal-700" />
                      ) : (
                        <Zap className="w-3 h-3 text-amber-700" />
                      )}
                      <span>{ticket.service}</span>
                    </span>

                    <span className="text-xs font-bold text-brand-grey-500">
                      Ticket #{ticket.id.slice(0, 8)}
                    </span>
                  </div>

                  <h1 className="text-2xl font-black text-brand-grey-900">
                    Live Service Tracker
                  </h1>
                  <p className="text-xs text-brand-grey-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-grey-400" />
                    <span>
                      {ticket.society_name} &bull; Flat {ticket.flat_no}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-3.5 py-1.5 rounded-xl bg-brand-teal-50 border border-brand-teal-200 text-brand-teal-900 text-xs font-bold">
                    Status: {ticket.status}
                  </span>
                </div>
              </div>

              {/* Emergency Alert Banner */}
              {ticket.is_emergency && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold text-red-950 uppercase tracking-wider">
                      Priority Hazard Dispatch Active
                    </h4>
                    <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
                      This ticket is prioritized for urgent response (&lt;30 minutes in NIBM) due to active water leakage or electrical safety concern.
                    </p>
                  </div>
                </div>
              )}

              {/* Status Specific Alerts */}
              {(ticket.status === "Cancelled" || ticket.status === "No-show") && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                      Ticket {ticket.status === "No-show" ? "Marked as Missed / No-show" : "Cancelled"}
                    </h4>
                    <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                      This service ticket is currently closed. If you need a technician dispatched, please reach out directly on WhatsApp to reschedule.
                    </p>
                  </div>
                </div>
              )}

              {ticket.status === "Rescheduled" && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                      Visit Rescheduled
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                      Your appointment has been rescheduled. Our dispatch team will confirm the revised slot on WhatsApp.
                    </p>
                  </div>
                </div>
              )}

              {ticket.status === "Partial" && (
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                      Partial Repair / Parts Procurement Active
                    </h4>
                    <p className="text-xs text-purple-800 mt-0.5 leading-relaxed">
                      Initial diagnostics complete. The technician is sourcing required replacement parts for follow-up completion.
                    </p>
                  </div>
                </div>
              )}

              {/* Reported Fault */}
              <div>
                <h4 className="text-xs font-bold text-brand-grey-500 uppercase tracking-wider mb-1.5">
                  Reported Issue
                </h4>
                <p className="text-sm font-medium text-brand-grey-900 leading-relaxed bg-brand-grey-50 p-4 rounded-2xl border border-brand-grey-200/80">
                  {ticket.description}
                </p>
              </div>

              {/* Visual 5-Stage Stepper Progress Bar */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-brand-grey-500 uppercase tracking-wider mb-4">
                  Lifecycle Progress
                </h4>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-4 right-4 h-1 bg-brand-grey-200 -z-0">
                    <div
                      className="h-full bg-brand-teal-600 transition-all duration-500"
                      style={{
                        width: `${((currentStage - 1) / (TRACKING_STAGES.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Stage Dots */}
                  <div className="relative z-10 flex items-start justify-between">
                    {TRACKING_STAGES.map((stage) => {
                      const isPast = stage.id < currentStage;
                      const isCurrent = stage.id === currentStage;
                      return (
                        <div
                          key={stage.id}
                          className="flex flex-col items-center text-center max-w-[80px]"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition shadow-sm ${
                              isPast
                                ? "bg-brand-teal-600 text-white"
                                : isCurrent
                                ? "bg-brand-amber-500 text-brand-grey-950 ring-4 ring-brand-amber-100 animate-pulse"
                                : "bg-white text-brand-grey-400 border-2 border-brand-grey-300"
                            }`}
                          >
                            {isPast ? <CheckCircle2 className="w-4 h-4" /> : stage.id}
                          </div>
                          <span
                            className={`text-[11px] font-bold mt-2 leading-tight ${
                              isCurrent
                                ? "text-brand-teal-900"
                                : isPast
                                ? "text-brand-grey-700"
                                : "text-brand-grey-400"
                            }`}
                          >
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Technician Card (If Pro is assigned) */}
            {ticket.pro && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-grey-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brand-grey-100">
                  <h3 className="text-sm font-extrabold text-brand-grey-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-teal-700" />
                    <span>Your Assigned Technician</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Gate Pre-Cleared
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-teal-600 to-brand-teal-800 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                    {ticket.pro.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-extrabold text-brand-grey-950">
                      {ticket.pro.name}
                    </h4>
                    <p className="text-xs text-brand-grey-600">
                      Vetted local {ticket.pro.service} pro &bull; NIBM Bench
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className="flex items-center gap-1 font-bold text-brand-grey-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{ticket.pro.health_score || 5.0} / 5.0</span>
                      </span>
                      <span className="text-brand-grey-400">&bull;</span>
                      <span className="text-brand-teal-800 font-semibold">
                        Aadhaar Verified &bull; Police Cleared
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-brand-teal-50/70 border border-brand-teal-200 text-xs text-brand-teal-950 leading-relaxed">
                  💡 <strong>Gate Entry Tip:</strong> When the guard rings via MyGate or NoBrokerHood, tap <strong>Approve</strong>. Our pro carries verified ID from Tap &amp; Toggle.
                </div>
              </div>
            )}

            {/* Bill & Transparency Breakdown (If amounts exist) */}
            {(ticket.estimate_amount || ticket.final_amount) && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-grey-200 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-brand-grey-900 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Transparent Price Breakdown</span>
                </h3>

                <div className="space-y-2 text-xs divide-y divide-brand-grey-100">
                  <div className="flex justify-between py-1.5">
                    <span className="text-brand-grey-600">Labor / Workmanship</span>
                    <span className="font-bold text-brand-grey-900">
                      ₹{ticket.estimate_amount || 0}
                    </span>
                  </div>
                  {ticket.parts_amount ? (
                    <div className="flex justify-between py-1.5">
                      <span className="text-brand-grey-600">
                        Parts (Sourced at actual market cost)
                      </span>
                      <span className="font-bold text-brand-grey-900">
                        ₹{ticket.parts_amount}
                      </span>
                    </div>
                  ) : null}
                  {ticket.handling_fee ? (
                    <div className="flex justify-between py-1.5">
                      <span className="text-brand-grey-600">Parts Procurement / Handling</span>
                      <span className="font-bold text-brand-grey-900">
                        ₹{ticket.handling_fee}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex justify-between pt-3 text-sm">
                    <span className="font-extrabold text-brand-grey-900">Total Accountable Bill</span>
                    <span className="font-black text-emerald-700 text-base">
                      ₹
                      {ticket.final_amount ||
                        (ticket.estimate_amount || 0) +
                          (ticket.parts_amount || 0) +
                          (ticket.handling_fee || 0)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-brand-grey-500 italic">
                  One accountable bill. Pay only after work is completed and inspected.
                </p>
              </div>
            )}

            {/* 7-Day Warranty Badge */}
            {(ticket.status === "Done" ||
              ticket.status === "Paid" ||
              ticket.status === "Warranty" ||
              ticket.status === "Closed") && (
              <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-300 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-emerald-950">
                    7-Day Workmanship Warranty Active
                  </h4>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    If this repair has any recurring leakage, loose connection, or fault within 7 days, we dispatch a technician to revisit for free.
                  </p>
                </div>
              </div>
            )}

            {/* Help & Support CTA */}
            <div className="bg-brand-grey-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-extrabold">Need to speak with Dispatch?</h4>
                <p className="text-xs text-brand-grey-400 mt-0.5">
                  Our NIBM operations team is available directly on WhatsApp
                </p>
              </div>
              <a
                href={waSupportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-brand-grey-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4 fill-brand-grey-950" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
