"use client";

import { useState, useEffect } from "react";
import { incomeApi } from "@/app/_lib/api";
import { IncomeEntry } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2 } from "lucide-react";

const platforms = [
  "Upwork",
  "Fiverr",
  "Toptal",
  "Direct Client",
  "UPI",
  "Bank Transfer",
  "Other",
];

export default function IncomePage() {
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [platform, setPlatform] = useState("Upwork");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [amountInr, setAmountInr] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [clientName, setClientName] = useState("");
  const [serviceType, setServiceType] = useState("domestic");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await incomeApi.list();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await incomeApi.create(
        platform,
        parseFloat(amount),
        currency,
        parseFloat(amountInr || amount),
        date,
        clientName || null,
        serviceType
      );
      await loadEntries();
      setPlatform("Upwork");
      setAmount("");
      setCurrency("INR");
      setAmountInr("");
      setDate(new Date().toISOString().split("T")[0]);
      setClientName("");
      setServiceType("domestic");
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await incomeApi.delete(id);
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete entry");
    }
  };

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(num);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading income entries...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900">Income Entries</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Add Entry"}
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>New Income Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900">Platform *</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900">Date *</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border-gray-300 bg-white text-gray-900"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900">Amount *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border-gray-300 bg-white text-gray-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900">Amount in INR</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={amountInr}
                    onChange={(e) => setAmountInr(e.target.value)}
                    placeholder="Auto-filled if INR"
                    className="border-gray-300 bg-white text-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900">Client Name</Label>
                <Input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="border-gray-300 bg-white text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900">Service Type *</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domestic">Domestic</SelectItem>
                    <SelectItem value="export">Export of Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? "Creating..." : "Create Entry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No income entries yet.</p>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{entry.platform}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString()} • {entry.client_name || "No client"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {entry.service_type === "export" ? "Export" : "Domestic"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(entry.amount_inr)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {entry.original_currency !== "INR" &&
                        `${entry.amount_original.toFixed(2)} ${entry.original_currency}`}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDelete(entry.id)}
                    variant="ghost"
                    size="sm"
                    className="ml-4"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
