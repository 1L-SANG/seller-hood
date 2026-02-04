"use client";

import { Navigation } from "@/components/sellerhood/navigation";
import { HeroSection } from "@/components/sellerhood/hero-section";
import { FeaturesSection } from "@/components/sellerhood/features-section";
import { HowItWorksSection } from "@/components/sellerhood/how-it-works-section";
import { TestimonialsSection } from "@/components/sellerhood/testimonials-section";
import { PricingSection } from "@/components/sellerhood/pricing-section";
import { CTASection } from "@/components/sellerhood/cta-section";
import { Footer } from "@/components/sellerhood/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
