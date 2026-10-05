import React from "react";
import { Hero } from "@/components/landing/Hero";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { SocietyChecker } from "@/components/landing/SocietyChecker";
import { RateCard } from "@/components/landing/RateCard";
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

      {/* 5. Society Gate Clearance Checker */}
      <SocietyChecker />

      {/* 6. Interactive Rate Card */}
      <RateCard />

      {/* 7. DPDP-Compliant Lead Request Form */}
      <BookingForm />

      {/* 8. Trust FAQs & Objections Buster */}
      <FAQSection />

      {/* 9. Floating Sticky WhatsApp Quick Action */}
      <FloatingWhatsAppCTA />
    </div>
  );
}

