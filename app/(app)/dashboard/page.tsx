"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { incomeApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";


function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [gstEstimate, setGstEstimate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);


  useEffect(() => {
    const checkoutSuccess = searchParams.get("checkout") === "success";
    if (checkoutSuccess) {
      setPaymentSuccess(true);
      const timer = setTimeout(() => setPaymentSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [s, g] = await Promise.all([
          incomeApi.getSummary(),
          incomeApi.getGSTEstimate(),
        ]);
        setSummary(s);
        setGstEstimate(g);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(num);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.display_name || user?.email}!
        </p>
      </div>

      {paymentSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            Payment processed successfully! Your subscription has been updated.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(summary?.total_month || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              This Quarter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(summary?.total_quarter || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Year to Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(summary?.total_ytd || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">GST Liability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium text-gray-900">
                Estimated GST Payable (Q{new Date().getMonth() < 6 ? 1 : 2})
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(gstEstimate?.estimated_gst_payable || 0)}
              </p>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Domestic Services (18%): {formatCurrency(gstEstimate?.domestic_income * 0.18 || 0)}</p>
              <p>Export of Services (0%): {formatCurrency(0)}</p>
            </div>
          </div>
          {user?.gst_status === "unregistered" && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">
                GST Registration Threshold Progress
              </p>
              <Progress
                value={gstEstimate?.threshold_progress_percent || 0}
                className="h-2"
              />
              <p className="text-xs text-gray-600 mt-2">
                {formatCurrency(gstEstimate?.domestic_income || 0)} of
                {formatCurrency(2000000)} annual
              </p>
              {gstEstimate?.is_approaching_threshold && (
                <Alert className="border-yellow-200 bg-yellow-50 mt-3">
                  <AlertDescription className="text-yellow-800 text-xs">
                    You're approaching the ₹20L GST registration threshold.
                    Consider registering soon.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          <p className="text-xs text-gray-500 italic">
            This is an estimate. Consult a CA for filing.
          </p>
        </CardContent>
      </Card>

      {summary?.by_source && Object.keys(summary.by_source).length > 0 && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              Earnings by Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(summary.by_source).map(([source, amount]: any) => (
                <div
                  key={source}
                  className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-gray-700 capitalize">{source}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Link href="/income" className="flex-1">
          <Button className="w-full">Add Income Entry</Button>
        </Link>
        <Link href="/invoices" className="flex-1">
          <Button className="w-full" variant="outline">
            Create Invoice
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
