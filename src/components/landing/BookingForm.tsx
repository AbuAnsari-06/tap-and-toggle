"use client";

import React, { useState } from "react";
import { submitLeadAction, SubmitLeadState } from "@/app/actions/submitLead";
import { SITE_CONFIG } from "@/config/site";
import { generateCustomerConfirmationWhatsAppUrl } from "@/lib/whatsapp";
import { Droplets, Zap, Send, CheckCircle, AlertCircle, ShieldCheck, Upload, AlertTriangle, ExternalLink, MessageSquare } from "lucide-react";
import Link from "next/link";

const LAUNCH_SOCIETIES = [
  "NIBMgaon",
  "Nyati",
  "Sus",
  "NIBM Phase 1",
  "NIBM Phase 2",
  "Other / Standalone Building in NIBM",
];

export function BookingForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [societyName, setSocietyName] = useState(LAUNCH_SOCIETIES[0]);
  const [service, setService] = useState<"plumbing" | "electrical">("plumbing");
  const [description, setDescription] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [dpdpConsent, setDpdpConsent] = useState(false); // Strictly unticked by default
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverState, setServerState] = useState<SubmitLeadState | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    societyName: string;
    flatNo: string;
    service: "plumbing" | "electrical";
    description: string;
    isEmergency: boolean;
  } | null>(null);

  const handlePhoneChange = (val: string) => {
    let cleaned = val.replace(/[^0-9]/g, "");
    if (cleaned.length === 12 && cleaned.startsWith("91")) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.length === 11 && cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    setPhone(cleaned.slice(0, 10));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!dpdpConsent) {
      setServerState({
        success: false,
        error: "Please check the DPDP consent box below to allow us to contact you regarding your request.",
      });
      return;
    }

    setIsSubmitting(true);
    setServerState(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("flat_no", flatNo);
    formData.append("society_name", societyName);
    formData.append("service", service);
    formData.append("description", description);
    formData.append("is_emergency", isEmergency ? "true" : "false");
    formData.append("dpdp_consent", dpdpConsent ? "true" : "false");

    const currentPayload = {
      name,
      societyName,
      flatNo,
      service,
      description,
      isEmergency,
    };

    try {
      const res = await submitLeadAction(null, formData);
      setServerState(res);
      if (res.success) {
        setSubmittedData(currentPayload);
        // Reset form on success
        setName("");
        setPhone("");
        setFlatNo("");
        setDescription("");
        setIsEmergency(false);
        setDpdpConsent(false);
        setPhotoName(null);
      }
    } catch (err) {
      setServerState({
        success: false,
        error: "Network connection issue. Please check your internet or reach out directly on WhatsApp.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking-form" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal-100 text-brand-teal-900 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-teal-700" />
            <span>DPDP Act 2023 Protected</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-grey-900 tracking-tight">
            Request a Free Visit & Estimate
          </h2>
          <p className="text-sm sm:text-base text-brand-grey-600 mt-2">
            Tell us what needs attention. We&apos;ll message you on WhatsApp with a free estimate before dispatching a vetted pro.
          </p>
        </div>

        {/* Success Confirmation Card */}
        {serverState?.success ? (
          <div className="p-8 rounded-3xl bg-brand-teal-50/80 border-2 border-brand-teal-400 text-center space-y-5 shadow-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-brand-teal-700 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-8 h-8 text-brand-teal-100" />
            </div>
            <h3 className="text-2xl font-bold text-brand-teal-950">
              Request Received!
            </h3>
            <p className="text-sm text-brand-teal-900 max-w-md mx-auto leading-relaxed">
              {serverState.message}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {serverState.jobId && (
                <>
                  <Link
                    href={`/track/${serverState.jobId}`}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-brand-grey-950 text-xs font-bold shadow transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Track Status Live</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  {submittedData && (
                    <a
                      href={generateCustomerConfirmationWhatsAppUrl({
                        jobId: serverState.jobId,
                        customerName: submittedData.name,
                        societyName: submittedData.societyName,
                        flatNo: submittedData.flatNo,
                        service: submittedData.service,
                        description: submittedData.description,
                        isEmergency: submittedData.isEmergency,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Open WhatsApp Chat</span>
                    </a>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={() => setServerState(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-brand-teal-700 hover:bg-brand-teal-800 text-white text-xs font-bold shadow transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-brand-grey-50 rounded-3xl p-6 sm:p-10 border border-brand-grey-200 shadow-sm space-y-6"
          >
            {/* Error Banner */}
            {serverState?.error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <span>{serverState.error}</span>
              </div>
            )}

            {/* Service Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey-700 mb-2">
                Select Service Category *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setService("plumbing")}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2.5 font-bold text-sm transition-all ${
                    service === "plumbing"
                      ? "border-brand-teal-700 bg-brand-teal-700 text-white shadow-sm"
                      : "border-brand-grey-300 bg-white text-brand-grey-700 hover:border-brand-teal-400"
                  }`}
                >
                  <Droplets className="w-5 h-5" />
                  <span>Plumbing (&quot;Tap&quot;)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setService("electrical")}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2.5 font-bold text-sm transition-all ${
                    service === "electrical"
                      ? "border-brand-amber-500 bg-brand-amber-500 text-white shadow-sm"
                      : "border-brand-grey-300 bg-white text-brand-grey-700 hover:border-brand-amber-400"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  <span>Electrical (&quot;Toggle&quot;)</span>
                </button>
              </div>
            </div>

            {/* Resident Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lead-name" className="block text-xs font-bold text-brand-grey-800 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-brand-grey-300 text-sm focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="lead-phone" className="block text-xs font-bold text-brand-grey-800 mb-1.5">
                  Mobile Number (WhatsApp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-grey-400">
                    +91
                  </span>
                  <input
                    id="lead-phone"
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-brand-grey-300 text-sm focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lead-society" className="block text-xs font-bold text-brand-grey-800 mb-1.5">
                  Housing Society / Area *
                </label>
                <select
                  id="lead-society"
                  value={societyName}
                  onChange={(e) => setSocietyName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-brand-grey-300 text-sm focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none transition"
                >
                  {LAUNCH_SOCIETIES.map((soc) => (
                    <option key={soc} value={soc}>
                      {soc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="lead-flat" className="block text-xs font-bold text-brand-grey-800 mb-1.5">
                  Flat & Building / Wing
                </label>
                <input
                  id="lead-flat"
                  type="text"
                  placeholder="e.g. Tower B - Flat 402"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-brand-grey-300 text-sm focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none transition"
                />
              </div>
            </div>

            {/* Issue Description */}
            <div>
              <label htmlFor="lead-desc" className="block text-xs font-bold text-brand-grey-800 mb-1.5">
                Issue Description *
              </label>
              <textarea
                id="lead-desc"
                required
                rows={3}
                placeholder="Describe the leak, spark, or appliance point repair needed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-brand-grey-300 text-sm focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none transition resize-none"
              />
            </div>

            {/* Urgent / Emergency Hazard Toggle */}
            <div>
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 cursor-pointer hover:bg-amber-100/60 transition">
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-amber-300 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Urgent Hazard / Active Emergency</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    Check if you have an active pipe burst, severe leak, sparking switchboard, or sudden power outage. Flags for priority dispatch within 30 minutes in NIBM.
                  </p>
                </div>
              </label>
            </div>

            {/* Optional Photo Input */}
            <div>
              <label className="block text-xs font-bold text-brand-grey-800 mb-1.5">
                Optional Photo of Fixture (Work Proof Only)
              </label>
              <div className="relative border-2 border-dashed border-brand-grey-300 hover:border-brand-teal-400 rounded-xl p-4 bg-white text-center cursor-pointer transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhotoName(e.target.files[0].name);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex items-center justify-center gap-2 text-xs text-brand-grey-600">
                  <Upload className="w-4 h-4 text-brand-teal-600" />
                  <span>{photoName ? `Selected: ${photoName}` : "Click to attach photo (optional)"}</span>
                </div>
              </div>
              <p className="text-[11px] text-brand-grey-400 mt-1">
                Home photos are protected under our privacy policy and used strictly as technical work proof.
              </p>
            </div>

            {/* DPDP Act 2023 Mandatory Consent Checkbox (Strictly Unticked) */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-4 rounded-xl bg-brand-teal-50/50 border border-brand-teal-200 cursor-pointer hover:bg-brand-teal-50 transition">
                <input
                  type="checkbox"
                  required
                  checked={dpdpConsent}
                  onChange={(e) => setDpdpConsent(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded text-brand-teal-700 focus:ring-brand-teal-500 border-brand-grey-300 shrink-0"
                />
                <span className="text-xs text-brand-grey-700 leading-relaxed">
                  {SITE_CONFIG.dpdpConsent.text}{" "}
                  <Link href="/privacy" className="text-brand-teal-800 font-bold underline">
                    Privacy Policy
                  </Link>{" "}
                  &{" "}
                  <Link href="/terms" className="text-brand-teal-800 font-bold underline">
                    Terms
                  </Link>
                  .
                </span>
              </label>
            </div>

            {/* Submit Action (With Double-Tap Protection) */}
            <button
              type="submit"
              disabled={isSubmitting || !dpdpConsent}
              className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all ${
                isSubmitting || !dpdpConsent
                  ? "bg-brand-grey-300 text-brand-grey-500 cursor-not-allowed shadow-none"
                  : "bg-brand-teal-700 hover:bg-brand-teal-800 text-white hover:shadow-lg active:scale-[0.99]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Service Request</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-brand-grey-500">
              Free upfront estimate · 7-day workmanship warranty · Pay after work is done
            </p>
          </form>
        )}

      </div>
    </section>
  );
}
