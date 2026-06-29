"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Shield } from "lucide-react";

const statusColors: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
  REMOVED: "success",
  CONFIRMED: "success",
  IN_PROGRESS: "warning",
  PENDING: "default",
  SCANNING: "info",
  FAILED: "error",
  NOT_FOUND: "default",
};

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const res = await fetch("/api/user/brokers");
        const json = await res.json();
        setBrokers(json.brokers || []);
        setStats(json.stats);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchBrokers();
  }, []);

  const filtered = brokers.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Brokers</h1>
        <p className="text-gray-500 mt-1">
          Track removal status for {stats?.total || 0} data brokers
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-gray-900" },
            { label: "Removed", value: stats.removed, color: "text-emerald-600" },
            { label: "In Progress", value: stats.inProgress, color: "text-amber-600" },
            { label: "Pending", value: stats.pending, color: "text-gray-400" },
            { label: "Failed", value: stats.failed, color: "text-red-600" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search brokers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <Card>
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Broker</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 hidden md:table-cell">Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((broker) => (
                <tr key={broker.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{broker.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-gray-500 capitalize">{broker.type?.toLowerCase()}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={statusColors[broker.status] || "default"}>
                      {broker.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                    {broker.lastChecked
                      ? new Date(broker.lastChecked).toLocaleDateString()
                      : "Not yet"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
