"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { checkAdminSessionAction, adminSignOutAction } from "@/app/actions/authActions";
import {
  ClipboardList,
  Users,
  UserCheck,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  PhoneCall,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("operator@tapandtoggle.in");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render children directly without admin shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true);
      return;
    }

    const checkAuth = async () => {
      // 1. Verify server-side HttpOnly signed session cookie
      const session = await checkAdminSessionAction();
      if (session.authenticated) {
        if (session.email) setUserEmail(session.email);
        setIsAuthenticated(true);
        return;
      }

      // 2. Fallback check for local storage
      const demoAuth = localStorage.getItem("tt_admin_authenticated");
      const storedEmail = localStorage.getItem("tt_admin_user");
      if (demoAuth === "true") {
        if (storedEmail) setUserEmail(storedEmail);
        setIsAuthenticated(true);
        return;
      }

      // Not authenticated, redirect to login
      setIsAuthenticated(false);
      router.push("/admin/login");
    };

    checkAuth();
  }, [isLoginPage, router]);

  const handleSignOut = async () => {
    localStorage.removeItem("tt_admin_authenticated");
    localStorage.removeItem("tt_admin_user");
    await adminSignOutAction();
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while verifying credentials
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-brand-grey-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-brand-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-brand-grey-400 font-medium">
            Verifying Dispatcher Session...
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      name: "Jobs Board",
      href: "/admin",
      icon: ClipboardList,
      exact: true,
    },
    {
      name: "Pro Bench",
      href: "/admin/pros",
      icon: UserCheck,
      exact: false,
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-grey-900 text-brand-grey-100 flex flex-col">
      {/* Top Dispatch Navigation Bar */}
      <header className="sticky top-0 z-40 bg-brand-grey-950/95 backdrop-blur-md border-b border-brand-grey-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Hub Info */}
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal-500 to-brand-teal-700 flex items-center justify-center text-white font-black text-base shadow">
                  T
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-base tracking-tight">
                      Tap &amp; Toggle
                    </span>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-brand-teal-900/80 text-brand-teal-300 border border-brand-teal-700/50">
                      DISPATCH
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-grey-400 leading-none">
                    NIBM Hyperlocal Operations Hub
                  </p>
                </div>
              </Link>

              {/* Status Pill */}
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-[11px] text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>NIBMgaon · Nyati · Sus Active</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? "bg-brand-teal-600/30 text-brand-teal-300 border border-brand-teal-500/30"
                        : "text-brand-grey-400 hover:text-white hover:bg-brand-grey-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions & User Info */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand-grey-400 hover:text-white hover:bg-brand-grey-800/80 transition"
              >
                <span>Customer Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="h-4 w-px bg-brand-grey-800" />

              <div className="flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-full bg-brand-amber-500/20 border border-brand-amber-500/40 text-brand-amber-300 flex items-center justify-center font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="text-brand-grey-300 max-w-[120px] truncate">
                  {userEmail.split("@")[0]}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1.5 rounded-lg text-brand-grey-400 hover:text-red-400 hover:bg-red-950/40 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-brand-grey-300 hover:bg-brand-grey-800"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-brand-grey-950 border-b border-brand-grey-800">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? "bg-brand-teal-600/30 text-brand-teal-300"
                      : "text-brand-grey-400 hover:bg-brand-grey-900 text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-brand-grey-800 flex items-center justify-between text-xs text-brand-grey-400">
              <Link href="/" target="_blank" className="flex items-center gap-1">
                <span>Customer Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
