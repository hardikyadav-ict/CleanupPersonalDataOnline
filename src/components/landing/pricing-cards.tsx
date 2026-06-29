"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function PricingCards() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Personal information removals made easy
          </h2>
          <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full p-1 mt-4">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative p-6 flex flex-col",
                plan.recommended && "ring-2 ring-emerald-500 shadow-lg scale-[1.02]"
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
                    Billed ${(plan.annualPrice * 12).toFixed(2)} annually
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
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

              <Link href={`/pricing?plan=${plan.id}&billing=${annual ? "annual" : "monthly"}`}>
                <Button variant={plan.recommended ? "primary" : "outline"} className="w-full">
                  Get {plan.name}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            30-day money-back guarantee &middot; Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
