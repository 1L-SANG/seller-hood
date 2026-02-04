import { CTASection } from "@/components/posts/cta-section";
import { FeaturesSection } from "@/components/posts/features-section";
import { HeroSection } from "@/components/posts/hero-section";
import { HowItWorksSection } from "@/components/posts/how-it-works-section";
import { PricingSection } from "@/components/posts/pricing-section";
import { TestimonialsSection } from "@/components/posts/testimonials-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
