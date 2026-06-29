"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CreditCard, Bell, Shield, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user/subscription");
        if (res.ok) {
          setSubscription(await res.json());
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and subscription</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">Subscription</h2>
          </div>

          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {subscription.planId?.replace(/_/g, " ") || "Standard Plan"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {subscription.status}
                    {subscription.currentPeriodEnd &&
                      ` · Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
                  </p>
                </div>
                <Badge
                  variant={
                    subscription.status === "ACTIVE" ? "success" : "default"
                  }
                >
                  {subscription.status}
                </Badge>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Change Plan
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  Cancel Subscription
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No active subscription</p>
              <Button variant="primary">Choose a Plan</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Monthly privacy reports", enabled: true },
              { label: "Removal request updates", enabled: true },
              { label: "New broker discovered alerts", enabled: false },
              { label: "Subscription reminders", enabled: true },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{n.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={n.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Two-factor authentication</p>
                <p className="text-xs text-gray-500">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <hr className="border-gray-100" />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              Sign out of all devices
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
