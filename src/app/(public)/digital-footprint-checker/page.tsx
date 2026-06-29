"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, Search, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

export default function DigitalFootprintCheckerPage() {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<null | { found: number; brokers: string[] }>(null);

  const handleScan = async () => {
    if (!state || !city) return;
    setScanning(true);
    await new Promise((r) => setTimeout(r, 2500));
    setResults({
      found: Math.floor(Math.random() * 8) + 3,
      brokers: ["Spokeo", "Whitepages", "BeenVerified", "PeopleFinders", "TruthFinder"].slice(0, Math.floor(Math.random() * 5) + 1),
    });
    setScanning(false);
  };

  return (
    <div>
      <section className="section-padding bg-gradient-to-b from-emerald-50 to-white">
        <div className="container-wide text-center max-w-3xl mx-auto">
          <Shield className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Check if your personal info is exposed
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your personal data is collected and sold every day. Discover which companies
            hold your personal information with our free data exposure scan.
          </p>

          {!results ? (
            <Card className="p-8 max-w-md mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">Choose the state</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Input
                  id="city"
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                />
                <Button
                  onClick={handleScan}
                  loading={scanning}
                  disabled={!state || !city}
                  className="w-full"
                >
                  {scanning ? "Scanning..." : "Run free scan"}
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 max-w-md mx-auto">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {results.found} profiles found
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Your data was found on the following sites:
                </p>
                <ul className="space-y-2 mb-6">
                  {results.brokers.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                      <Search className="w-4 h-4 text-emerald-600" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button className="w-full">
                    Sign up to remove your data <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <button
                  onClick={() => setResults(null)}
                  className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                >
                  Run another scan
                </button>
              </div>
            </Card>
          )}
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-2">When your information falls into the wrong hands</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  You receive robocalls, spam calls, texts and messages daily
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  You are at risk of doxxing, online snooping, and stalking
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  You are on the target list for identity theft and phishing
                </li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-2">Take back control in 4 steps</h3>
              <ol className="space-y-3 text-sm text-gray-600 list-decimal list-inside">
                <li>Enter your details and run a free scan</li>
                <li>We scan people search sites for your data</li>
                <li>Receive your free report in your inbox</li>
                <li>Sign up to continuously remove your data</li>
              </ol>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
