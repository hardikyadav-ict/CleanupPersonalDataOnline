"use client";

import { Card } from "@/components/ui/card";
import { Phone, ShieldAlert, Banknote, Eye } from "lucide-react";

const risks = [
  {
    icon: Phone,
    title: "Everyday nuisances",
    description:
      "Marketers buy your personal profiles from data brokers and scrape your contact details from people search sites.",
    items: ["Spam calls and emails", "Junk mail", "Spam messages", "Robocalls"],
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: ShieldAlert,
    title: "Exposure to cybercriminals",
    description:
      "Cybercriminals need your personal information to target you with more and better tailored attacks.",
    items: ["Scams", "Identity theft", "Hacking"],
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Banknote,
    title: "Financial difficulties",
    description:
      "Financial data brokers sell details such as your credit scores and health-related searches to insurers and banks.",
    items: ["Increased insurance rates", "Loan denials", "Loss of job opportunities"],
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Eye,
    title: "Compromised privacy & safety",
    description:
      "People search sites give total strangers access to your address, family members, and personal routines.",
    items: ["Stalking", "Doxxing", "Swatting", "Blackmail"],
    color: "bg-purple-50 text-purple-600",
  },
];

export function RiskCards() {
  return (
    <section id="features" className="section-padding bg-gray-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Here&apos;s what&apos;s at stake
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personal data is being collected, sold, and exposed every day
            without your consent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {risks.map((risk, i) => (
            <Card key={i} hover className="p-6">
              <div className={`w-12 h-12 rounded-xl ${risk.color} flex items-center justify-center mb-4`}>
                <risk.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{risk.title}</h3>
              <p className="text-gray-600 mb-4">{risk.description}</p>
              <ul className="space-y-1.5">
                {risk.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
