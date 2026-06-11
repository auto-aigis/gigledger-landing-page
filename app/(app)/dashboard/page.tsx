"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/_components/AuthProvider";
import { incomeApi, gstApi } from "@/app/_lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import IncomeForm from "./_components/IncomeForm";
import IncomeList from "./_components/IncomeList";
import GSTPanel from "./_components/GSTPanel";

export default function DashboardPage() {
  const { user, subscription } = useAuth();
  const [incomeEntries, setIncomeEntries] = useState<any[]>([]);
  const [gstSummary, setGstSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [entries, gst] = await Promise.all([
        incomeApi.list(),
        gstApi.summary(),
      ]);
      setIncomeEntries(entries);
      setGstSummary(gst);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalInr = incomeEntries.reduce((sum, e) => sum + e.amount_inr, 0);
  const platformCount = new Set(incomeEntries.map((e) => e.platform_source)).size;
  const canAddMore = subscription?.tier !== "free" || platformCount < 1;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.display_name || "Freelancer"}!</p>
      </div>

      {error && (
        <div className="flex gap-3 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Income (INR)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-gray-900">₹{totalInr.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-gray-900">{platformCount}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-semibold text-gray-900">—</p>
              <Link href="/invoices" className="text-sm font-medium text-gray-900 hover:underline">
                View
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {!canAddMore && subscription?.tier === "free" && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            You've reached the free tier limit of 1 income source.{" "}
            <Link href="/pricing" className="font-medium hover:underline">
              Upgrade to Pro
            </Link>{" "}
            for unlimited sources.
          </p>
        </div>
      )}

      {showForm ? (
        <IncomeForm
          onSuccess={() => {
            setShowForm(false);
            loadData();
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <Button onClick={() => setShowForm(true)} className="w-full">
          + Add Income Entry
        </Button>
      )}

      <IncomeList entries={incomeEntries} onDelete={loadData} />
      <GSTPanel summary={gstSummary} />
    </div>
  );
}