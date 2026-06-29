"use client";

import { STATS } from "@/lib/plans";
import { Shield, Globe, Database, Target } from "lucide-react";

const icons = [Globe, Database, Shield, Target];

export function StatsSection() {
  return (
    <section className="section-padding bg-emerald-600 text-white">
      <div className="container-wide">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <p className="text-emerald-200 text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
        <p className="text-center text-emerald-300 text-xs mt-8">
          Numbers verified by Deloitte
        </p>
      </div>
    </section>
  );
}
