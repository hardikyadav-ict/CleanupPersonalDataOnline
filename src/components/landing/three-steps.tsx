"use client";

import { Card } from "@/components/ui/card";
import { UserPlus, FileSignature, Sparkles } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign up and create your profile",
    description:
      "We'll need your name, email, and home address to help us match your profile with records in data broker databases.",
    image: "/steps/sign-up.png",
  },
  {
    icon: FileSignature,
    title: "Grant us the right to act on your behalf",
    description:
      "Sign an online authorization form to grant us the power to demand data brokers remove your personal information.",
    image: "/steps/sign.png",
  },
  {
    icon: Sparkles,
    title: "Sit back and let us do the work",
    description:
      "We make exercising your right to data privacy easy by automating the data removal process. Track progress through your dashboard.",
    image: "/steps/protect.png",
  },
];

export function ThreeSteps() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get started in three steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting protected takes just minutes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
