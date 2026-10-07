"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Zap,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Receipt,
  Calendar,
  ShieldCheck,
  RefreshCw,
  HardHat,
} from "lucide-react";
import { fetchProAssignedJobsAction, ProJobWithDetails } from "@/app/actions/proJobActions";
import { JobStatus } from "@/types/database";

export default function ProDashboardPage() {
  const [jobs, setJobs] = useState<ProJobWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "issues">("active");
  const [isOnDuty, setIsOnDuty] = useState(true);

  const loadJobs = async () => {
    setLoading(true);
    const res = await fetchProAssignedJobsAction();
    if (res.success && res.jobs) {
      setJobs(res.jobs);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Filter jobs by lifecycle tab
  const activeJobs = jobs.filter((j) =>
    ["Assigned", "On the way", "Arrived", "In Progress", "Scheduled", "New"].includes(j.status)
  );

  const completedJobs = jobs.filter((j) =>
    ["Done", "Paid", "Warranty", "Closed"].includes(j.status)
  );

  const issueJobs = jobs.filter((j) =>
    ["Partial", "Rescheduled", "Cancelled", "No-show"].includes(j.status) ||
    (j.issues && j.issues.length > 0)
  );

  // Active in-field job (if any)
  const currentInFieldJob = jobs.find((j) =>
    ["On the way", "Arrived", "In Progress"].includes(j.status)
  );

  // Financial calculations
  const totalLaborEarned = completedJobs.reduce(
    (sum, j) => sum + (Number(j.estimate_amount) || 250),
    0
  );
  const totalPartsReimbursed = completedJobs.reduce(
    (sum, j) => sum + (Number(j.parts_amount) || 0),
    0
  );

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case "In Progress":
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            In Progress
          </span>
        );
      case "On the way":
        return (
          <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            On The Way
          </span>
        );
      case "Arrived":
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold">
            Arrived at Flat
          </span>
        );
      case "Assigned":
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            Assigned Today
          </span>
        );
      case "Done":
      case "Paid":
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case "Partial":
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Issue Reported
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-brand-grey-800 text-brand-grey-300 border border-brand-grey-700 text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Duty Status & Shift Toggle */}
      <div className="p-4 sm:p-5 rounded-2xl bg-brand-grey-900 border border-brand-grey-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              isOnDuty ? "bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse" : "bg-brand-grey-600"
            }`}
          />
          <div>
            <span className="text-xs font-bold text-white block">
              {isOnDuty ? "On Duty · Accepting Dispatches" : "Off Duty / Shift Paused"}
            </span>
            <span className="text-[11px] text-brand-grey-400 block">
              {isOnDuty ? "GPS availability active in NIBM area" : "Tap toggle to resume shifts"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsOnDuty(!isOnDuty)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
            isOnDuty
              ? "bg-brand-grey-800 text-brand-grey-300 border-brand-grey-700 hover:text-white"
              : "bg-emerald-500 text-black border-emerald-400 font-extrabold"
          }`}
        >
          {isOnDuty ? "Take Break" : "Go On Duty"}
        </button>
      </div>

      {/* Persistent Active In-Field Job Alert */}
      {currentInFieldJob && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 to-brand-grey-900 border-2 border-amber-500/70 shadow-xl shadow-amber-500/10 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
              Active Job in Progress
            </span>
            <span className="text-xs text-amber-400 font-bold">
              {currentInFieldJob.society?.name || "NIBM Society"}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-white leading-tight">
              {currentInFieldJob.customer?.flat_no || "Flat Entry"} · {currentInFieldJob.customer?.name}
            </h3>
            <p className="text-xs text-brand-grey-300 mt-1 line-clamp-1">
              {currentInFieldJob.description}
            </p>
          </div>

          <Link
            href={`/pro/jobs/${currentInFieldJob.id}`}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow transition flex items-center justify-center gap-1.5"
          >
            <span>Resume Active Job Sheet</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-brand-grey-900 border border-brand-grey-800">
          <span className="text-[11px] font-semibold text-brand-grey-400 block">
            Queue Today
          </span>
          <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
            {activeJobs.length}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-brand-grey-900 border border-brand-grey-800">
          <span className="text-[11px] font-semibold text-brand-grey-400 block">
            Completed
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
            {completedJobs.length}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-brand-grey-900 border border-brand-grey-800">
          <span className="text-[11px] font-semibold text-brand-grey-400 block">
            Labor Earned
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1 block">
            ₹{totalLaborEarned}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-grey-800 gap-2">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "active"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-brand-grey-400 hover:text-white"
          }`}
        >
          <span>Today&apos;s Queue</span>
          <span className="px-1.5 py-0.2 rounded-full bg-brand-grey-800 text-[10px]">
            {activeJobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "completed"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-brand-grey-400 hover:text-white"
          }`}
        >
          <span>Completed</span>
          <span className="px-1.5 py-0.2 rounded-full bg-brand-grey-800 text-[10px]">
            {completedJobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("issues")}
          className={`pb-3 px-3 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "issues"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-brand-grey-400 hover:text-white"
          }`}
        >
          <span>Roadblocks &amp; Issues</span>
          {issueJobs.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">
              {issueJobs.length}
            </span>
          )}
        </button>
      </div>

      {/* Jobs Feed */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-xs text-brand-grey-500">
            Syncing assigned tickets...
          </div>
        ) : (
          <>
            {activeTab === "active" && (
              <>
                {activeJobs.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-brand-grey-900 border border-brand-grey-800 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-sm font-bold text-white">All caught up!</p>
                    <p className="text-xs text-brand-grey-400">
                      No pending jobs currently assigned. Stand by for new dispatches.
                    </p>
                  </div>
                ) : (
                  activeJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/pro/jobs/${job.id}`}
                      className="block p-4 sm:p-5 rounded-2xl bg-brand-grey-900 hover:bg-brand-grey-850 border border-brand-grey-800 hover:border-brand-grey-700 transition shadow-sm group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-brand-grey-800 flex items-center justify-center text-amber-400">
                            {job.service === "plumbing" ? (
                              <Wrench className="w-4 h-4" />
                            ) : (
                              <Zap className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                              {job.customer?.flat_no || "Flat Entry"}
                            </span>
                            <span className="text-[11px] text-brand-grey-400 block">
                              {job.society?.name || "NIBM Society"}
                            </span>
                          </div>
                        </div>

                        {getStatusBadge(job.status)}
                      </div>

                      {/* Urgency Badge */}
                      {job.is_emergency && (
                        <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-bold">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Emergency Hazard / Active Leak</span>
                        </div>
                      )}

                      {/* Issue Description */}
                      <p className="text-xs text-brand-grey-300 mt-2.5 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Bottom Details */}
                      <div className="mt-3 pt-3 border-t border-brand-grey-800 flex items-center justify-between text-[11px] text-brand-grey-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-brand-grey-500" />
                          <span>{job.requested_slot || "ASAP / Flexible"}</span>
                        </div>

                        <div className="flex items-center gap-1 text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
                          <span>Open Job Sheet</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </>
            )}

            {activeTab === "completed" && (
              <>
                {completedJobs.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-brand-grey-900 border border-brand-grey-800 text-center text-xs text-brand-grey-400">
                    No completed jobs recorded yet today.
                  </div>
                ) : (
                  completedJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/pro/jobs/${job.id}`}
                      className="block p-4 sm:p-5 rounded-2xl bg-brand-grey-900 border border-brand-grey-800 text-xs transition hover:border-brand-grey-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block">
                            {job.customer?.flat_no} · {job.society?.name}
                          </span>
                          <span className="text-brand-grey-400 text-[11px] mt-0.5 block">
                            {job.customer?.name}
                          </span>
                        </div>
                        {getStatusBadge(job.status)}
                      </div>

                      <div className="mt-3 pt-3 border-t border-brand-grey-800 flex items-center justify-between text-brand-grey-300">
                        <span>Labor: ₹{job.estimate_amount || 250}</span>
                        {Number(job.parts_amount) > 0 && (
                          <span className="text-amber-400">Parts: ₹{job.parts_amount}</span>
                        )}
                        <span className="font-bold text-emerald-400">
                          Total Bill: ₹{job.final_amount || job.estimate_amount || 250}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </>
            )}

            {activeTab === "issues" && (
              <>
                {issueJobs.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-brand-grey-900 border border-brand-grey-800 text-center text-xs text-brand-grey-400">
                    No active roadblocks or issues reported.
                  </div>
                ) : (
                  issueJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/pro/jobs/${job.id}`}
                      className="block p-4 sm:p-5 rounded-2xl bg-brand-grey-900 border border-rose-500/30 text-xs transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">
                          {job.customer?.flat_no} · {job.society?.name}
                        </span>
                        {getStatusBadge(job.status)}
                      </div>

                      {job.issues && job.issues.length > 0 && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-300 text-[11px] space-y-1">
                          <span className="font-bold block uppercase tracking-wider text-[10px]">
                            Reported Roadblock: {job.issues[0].category.replace(/_/g, " ")}
                          </span>
                          <p>{job.issues[0].description}</p>
                        </div>
                      )}
                    </Link>
                  ))
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
