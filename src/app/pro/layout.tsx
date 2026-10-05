"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Wrench,
  Zap,
  PhoneCall,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  Bell,
} from "lucide-react";
import { checkProSessionAction, proSignOutAction } from "@/app/actions/proAuthActions";

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/pro/login";

  const [pro, setPro] = useState<{
    id: string;
    name: string;
    phone: string;
    service: string;
  } | null>(null);
  const [loading, setLoading] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) return;

    checkProSessionAction().then((res) => {
      if (res.authenticated && res.pro) {
        setPro(res.pro);
      } else {
        router.push("/pro/login");
      }
      setLoading(false);
    });
  }, [isLoginPage, router]);

  const handleSignOut = async () => {
    await proSignOutAction();
    router.push("/pro/login");
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-brand-grey-950 text-brand-grey-100">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-grey-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-brand-grey-400">Loading technician workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-grey-950 text-brand-grey-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-grey-900/90 backdrop-blur-md border-b border-brand-grey-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/pro" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black shadow-md shadow-amber-500/20">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white tracking-tight">
                  Tap &amp; Toggle <span className="text-amber-400 font-extrabold">PRO</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-brand-grey-400 leading-tight">
                {pro ? `${pro.name} · ${pro.service === "plumbing" ? "Plumber" : "Electrician"}` : "Technician Workspace"}
              </p>
            </div>
          </Link>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="tel:+918050959001"
              className="px-3 py-1.5 rounded-xl bg-brand-grey-800 hover:bg-brand-grey-700 text-brand-grey-200 border border-brand-grey-700 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Call Dispatch Hotline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Dispatch</span>
            </a>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl text-brand-grey-400 hover:text-white hover:bg-brand-grey-800 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-20">
        {children}
      </main>

      {/* Mobile Sticky Quick Nav */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-brand-grey-900/95 backdrop-blur-md border-t border-brand-grey-800 py-2.5 px-4 sm:hidden">
        <div className="flex items-center justify-around text-xs">
          <Link
            href="/pro"
            className="flex flex-col items-center gap-1 text-amber-400 font-semibold"
          >
            <HardHat className="w-4 h-4" />
            <span>My Jobs</span>
          </Link>
          <a
            href="tel:+918050959001"
            className="flex flex-col items-center gap-1 text-brand-grey-400 hover:text-white"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Hotline</span>
          </a>
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center gap-1 text-brand-grey-400 hover:text-white"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
