"use client";

import React, { useState, useRef } from "react";
import { submitLeadAction, SubmitLeadState } from "@/app/actions/submitLead";
import { SITE_CONFIG } from "@/config/site";
import { generateCustomerConfirmationWhatsAppUrl } from "@/lib/whatsapp";
import {
  Droplets,
  Zap,
  Send,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Upload,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Camera,
  X,
  Plus,
  Info,
} from "lucide-react";
import Link from "next/link";

const LAUNCH_SOCIETIES = [
  "NIBMgaon",
  "Nyati",
  "Sus",
  "NIBM Phase 1",
  "NIBM Phase 2",
  "Other / Standalone Building in NIBM",
];

interface UploadedPhoto {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
}

export function BookingForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [societyName, setSocietyName] = useState(LAUNCH_SOCIETIES[0]);
  const [service, setService] = useState<"plumbing" | "electrical">("plumbing");
  const [description, setDescription] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [dpdpConsent, setDpdpConsent] = useState(false); // Strictly unticked by default
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const remainingSlots = 5 - photos.length;

    if (remainingSlots <= 0) {
      setPhotoError("Maximum 5 photos allowed. Please remove a photo before adding more.");
      return;
    }

    const filesToProcess = fileList.slice(0, remainingSlots);
    if (fileList.length > remainingSlots) {
      setPhotoError(`Only ${remainingSlots} more photo(s) could be added (max 5 allowed).`);
    }

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setPhotoError("Only image files (JPEG, PNG, WebP) are supported.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError(`File "${file.name}" exceeds the 5MB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto: UploadedPhoto = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            size: file.size,
            dataUrl: event.target.result as string,
          };
          setPhotos((prev) => {
            if (prev.length >= 5) return prev;
            return [...prev, newPhoto];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setPhotoError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!dpdpConsent) {
      setServerState({
        success: false,
        error: "Please review and check the agreement and DPDP consent box below before submitting.",
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
    formData.append("photo_count", photos.length.toString());
    formData.append("photo_names", photos.map((p) => p.name).join(", "));

    const currentPayload = {
      name,
      societyName,
      flatNo,
      service,
      description: photos.length > 0 ? `${description} (${photos.length} photo(s) attached)` : description,
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
        setPhotos([]);
        setPhotoError(null);
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
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal-100 text-brand-teal-900 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-teal-700" />
            <span>DPDP Act 2023 Protected</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-grey-900 tracking-tight">
            Request a Free Visit &amp; Estimate
          </h2>
          <p className="text-sm sm:text-base text-brand-grey-600 mt-2">
            Tell us what needs attention. We&apos;ll message you on WhatsApp with a free estimate before dispatching a vetted pro.
          </p>

          {/* Service Platform Transparency Notice */}
          <div className="mt-4 p-3.5 rounded-2xl bg-brand-teal-50/80 border border-brand-teal-200 text-xs text-brand-teal-950 flex items-start sm:items-center justify-center gap-2.5 text-left sm:text-center shadow-sm">
            <Info className="w-4 h-4 text-brand-teal-700 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Platform Notice:</strong> Tap &amp; Toggle is a professional service facilitation platform that dispatches vetted independent technicians. Physical repair craftsmanship is performed directly by independent trade professionals under platform quality standards.
            </span>
          </div>
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

            {/* Multi-Photo Input (3 to 5 images max) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-brand-grey-800">
                  Photos of Fixture / Fault (Optional · Up to 5 photos)
                </label>
                <span className="text-[11px] font-semibold text-brand-teal-700 bg-brand-teal-50 px-2 py-0.5 rounded-full border border-brand-teal-200">
                  {photos.length}/5 attached
                </span>
              </div>

              {/* Hidden Native File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handlePhotoSelect}
                className="hidden"
                id="booking-photo-upload"
              />

              {photos.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-brand-grey-300 hover:border-brand-teal-500 rounded-2xl p-6 bg-white text-center cursor-pointer transition group hover:bg-brand-teal-50/20"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-xs text-brand-grey-600">
                    <div className="w-12 h-12 rounded-full bg-brand-teal-50 flex items-center justify-center text-brand-teal-700 group-hover:scale-105 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-grey-800 text-sm">
                        Click or Tap to Upload Photos (1 to 5 max)
                      </p>
                      <p className="text-[11px] text-brand-grey-400 mt-0.5">
                        Snap or select photos of the tap, pipe, switchboard, or leak. Max 5MB per photo.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {photos.map((p, idx) => (
                      <div
                        key={p.id}
                        className="relative group rounded-xl overflow-hidden border border-brand-grey-200 bg-brand-grey-100 shadow-sm aspect-square flex flex-col justify-between"
                      >
                        <img
                          src={p.dataUrl}
                          alt={`Uploaded proof ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removePhoto(p.id)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/75 hover:bg-rose-600 text-white transition shadow"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-[10px] text-white truncate">
                          {p.name}
                        </div>
                      </div>
                    ))}

                    {/* Add More button if under 5 photos */}
                    {photos.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-xl border-2 border-dashed border-brand-grey-300 hover:border-brand-teal-500 bg-white hover:bg-brand-teal-50/20 aspect-square flex flex-col items-center justify-center gap-1 text-xs text-brand-grey-600 transition cursor-pointer"
                      >
                        <Plus className="w-5 h-5 text-brand-teal-600" />
                        <span className="font-semibold text-[11px]">Add Photo</span>
                        <span className="text-[9px] text-brand-grey-400">
                          ({5 - photos.length} left)
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {photoError && (
                <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{photoError}</span>
                </p>
              )}

              <p className="text-[11px] text-brand-grey-400 mt-1">
                Fixture photos help our pros prepare the right spare parts in advance. Photos are kept strictly private under our privacy policy.
              </p>
            </div>

            {/* Platform Role & DPDP Act 2023 Mandatory Consent Checkbox (Strictly Unticked) */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-4 rounded-xl bg-brand-teal-50/60 border border-brand-teal-200 cursor-pointer hover:bg-brand-teal-50 transition">
                <input
                  type="checkbox"
                  required
                  checked={dpdpConsent}
                  onChange={(e) => setDpdpConsent(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded text-brand-teal-700 focus:ring-brand-teal-500 border-brand-grey-300 shrink-0"
                />
                <span className="text-xs text-brand-grey-800 leading-relaxed">
                  I understand that Tap &amp; Toggle is a professional service facilitation platform connecting me with independent, vetted trade technicians who perform the on-site work. I agree to the{" "}
                  <Link href="/terms" className="text-brand-teal-800 font-bold underline hover:text-brand-teal-950">
                    Terms of Service
                  </Link>{" "}
                  (including limitation of liability &amp; 7-day labor rework policy) &amp;{" "}
                  <Link href="/privacy" className="text-brand-teal-800 font-bold underline hover:text-brand-teal-950">
                    Privacy Policy
                  </Link>
                  , and consent to service communication under the DPDP Act 2023.
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
