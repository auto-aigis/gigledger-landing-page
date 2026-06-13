"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { incomeApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { GSTEstimate, IncomeSummary } from "@/app/_lib/types";
import AdvanceTaxWidget from "./_components/AdvanceTaxWidget";
import GSTWidget from "./_components/GSTWidget";

function DashboardContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [summary, setSummary] = useState<IncomeSummary | null>(null);
  const [gstEstimate, setGstEstimate] = useState<GSTEstimate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      try {
        const [s, g] = await Promise.all([incomeApi.getSummary(), incomeApi.getGSTEstimate()]);
        setSummary(s);
        setGstEstimate(g);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-64">
      <div className="text-center"><div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" /><p className="text-gray-500">Loading dashboard...</p></div>
    </div>
  );

  const ytd = summary?.total_ytd || 0;
  const annualEstimate = ytd > 0 ? (ytd / (new Date().getMonth() + 1)) * 12 : 0;
  const showAdvanceTax = annualEstimate > 250000;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.display_name || user?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {user?.tier === "free" && (
            <Link href="/pricing">
              <Badge variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 cursor-pointer">Free Plan · Upgrade</Badge>
            </Link>
          )}
          {user?.tier !== "free" && (
            <Badge className="bg-blue-100 text-blue-800 capitalize">{user?.tier} Plan</Badge>
          )}
        </div>
      </div>

      {paymentSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Payment processed successfully! Your subscription has been updated.</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "This Month", value: summary?.total_month || 0, icon: TrendingUp, color: "text-blue-600" },
          { label: "This Quarter", value: summary?.total_quarter || 0, icon: TrendingUp, color: "text-indigo-600" },
          { label: "Year to Date", value: summary?.total_ytd || 0, icon: TrendingUp, color: "text-purple-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="bg-white border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{fmt(value)}</p>
                </div>
                <div className={`w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GST Widget */}
        <GSTWidget gstEstimate={gstEstimate} user={user} fmt={fmt} />

        {/* Earnings by Source */}
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-900">Earnings by Source</CardTitle>
          </CardHeader>
          <CardContent>
            {!summary?.by_source || Object.keys(summary.by_source).length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400 text-sm">No income entries yet</p>
                <Link href="/income"><Button size="sm" className="mt-3">Add First Entry</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(summary.by_source)
                  .sort(([, a], [, b]) => Number(b) - Number(a))
                  .map(([source, amount]: any) => {
                    const pct = summary.total_ytd > 0 ? (Number(amount) / Number(summary.total_ytd)) * 100 : 0;
                    return (
                      <div key={source}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <ArrowUpRight className="h-3.5 w-3.5 text-green-600" />
                            <span className="text-sm text-gray-700">{source}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{fmt(amount)}</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Advance Tax Widget */}
      {showAdvanceTax && <AdvanceTaxWidget annualEstimate={annualEstimate} fmt={fmt} />}

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link href="/income" className="flex-1">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">+ Add Income Entry</Button>
        </Link>
        <Link href="/invoices" className="flex-1">
          <Button className="w-full" variant="outline">Create Invoice</Button>
        </Link>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="p-6 text-center"><p className="text-gray-500">Loading...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}
