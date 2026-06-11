"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GSTPanel({ summary }: { summary: any }) {
  if (!summary) return null;

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">GST Liability</h2>

      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Total Income (INR)</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(summary.total_income_inr)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Estimated GST (18%)</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(summary.estimated_gst_18_percent)}
            </span>
          </div>

          {summary.cgst !== null && (
            <>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Breakdown:</p>
                <div className="space-y-1 ml-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">CGST (9%)</span>
                    <span className="text-gray-900">{formatCurrency(summary.cgst)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SGST (9%)</span>
                    <span className="text-gray-900">{formatCurrency(summary.sgst)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IGST (18%)</span>
                    <span className="text-gray-900">{formatCurrency(summary.igst)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {summary.is_approaching_threshold && (
            <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
              <p className="font-medium">Approaching GST threshold</p>
              <p className="text-xs mt-1">
                You are at {summary.threshold_percentage}% of ₹20L registration limit.
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3 text-xs text-gray-500">
            {summary.disclaimer}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}