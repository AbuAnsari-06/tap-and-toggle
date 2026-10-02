"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { SITE_CONFIG } from "@/config/site";
import { ShieldAlert, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Attempt Supabase Auth if real keys exist
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
      ) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }
      }

      // 2. Set operator session flag for local dev / demo resilience
      if (typeof window !== "undefined") {
        localStorage.setItem("tt_admin_authenticated", "true");
        localStorage.setItem("tt_admin_user", email || "operator@tapandtoggle.in");
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err?.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tt_admin_authenticated", "true");
      localStorage.setItem("tt_admin_user", "nibm_dispatcher@tapandtoggle.in");
    }
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-brand-grey-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Header */}
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal-500 to-brand-teal-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
            T
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            Tap &amp; Toggle
          </span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal-950 border border-brand-teal-800 text-brand-teal-300 text-xs font-semibold mb-2">
          <Lock className="w-3.5 h-3.5 text-brand-amber-400" />
          <span>Dispatch &amp; Operations Portal</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-grey-100">
          Operator Sign In
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-brand-grey-400">
          Restricted access for NIBM dispatchers and operations team
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-brand-grey-800/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-brand-grey-700 sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-brand-grey-200 mb-1.5"
              >
                Operator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-grey-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dispatcher@tapandtoggle.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-grey-900 border border-brand-grey-700 text-brand-grey-100 text-sm focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-brand-grey-200 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-grey-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-grey-900 border border-brand-grey-700 text-brand-grey-100 text-sm focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Dispatcher</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Local Dev & Demo Instant Access */}
          <div className="mt-6 pt-6 border-t border-brand-grey-700 text-center">
            <p className="text-xs text-brand-grey-400 mb-3">
              Testing locally without remote Supabase auth configured?
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-amber-500/10 hover:bg-brand-amber-500/20 border border-brand-amber-500/30 text-brand-amber-300 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-amber-400" />
              <span>Instant Launch in Operator Demo Mode</span>
            </button>
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/"
              className="text-xs text-brand-teal-400 hover:text-brand-teal-300 underline"
            >
              &larr; Return to Customer Landing Page
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] text-brand-grey-500 mt-6">
          Tap &amp; Toggle Dispatch System &bull; Hyperlocal Home Services for NIBM, Pune
        </p>
      </div>
    </div>
  );
}
