"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  Plus,
  RefreshCw,
  Wrench,
  Zap,
  CheckCircle2,
  X,
  Send,
  Check,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { Pro, ServiceType } from "@/types/database";
import {
  fetchAdminProsAction,
  toggleProStatusAction,
  addProAction,
  resetProPinAction,
} from "@/app/actions/adminPros";
import { generateWhatsAppDispatchLink } from "@/lib/dispatch/whatsappDispatch";

export default function AdminProsPage() {
  const [pros, setPros] = useState<Pro[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterService, setFilterService] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Pro Form state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newService, setNewService] = useState<ServiceType>("plumbing");
  const [newBaseRate, setNewBaseRate] = useState<number>(350);
  const [newPin, setNewPin] = useState("1234");
  const [newUpiId, setNewUpiId] = useState("");
  const [newVetting, setNewVetting] = useState("Aadhaar verified · Police verification on file");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset PIN modal state
  const [resetPinPro, setResetPinPro] = useState<Pro | null>(null);
  const [newPinValue, setNewPinValue] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Test Dispatch Modal
  const [dispatchPro, setDispatchPro] = useState<Pro | null>(null);

  const loadPros = async () => {
    setLoading(true);
    const res = await fetchAdminProsAction();
    if (res.success && res.pros) {
      setPros(res.pros);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPros();
  }, []);

  const handleToggleStatus = async (proId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setPros((prev) =>
      prev.map((p) => (p.id === proId ? { ...p, active: nextStatus } : p))
    );
    await toggleProStatusAction(proId, nextStatus);
  };

  const handleAddPro = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const res = await addProAction({
      name: newName,
      phone: newPhone,
      service: newService,
      base_rate: Number(newBaseRate),
      pin: newPin || "1234",
      bank_upi_id: newUpiId || undefined,
      vetting_docs_ref: newVetting,
    });

    if (res.success && res.pro) {
      setPros((prev) => [res.pro!, ...prev]);
      setShowAddModal(false);
      setNewName("");
      setNewPhone("");
      setFormError(null);
    } else {
      setFormError(res.error || "Failed to onboard technician. Please verify database connection.");
    }
    setIsSubmitting(false);
  };

  const filteredPros = pros.filter((p) => {
    if (filterService !== "all" && p.service !== filterService) return false;
    return true;
  });

  const activeCount = pros.filter((p) => p.active).length;
  const plumbersCount = pros.filter((p) => p.service === "plumbing").length;
  const electriciansCount = pros.filter((p) => p.service === "electrical").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-brand-grey-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Vetted Technician Bench</span>
            <span className="px-2 py-0.5 rounded-full bg-brand-teal-900/80 border border-brand-teal-700 text-brand-teal-300 text-xs font-semibold">
              NIBM Roster
            </span>
          </h1>
          <p className="text-xs text-brand-grey-400 mt-1">
            Gate-cleared local plumbers and electricians backed by Tap &amp; Toggle
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Technician</span>
          </button>

          <button
            type="button"
            onClick={loadPros}
            className="p-2 rounded-xl bg-brand-grey-800 hover:bg-brand-grey-700 text-brand-grey-300 border border-brand-grey-700 transition cursor-pointer"
            title="Refresh Bench"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-brand-grey-800/80 border border-brand-grey-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-teal-300 uppercase tracking-wider">
              On Duty Active
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">{activeCount}</div>
          <p className="text-[11px] text-brand-grey-400 mt-0.5">Available for instant dispatch</p>
        </div>

        <div className="p-4 rounded-2xl bg-brand-grey-800/80 border border-brand-grey-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" />
              <span>Plumbers</span>
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-white">{plumbersCount}</div>
          <p className="text-[11px] text-brand-grey-400 mt-0.5">Leakage, valves, tanks &amp; pumps</p>
        </div>

        <div className="p-4 rounded-2xl bg-brand-grey-800/80 border border-brand-grey-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Electricians</span>
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-white">{electriciansCount}</div>
          <p className="text-[11px] text-brand-grey-400 mt-0.5">MCB, switches, wiring &amp; fans</p>
        </div>

        <div className="p-4 rounded-2xl bg-brand-grey-800/80 border border-brand-grey-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gate Clearance</span>
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-white">100%</div>
          <p className="text-[11px] text-brand-grey-400 mt-0.5">MyGate / NoBrokerHood pre-listed</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilterService("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            filterService === "all"
              ? "bg-brand-teal-600 text-white"
              : "bg-brand-grey-800 text-brand-grey-400 hover:text-white"
          }`}
        >
          All Technicians ({pros.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterService("plumbing")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
            filterService === "plumbing"
              ? "bg-brand-teal-700 text-white"
              : "bg-brand-grey-800 text-brand-grey-400 hover:text-white"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Plumbing Only ({plumbersCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setFilterService("electrical")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
            filterService === "electrical"
              ? "bg-amber-600 text-white"
              : "bg-brand-grey-800 text-brand-grey-400 hover:text-white"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Electrical Only ({electriciansCount})</span>
        </button>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPros.map((pro) => (
          <div
            key={pro.id}
            className="p-5 rounded-2xl bg-brand-grey-800/60 border border-brand-grey-700/80 shadow-sm space-y-4 hover:border-brand-teal-600/50 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-grey-700 to-brand-grey-800 border border-brand-grey-600 flex items-center justify-center text-white font-bold text-lg shadow">
                  {pro.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-base">{pro.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        pro.service === "plumbing"
                          ? "bg-brand-teal-950 text-brand-teal-300 border border-brand-teal-800"
                          : "bg-amber-950 text-amber-300 border border-amber-800"
                      }`}
                    >
                      {pro.service === "plumbing" ? (
                        <Wrench className="w-3 h-3" />
                      ) : (
                        <Zap className="w-3 h-3" />
                      )}
                      <span>{pro.service}</span>
                    </span>
                  </div>
                  <a
                    href={`tel:${pro.phone.replace(/\s+/g, "")}`}
                    className="text-xs text-brand-grey-400 hover:text-brand-teal-300 flex items-center gap-1 mt-0.5"
                  >
                    <Phone className="w-3 h-3 text-brand-teal-400" />
                    <span>{pro.phone}</span>
                  </a>
                </div>
              </div>

              {/* Active Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggleStatus(pro.id, pro.active)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                  pro.active
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900"
                    : "bg-brand-grey-800 text-brand-grey-400 border-brand-grey-700 hover:bg-brand-grey-700"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    pro.active ? "bg-emerald-400" : "bg-brand-grey-500"
                  }`}
                />
                <span>{pro.active ? "On Duty" : "Off Duty"}</span>
              </button>
            </div>

            {/* Quality & Vetting Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-brand-grey-900/60 p-3 rounded-xl border border-brand-grey-800">
              <div>
                <span className="text-[10px] text-brand-grey-400 block">Quality Rating</span>
                <span className="text-white font-bold flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{pro.health_score || 5.0} / 5.0</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-brand-grey-400 block">Base Visit Rate</span>
                <span className="text-white font-bold mt-0.5 block">
                  ₹{pro.base_rate}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-brand-grey-800/80 flex items-center justify-between text-[11px]">
                <span className="text-brand-grey-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-teal-400 shrink-0" />
                  <span className="truncate max-w-[200px]">{pro.vetting_docs_ref}</span>
                </span>
                <span className="text-emerald-400 font-semibold">
                  Gate Cleared
                </span>
              </div>
            </div>

            {/* Actions: 1-Click WhatsApp Dispatch & PIN Management */}
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDispatchPro(pro)}
                className="flex-1 py-2 px-3 rounded-xl bg-brand-teal-700/30 hover:bg-brand-teal-700/50 border border-brand-teal-600/40 text-brand-teal-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-brand-teal-400" />
                <span>Dispatch</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setResetPinPro(pro);
                  setNewPinValue("");
                  setResetSuccess(false);
                }}
                className="py-2 px-3 rounded-xl bg-brand-grey-800 hover:bg-brand-grey-700 border border-brand-grey-700 text-brand-grey-300 hover:text-amber-400 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                title="Reset Technician Access PIN"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>PIN</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 1-Click WhatsApp Dispatch Generator Modal */}
      {dispatchPro && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-brand-grey-900 border border-brand-grey-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-grey-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Send WhatsApp Dispatch Briefing
                  </h3>
                  <p className="text-xs text-brand-grey-400">
                    To: {dispatchPro.name} ({dispatchPro.phone})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDispatchPro(null)}
                className="p-1 rounded-lg text-brand-grey-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-brand-grey-300 leading-relaxed">
              This opens WhatsApp with an instant, pre-filled work order containing flat address, Google Maps link, resident details, and gate clearance instructions.
            </p>

            <div className="bg-brand-grey-950 p-3.5 rounded-xl border border-brand-grey-800 text-[11px] text-brand-grey-300 space-y-1 font-mono">
              <p className="text-brand-teal-300 font-bold">Preview Dispatch Header:</p>
              <p>🛠️ TAP &amp; TOGGLE — TECHNICIAN DISPATCH ORDER</p>
              <p>👤 Assigned To: {dispatchPro.name}</p>
              <p>📍 Location: Nyati / NIBM Area</p>
              <p>🛡️ Gate Entry: "Tap &amp; Toggle technician on duty"</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDispatchPro(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-grey-400 hover:text-white hover:bg-brand-grey-800"
              >
                Cancel
              </button>
              <a
                href={generateWhatsAppDispatchLink({
                  proPhone: dispatchPro.phone,
                  proName: dispatchPro.name,
                  customerName: "Resident in NIBM",
                  customerPhone: "+91 98765 43210",
                  societyName: "Nyati",
                  flatNo: "Tower B - 402",
                  service: dispatchPro.service,
                  description: "Reported leakage in wash basin fitting and angle valve.",
                  isEmergency: false,
                  jobId: "demo-dispatch-01",
                })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDispatchPro(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch in WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Onboard Pro Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-brand-grey-900 border border-brand-grey-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-grey-800">
              <h3 className="text-base font-extrabold text-white">
                Onboard New Bench Technician
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-brand-grey-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPro} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-brand-grey-200 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Santosh Gaikwad"
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-grey-200 block mb-1">
                  Phone (WhatsApp)
                </label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98220 55555"
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-brand-grey-200 block mb-1">
                    Service
                  </label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value as ServiceType)}
                    className="w-full px-3 py-2 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-xs text-white"
                  >
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-grey-200 block mb-1">
                    Base Visit Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={newBaseRate}
                    onChange={(e) => setNewBaseRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-brand-grey-200 block mb-1">
                    Initial Security PIN
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="1234"
                    className="w-full px-3 py-2 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-xs text-white font-mono tracking-widest"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-grey-200 block mb-1">
                    Bank / UPI ID
                  </label>
                  <input
                    type="text"
                    value={newUpiId}
                    onChange={(e) => setNewUpiId(e.target.value)}
                    placeholder="ramesh@okhdfcbank"
                    className="w-full px-3 py-2 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-grey-200 block mb-1">
                  Vetting &amp; Identity Documentation
                </label>
                <input
                  type="text"
                  value={newVetting}
                  onChange={(e) => setNewVetting(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-grey-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Add to Bench</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset PIN Modal */}
      {resetPinPro && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-brand-grey-900 border border-brand-grey-700 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-grey-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  Reset Technician PIN
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setResetPinPro(null)}
                className="p-1 rounded-lg text-brand-grey-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-brand-grey-300">
              Set a new 4 to 6-digit access code for{" "}
              <strong className="text-white">{resetPinPro.name}</strong> ({resetPinPro.phone}).
            </p>

            {resetSuccess ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>PIN updated successfully! Inform technician.</span>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newPinValue || newPinValue.length < 4) return;
                  setResetLoading(true);
                  const res = await resetProPinAction(resetPinPro.id, newPinValue);
                  setResetLoading(false);
                  if (res.success) {
                    setResetSuccess(true);
                    setTimeout(() => setResetPinPro(null), 1500);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-brand-grey-200 block mb-1">
                    New Numerical PIN (4–6 Digits)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••"
                    value={newPinValue}
                    onChange={(e) => setNewPinValue(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-sm text-white font-mono tracking-widest text-center"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetPinPro(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-grey-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading || newPinValue.length < 4}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {resetLoading ? "Updating..." : "Update PIN"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
