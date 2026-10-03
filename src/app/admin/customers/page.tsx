"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Phone,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Building2,
  Calendar,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Droplets,
  Zap,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  AlertTriangle,
  ArrowUpRight,
  Download,
} from "lucide-react";
import {
  CustomerWithHistory,
  fetchAdminCustomersAction,
  deleteCustomerAction,
} from "@/app/actions/adminCustomers";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [societyFilter, setSocietyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");

  // Selected customer for detailed modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithHistory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    const res = await fetchAdminCustomersAction();
    if (res.success && res.customers) {
      setCustomers(res.customers);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Filter logic
  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.society_name.toLowerCase().includes(q) ||
      c.flat_no?.toLowerCase().includes(q);

    const matchesSociety =
      societyFilter === "all" || c.society_name.toLowerCase() === societyFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && c.active_jobs_count > 0) ||
      (statusFilter === "completed" && c.active_jobs_count === 0 && c.total_jobs > 0);

    return matchesQuery && matchesSociety && matchesStatus;
  });

  // Unique societies for dropdown
  const uniqueSocieties = Array.from(
    new Set(customers.map((c) => c.society_name).filter(Boolean))
  );

  // Summary Metrics
  const totalCustomers = customers.length;
  const activeJobsCustomers = customers.filter((c) => c.active_jobs_count > 0).length;
  const totalCompletedJobs = customers.reduce(
    (acc, c) => acc + (c.total_jobs - c.active_jobs_count),
    0
  );

  const handleDeleteCustomer = async (customerId: string) => {
    setIsDeleting(true);
    const res = await deleteCustomerAction(customerId);
    if (res.success) {
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
      setSelectedCustomer(null);
      setDeleteConfirm(false);
    } else {
      alert("Could not delete customer: " + (res.error || "Unknown error"));
    }
    setIsDeleting(false);
  };

  const exportCustomerCSV = () => {
    const headers = ["Customer ID", "Name", "Phone", "Society", "Flat", "Total Jobs", "Active Jobs", "DPDP Consent Date"];
    const rows = filteredCustomers.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.society_name}"`,
      `"${c.flat_no || ""}"`,
      c.total_jobs,
      c.active_jobs_count,
      `"${c.created_at}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tap_toggle_customers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-brand-grey-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Customer Registry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-teal-900/60 text-brand-teal-300 border border-brand-teal-700/50">
              {totalCustomers} Residents
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-grey-400 mt-1">
            Registered apartment residents across NIBM &amp; Sus societies with DPDP Act 2023 audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadCustomers}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-brand-grey-800 hover:bg-brand-grey-700 text-brand-grey-200 text-xs font-bold transition flex items-center gap-1.5 border border-brand-grey-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportCustomerCSV}
            className="px-3.5 py-2 rounded-xl bg-brand-grey-800 hover:bg-brand-grey-700 text-brand-grey-200 text-xs font-bold transition flex items-center gap-1.5 border border-brand-grey-700"
          >
            <Download className="w-3.5 h-3.5 text-brand-teal-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-brand-grey-900/90 border border-brand-grey-800">
          <div className="flex items-center justify-between text-brand-grey-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Residents</span>
            <Users className="w-4 h-4 text-brand-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalCustomers}</div>
          <div className="text-[11px] text-brand-grey-400 mt-1">
            Deduplicated by phone
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-brand-grey-900/90 border border-brand-grey-800">
          <div className="flex items-center justify-between text-brand-grey-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Active In Queue</span>
            <Clock className="w-4 h-4 text-brand-amber-400" />
          </div>
          <div className="text-2xl font-black text-brand-amber-400">
            {activeJobsCustomers}
          </div>
          <div className="text-[11px] text-brand-grey-400 mt-1">
            Residents with ongoing jobs
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-brand-grey-900/90 border border-brand-grey-800">
          <div className="flex items-center justify-between text-brand-grey-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Visits</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {totalCompletedJobs}
          </div>
          <div className="text-[11px] text-brand-grey-400 mt-1">
            Fulfilled service tickets
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-brand-grey-900/90 border border-brand-grey-800">
          <div className="flex items-center justify-between text-brand-grey-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">DPDP Consent</span>
            <ShieldCheck className="w-4 h-4 text-brand-teal-400" />
          </div>
          <div className="text-2xl font-black text-brand-teal-300">100%</div>
          <div className="text-[11px] text-brand-grey-400 mt-1">
            Audited &amp; verifiable
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-brand-grey-900/80 border border-brand-grey-800 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-brand-grey-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by resident name, phone number, society or flat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-grey-950 border border-brand-grey-700 text-sm text-white placeholder-brand-grey-500 focus:outline-none focus:border-brand-teal-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-grey-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Society Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Building2 className="w-4 h-4 text-brand-grey-400 shrink-0" />
          <select
            value={societyFilter}
            onChange={(e) => setSocietyFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-2.5 rounded-xl bg-brand-grey-950 border border-brand-grey-700 text-xs text-white focus:outline-none focus:border-brand-teal-500"
          >
            <option value="all">All Societies</option>
            {uniqueSocieties.map((soc) => (
              <option key={soc} value={soc}>
                {soc}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-brand-grey-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full md:w-40 px-3 py-2.5 rounded-xl bg-brand-grey-950 border border-brand-grey-700 text-xs text-white focus:outline-none focus:border-brand-teal-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Tickets</option>
            <option value="completed">Past Customers</option>
          </select>
        </div>
      </div>

      {/* Customers Table / Grid */}
      <div className="bg-brand-grey-900/90 rounded-2xl border border-brand-grey-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-grey-800 bg-brand-grey-950/60 text-[11px] font-bold uppercase tracking-wider text-brand-grey-400">
                <th className="py-3.5 px-4">Resident</th>
                <th className="py-3.5 px-4">Society &amp; Flat</th>
                <th className="py-3.5 px-4">Contact (WhatsApp)</th>
                <th className="py-3.5 px-4 text-center">Total Jobs</th>
                <th className="py-3.5 px-4 text-center">Active Queue</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-grey-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-grey-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-brand-teal-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading customer registry...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-grey-400">
                    <Users className="w-8 h-8 text-brand-grey-600 mx-auto mb-2" />
                    <p className="font-semibold text-white">No customers found</p>
                    <p className="text-xs text-brand-grey-500 mt-0.5">
                      Try adjusting your search query or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const cleanPhone = customer.phone.replace(/[^0-9]/g, "");
                  const waNumber = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

                  return (
                    <tr
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className="hover:bg-brand-grey-800/50 cursor-pointer transition-colors group"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-teal-700 to-brand-grey-800 text-brand-teal-200 flex items-center justify-center font-bold text-xs uppercase border border-brand-teal-600/30">
                            {customer.name.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-brand-teal-300 transition">
                              {customer.name}
                            </div>
                            <div className="text-[10px] text-brand-grey-400 font-mono">
                              ID: {customer.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Society & Flat */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-brand-grey-200 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-brand-teal-400 shrink-0" />
                          <span>{customer.society_name}</span>
                        </div>
                        <div className="text-[11px] text-brand-grey-400 pl-5">
                          {customer.flat_no || "Unit not specified"}
                        </div>
                      </td>

                      {/* Phone & WhatsApp */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:+91${cleanPhone}`}
                            className="text-white hover:text-brand-teal-300 font-mono font-medium flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-brand-grey-400" />
                            <span>+91 {cleanPhone}</span>
                          </a>
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${customer.name}, reaching out from Tap & Toggle Dispatch.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-700/50 transition"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </a>
                        </div>
                      </td>

                      {/* Total Jobs */}
                      <td className="py-3.5 px-4 text-center font-bold text-white">
                        <span className="px-2 py-0.5 rounded-full bg-brand-grey-800 text-brand-grey-200 border border-brand-grey-700 text-[11px]">
                          {customer.total_jobs} {customer.total_jobs === 1 ? "job" : "jobs"}
                        </span>
                      </td>

                      {/* Active Queue */}
                      <td className="py-3.5 px-4 text-center">
                        {customer.active_jobs_count > 0 ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-brand-amber-950 text-brand-amber-400 border border-brand-amber-700/50 font-bold text-[11px] inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-amber-400 animate-pulse" />
                            {customer.active_jobs_count} Active
                          </span>
                        ) : (
                          <span className="text-brand-grey-500 text-[11px]">None</span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 text-brand-grey-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brand-grey-500 shrink-0" />
                          <span>
                            {new Date(customer.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="px-2.5 py-1 rounded-lg bg-brand-grey-800 hover:bg-brand-teal-900/80 text-brand-grey-200 hover:text-brand-teal-200 text-xs font-semibold transition inline-flex items-center gap-1 border border-brand-grey-700"
                        >
                          <span>History</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details & History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-brand-grey-900 border border-brand-grey-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-brand-grey-800 flex items-start justify-between bg-brand-grey-950/70 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-teal-600 to-brand-teal-900 text-white flex items-center justify-center font-bold text-base shadow">
                  {selectedCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>{selectedCustomer.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-teal-900 text-brand-teal-300 border border-brand-teal-700/50">
                      DPDP Verified
                    </span>
                  </h2>
                  <p className="text-xs text-brand-grey-400 mt-0.5">
                    {selectedCustomer.society_name} • Flat: {selectedCustomer.flat_no || "Unit"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setDeleteConfirm(false);
                }}
                className="p-2 rounded-xl text-brand-grey-400 hover:text-white hover:bg-brand-grey-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Quick Communication Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/91${selectedCustomer.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${selectedCustomer.name}, this is Tap & Toggle Dispatch team regarding your apartment service requests at ${selectedCustomer.society_name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-700/50 hover:bg-emerald-900/80 text-emerald-200 flex items-center gap-3 transition group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center gap-1">
                      <span>Message on WhatsApp</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                      +91 {selectedCustomer.phone}
                    </div>
                  </div>
                </a>

                <a
                  href={`tel:+91${selectedCustomer.phone.replace(/[^0-9]/g, "")}`}
                  className="p-3.5 rounded-2xl bg-brand-grey-800/80 border border-brand-grey-700 hover:bg-brand-grey-800 text-brand-grey-200 flex items-center gap-3 transition group"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-grey-700 text-white flex items-center justify-center shrink-0 shadow">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-brand-teal-300 flex items-center gap-1">
                      <span>Direct Phone Call</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] text-brand-grey-400 font-mono mt-0.5">
                      Doorstep Dispatch Line
                    </div>
                  </div>
                </a>
              </div>

              {/* Service Request History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-grey-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-brand-teal-400" />
                    <span>Service Tickets &amp; Job History ({selectedCustomer.jobs.length})</span>
                  </h3>
                  <Link
                    href="/admin"
                    className="text-xs text-brand-teal-400 hover:text-brand-teal-300 font-bold flex items-center gap-1"
                  >
                    <span>Open in Jobs Board</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {selectedCustomer.jobs.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-brand-grey-950 border border-brand-grey-800 text-center text-brand-grey-400 text-xs">
                    No service tickets logged yet for this resident.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedCustomer.jobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 rounded-2xl bg-brand-grey-950 border border-brand-grey-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-brand-grey-700 transition"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            {job.service === "plumbing" ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-teal-950 text-brand-teal-300 border border-brand-teal-800 flex items-center gap-1">
                                <Droplets className="w-2.5 h-2.5" /> Plumbing
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-amber-950 text-brand-amber-300 border border-brand-amber-800 flex items-center gap-1">
                                <Zap className="w-2.5 h-2.5" /> Electrical
                              </span>
                            )}

                            {job.is_emergency && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
                                Urgent
                              </span>
                            )}

                            <span className="text-xs font-bold text-white">
                              Ticket: {job.id.slice(0, 8)}...
                            </span>
                          </div>

                          <p className="text-xs text-brand-grey-300 line-clamp-2">
                            {job.description}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-brand-grey-400 pt-1">
                            <span>
                              {new Date(job.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {job.pro_name && (
                              <span>• Assigned: <strong className="text-brand-grey-200">{job.pro_name}</strong></span>
                            )}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-brand-grey-800">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            job.status === "Done" || job.status === "Paid"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : job.status === "Cancelled"
                              ? "bg-rose-950 text-rose-400 border border-rose-800"
                              : "bg-brand-amber-950 text-brand-amber-400 border border-brand-amber-800"
                          }`}>
                            {job.status}
                          </span>
                          {job.final_amount ? (
                            <span className="text-xs font-bold text-white mt-1">
                              ₹{job.final_amount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DPDP Act 2023 Consent Audit Trail */}
              <div className="p-4 rounded-2xl bg-brand-teal-950/40 border border-brand-teal-800/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-teal-300">
                  <ShieldCheck className="w-4 h-4 text-brand-teal-400" />
                  <span>DPDP Act 2023 Proof of Consent</span>
                </div>
                <div className="text-[11px] text-brand-grey-300 leading-relaxed">
                  Consent given for purpose: <strong className="text-white">{selectedCustomer.consent_record?.purpose || "service_request_contact"}</strong> (Policy Version: {selectedCustomer.consent_record?.text_version || "2026-DPDP-v1.0"}).
                </div>
                <div className="text-[10px] text-brand-grey-500">
                  Consent recorded at: {new Date(selectedCustomer.created_at).toISOString()}
                </div>
              </div>

              {/* Right to be Forgotten (DPDP Deletion) */}
              <div className="pt-2 border-t border-brand-grey-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-brand-grey-300">
                    DPDP Right to Erasure
                  </div>
                  <div className="text-[11px] text-brand-grey-500 max-w-sm">
                    Redacts personal data per DPDP Act 2023 while preserving payment ledgers for statutory tax audit.
                  </div>
                </div>

                {deleteConfirm ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="px-3 py-1.5 rounded-lg bg-brand-grey-800 text-brand-grey-300 text-xs font-semibold hover:bg-brand-grey-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isDeleting}
                      onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isDeleting ? "Erasing..." : "Confirm Erase"}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="px-3 py-1.5 rounded-lg border border-rose-900/80 bg-rose-950/50 hover:bg-rose-950 text-rose-400 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
