"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  {
    number: 1,
    title: "It starts with a scan",
    description:
      "We scan people search sites for your personal information and send removal requests when records are found.",
    duration: "~14 days until resolution",
  },
  {
    number: 2,
    title: "First removal requests are sent",
    description:
      "We send automated removal requests to all covered data brokers who may have your personal information.",
    duration: "",
  },
  {
    number: 3,
    title: "Requests are sent on repeat",
    description:
      "We re-scan and send out fresh waves of removal requests regularly, so data brokers won't have the chance to re-collect your data.",
    duration: "10 days until next request",
  },
  {
    number: 4,
    title: "We don't stop there",
    description:
      "We continually track down and add new data brokers to our list, so your level of protection keeps improving.",
    duration: "",
  },
  {
    number: 5,
    title: "Progress reports keep you informed",
    description:
      "You'll receive regular privacy reports to stay in the loop and maintain total control over your personal data.",
    duration: "Monthly reports",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Data privacy should not be a hassle
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We ensure it isn&apos;t with our automated data removals
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 pb-12 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-emerald-200 mt-2" />
                )}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {step.duration && (
                  <span className="inline-block mt-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    {step.duration}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/pricing">
            <Button size="lg">Get started now</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
