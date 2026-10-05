import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site";
import Link from "next/link";
import { Droplets, Zap, ShieldCheck } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} style={{ scrollBehavior: "smooth" }}>
      <body className="min-h-screen flex flex-col bg-brand-grey-50 text-brand-grey-900 antialiased selection:bg-brand-teal-100 selection:text-brand-teal-900">
        {/* Header Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-brand-teal-900/10 bg-white/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-teal-700 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-teal-800 transition-colors">
                <span className="flex items-center">
                  <Droplets className="w-4 h-4 text-brand-teal-200" />
                  <Zap className="w-4 h-4 -ml-1 text-brand-amber-400 fill-brand-amber-400" />
                </span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-brand-teal-900 block leading-tight">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-[11px] font-medium text-brand-grey-500 block">
                  Plumbing & Electrical · NIBM
                </span>
              </div>
            </Link>

            {/* Quick Links & CTA */}
            <div className="flex items-center gap-3 sm:gap-6">
              <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-brand-grey-600">
                <Link href="/#rate-card" className="hover:text-brand-teal-800 transition-colors">
                  Rate Card
                </Link>
                <Link href="/#booking-form" className="hover:text-brand-teal-800 transition-colors">
                  Book a Pro
                </Link>
              </nav>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal-50 border border-brand-teal-100 text-xs font-medium text-brand-teal-800">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-teal-600" />
                <span>7-Day Warranty</span>
              </div>

              <a
                href={`https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-medium text-xs sm:text-sm shadow-sm transition-all hover:shadow focus:ring-2 focus:ring-brand-amber-400 focus:ring-offset-2"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-brand-grey-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-lg font-bold text-brand-teal-900">
                    {SITE_CONFIG.name}
                  </span>
                </div>
                <p className="text-sm text-brand-grey-600 mt-1 max-w-md">
                  {SITE_CONFIG.tagline}
                </p>
                <p className="text-xs text-brand-grey-400 mt-1">
                  Serving {SITE_CONFIG.serviceArea}
                </p>
              </div>

              <div className="flex flex-col items-center md:items-end gap-2 text-xs text-brand-grey-500">
                <div className="flex items-center gap-4 text-brand-teal-800 font-semibold">
                  <Link href="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                  <span>•</span>
                  <Link href="/terms" className="hover:underline">
                    Terms of Service
                  </Link>
                  <span>•</span>
                  <Link href="/#rate-card" className="hover:underline">
                    Rate Card
                  </Link>
                  <span>•</span>
                  <Link href="/pro/login" className="text-brand-amber-600 hover:underline">
                    Technician Portal
                  </Link>
                </div>
                <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
                <div className="flex items-center gap-2 text-brand-grey-400 text-[11px]">
                  <span>Managed dispatch &amp; verified bench</span>
                  <span>•</span>
                  <Link href="/admin/login" className="hover:text-brand-grey-600">
                    Ops Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
