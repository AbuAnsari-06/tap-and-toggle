"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Phone,
  UserCheck,
  Search,
  Filter,
  ArrowUpRight,
  RefreshCw,
  MapPin,
  Wrench,
  Zap,
  X,
  MessageSquare,
  DollarSign,
  ShieldCheck,
  ChevronDown,
  Calendar,
  Send,
  Check,
  QrCode,
} from "lucide-react";
import { JobStatus, ServiceType } from "@/types/database";
import {
  AdminJobView,
  fetchAdminJobsAction,
  updateJobStatusAction,
  updateJobDetailsAction,
} from "@/app/actions/adminJobs";
import { generateWhatsAppDispatchLink } from "@/lib/dispatch/whatsappDispatch";
import { DoorstepPaymentModal } from "@/components/admin/DoorstepPaymentModal";

const ALL_STATUSES: JobStatus[] = [
  "New",
  "Contacted",
  "Estimated",
  "Approved",
  "Scheduled",
  "Assigned",
  "On the way",
  "Arrived",
  "In Progress",
  "Done",
  "Paid",
  "Warranty",
  "Closed",
  "Rescheduled",
  "Cancelled",
];

const BENCH_PROS = [
  { id: "pro-001", name: "Ramesh Shinde", phone: "+91 98220 11111", service: "plumbing" },
  { id: "pro-002", name: "Suresh Patil", phone: "+91 98220 22222", service: "plumbing" },
  { id: "pro-003", name: "Amit Deshmukh", phone: "+91 98220 33333", service: "electrical" },
  { id: "pro-004", name: "Vikas More", phone: "+91 98220 44444", service: "electrical" },
];

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<AdminJobView[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "emergency" | "new" | "in_field" | "completed">("all");
  const [filterService, setFilterService] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<AdminJobView | null>(null);
  const [paymentJob, setPaymentJob] = useState<AdminJobView | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal editing form state
  const [modalStatus, setModalStatus] = useState<JobStatus>("New");
  const [modalProId, setModalProId] = useState<string>("");
  const [modalEstimate, setModalEstimate] = useState<number>(0);
  const [modalParts, setModalParts] = useState<number>(0);
  const [modalHandling, setModalHandling] = useState<number>(30);

  const loadJobs = async () => {
    setLoading(true);
    const res = await fetchAdminJobsAction();
    if (res.success && res.jobs) {
      setJobs(res.jobs);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const openJobModal = (job: AdminJobView) => {
    setSelectedJob(job);
    setModalStatus(job.status);
    setModalProId(job.pro_id || "");
    setModalEstimate(job.estimate_amount || 0);
    setModalParts(job.parts_amount || 0);
    setModalHandling(job.handling_fee || 30);
  };

  const handleQuickStatusChange = async (jobId: string, newStatus: JobStatus) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
    await updateJobStatusAction(jobId, newStatus);
  };

  const handleSaveModal = async () => {
    if (!selectedJob) return;
    setIsUpdating(true);

    const chosenPro = BENCH_PROS.find((p) => p.id === modalProId);
    const finalBill = Number(modalEstimate) + Number(modalParts) + Number(modalHandling);

    const updatedData = {
      status: modalStatus,
      pro_id: modalProId || null,
      estimate_amount: Number(modalEstimate),
      parts_amount: Number(modalParts),
      handling_fee: Number(modalHandling),
      final_amount: finalBill,
    };

    setJobs((prev) =>
      prev.map((j) =>
        j.id === selectedJob.id
          ? {
              ...j,
              ...updatedData,
              pro_name: chosenPro?.name || j.pro_name,
              pro_phone: chosenPro?.phone || j.pro_phone,
            }
          : j
      )
    );

    await updateJobDetailsAction(selectedJob.id, updatedData);
    setIsUpdating(false);
    setSelectedJob(null);
  };

  // Metrics counters
  const emergencyCount = jobs.filter((j) => j.is_emergency).length;
  const newCount = jobs.filter((j) => j.status === "New" || j.status === "Contacted").length;
  const inFieldCount = jobs.filter(
    (j) =>
      j.status === "Assigned" ||
      j.status === "On the way" ||
      j.status === "Arrived" ||
      j.status === "In Progress"
  ).length;
  const completedCount = jobs.filter(
    (j) => j.status === "Done" || j.status === "Paid" || j.status === "Warranty" || j.status === "Closed"
  ).length;

  const filteredJobs = jobs.filter((j) => {
    if (activeTab === "emergency" && !j.is_emergency) return false;
    if (activeTab === "new" && !(j.status === "New" || j.status === "Contacted")) return false;
    if (
      activeTab === "in_field" &&
      !(
        j.status === "Assigned" ||
        j.status === "On the way" ||
        j.status === "Arrived" ||
        j.status === "In Progress"
      )
    )
      return false;
    if (
      activeTab === "completed" &&
      !(
        j.status === "Done" ||
        j.status === "Paid" ||
        j.status === "Warranty" ||
        j.status === "Closed"
      )
    )
      return false;

    if (filterService !== "all" && j.service !== filterService) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        j.customer_name.toLowerCase().includes(q) ||
        j.society_name.toLowerCase().includes(q) ||
        j.flat_no.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.customer_phone.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "New":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "Contacted":
      case "Estimated":
        return "bg-sky-500/20 text-sky-300 border-sky-500/40";
      case "Approved":
      case "Scheduled":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/40";
      case "Assigned":
      case "On the way":
      case "Arrived":
        return "bg-brand-teal-500/20 text-brand-teal-300 border-brand-teal-500/40";
      case "In Progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "Done":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "Paid":
      case "Warranty":
      case "Closed":
        return "bg-emerald-600/30 text-emerald-200 border-emerald-500/50";
      case "Cancelled":
      case "No-show":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      default:
        return "bg-brand-grey-700 text-brand-grey-300 border-brand-grey-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-brand-grey-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Live Job Triage &amp; Dispatch Board</span>
            <span className="px-2 py-0.5 rounded-full bg-brand-teal-900/80 border border-brand-teal-700 text-brand-teal-300 text-xs font-semibold">
              State Machine
            </span>
          </h1>
          <p className="text-xs text-brand-grey-400 mt-1">
            End-to-end lifecycle progression from new lead to paid &amp; 7-day warranty
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadJobs}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-brand-grey-800 hover:bg-brand-grey-700 text-brand-grey-200 text-xs font-semibold border border-brand-grey-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Emergencies Card */}
        <div
          onClick={() => setActiveTab(activeTab === "emergency" ? "all" : "emergency")}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeTab === "emergency"
              ? "bg-red-950 border-red-500 ring-2 ring-red-500/50 shadow-lg"
              : "bg-red-950/40 hover:bg-red-950/70 border-red-900/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Active Hazards</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-red-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">{emergencyCount}</div>
          <p className="text-[11px] text-red-300/80 mt-0.5">
            {emergencyCount > 0 ? "Priority response <30 mins" : "No active hazards"}
          </p>
        </div>

        {/* New Leads */}
        <div
          onClick={() => setActiveTab(activeTab === "new" ? "all" : "new")}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeTab === "new"
              ? "bg-brand-grey-800 border-amber-500 ring-2 ring-amber-500/50"
              : "bg-brand-grey-800/80 hover:bg-brand-grey-800 border-brand-grey-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-amber-400" />
              <span>New Leads</span>
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-white">{newCount}</div>
          <p className="text-[11px] text-brand-grey-400 mt-0.5">Awaiting WhatsApp estimate</p>
        </div>

        {/* In Field */}
        <div
          onClick={() => setActiveTab(activeTab === "in_field" ? "all" : "in_field")}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeTab === "in_field"
              ? "bg-brand-grey-800 border-brand-teal-500 ring-2 ring-brand-teal-500/50"
              : "bg-brand-grey-800/80 hover:bg-brand-grey-800 border-brand-grey-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-brand-teal-400" />
              <span>In Field / Assigned</span>
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-white">{inFieldCount}</div>
          <p className="text-[11px] text-brand-grey-400 mt-0.5">Technicians on the way / on site</p>
        </div>

        {/* Completed & Paid */}
        <div
          onClick={() => setActiveTab(activeTab === "completed" ? "all" : "completed")}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeTab === "completed"
              ? "bg-brand-grey-800 border-emerald-500 ring-2 ring-emerald-500/50"
              : "bg-brand-grey-800/80 hover:bg-brand-grey-800 border-brand-grey-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Completed / Paid</span>
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-white">{completedCount}</div>
          <p className="text-[11px] text-brand-grey-400 mt-0.5">Under 7-day warranty protection</p>
        </div>
      </div>

      {/* Tabs & Search Filter Controls */}
      <div className="space-y-3">
        {/* State Machine Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-brand-grey-800">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "all"
                ? "bg-brand-teal-600 text-white"
                : "text-brand-grey-400 hover:text-white hover:bg-brand-grey-800"
            }`}
          >
            All Tickets ({jobs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("emergency")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "emergency"
                ? "bg-red-700 text-white"
                : "text-red-400 hover:text-red-300 hover:bg-red-950/40"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Emergencies ({emergencyCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("new")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "new"
                ? "bg-amber-600 text-white"
                : "text-amber-400 hover:text-amber-300 hover:bg-amber-950/40"
            }`}
          >
            New Leads ({newCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("in_field")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "in_field"
                ? "bg-brand-teal-700 text-white"
                : "text-brand-teal-400 hover:text-brand-teal-300 hover:bg-brand-teal-950/40"
            }`}
          >
            In Field ({inFieldCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "completed"
                ? "bg-emerald-700 text-white"
                : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40"
            }`}
          >
            Done &amp; Paid ({completedCount})
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-brand-grey-800/60 p-3 rounded-2xl border border-brand-grey-700/80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-grey-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resident, society, flat, phone, or issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-brand-grey-900 border border-brand-grey-700 text-xs text-white placeholder-brand-grey-400 focus:outline-none focus:border-brand-teal-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="px-3 py-2 rounded-xl bg-brand-grey-900 border border-brand-grey-700 text-xs text-brand-grey-200 focus:outline-none focus:border-brand-teal-500 cursor-pointer"
            >
              <option value="all">All Services</option>
              <option value="plumbing">Plumbing Only</option>
              <option value="electrical">Electrical Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ticket Cards Stream */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-brand-grey-800/20 rounded-2xl border border-brand-grey-800">
            <p className="text-sm text-brand-grey-400">
              No tickets found in this view.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`p-4 sm:p-5 rounded-2xl border transition shadow-sm ${
                job.is_emergency
                  ? "bg-red-950/20 border-red-900/80 hover:border-red-700"
                  : "bg-brand-grey-800/50 hover:bg-brand-grey-800/80 border-brand-grey-700/60"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Ticket Content */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Emergency Hazard Badge */}
                    {job.is_emergency && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-900 text-red-100 border border-red-700 flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Emergency Hazard</span>
                      </span>
                    )}

                    {/* Service Type */}
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        job.service === "plumbing"
                          ? "bg-brand-teal-950 text-brand-teal-300 border border-brand-teal-800"
                          : "bg-amber-950 text-amber-300 border border-amber-800"
                      }`}
                    >
                      {job.service === "plumbing" ? (
                        <Wrench className="w-3 h-3" />
                      ) : (
                        <Zap className="w-3 h-3" />
                      )}
                      <span>{job.service}</span>
                    </span>

                    {/* Society & Flat */}
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-grey-400" />
                      <span>
                        {job.society_name} &bull; {job.flat_no}
                      </span>
                    </span>

                    <span className="text-[11px] text-brand-grey-500">
                      {new Date(job.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-brand-grey-100 leading-snug">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-brand-grey-400">
                    <span className="font-bold text-brand-grey-200">
                      {job.customer_name}
                    </span>
                    <a
                      href={`tel:${job.customer_phone.replace(/\s+/g, "")}`}
                      className="hover:text-brand-teal-300 flex items-center gap-1 font-medium"
                    >
                      <Phone className="w-3 h-3 text-brand-teal-400" />
                      <span>{job.customer_phone}</span>
                    </a>

                    {job.pro_name ? (
                      <span className="text-brand-teal-300 font-semibold flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Assigned Pro: {job.pro_name}</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium">
                        ⚠️ No pro assigned yet
                      </span>
                    )}

                    {job.final_amount ? (
                      <span className="text-emerald-300 font-bold flex items-center gap-0.5">
                        <DollarSign className="w-3 h-3" />
                        <span>Total: ₹{job.final_amount}</span>
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Right: State Machine Dropdown & Details Button */}
                <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
                  {/* Quick Status Dropdown */}
                  <div className="relative">
                    <select
                      value={job.status}
                      onChange={(e) =>
                        handleQuickStatusChange(job.id, e.target.value as JobStatus)
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st} className="bg-brand-grey-900 text-white">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Collect UPI Payment Button */}
                  {job.status === "Paid" || job.status === "Warranty" || job.status === "Closed" ? (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Paid</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPaymentJob(job)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Collect Doorstep UPI Payment"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Collect UPI</span>
                    </button>
                  )}

                  {/* Manage Ticket Button */}
                  <button
                    type="button"
                    onClick={() => openJobModal(job)}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-teal-700 hover:bg-brand-teal-600 text-white text-xs font-bold shadow transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage</span>
                  </button>

                  {/* Public Tracking Link */}
                  <Link
                    href={`/track/${job.id}`}
                    target="_blank"
                    className="p-1.5 rounded-xl bg-brand-grey-800 hover:bg-brand-grey-700 text-brand-grey-400 hover:text-white transition"
                    title="Open Live Tracking URL"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Slide-over / Modal for Job Lifecycle Management */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-brand-grey-900 border border-brand-grey-700 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-brand-grey-800">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedJob.service === "plumbing"
                        ? "bg-brand-teal-950 text-brand-teal-300 border border-brand-teal-800"
                        : "bg-amber-950 text-amber-300 border border-amber-800"
                    }`}
                  >
                    {selectedJob.service}
                  </span>
                  {selectedJob.is_emergency && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-900 text-red-100 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Hazard</span>
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  {selectedJob.customer_name} &bull; {selectedJob.society_name} ({selectedJob.flat_no})
                </h3>
                <p className="text-xs text-brand-grey-400">{selectedJob.customer_phone}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="p-1.5 rounded-lg text-brand-grey-400 hover:text-white hover:bg-brand-grey-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Issue Description */}
            <div className="bg-brand-grey-800/60 p-3.5 rounded-2xl border border-brand-grey-700/60">
              <label className="text-[11px] font-bold text-brand-grey-400 uppercase tracking-wider block mb-1">
                Reported Issue
              </label>
              <p className="text-xs text-brand-grey-100 leading-relaxed font-medium">
                {selectedJob.description}
              </p>
            </div>

            {/* Lifecycle State Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-grey-300">
                Ticket Lifecycle Status (State Machine)
              </label>
              <select
                value={modalStatus}
                onChange={(e) => setModalStatus(e.target.value as JobStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-sm font-semibold text-brand-teal-300 focus:outline-none focus:border-brand-teal-500 cursor-pointer"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Assign Pro Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-grey-300">
                Assign Technician from Bench
              </label>
              <select
                value={modalProId}
                onChange={(e) => setModalProId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-sm font-semibold text-brand-grey-100 focus:outline-none focus:border-brand-teal-500 cursor-pointer"
              >
                <option value="">-- No Pro Assigned --</option>
                {BENCH_PROS.filter((p) => p.service === selectedJob.service).map((pro) => (
                  <option key={pro.id} value={pro.id}>
                    {pro.name} ({pro.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Financial Calculator (Labor + Parts + Handling) */}
            <div className="bg-brand-grey-800/40 p-4 rounded-2xl border border-brand-grey-700/80 space-y-3">
              <span className="text-xs font-bold text-white block">
                Financials &amp; Bill Breakdown
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-brand-grey-400 block mb-1">Labor (₹)</label>
                  <input
                    type="number"
                    value={modalEstimate}
                    onChange={(e) => setModalEstimate(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-brand-grey-900 border border-brand-grey-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-grey-400 block mb-1">Parts (₹)</label>
                  <input
                    type="number"
                    value={modalParts}
                    onChange={(e) => setModalParts(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-brand-grey-900 border border-brand-grey-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-grey-400 block mb-1">Handling (₹)</label>
                  <input
                    type="number"
                    value={modalHandling}
                    onChange={(e) => setModalHandling(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-brand-grey-900 border border-brand-grey-700 text-xs text-white"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-brand-grey-700 flex items-center justify-between text-xs">
                <span className="text-brand-grey-300 font-semibold">Total Customer Bill:</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{Number(modalEstimate) + Number(modalParts) + Number(modalHandling)}
                </span>
              </div>
            </div>

            {/* 1-Click WhatsApp Dispatch Briefing Button */}
            {modalProId && (
              <div className="pt-1">
                {(() => {
                  const assignedPro = BENCH_PROS.find((p) => p.id === modalProId);
                  if (!assignedPro) return null;
                  const dispatchLink = generateWhatsAppDispatchLink({
                    proPhone: assignedPro.phone,
                    proName: assignedPro.name,
                    customerName: selectedJob.customer_name,
                    customerPhone: selectedJob.customer_phone,
                    societyName: selectedJob.society_name,
                    flatNo: selectedJob.flat_no,
                    service: selectedJob.service,
                    description: selectedJob.description,
                    isEmergency: selectedJob.is_emergency,
                    jobId: selectedJob.id,
                  });
                  return (
                    <a
                      href={dispatchLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>1-Click WhatsApp Dispatch to {assignedPro.name}</span>
                    </a>
                  );
                })()}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-grey-400 hover:text-white hover:bg-brand-grey-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doorstep Direct UPI Payment Modal */}
      {paymentJob && (
        <DoorstepPaymentModal
          jobId={paymentJob.id}
          customerName={paymentJob.customer_name}
          customerPhone={paymentJob.customer_phone}
          societyName={paymentJob.society_name}
          flatNo={paymentJob.flat_no}
          service={paymentJob.service}
          estimateAmount={paymentJob.estimate_amount || 0}
          partsAmount={paymentJob.parts_amount || 0}
          handlingFee={paymentJob.handling_fee || 30}
          onClose={() => setPaymentJob(null)}
          onPaymentSuccess={(invoiceNo) => {
            setJobs((prev) =>
              prev.map((j) => (j.id === paymentJob.id ? { ...j, status: "Paid" } : j))
            );
          }}
        />
      )}
    </div>
  );
}
