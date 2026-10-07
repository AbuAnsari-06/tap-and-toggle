"use client";

import React, { useEffect, useState } from "react";
import {
  Building,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Users,
  Wrench,
  Phone,
  MessageSquare,
  FileText,
  Sparkles,
  MapPin,
  ExternalLink,
  RefreshCw,
  Clock,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  fetchAdminSocietiesAction,
  addSocietyAction,
  toggleSocietyStatusAction,
  AdminSocietyView,
} from "@/app/actions/adminSocieties";
import { SITE_CONFIG } from "@/config/site";

export default function AdminSocietiesPage() {
  const [societies, setSocieties] = useState<AdminSocietyView[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pre_approved" | "mou" | "pending">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState<AdminSocietyView | null>(null);

  // Form state
  const [newName, setNewName] = useState("");
  const [newArea, setNewArea] = useState("NIBM Road");
  const [newPreApproved, setNewPreApproved] = useState(true);
  const [newHasMou, setNewHasMou] = useState(false);
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRole, setNewContactRole] = useState("Managing Committee Member");
  const [newNotes, setNewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cleanOperatorPhone = SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");

  const loadSocieties = async () => {
    setLoading(true);
    const res = await fetchAdminSocietiesAction();
    if (res.success && res.societies) {
      setSocieties(res.societies);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSocieties();
  }, []);

  const handleToggleStatus = async (
    societyId: string,
    field: "has_mou" | "pre_approved",
    currentVal: boolean
  ) => {
    const newVal = !currentVal;
    setSocieties((prev) =>
      prev.map((s) => (s.id === societyId ? { ...s, [field]: newVal } : s))
    );
    await toggleSocietyStatusAction(societyId, field, newVal);
  };

  const handleAddSociety = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsSubmitting(true);

    const res = await addSocietyAction({
      name: newName,
      area: newArea,
      has_mou: newHasMou,
      pre_approved: newPreApproved,
      contact_person: newContactPerson,
      contact_phone: newContactPhone,
      contact_role: newContactRole,
      notes: newNotes,
    });

    if (res.success && res.society) {
      setSocieties((prev) => [res.society!, ...prev]);
      setShowAddModal(false);
      setNewName("");
      setNewContactPerson("");
      setNewContactPhone("");
      setNewNotes("");
    }
    setIsSubmitting(false);
  };

  // Metrics
  const totalSocieties = societies.length;
  const preApprovedCount = societies.filter((s) => s.pre_approved).length;
  const mouCount = societies.filter((s) => s.has_mou).length;
  const totalResidents = societies.reduce(
    (sum, s) => sum + (s.total_residents_count || 0),
    0
  );

  // Filter & Search
  const filteredSocieties = societies.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.area.toLowerCase().includes(search.toLowerCase()) ||
      (s.contact_person && s.contact_person.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === "pre_approved") return s.pre_approved;
    if (filter === "mou") return s.has_mou;
    if (filter === "pending") return !s.has_mou && !s.pre_approved;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-900/60 border border-brand-teal-700/50 text-brand-teal-300 text-xs font-semibold mb-1">
            <Building className="w-3.5 h-3.5 text-brand-teal-400" />
            <span>Hyperlocal Society Coverage Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Society Roster &amp; RWA Partnerships
          </h1>
          <p className="text-xs sm:text-sm text-brand-grey-400 mt-1">
            Manage gated society pre-clearances, RWA committee MOUs, and local community outreach across NIBM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSocieties}
            className="p-2.5 rounded-xl bg-brand-grey-800 hover:bg-brand-grey-700 text-brand-grey-300 transition-colors"
            title="Refresh Society Directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white text-xs font-bold shadow-md shadow-brand-teal-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Housing Society</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-brand-grey-800/80 border border-brand-grey-700 shadow-sm space-y-1">
          <span className="text-xs font-bold text-brand-grey-400 block uppercase tracking-wider">
            Total Societies
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white">{totalSocieties}</span>
          <span className="text-[11px] text-brand-teal-400 block">South Pune Corridor</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-brand-grey-800/80 border border-brand-grey-700 shadow-sm space-y-1">
          <span className="text-xs font-bold text-brand-grey-400 block uppercase tracking-wider">
            Pre-Approved Gates
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">{preApprovedCount}</span>
          <span className="text-[11px] text-emerald-400/80 block">Aadhaar/Police Verified Entry</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-brand-grey-800/80 border border-brand-grey-700 shadow-sm space-y-1">
          <span className="text-xs font-bold text-brand-grey-400 block uppercase tracking-wider">
            Active RWA MOUs
          </span>
          <span className="text-2xl sm:text-3xl font-black text-brand-amber-400">{mouCount}</span>
          <span className="text-[11px] text-brand-amber-300 block">Corpus Fund Partners</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-brand-grey-800/80 border border-brand-grey-700 shadow-sm space-y-1">
          <span className="text-xs font-bold text-brand-grey-400 block uppercase tracking-wider">
            Covered Residents
          </span>
          <span className="text-2xl sm:text-3xl font-black text-purple-400">{totalResidents}</span>
          <span className="text-[11px] text-purple-300 block">Registered Flat Units</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-brand-grey-800/60 rounded-2xl border border-brand-grey-700">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-grey-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search society, area, RWA contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-brand-grey-900 border border-brand-grey-700 text-xs text-white placeholder-brand-grey-500 focus:outline-none focus:border-brand-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filter === "all"
                ? "bg-brand-teal-700 text-white"
                : "bg-brand-grey-900 text-brand-grey-400 hover:text-white"
            }`}
          >
            All ({societies.length})
          </button>
          <button
            onClick={() => setFilter("pre_approved")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filter === "pre_approved"
                ? "bg-emerald-600 text-white"
                : "bg-brand-grey-900 text-brand-grey-400 hover:text-white"
            }`}
          >
            Pre-Approved ({preApprovedCount})
          </button>
          <button
            onClick={() => setFilter("mou")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filter === "mou"
                ? "bg-brand-amber-500 text-brand-grey-950"
                : "bg-brand-grey-900 text-brand-grey-400 hover:text-white"
            }`}
          >
            MOU Partners ({mouCount})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filter === "pending"
                ? "bg-purple-600 text-white"
                : "bg-brand-grey-900 text-brand-grey-400 hover:text-white"
            }`}
          >
            Nominations / Outreach
          </button>
        </div>
      </div>

      {/* Society Directory Table / Cards */}
      {loading ? (
        <div className="p-12 text-center bg-brand-grey-800/40 rounded-3xl border border-brand-grey-700">
          <div className="w-8 h-8 border-3 border-brand-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-brand-grey-400">Loading Society Directory...</p>
        </div>
      ) : filteredSocieties.length === 0 ? (
        <div className="p-12 text-center bg-brand-grey-800/40 rounded-3xl border border-brand-grey-700 space-y-3">
          <Building className="w-10 h-10 text-brand-grey-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Societies Found</h3>
          <p className="text-xs text-brand-grey-400 max-w-sm mx-auto">
            Try adjusting your search filter or add a new society to the directory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSocieties.map((soc) => {
            const cleanPhone = soc.contact_phone?.replace(/[^0-9]/g, "") || "";
            const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
            const waOutreachUrl = targetPhone
              ? `https://wa.me/${targetPhone}?text=${encodeURIComponent(
                  `Hello ${soc.contact_person || "Managing Committee"}! 👋 This is Tap & Toggle Operations (NIBM). We are reaching out regarding gate clearance and resident repair facilitation for ${soc.name}.`
                )}`
              : `https://wa.me/${cleanOperatorPhone}?text=${encodeURIComponent(
                  `Hi Tap & Toggle Operations, regarding ${soc.name} RWA partnership.`
                )}`;

            return (
              <div
                key={soc.id}
                className="p-5 rounded-3xl bg-brand-grey-800/90 border border-brand-grey-700 hover:border-brand-teal-500/50 transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] text-brand-grey-400 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-brand-teal-400 shrink-0" />
                      <span>{soc.area}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {soc.has_mou ? (
                        <span className="px-2 py-0.5 rounded-full bg-brand-amber-500/20 text-brand-amber-300 border border-brand-amber-500/30 text-[10px] font-bold">
                          MOU Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-brand-grey-700 text-brand-grey-400 text-[10px] font-medium">
                          No MOU
                        </span>
                      )}

                      {soc.pre_approved ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Pre-Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                          Nominated
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Notes */}
                  <div>
                    <h3 className="text-base font-extrabold text-white tracking-tight">
                      {soc.name}
                    </h3>
                    {soc.notes && (
                      <p className="text-xs text-brand-grey-400 mt-1 leading-relaxed line-clamp-2">
                        {soc.notes}
                      </p>
                    )}
                  </div>

                  {/* RWA Contact Details Box */}
                  <div className="p-3 rounded-2xl bg-brand-grey-900/80 border border-brand-grey-700/60 text-xs text-brand-grey-300 space-y-1">
                    <div className="flex justify-between items-center text-[11px] text-brand-grey-500 font-bold uppercase">
                      <span>RWA Committee Contact</span>
                      <span>{soc.total_residents_count || 0} Flats</span>
                    </div>
                    <p className="font-bold text-white">
                      {soc.contact_person || "RWA Office Desk"}
                      {soc.contact_role ? ` (${soc.contact_role})` : ""}
                    </p>
                    <p className="font-mono text-brand-grey-400 text-[11px]">
                      {soc.contact_phone || "Phone on file"}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-brand-grey-700/60 flex items-center justify-between gap-2">
                  {/* Status Toggle Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(soc.id, "pre_approved", soc.pre_approved)}
                      className={`p-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        soc.pre_approved
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                          : "bg-brand-grey-700 text-brand-grey-400 hover:text-white"
                      }`}
                      title="Toggle Pre-Approved Gate Roster Status"
                    >
                      Gate {soc.pre_approved ? "✓" : "✗"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(soc.id, "has_mou", soc.has_mou)}
                      className={`p-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        soc.has_mou
                          ? "bg-brand-amber-500/20 text-brand-amber-300 border border-brand-amber-500/30 hover:bg-brand-amber-500/30"
                          : "bg-brand-grey-700 text-brand-grey-400 hover:text-white"
                      }`}
                      title="Toggle MOU Partnership Status"
                    >
                      MOU {soc.has_mou ? "✓" : "✗"}
                    </button>
                  </div>

                  {/* 1-Click WhatsApp Outreach */}
                  <a
                    href={waOutreachUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-transform hover:scale-105"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white text-emerald-600" />
                    <span>WhatsApp RWA</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Society Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-brand-grey-900 border border-brand-grey-700 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-brand-grey-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Building className="w-5 h-5 text-brand-teal-400" />
                <h3 className="text-lg font-bold">Add Housing Society</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-brand-grey-800 text-brand-grey-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSociety} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-grey-300 mb-1">
                  Society / Condominium Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nyati Esteban II"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-white placeholder-brand-grey-500 focus:outline-none focus:border-brand-teal-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-grey-300 mb-1">
                  Locality / Area in South Pune *
                </label>
                <select
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-white focus:outline-none focus:border-brand-teal-500 text-xs"
                >
                  <option value="NIBM Road">NIBM Road</option>
                  <option value="NIBM Undri Road">NIBM Undri Road</option>
                  <option value="Mohammadwadi">Mohammadwadi</option>
                  <option value="NIBM Annexe">NIBM Annexe</option>
                  <option value="Corinthians Club Road">Corinthians Club Road</option>
                  <option value="Wanowrie">Wanowrie</option>
                  <option value="Kondhwa">Kondhwa</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-grey-300 mb-1">
                    RWA Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Sharma"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-white placeholder-brand-grey-500 focus:outline-none focus:border-brand-teal-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brand-grey-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 98220 12345"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-white placeholder-brand-grey-500 focus:outline-none focus:border-brand-teal-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-grey-300 mb-1">
                  Gate Security Clearance &amp; Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. MyGate / NoBrokerHood entry rules, gate cabin location..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-brand-grey-800 border border-brand-grey-700 text-white placeholder-brand-grey-500 focus:outline-none focus:border-brand-teal-500 text-xs resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPreApproved}
                    onChange={(e) => setNewPreApproved(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-teal-600 focus:ring-0"
                  />
                  <span className="font-semibold text-white">Pre-Approved Gate Entry</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newHasMou}
                    onChange={(e) => setNewHasMou(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-amber-500 focus:ring-0"
                  />
                  <span className="font-semibold text-white">RWA MOU Signed</span>
                </label>
              </div>

              <div className="pt-3 border-t border-brand-grey-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-brand-grey-800 hover:bg-brand-grey-700 text-brand-grey-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>Save Housing Society</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
