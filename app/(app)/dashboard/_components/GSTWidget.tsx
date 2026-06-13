"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info } from "lucide-react";
import { GSTEstimate, User } from "@/app/_lib/types";

interface GSTWidgetProps {
  gstEstimate: GSTEstimate | null;
  user: User | null;
  fmt: (n: number) => string;
}

export default function GSTWidget({ gstEstimate, user, fmt }: GSTWidgetProps) {
  const isRegistered = user?.gst_status === "registered";
  const isApproaching = user?.gst_status === "threshold-approaching";

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">GST Liability</CardTitle>
          <Badge variant="outline" className={
            isRegistered ? "border-green-300 text-green-700" :
            isApproaching ? "border-yellow-300 text-yellow-700" :
            "border-gray-300 text-gray-600"
          }>
            {isRegistered ? "Registered" : isApproaching ? "Approaching Threshold" : "Unregistered"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRegistered ? (
          <>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-600 font-medium mb-1">Estimated GST Payable (This Quarter)</p>
              <p className="text-3xl font-bold text-blue-900">{fmt(gstEstimate?.estimated_gst_payable || 0)}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Domestic Income (taxable)</span>
                <span className="font-medium text-gray-900">{fmt(gstEstimate?.domestic_income || 0)}</span>
              </div>
              {(gstEstimate?.cgst || 0) > 0 && (
                <>
                  <div className="flex justify-between py-1 pl-3">
                    <span className="text-gray-500">CGST @ 9%</span>
                    <span className="text-gray-800">{fmt(gstEstimate?.cgst || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1 pl-3">
                    <span className="text-gray-500">SGST @ 9%</span>
                    <span className="text-gray-800">{fmt(gstEstimate?.sgst || 0)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-600">Export Income (zero-rated)</span>
                <span className="font-medium text-gray-900">{fmt(gstEstimate?.export_income || 0)}</span>
              </div>
              <div className="flex justify-between py-1 pl-3">
                <span className="text-gray-500">IGST @ 0%</span>
                <span className="text-gray-800">₹ 0</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-700 font-medium">Registration Threshold Progress</p>
                <p className="text-sm font-bold text-gray-900">
                  {(gstEstimate?.threshold_progress_percent || 0).toFixed(1)}%
                </p>
              </div>
              <Progress value={gstEstimate?.threshold_progress_percent || 0} className="h-3" />
              <div className="flex justify-between mt-1.5 text-xs text-gray-500">
                <span>{fmt(gstEstimate?.domestic_income || 0)} YTD</span>
                <span>₹20,00,000 threshold</span>
              </div>
            </div>
            {gstEstimate?.is_approaching_threshold && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 text-xs">
                  <strong>Action needed:</strong> You&apos;re approaching the ₹20L GST registration threshold. Consider registering to avoid penalties.
                </AlertDescription>
              </Alert>
            )}
            {isApproaching && !gstEstimate?.is_approaching_threshold && (
              <Alert className="border-blue-100 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700 text-xs">
                  You&apos;ve marked your status as &quot;Approaching Threshold&quot;. Monitor your income closely.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
        <p className="text-xs text-gray-400 italic flex items-center gap-1">
          <Info className="h-3 w-3" /> Estimate only. Consult a CA for filing.
        </p>
      </CardContent>
    </Card>
  );
}
