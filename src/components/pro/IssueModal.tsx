"use client";

import React, { useState } from "react";
import { X, AlertTriangle, AlertCircle, Send, Camera } from "lucide-react";
import { reportJobIssueAction } from "@/app/actions/proJobActions";
import { JobIssue, JobIssueCategory, JobIssueSeverity } from "@/types/database";

interface IssueModalProps {
  jobId: string;
  onClose: () => void;
  onIssueReported: (issue: JobIssue) => void;
}

const ISSUE_CATEGORIES: { id: JobIssueCategory; label: string; icon: string; desc: string }[] = [
  {
    id: "resident_unavailable",
    label: "Resident Not Available",
    icon: "🚪",
    desc: "Door locked, bell unanswered, or resident unreachable on phone",
  },
  {
    id: "wrong_parts_required",
    label: "Specialized Part Needed",
    icon: "🔩",
    desc: "Obsolete or non-standard part requires ordering from wholesale distributor",
  },
  {
    id: "concealed_wall_damage",
    label: "Concealed Wall / Pipe Damage",
    icon: "🧱",
    desc: "Leak is behind tiles or masonry; requires breaking wall / specialized contractor",
  },
  {
    id: "customer_refused_estimate",
    label: "Estimate Disagreement",
    icon: "🛑",
    desc: "Resident disagreed with parts cost or additional scope before work started",
  },
  {
    id: "safety_hazard",
    label: "Critical Safety Hazard",
    icon: "⚠️",
    desc: "Active short circuit, water near live wires, or structural collapse risk",
  },
  {
    id: "scope_expanded",
    label: "Scope Expansion",
    icon: "📝",
    desc: "Resident requested additional repair points not in original booking ticket",
  },
  {
    id: "other",
    label: "Other Roadblock",
    icon: "❓",
    desc: "Unforeseen complication requiring operator advice or rescheduling",
  },
];

export function IssueModal({ jobId, onClose, onIssueReported }: IssueModalProps) {
  const [category, setCategory] = useState<JobIssueCategory>("resident_unavailable");
  const [severity, setSeverity] = useState<JobIssueSeverity>("blocking");
  const [description, setDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Please describe the issue or reason for the roadblock.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await reportJobIssueAction(jobId, {
      category,
      severity,
      description: description.trim(),
      photo_url: photoPreview || undefined,
    });

    if (res.success && res.issue) {
      onIssueReported(res.issue);
      onClose();
    } else {
      setError(res.error || "Failed to submit issue. Please retry.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg bg-brand-grey-900 border border-brand-grey-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-grey-800 flex items-center justify-between bg-brand-grey-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Report Roadblock / Job Issue
              </h2>
              <p className="text-xs text-brand-grey-400">
                Instantly notifies Tap &amp; Toggle dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-brand-grey-400 hover:text-white hover:bg-brand-grey-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-brand-grey-300 mb-2">
              What is blocking or delaying this job?
            </label>
            <div className="grid grid-cols-1 gap-2">
              {ISSUE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${
                    category === cat.id
                      ? "bg-rose-950/30 border-rose-500/60 text-white ring-1 ring-rose-500/50"
                      : "bg-brand-grey-800/40 border-brand-grey-700/60 text-brand-grey-300 hover:bg-brand-grey-800/70"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <div>
                    <span className="text-xs font-bold block">{cat.label}</span>
                    <span className="text-[11px] text-brand-grey-400 block leading-snug">
                      {cat.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Severity Toggle */}
          <div>
            <label className="block text-xs font-semibold text-brand-grey-300 mb-2">
              Impact on Today&apos;s Job
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSeverity("blocking")}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  severity === "blocking"
                    ? "bg-rose-500 text-white font-bold border-rose-400 shadow"
                    : "bg-brand-grey-800 border-brand-grey-700 text-brand-grey-300 hover:text-white"
                }`}
              >
                <span className="text-xs block font-bold">⛔ Work Blocked</span>
                <span className="text-[10px] opacity-80 block">Cannot finish today</span>
              </button>
              <button
                type="button"
                onClick={() => setSeverity("warning")}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  severity === "warning"
                    ? "bg-amber-500 text-black font-bold border-amber-400 shadow"
                    : "bg-brand-grey-800 border-brand-grey-700 text-brand-grey-300 hover:text-white"
                }`}
              >
                <span className="text-xs block font-bold">⚠️ Minor Delay</span>
                <span className="text-[10px] opacity-80 block">Work proceeding</span>
              </button>
            </div>
          </div>

          {/* Detailed Note */}
          <div>
            <label className="block text-xs font-semibold text-brand-grey-300 mb-1.5">
              Specific Details for Dispatch <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Rang flat 402 doorbell at 2:15 PM and 2:25 PM. Tried calling resident 3 times, phone switched off."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-800/80 border border-brand-grey-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder:text-brand-grey-500"
            />
          </div>

          {/* Photo Proof */}
          <div>
            <label className="block text-xs font-semibold text-brand-grey-300 mb-1.5">
              Site / Problem Photo Proof (Optional)
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-center p-3 border-2 border-dashed border-brand-grey-700 hover:border-rose-500/60 rounded-xl cursor-pointer bg-brand-grey-800/40 hover:bg-brand-grey-800/60 transition group">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoCapture}
                />
                <div className="flex items-center gap-2 text-xs font-medium text-brand-grey-300 group-hover:text-rose-300">
                  <Camera className="w-4 h-4 text-rose-400" />
                  <span>Snap Photo Proof (Locked door / damaged pipe)</span>
                </div>
              </label>

              {photoPreview && (
                <div className="relative rounded-xl overflow-hidden border border-brand-grey-700 max-h-36 bg-black flex items-center justify-center">
                  <img
                    src={photoPreview}
                    alt="Proof preview"
                    className="max-h-36 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Alerting Dispatch...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Roadblock to Dispatch</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
