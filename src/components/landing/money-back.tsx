"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, HeadphonesIcon, ArrowRight } from "lucide-react";

export function MoneyBack() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <Card className="p-8 md:p-12 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white border-0">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <ShieldCheck className="w-12 h-12 mx-auto md:mx-0 mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                30-day money-back guarantee on all plans
              </h2>
              <p className="text-emerald-100 mb-6 max-w-xl">
                If we don&apos;t meet your expectations, contact our 24/7 Customer
                Support Team within 30 days of signing up, and we&apos;ll refund the
                full amount paid.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <Link href="/pricing">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-emerald-800 hover:bg-emerald-50"
                  >
                    Try PrivacyShield <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-emerald-200">
                  <HeadphonesIcon className="w-4 h-4" />
                  24/7 support
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <ShieldCheck className="w-32 h-32 text-emerald-500/50" />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
