import { Hero } from "@/components/landing/hero";
import { RiskCards } from "@/components/landing/risk-cards";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ThreeSteps } from "@/components/landing/three-steps";
import { PricingCards } from "@/components/landing/pricing-cards";
import { Testimonials } from "@/components/landing/testimonials";
import { StatsSection } from "@/components/landing/stats-section";
import { MoneyBack } from "@/components/landing/money-back";
import { FAQSection } from "@/components/landing/faq-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <RiskCards />
      <HowItWorks />
      <ThreeSteps />
      <PricingCards />
      <Testimonials />
      <StatsSection />
      <MoneyBack />
      <FAQSection />
    </>
  );
}
