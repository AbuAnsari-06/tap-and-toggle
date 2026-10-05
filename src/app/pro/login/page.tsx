"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HardHat,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { proLoginAction } from "@/app/actions/proAuthActions";

export default function ProLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("pin", pin);

    const res = await proLoginAction(null, formData);

    if (res.success) {
      router.push("/pro");
    } else {
      setError(res.error || "Login failed. Check your mobile number and PIN.");
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("demo", "true");

    const res = await proLoginAction(null, formData);

    if (res.success) {
      router.push("/pro");
    } else {
      setError(res.error || "Demo login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-grey-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-amber-500 items-center justify-center text-black shadow-xl shadow-amber-500/20 mb-4 ring-4 ring-amber-500/20">
            <HardHat className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Tap &amp; Toggle <span className="text-amber-400">PRO</span>
          </h1>
          <p className="text-xs text-brand-grey-400 mt-1.5 max-w-xs mx-auto">
            Technician Dispatch &amp; Job Management Portal for Verified Plumbers &amp; Electricians
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-brand-grey-900 border border-brand-grey-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-brand-grey-800">
            <span className="text-xs font-bold text-brand-grey-300 uppercase tracking-wider">
              Technician Sign In
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
              Closed Bench Only
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-brand-grey-300 mb-1.5">
                Registered Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-grey-400 font-medium text-xs">
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  required
                  placeholder="98220 11111"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-brand-grey-800/80 border border-brand-grey-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-brand-grey-500 font-mono tracking-wide"
                />
              </div>
            </div>

            {/* PIN Entry */}
            <div>
              <label className="block text-xs font-semibold text-brand-grey-300 mb-1.5">
                4 to 6-Digit Security PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-grey-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-grey-800/80 border border-brand-grey-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-brand-grey-500 tracking-widest font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Bypass */}
          <div className="pt-2 border-t border-brand-grey-800/80">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-grey-800/70 hover:bg-brand-grey-800 border border-brand-grey-700 text-brand-grey-300 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Demo (Ramesh Shinde — Plumber)</span>
            </button>
          </div>

          {/* PIN Help / Operations Contact */}
          <div className="p-3 rounded-xl bg-brand-grey-950/60 border border-brand-grey-800 text-[11px] text-brand-grey-400 space-y-1">
            <div className="flex items-center gap-1.5 text-brand-grey-300 font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Forgot your PIN or need help?</span>
            </div>
            <p>
              Technician PINs are managed directly by Tap &amp; Toggle dispatch. Call{" "}
              <a href="tel:+918050959001" className="text-amber-400 hover:underline font-bold">
                +91 80509 59001
              </a>{" "}
              to reset your access code.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-brand-grey-500 hover:text-brand-grey-300 transition"
          >
            ← Return to Tap &amp; Toggle Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
