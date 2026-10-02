import React from "react";
import { Hero } from "@/components/landing/Hero";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { RateCard } from "@/components/landing/RateCard";
import { BookingForm } from "@/components/landing/BookingForm";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust Badges Section */}
      <TrustBadges />

      {/* 3. How It Works Section */}
      <HowItWorks />

      {/* 4. Core Services Showcase */}
      <ServicesSection />

      {/* 5. Interactive Rate Card */}
      <RateCard />

      {/* 6. DPDP-Compliant Lead Request Form */}
      <BookingForm />
    </div>
  );
}
