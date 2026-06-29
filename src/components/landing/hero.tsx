"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Star } from "lucide-react";

const trustLogos = [
  { name: "TechRadar", src: "/logos/techradar.svg" },
  { name: "PCWorld", src: "/logos/pcworld.svg" },
  { name: "PCMag", src: "/logos/pcmag.svg" },
  { name: "Security.org", src: "/logos/security-org.svg" },
  { name: "Cybernews", src: "/logos/cybernews.svg" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="container-wide pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 fill-emerald-800" />
              Independently verified by Deloitte
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Take back control of{" "}
              <span className="text-emerald-600">your personal data</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
              Automatically remove your personal information from 420+ data broker
              sites. Stop spam calls, reduce scam risk, and reclaim your privacy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/pricing">
                <Button size="lg" className="text-base px-10">
                  Get started
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button variant="outline" size="lg" className="text-base">
                  How it works
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 text-emerald-600" />
              30-day money-back guarantee
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                As seen on
              </span>
              {trustLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="h-8 opacity-50 grayscale hover:opacity-70 transition-opacity"
                >
                  <span className="text-sm font-semibold text-gray-500">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full blur-3xl opacity-20" />
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-md">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-10 h-10 text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">PrivacyShield</h3>
                    <p className="text-sm text-gray-500">Active Protection</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Brokers Covered</span>
                    <span className="text-2xl font-bold text-emerald-600">420+</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Requests Sent</span>
                    <span className="text-2xl font-bold text-blue-600">245M+</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-700">Your Protection</span>
                    <span className="text-2xl font-bold text-amber-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
