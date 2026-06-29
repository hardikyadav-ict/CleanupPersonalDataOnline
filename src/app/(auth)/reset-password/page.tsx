"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, Mail } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Shield className="w-8 h-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">PrivacyShield</span>
          </Link>
        </div>

        <Card className="p-8">
          {sent ? (
            <div className="text-center">
              <Mail className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
              <p className="text-gray-500 mb-6">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
              <Link href="/login">
                <Button variant="outline">Back to sign in</Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h1>
              <p className="text-gray-500 mb-6">
                Enter your email and we&apos;ll send you a reset link
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
                <Button type="submit" loading={loading} className="w-full">
                  Send reset link
                </Button>
              </form>
              <div className="mt-6 text-center text-sm">
                <Link href="/login" className="text-emerald-600 hover:underline">
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
