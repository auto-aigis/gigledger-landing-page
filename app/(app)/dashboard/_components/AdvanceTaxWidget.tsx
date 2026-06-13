"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertTriangle, Clock, CheckCircle } from "lucide-react";

interface AdvanceTaxWidgetProps {
  annualEstimate: number;
  fmt: (n: number) => string;
}

function getQuarterStatus(dueDate: Date): { label: string; color: string; icon: any } {
  const now = new Date();
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: "Overdue", color: "bg-red-100 text-red-700 border-red-200", icon: AlertTriangle };
  if (diffDays <= 30) return { label: "Due Soon", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock };
  return { label: "Upcoming", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle };
}

export default function AdvanceTaxWidget({ annualEstimate, fmt }: AdvanceTaxWidgetProps) {
  const year = new Date().getFullYear();
  const quarters = [
    { quarter: "Q1", due: new Date(year, 5, 15), label: "Jun 15", pct: 15 },
    { quarter: "Q2", due: new Date(year, 8, 15), label: "Sep 15", pct: 45 },
    { quarter: "Q3", due: new Date(year, 11, 15), label: "Dec 15", pct: 75 },
    { quarter: "Q4", due: new Date(year + 1, 2, 15), label: "Mar 15", pct: 100 },
  ];

  const estimatedTax = annualEstimate > 250000 ? (annualEstimate - 250000) * 0.05 : 0;

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-base font-semibold text-gray-900">Advance Tax Tracker</CardTitle>
          </div>
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
            Est. Annual: {fmt(annualEstimate)}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Based on YTD income, your estimated advance tax: <strong>{fmt(estimatedTax)}</strong>
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quarters.map(({ quarter, due, label, pct }) => {
            const { label: statusLabel, color, icon: Icon } = getQuarterStatus(due);
            const quarterTax = (estimatedTax * pct) / 100;
            return (
              <div key={quarter} className={`rounded-lg border p-3 ${color}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{quarter}</span>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs font-medium">{label}</p>
                <p className="text-xs mt-1 opacity-80">{fmt(quarterTax)}</p>
                <p className="text-xs mt-1 font-medium">{statusLabel}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3 italic">
          Advance tax is due if total tax exceeds ₹10,000/year. Consult a CA for exact calculations.
        </p>
      </CardContent>
    </Card>
  );
}
