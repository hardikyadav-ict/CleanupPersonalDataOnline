"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Clock } from "lucide-react";

const mockReports = [
  { id: "1", period: "Jun 1-28, 2026", generated: "Jun 28, 2026", status: "available", brokersRemoved: 156 },
  { id: "2", period: "May 1-31, 2026", generated: "May 31, 2026", status: "available", brokersRemoved: 142 },
  { id: "3", period: "Apr 1-30, 2026", generated: "Apr 30, 2026", status: "available", brokersRemoved: 138 },
  { id: "4", period: "Mar 1-31, 2026", generated: "Mar 31, 2026", status: "available", brokersRemoved: 125 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Privacy Reports</h1>
        <p className="text-gray-500 mt-1">
          Your monthly privacy protection summaries
        </p>
      </div>

      <Card className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold mb-1">Latest Report Available</h2>
              <p className="text-emerald-200 text-sm">
                June 2026 — {mockReports[0].brokersRemoved} brokers cleaned
              </p>
            </div>
            <Button variant="secondary" className="bg-white text-emerald-800 hover:bg-emerald-50">
              <Download className="mr-2 w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Report History</h2>
          <div className="space-y-3">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">{report.period}</p>
                    <p className="text-sm text-gray-500">
                      Generated {report.generated} &middot; {report.brokersRemoved} removals
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">Available</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Understanding Your Reports</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Each monthly report shows the total number of data brokers your data has been
              removed from, new brokers discovered, and the status of ongoing removal requests.
            </p>
            <p>
              Reports are generated automatically on the last day of each month and are
              available for download as PDF.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
