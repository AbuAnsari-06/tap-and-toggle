"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Wrench,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Receipt,
  Plus,
  Trash2,
  QrCode,
  DollarSign,
  ShieldCheck,
  Building,
  User,
  ChevronRight,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import {
  fetchProJobDetailAction,
  updateProJobStatusAction,
  deleteJobExpenseAction,
  ProJobWithDetails,
} from "@/app/actions/proJobActions";
import { ExpenseModal } from "@/components/pro/ExpenseModal";
import { IssueModal } from "@/components/pro/IssueModal";
import { DoorstepPaymentModal } from "@/components/admin/DoorstepPaymentModal";
import { JobStatus, JobExpense, JobIssue } from "@/types/database";

export default function ProJobExecutionPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = useState<ProJobWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Modals state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const loadJob = async () => {
    if (!jobId) return;
    setLoading(true);
    const res = await fetchProJobDetailAction(jobId);
    if (res.success && res.job) {
      setJob(res.job);
    } else {
      setError(res.error || "Job not found or access restricted.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const handleUpdateStatus = async (newStatus: JobStatus) => {
    if (!job) return;
    setStatusLoading(true);

    const res = await updateProJobStatusAction(job.id, newStatus);
    if (res.success) {
      setJob({ ...job, status: newStatus });
    }
    setStatusLoading(false);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!job) return;
    const res = await deleteJobExpenseAction(job.id, expenseId);
    if (res.success) {
      const remainingExpenses = (job.expenses || []).filter((e) => e.id !== expenseId);
      const newPartsTotal = remainingExpenses.reduce((sum, e) => sum + Number(e.total_price), 0);
      const labor = Number(job.estimate_amount) || 250;
      const handling = Number(job.handling_fee) || 30;
      setJob({
        ...job,
        expenses: remainingExpenses,
        parts_amount: newPartsTotal,
        final_amount: labor + newPartsTotal + handling,
      });
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-brand-grey-400">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading job sheet details...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs max-w-md mx-auto">
          {error || "Unable to display this job sheet."}
        </div>
        <Link
          href="/pro"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-grey-800 text-white text-xs font-bold hover:bg-brand-grey-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned Jobs</span>
        </Link>
      </div>
    );
  }

  const laborCost = Number(job.estimate_amount) || 250;
  const partsCost = Number(job.parts_amount) || 0;
  const handlingCost = Number(job.handling_fee) || 30;
  const totalBill = Number(job.final_amount) || laborCost + partsCost + handlingCost;

  const mapsQuery = encodeURIComponent(
    `${job.society?.name || "NIBM"}, NIBM Road, Pune, Maharashtra`
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="space-y-5 pb-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/pro"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-grey-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        <span className="text-[11px] font-mono text-brand-grey-500">
          Ticket #{job.id.slice(-6).toUpperCase()}
        </span>
      </div>

      {/* Emergency Alert Banner */}
      {job.is_emergency && (
        <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 font-bold animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>PRIORITY DISPATCH: Active Water Leak or Electrical Hazard</span>
        </div>
      )}

      {/* Primary Customer Location & Gate Info Card */}
      <div className="p-5 rounded-3xl bg-brand-grey-900 border border-brand-grey-800 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white tracking-tight">
                {job.customer?.flat_no || "Flat Entry"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
                {job.service}
              </span>
            </div>
            <p className="text-sm font-semibold text-brand-grey-300 mt-0.5 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-brand-grey-400" />
              <span>{job.society?.name || "NIBM Society"}</span>
            </p>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Map</span>
          </a>
        </div>

        {/* Resident Name & Contact Details */}
        <div className="p-3 rounded-2xl bg-brand-grey-950/70 border border-brand-grey-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand-grey-400" />
            <span className="font-bold text-white">{job.customer?.name}</span>
          </div>

          {job.customer?.phone && (
            <a
              href={`tel:${job.customer.phone}`}
              className="px-3 py-1.5 rounded-lg bg-brand-grey-800 hover:bg-brand-grey-700 text-emerald-400 font-bold flex items-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{job.customer.phone}</span>
            </a>
          )}
        </div>

        {/* Gate Clearance Protocol */}
        <div className="p-3 rounded-xl bg-brand-grey-800/50 border border-brand-grey-700/60 flex items-center gap-2.5 text-xs text-brand-grey-300">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            <strong className="text-white">Gate Pass:</strong> Tap &amp; Toggle Pre-Approved Roster. State{" "}
            <em>&quot;Tap &amp; Toggle Service for {job.customer?.flat_no}&quot;</em> at the security boom.
          </span>
        </div>
      </div>

      {/* Reported Issue Description */}
      <div className="p-5 rounded-3xl bg-brand-grey-900 border border-brand-grey-800 space-y-3">
        <span className="text-xs font-bold text-brand-grey-400 uppercase tracking-wider block">
          Resident Problem Description
        </span>
        <p className="text-sm text-white font-medium leading-relaxed">
          {job.description}
        </p>

        {/* Customer Uploaded Fixture Photos for Pro Inspection */}
        {job.photos && job.photos.length > 0 && (
          <div className="pt-2 space-y-2 border-t border-brand-grey-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Customer Attached Photos ({job.photos.length})</span>
              </span>
              <span className="text-[10px] text-brand-grey-400">Tap photo to enlarge</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {job.photos.map((photo, idx) => (
                <button
                  key={photo.id || idx}
                  type="button"
                  onClick={() => setPreviewPhoto(photo.photo_url)}
                  className="group relative rounded-xl overflow-hidden bg-brand-grey-950 border border-brand-grey-800 aspect-video focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.photo_url}
                    alt={photo.file_name || `Fixture photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                  <span className="absolute bottom-1.5 left-2 right-2 text-[10px] font-bold text-white truncate">
                    {photo.file_name || `Photo ${idx + 1}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center gap-2 text-xs text-brand-grey-400 border-t border-brand-grey-800/60">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Requested Slot: {job.requested_slot || "ASAP / Flexible"}</span>
        </div>
      </div>

      {/* Lifecycle Workflow Stepper & Big Action Button */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-brand-grey-900 to-brand-grey-950 border border-brand-grey-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-brand-grey-300 uppercase tracking-wider">
            Job Status Workflow
          </span>
          <span className="text-xs font-extrabold text-amber-400">{job.status}</span>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
          <div
            className={`py-1.5 rounded-lg border ${
              ["Assigned", "On the way", "Arrived", "In Progress", "Done", "Paid"].includes(job.status)
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-brand-grey-800/40 border-brand-grey-800 text-brand-grey-500"
            }`}
          >
            1. Assigned
          </div>
          <div
            className={`py-1.5 rounded-lg border ${
              ["On the way", "Arrived", "In Progress", "Done", "Paid"].includes(job.status)
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-brand-grey-800/40 border-brand-grey-800 text-brand-grey-500"
            }`}
          >
            2. On Way
          </div>
          <div
            className={`py-1.5 rounded-lg border ${
              ["Arrived", "In Progress", "Done", "Paid"].includes(job.status)
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-brand-grey-800/40 border-brand-grey-800 text-brand-grey-500"
            }`}
          >
            3. Arrived
          </div>
          <div
            className={`py-1.5 rounded-lg border ${
              ["In Progress", "Done", "Paid"].includes(job.status)
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-brand-grey-800/40 border-brand-grey-800 text-brand-grey-500"
            }`}
          >
            4. Working
          </div>
        </div>

        {/* Primary Action Button by Status */}
        <div className="pt-2">
          {job.status === "Assigned" && (
            <button
              onClick={() => handleUpdateStatus("On the way")}
              disabled={statusLoading}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>🚀 Start Trip · I&apos;m On The Way</span>
            </button>
          )}

          {job.status === "On the way" && (
            <button
              onClick={() => handleUpdateStatus("Arrived")}
              disabled={statusLoading}
              className="w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-black font-black text-sm shadow-xl shadow-teal-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>📍 I Have Arrived at Society Gate / Flat</span>
            </button>
          )}

          {job.status === "Arrived" && (
            <button
              onClick={() => handleUpdateStatus("In Progress")}
              disabled={statusLoading}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>🔧 Start Inspection &amp; Repair Work</span>
            </button>
          )}

          {job.status === "In Progress" && (
            <button
              onClick={() => handleUpdateStatus("Done")}
              disabled={statusLoading}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>✅ Repair Finished · Ready for Payment</span>
            </button>
          )}

          {["Done", "Paid"].includes(job.status) && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Repair Completed &amp; Workmanship Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Spare Parts & Expenses Section */}
      <div className="p-5 rounded-3xl bg-brand-grey-900 border border-brand-grey-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Spare Parts &amp; Receipts
            </span>
          </div>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Part / Bill</span>
          </button>
        </div>

        {/* Expenses List */}
        {job.expenses && job.expenses.length > 0 ? (
          <div className="space-y-2.5">
            {job.expenses.map((exp) => (
              <div
                key={exp.id}
                className="p-3 rounded-2xl bg-brand-grey-950/70 border border-brand-grey-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{exp.item_name}</span>
                  <span className="text-brand-grey-400 text-[11px] block">
                    Qty {exp.quantity} × ₹{exp.unit_price}
                    {exp.notes ? ` · ${exp.notes}` : ""}
                  </span>
                  {exp.receipt_photo_url && (
                    <button
                      onClick={() => setPreviewPhoto(exp.receipt_photo_url!)}
                      className="mt-1 text-[11px] text-amber-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Receipt className="w-3 h-3" />
                      <span>View Receipt Photo Proof</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-amber-400 text-sm">
                    ₹{exp.total_price}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(exp.id)}
                    className="p-1.5 rounded-lg text-brand-grey-500 hover:text-rose-400 hover:bg-brand-grey-800 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-brand-grey-500 italic py-2 text-center">
            No spare parts recorded. If you purchased materials from a hardware shop, tap &quot;Add Part / Bill&quot; to attach the receipt.
          </p>
        )}
      </div>

      {/* Roadblock / Issue Escalation Section */}
      <div className="p-5 rounded-3xl bg-brand-grey-900 border border-brand-grey-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Roadblock / Delay Alerts
            </span>
          </div>

          <button
            onClick={() => setShowIssueModal(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <span>Report Roadblock</span>
          </button>
        </div>

        {/* Existing Issues */}
        {job.issues && job.issues.length > 0 ? (
          <div className="space-y-2">
            {job.issues.map((iss) => (
              <div
                key={iss.id}
                className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300 uppercase tracking-wider text-[10px]">
                    {iss.category.replace(/_/g, " ")} ({iss.severity})
                  </span>
                  <span className="text-brand-grey-400 text-[10px]">
                    {new Date(iss.reported_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-brand-grey-200">{iss.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-brand-grey-500 py-1 text-center">
            Job proceeding normally with no reported roadblocks.
          </p>
        )}
      </div>

      {/* Doorstep Bill Calculation & UPI Collection */}
      <div className="p-5 rounded-3xl bg-brand-grey-900 border border-brand-grey-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-brand-grey-400 uppercase tracking-wider">
            Total Customer Bill
          </span>
          <span className="text-xs text-brand-grey-500">
            DPDP &amp; GST Compliant
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-brand-grey-950 border border-brand-grey-800 space-y-2 text-xs">
          <div className="flex justify-between text-brand-grey-300">
            <span>Labor &amp; Inspection:</span>
            <span className="font-semibold text-white">₹{laborCost}</span>
          </div>

          <div className="flex justify-between text-brand-grey-300">
            <span>Parts at Actuals (from receipts):</span>
            <span className="font-semibold text-amber-400">₹{partsCost}</span>
          </div>

          <div className="flex justify-between text-brand-grey-300">
            <span>Procurement &amp; Handling Fee:</span>
            <span className="font-semibold text-brand-grey-300">₹{handlingCost}</span>
          </div>

          <div className="pt-2 border-t border-brand-grey-800 flex justify-between items-center text-sm font-black">
            <span className="text-white">Amount to Collect:</span>
            <span className="text-xl text-emerald-400">₹{totalBill}</span>
          </div>
        </div>

        {/* Collect Payment CTA */}
        <button
          onClick={() => setShowPaymentModal(true)}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <QrCode className="w-5 h-5" />
          <span>Present Doorstep UPI QR to Resident</span>
        </button>
      </div>

      {/* Modals */}
      {showExpenseModal && (
        <ExpenseModal
          jobId={job.id}
          onClose={() => setShowExpenseModal(false)}
          onExpenseAdded={(newExp) => {
            const nextExpenses = [...(job.expenses || []), newExp];
            const newPartsTotal = nextExpenses.reduce((sum, e) => sum + Number(e.total_price), 0);
            const labor = Number(job.estimate_amount) || 250;
            const handling = Number(job.handling_fee) || 30;
            setJob({
              ...job,
              expenses: nextExpenses,
              parts_amount: newPartsTotal,
              final_amount: labor + newPartsTotal + handling,
            });
          }}
        />
      )}

      {showIssueModal && (
        <IssueModal
          jobId={job.id}
          onClose={() => setShowIssueModal(false)}
          onIssueReported={(newIssue) => {
            setJob({
              ...job,
              status: newIssue.severity === "blocking" ? "Partial" : job.status,
              issues: [newIssue, ...(job.issues || [])],
            });
          }}
        />
      )}

      {showPaymentModal && (
        <DoorstepPaymentModal
          jobId={job.id}
          customerName={job.customer?.name || "Resident"}
          customerPhone={job.customer?.phone || ""}
          societyName={job.society?.name || "NIBM Society"}
          flatNo={job.customer?.flat_no || "Flat"}
          service={job.service}
          estimateAmount={laborCost}
          partsAmount={partsCost}
          handlingFee={handlingCost}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={(invoiceNo) => {
            setJob({ ...job, status: "Paid" });
            setShowPaymentModal(false);
          }}
        />
      )}

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={previewPhoto}
            alt="Receipt Full View"
            className="max-h-[85vh] max-w-full rounded-2xl object-contain border border-brand-grey-700"
          />
        </div>
      )}
    </div>
  );
}
