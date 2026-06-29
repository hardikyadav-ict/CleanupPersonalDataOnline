"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Gavel, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

const team = [
  { name: "Alex Chen", role: "Head of Product" },
  { name: "Sarah Williams", role: "Engineering" },
  { name: "Marcus Johnson", role: "Marketing" },
  { name: "Emily Rodriguez", role: "Data Broker Management" },
  { name: "James Park", role: "Experience" },
  { name: "Lisa Tanaka", role: "Engineering" },
];

const pillars = [
  {
    icon: Shield,
    title: "Automated data removals",
    description:
      "We provide an affordable, effective, and user-friendly data removal tool that covers the US, EU, and Canadian data brokers.",
  },
  {
    icon: Gavel,
    title: "Legal underpinning",
    description:
      "We use the GDPR, CCPA, and other applicable privacy laws to make data brokers remove your personal information from their databases.",
  },
  {
    icon: BookOpen,
    title: "Education and advocacy",
    description:
      "We work with consumer privacy advocacy groups and regularly publish our research to spread awareness and promote better data privacy laws.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="section-padding bg-gradient-to-b from-emerald-50 to-white">
        <div className="container-wide text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            We believe that data privacy is a human right
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Data protection is not universal. Depending on where you live in the world,
            your data is either protected to some extent or is not protected at all.
            At PrivacyShield, we believe that the need for privacy is shared by everyone.
            And that everyone should have full control over their data online.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                It all started with an idea. Our team was investigating data privacy issues
                when we stumbled upon the data broker industry and its appalling lack of
                regulation. We decided to build a tool that would curb the unfair data
                collection practices of data brokers and empower people to leverage existing
                privacy laws.
              </p>
              <p>
                A product that would use technology to return control over personal data
                back to its rightful owners. Today, we have helped remove over 245 million
                data points from data broker databases worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            How we do it
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pillars.map((pillar, i) => (
              <Card key={i} className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{pillar.title}</h3>
                <p className="text-gray-600 text-sm">{pillar.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Meet the team
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <Card key={i} className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-emerald-600 text-white text-center">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            We love working here. We think you will too!
          </h2>
          <p className="text-emerald-100 mb-6">
            Join us on our mission for a safer digital world and better data privacy.
          </p>
          <Link href="/pricing">
            <Button variant="secondary" size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50">
              Get started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
