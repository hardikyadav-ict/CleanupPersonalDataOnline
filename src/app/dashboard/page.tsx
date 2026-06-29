"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  PlayCircle,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardData {
  stats: {
    total: number;
    removed: number;
    inProgress: number;
    pending: number;
    failed: number;
  };
  protectionScore: number;
  profile: { email?: string; firstName?: string; lastName?: string };
  authSigned: boolean;
  hasPhones: boolean;
  hasAddresses: boolean;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brokersRes, profileRes, addrRes, phoneRes, authRes] = await Promise.all([
          fetch("/api/user/brokers"),
          fetch("/api/user/profile"),
          fetch("/api/user/addresses"),
          fetch("/api/user/phones"),
          fetch("/api/user/authorization"),
        ]);
        const brokers = await brokersRes.json();
        const profile = await profileRes.json();
        const addresses = await addrRes.json();
        const phones = await phoneRes.json();
        const auth = await authRes.json();

        setData({
          stats: brokers.stats,
          protectionScore: Math.round(
            (brokers.stats.removed / Math.max(brokers.stats.total, 1)) * 100
          ),
          profile: {
            email: profile?.user?.email,
            firstName: profile?.firstName,
            lastName: profile?.lastName,
          },
          authSigned: auth?.signed || false,
          hasPhones: phones.length > 0,
          hasAddresses: addresses.length > 0,
        });
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const startRemoval = async () => {
    setStarting(true);
    try {
      await fetch("/api/user/removal-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
    setStarting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const stats = data?.stats || { total: 0, removed: 0, inProgress: 0, pending: 0, failed: 0 };
  const score = data?.protectionScore || 0;
  const canStart = (data?.profile?.email || data?.profile?.firstName) && data?.authSigned;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Your privacy protection overview</p>
      </div>

      {!canStart && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-900">Complete setup to start removals</p>
                <p className="text-xs text-amber-700 mt-1">
                  Add your personal info on the{" "}
                  <Link href="/dashboard/profile" className="underline font-medium">Profile page</Link> and sign the{" "}
                  <Link href="/dashboard/authorization" className="underline font-medium">Authorization form</Link>{" "}
                  to enable automated opt-out requests on your behalf.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {canStart && stats.pending === stats.total && stats.total > 0 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <PlayCircle className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    Ready to remove your data from {stats.total} broker sites
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">
                    We&apos;ll use your email{data?.hasPhones ? ", phone" : ""}{data?.hasAddresses ? ", and address" : ""} to submit opt-out requests.
                  </p>
                </div>
              </div>
              <Button onClick={startRemoval} loading={starting}>
                Start Removal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">{score}%</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Protection Score</p>
            <p className="text-xs text-gray-500">Based on completed removals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">{stats.removed}</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Removed</p>
            <p className="text-xs text-gray-500">Data brokers cleaned</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">{stats.inProgress}</span>
            </div>
            <p className="text-sm font-medium text-gray-900">In Progress</p>
            <p className="text-xs text-gray-500">Removals underway</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className={cn("w-8 h-8", stats.failed > 0 ? "text-red-600" : "text-gray-400")} />
              <span className={cn("text-2xl font-bold", stats.failed > 0 ? "text-red-600" : "text-gray-400")}>
                {stats.failed}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">Failed</p>
            <p className="text-xs text-gray-500">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Broker Overview</h2>
            <Link href="/dashboard/brokers">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
            <div
              className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(stats.removed / Math.max(stats.total, 1)) * 100}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-gray-500">
              <strong className="text-gray-900">{stats.total}</strong> total brokers
            </span>
            <span className="text-emerald-600">
              <strong>{stats.removed}</strong> removed
            </span>
            <span className="text-amber-600">
              <strong>{stats.inProgress}</strong> in progress
            </span>
            <span className="text-gray-400">
              <strong>{stats.pending}</strong> pending
            </span>
            <span className="text-red-600">
              <strong>{stats.failed}</strong> failed
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/dashboard/profile" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Update your personal info
                </Button>
              </Link>
              <Link href="/dashboard/authorization" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Sign authorization form
                </Button>
              </Link>
              <Link href="/dashboard/brokers" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  View broker status
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Plan</h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-900">Free Plan</p>
                <p className="text-sm text-gray-500">All features included</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-xs text-gray-400">No payment required</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
