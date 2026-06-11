"use client";
import { useState } from "react";
import { incomeApi } from "@/app/_lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const PLATFORMS = [
  "Upwork",
  "Fiverr",
  "Toptal",
  "Direct Client",
  "UPI",
  "Bank Transfer",
  "Other",
];

const CURRENCIES = ["INR", "USD", "GBP", "EUR"];

export default function IncomeForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    platform_source: "Upwork",
    amount: 0,
    currency: "INR",
    entry_date: new Date().toISOString().split("T")[0],
    client_name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await incomeApi.create({
        ...formData,
        amount: parseFloat(String(formData.amount)),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add income");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <CardTitle>Add Income Entry</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Platform</label>
              <Select
                value={formData.platform_source}
                onValueChange={(val) =>
                  setFormData({ ...formData, platform_source: val })
                }
              >
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Currency</label>
              <Select
                value={formData.currency}
                onValueChange={(val) =>
                  setFormData({ ...formData, currency: val })
                }
              >
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Amount</label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="border-gray-300 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <Input
                type="date"
                value={formData.entry_date}
                onChange={(e) =>
                  setFormData({ ...formData, entry_date: e.target.value })
                }
                className="border-gray-300 bg-white text-gray-900"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Client Name (optional)</label>
              <Input
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Description (optional)</label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Add Entry"}
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}