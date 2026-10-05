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
  Share2,
  Check,
  XCircle,
  ThumbsUp,
  CreditCard,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { JobStatus } from "@/types/database";
import {
  CustomerTrackingData,
  fetchCustomerTrackingAction,
  approveCustomerEstimateAction,
  cancelCustomerJobAction,
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
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadTicket = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    if (!jobId) {
      setError("Invalid tracking link.");
      setLoading(false);
      return;
    }

    const res = await fetchCustomerTrackingAction(jobId);
    if (res.success && res.data) {
      setTicket(res.data);
      setError(null);
    } else {
      if (!ticket) setError(res.error || "Unable to locate service ticket.");
    }
    if (!isBackground) setLoading(false);
  };

  useEffect(() => {
    loadTicket();

    // Auto-poll status every 10 seconds so customer sees real-time updates seamlessly
    const interval = setInterval(() => {
      loadTicket(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [jobId]);

  const handleApproveEstimate = async () => {
    if (!ticket) return;
    setActionLoading(true);
    setActionMessage(null);
    const res = await approveCustomerEstimateAction(ticket.id);
    if (res.success) {
      setActionMessage(res.message || "Estimate approved! Dispatching technician.");
      await loadTicket();
    } else {
      alert(res.error || "Failed to approve estimate.");
    }
    setActionLoading(false);
  };

  const handleCancelJob = async () => {
    if (!ticket) return;
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this service request?"
    );
    if (!confirmCancel) return;

    setActionLoading(true);
    const res = await cancelCustomerJobAction(ticket.id, "Customer requested cancellation");
    if (res.success) {
      setActionMessage(res.message || "Request cancelled.");
      await loadTicket();
    } else {
      alert(res.error || "Failed to cancel request.");
    }
    setActionLoading(false);
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Tap & Toggle Ticket #${ticket?.id.slice(0, 8)}`,
          text: `Track our ${ticket?.service} service request at ${ticket?.society_name}:`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const currentStage = ticket ? getStageIndex(ticket.status) : 1;

  // WhatsApp Support Links
  const waSupportLink = `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Tap & Toggle team, checking on ticket #${ticket?.id.slice(0, 8) || "NIBM"} at ${
      ticket?.society_name || "NIBM"
    } (${ticket?.flat_no || ""}).`
  )}`;

  const waApproveLink = `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Tap & Toggle, I approve the estimate of ₹${ticket?.estimate_amount || 0} for ticket #${ticket?.id.slice(
      0,
      8
    )}. Please dispatch technician.`
  )}`;

  return (
    <div className="min-h-screen bg-brand-grey-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-grey-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-teal-800 hover:text-brand-teal-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-brand-grey-200 text-xs font-semibold text-brand-grey-700 hover:bg-brand-grey-100 transition shadow-xs cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-brand-grey-500" />
                  <span>Share Tracking</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => loadTicket()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-brand-grey-200 text-xs font-semibold text-brand-grey-700 hover:bg-brand-grey-100 transition shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Action Success Toast */}
        {actionMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span>{actionMessage}</span>
            <button
              type="button"
              onClick={() => setActionMessage(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              &times;
            </button>
          </div>
        )}

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

        {/* Live Ticket Details */}
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

              {/* 1-Click Estimate Approval Banner (When status is Estimated) */}
              {ticket.status === "Estimated" && ticket.estimate_amount && (
                <div className="p-5 rounded-2xl bg-brand-amber-50 border-2 border-brand-amber-400 text-brand-grey-950 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-amber-600" />
                      <span className="font-extrabold text-sm">
                        Free Estimate Ready: ₹{ticket.estimate_amount}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-brand-grey-600">
                      No Advance Required
                    </span>
                  </div>
                  <p className="text-xs text-brand-grey-700 leading-relaxed">
                    Our dispatch team has assessed your request. Approve the quote below to dispatch the nearest verified pro immediately.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleApproveEstimate}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-teal-700 hover:bg-brand-teal-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Approve Estimate (₹{ticket.estimate_amount})</span>
                    </button>
                    <a
                      href={waApproveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Approve on WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

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
                        width: `${((Math.max(1, currentStage) - 1) / (TRACKING_STAGES.length - 1)) * 100}%`,
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

                  {ticket.pro.phone && (
                    <a
                      href={`tel:${ticket.pro.phone}`}
                      className="p-3 rounded-2xl bg-brand-teal-100 text-brand-teal-900 hover:bg-brand-teal-200 transition"
                      title="Call Technician"
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-brand-teal-50/70 border border-brand-teal-200 text-xs text-brand-teal-950 leading-relaxed">
                  💡 <strong>Gate Entry Tip:</strong> When security asks via MyGate or NoBrokerHood, approve entry for <strong>Tap &amp; Toggle</strong>.
                </div>
              </div>
            )}

            {/* Transparent Bill Breakdown */}
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

                  {/* Itemized Parts List with Receipt Photos */}
                  {ticket.expenses && ticket.expenses.length > 0 && (
                    <div className="py-2.5 space-y-2 border-t border-brand-grey-100">
                      <span className="text-[10px] font-bold text-brand-grey-500 uppercase tracking-wider block">
                        Hardware Store Receipts Attached:
                      </span>
                      {ticket.expenses.map((exp) => (
                        <div
                          key={exp.id}
                          className="p-2.5 rounded-xl bg-brand-grey-50 border border-brand-grey-200/80 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-brand-grey-900 block">
                              {exp.item_name}
                            </span>
                            <span className="text-[11px] text-brand-grey-500">
                              Qty {exp.quantity} × ₹{exp.unit_price}
                            </span>
                            {exp.receipt_photo_url && (
                              <a
                                href={exp.receipt_photo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-brand-teal-700 hover:underline font-bold block mt-0.5"
                              >
                                📄 View Hardware Receipt Photo Proof
                              </a>
                            )}
                          </div>
                          <span className="font-black text-brand-grey-900">₹{exp.total_price}</span>
                        </div>
                      ))}
                    </div>
                  )}

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

            {/* Post-Service Instant Payment via UPI (When status is Done) */}
            {ticket.status === "Done" && (
              <div className="bg-gradient-to-br from-emerald-900 to-brand-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">
                        Work Completed · Settle Bill via UPI
                      </h3>
                      <p className="text-xs text-emerald-300">
                        Pay securely after work inspection. 7-day warranty activates instantly.
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-emerald-400">
                    ₹
                    {ticket.final_amount ||
                      (ticket.estimate_amount || 0) +
                        (ticket.parts_amount || 0) +
                        (ticket.handling_fee || 0)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* UPI Deep Link for Mobile Devices */}
                  <a
                    href={`upi://pay?pa=tapandtoggle@okhdfcbank&pn=Tap%26Toggle&am=${
                      ticket.final_amount ||
                      (ticket.estimate_amount || 0) +
                        (ticket.parts_amount || 0) +
                        (ticket.handling_fee || 0)
                    }&tn=TT_${ticket.id.slice(0, 8)}&cu=INR`}
                    className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-brand-grey-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-brand-grey-950" />
                    <span>Pay with GPay / PhonePe / Paytm / UPI</span>
                  </a>

                  {/* WhatsApp Payment Confirmation */}
                  <a
                    href={`https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hi Tap & Toggle, I have paid the bill of ₹${
                        ticket.final_amount ||
                        (ticket.estimate_amount || 0) +
                          (ticket.parts_amount || 0) +
                          (ticket.handling_fee || 0)
                      } for Ticket #${ticket.id.slice(0, 8)} at ${ticket.society_name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Confirm Payment on WhatsApp</span>
                  </a>
                </div>
              </div>
            )}

            {/* 7-Day Digital Warranty Certificate Card */}
            {(ticket.status === "Done" ||
              ticket.status === "Paid" ||
              ticket.status === "Warranty" ||
              ticket.status === "Closed") && (
              <div className="bg-gradient-to-b from-emerald-50 to-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-black uppercase tracking-wider mb-1">
                        Verified Workmanship Certificate
                      </div>
                      <h4 className="text-base font-black text-emerald-950">
                        7-Day Peace-of-Mind Warranty Active
                      </h4>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      Certificate ID
                    </span>
                    <span className="font-mono text-xs font-black text-emerald-900">
                      TT-WAR-{ticket.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs py-1">
                  <div className="bg-white/80 p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-bold block mb-0.5">
                      Covered Service
                    </span>
                    <span className="font-bold text-emerald-950 capitalize">
                      {ticket.service} Fitting &amp; Repair
                    </span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-bold block mb-0.5">
                      Location
                    </span>
                    <span className="font-bold text-emerald-950">
                      {ticket.society_name}, {ticket.flat_no}
                    </span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-bold block mb-0.5">
                      Warranty Period
                    </span>
                    <span className="font-bold text-emerald-950">
                      7 Days Free Revisit
                    </span>
                  </div>
                </div>

                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  If this repair experiences any recurring fault, leakage, or loose connection within 7 days, our dispatch team will assign a technician to revisit and rectify it for <strong>free</strong>.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Print / Save Certificate
                  </button>

                  <a
                    href={`https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hi Tap & Toggle, I would like to claim my 7-day warranty for Ticket #TT-WAR-${ticket.id
                        .slice(0, 8)
                        .toUpperCase()} at ${ticket.society_name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Claim Free Warranty Revisit</span>
                  </a>
                </div>
              </div>
            )}

            {/* Customer Self-Serve Actions: Cancel or Speak with Dispatch */}
            {ticket.status !== "Cancelled" &&
              ticket.status !== "Done" &&
              ticket.status !== "Paid" &&
              ticket.status !== "Closed" && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleCancelJob}
                    disabled={actionLoading}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline cursor-pointer"
                  >
                    Need to cancel this request?
                  </button>
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
