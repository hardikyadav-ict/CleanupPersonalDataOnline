"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Building, Users, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ForBusinessPage() {
  return (
    <div>
      <section className="section-padding bg-gradient-to-b from-emerald-50 to-white">
        <div className="container-wide text-center max-w-4xl">
          <Building className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Enterprise privacy protection for your team
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Ironwall helps organizations protect employees from online exposure and targeted threats.
            Make your team harder to find and target online.
          </p>
          <Link href="#contact">
            <Button size="lg">
              Contact Sales <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "Executive Protection", desc: "Enhanced protection for C-suite and high-risk roles with continuous monitoring." },
              { icon: Users, title: "Team Coverage", desc: "Protect every employee in your organization with automated data removal." },
              { icon: Target, title: "Threat Reduction", desc: "Reduce phishing, social engineering, and physical security risks." },
            ].map((item, i) => (
              <Card key={i} className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-padding bg-gray-50">
        <div className="container-wide max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to protect your team?</h2>
          <p className="text-gray-600 mb-8">
            Get in touch with our sales team for a customized enterprise solution.
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Company name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <input
                type="email"
                placeholder="Work email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <textarea
                placeholder="How many employees would you like to protect?"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <Button className="w-full">Request Demo</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
