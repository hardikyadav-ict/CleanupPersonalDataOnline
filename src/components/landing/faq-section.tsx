"use client";

import { Accordion } from "@/components/ui/accordion";

const faqs = [
  {
    title: "What is a data broker?",
    content:
      "Data brokers are companies that scrape the internet for personal information. They aggregate, analyze, and sell this data to third parties such as private businesses, insurance companies, financial institutions, and other data brokers.",
  },
  {
    title: "How do you know if a data broker has my personal information?",
    content:
      "We use the information you provide us to regularly scan people search sites for your data. When a match is flagged, we have it taken down. For private data brokers with closed databases, we use information such as your region to identify any broker that may hold your data and send them opt-out requests periodically.",
  },
  {
    title: "How long does it take to remove my data?",
    content:
      "How long data removal takes depends on the data broker. Some brokers comply with removal requests within hours, others take weeks. You can check the expected removal time of each data broker through your dashboard.",
  },
  {
    title: "Does PrivacyShield have a family plan?",
    content:
      "Yes, we offer Family plans that cover you and up to 4 additional members. Each member gets their own full data broker removal. Our Family Unlimited plan also includes custom removal requests and live phone support.",
  },
  {
    title: "How much does a subscription cost?",
    content:
      "Our Standard plan starts at $7.99/month (billed annually) or $15.98/month (monthly). We also offer Unlimited, Family, and Family Unlimited plans. All plans come with a 30-day money-back guarantee. Visit our pricing page for full details.",
  },
  {
    title: "Is my data safe with PrivacyShield?",
    content:
      "Yes, your data is safe and secure. We use AES-256-GCM encryption for all personal information, SOC 2 Type II audited infrastructure, and ephemeral browser sessions for all removal requests. We never share your data with third parties.",
  },
];

export function FAQSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-wide max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Need more information?
        </h2>
        <Accordion items={faqs} />
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Have more questions?{" "}
            <a href="#" className="text-emerald-600 hover:underline font-medium">
              Visit our Help Center
            </a>{" "}
            or reach out to our{" "}
            <a href="#" className="text-emerald-600 hover:underline font-medium">
              support team
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
