import React from "react";
import { Hero } from "@/components/landing/Hero";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { SocietyChecker } from "@/components/landing/SocietyChecker";
import { RateCard } from "@/components/landing/RateCard";
import { EstimateCalculator } from "@/components/landing/EstimateCalculator";
import { SnapEstimateCTA } from "@/components/landing/SnapEstimateCTA";
import { RecentRepairsFeed } from "@/components/landing/RecentRepairsFeed";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { BookingForm } from "@/components/landing/BookingForm";
import { FAQSection } from "@/components/landing/FAQSection";
import { FloatingWhatsAppCTA } from "@/components/landing/FloatingWhatsAppCTA";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust Badges Section */}
      <TrustBadges />

      {/* 3. How It Works Section */}
      <HowItWorks />

      {/* 4. Core Services Showcase */}
      <ServicesSection />

      {/* 5. Society Gate Clearance Checker & Vote Form */}
      <SocietyChecker />

      {/* 6. Interactive Rate Card with 1-Click WhatsApp Booking */}
      <RateCard />

      {/* 7. Multi-Item Upfront Cost Estimator */}
      <EstimateCalculator />

      {/* 8. Snap a Photo / Video 2-Min WhatsApp Estimate */}
      <SnapEstimateCTA />

      {/* 9. Live Hyperlocal Social Proof & Recent Society Repairs */}
      <RecentRepairsFeed />

      {/* 10. Platform vs Competitor Matrix */}
      <ComparisonTable />

      {/* 11. DPDP-Compliant Lead Request Form */}
      <BookingForm />

      {/* 12. Trust FAQs & Objections Buster */}
      <FAQSection />

      {/* 13. Floating Sticky WhatsApp Quick Action */}
      <FloatingWhatsAppCTA />
    </div>
  );
}
