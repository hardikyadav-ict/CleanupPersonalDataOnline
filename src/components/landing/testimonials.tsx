"use client";

import { TESTIMONIALS } from "@/lib/plans";
import { Card } from "@/components/ui/card";

export function Testimonials() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Proof you can count on
          </h2>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span className="underline decoration-dotted">Our impact</span>
            <span>Reviews from creators</span>
            <span>User reviews</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.title}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed italic">
                &ldquo;{t.text}&rdquo;
              </p>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-12 items-center">
          {["SOC 2 Type II", "PCWorld Editor's Choice", "PCMag Editor's Choice", "BBB Accredited", "TechRadar", "CNET"].map(
            (badge) => (
              <div
                key={badge}
                className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-600"
              >
                {badge}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
