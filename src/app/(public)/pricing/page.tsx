"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion } from "@/components/ui/accordion";
import { Check, X, ShieldCheck, ArrowRight } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

const comparisonFeatures = [
  { label: "420+ data broker sites covered", standard: true, unlimited: true, family: true, familyUnlimited: true },
  { label: "Multiple emails, addresses & phone numbers", standard: true, unlimited: true, family: true, familyUnlimited: true },
  { label: "Recurring removals", standard: true, unlimited: true, family: true, familyUnlimited: true },
  { label: "Custom removal requests (2,000+ sites)", standard: false, unlimited: true, family: false, familyUnlimited: true },
  { label: "Live phone support", standard: false, unlimited: true, family: false, familyUnlimited: true },
  { label: "Up to 5 members", standard: false, unlimited: false, family: true, familyUnlimited: true },
  { label: "Family account management", standard: false, unlimited: false, family: true, familyUnlimited: true },
];

const pricingFaqs = [
  {
    title: "What is a data broker?",
    content:
      "Data brokers are companies that scrape the internet for personal information. They aggregate, often analyze, and then sell this data to third parties such as private businesses, insurance companies, financial institutions, the government, and other data brokers.",
  },
  {
    title: "How long does it take to remove my data from data broker databases?",
    content:
      "How long data removal takes depends on the data broker. Some data brokers comply with removal requests within hours, others take weeks. You can check the expected removal time of each data broker through your dashboard.",
  },
  {
    title: "How much does a subscription to PrivacyShield cost?",
    content:
      "It depends on the plan you choose. We offer both monthly and yearly subscriptions. For example, a standard yearly individual plan costs $7.99/month ($95.88 billed yearly). A standard monthly individual plan costs $15.98/month.",
  },
  {
    title: "Does PrivacyShield have a family plan?",
    content:
      "Yes, PrivacyShield offers a Family plan. You can add up to four people to your subscription with this plan. Each member gets their own data broker removal coverage.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div>
      <section className="section-padding bg-gradient-to-b from-emerald-50 to-white">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your personal data, removed from the web
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Automatic removal from 420+ data brokers — and over 3,000 other websites.
          </p>

          <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full p-1 mt-8">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                !annual ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                annual ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
              )}
            >
              Annually
              <Badge variant="success" className="ml-2">Save 50%</Badge>
            </button>
          </div>
        </div>
      </section>

      <section className="section-padding -mt-8">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  "relative p-6 flex flex-col",
                  plan.recommended && "ring-2 ring-emerald-500 shadow-lg"
                )}
              >
                {plan.recommended && (
                  <Badge variant="success" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Recommended
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ${annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                  {annual && (
                    <p className="text-xs text-gray-500 mt-1">
                      Billed ${(plan.annualPrice * 12).toFixed(2)} annually. VAT/Sales Tax may apply.
                    </p>
                  )}
                </div>

                <Link href="/checkout" className="block mb-4">
                  <Button variant={plan.recommended ? "primary" : "outline"} className="w-full">
                    Get {plan.name}
                  </Button>
                </Link>

                <p className="text-xs text-gray-400 text-center mb-6 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  30-day money-back guarantee
                </p>

                <ul className="space-y-3 flex-1">
                  {(plan.features as Array<{text: string; included: boolean}>).map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {feat.included ? (
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={feat.included ? "text-gray-700" : "text-gray-400"}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            What&apos;s included in each plan
          </h2>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Standard</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-emerald-50">Unlimited</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Family</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Family Unlimited</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feat, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">{feat.label}</td>
                    {["standard", "unlimited", "family", "familyUnlimited"].map((plan) => (
                      <td key={plan} className="text-center py-3 px-4">
                        {feat[plan as keyof typeof feat] ? (
                          <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white border-0 max-w-4xl mx-auto">
            <div className="text-center">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                30-day money-back guarantee on all PrivacyShield plans
              </h2>
              <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
                If we don&apos;t meet your expectations, contact our 24/7 Customer Support Team
                within 30 days of signing up, and we&apos;ll refund the full amount paid.
              </p>
              <Link href="/checkout">
                <Button variant="secondary" size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50">
                  Get Incogni now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-wide max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Need more information?
          </h2>
          <Accordion items={pricingFaqs} />
        </div>
      </section>
    </div>
  );
}
