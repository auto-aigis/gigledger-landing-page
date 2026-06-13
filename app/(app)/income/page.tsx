"use client";

import { useState, useEffect } from "react";
import { incomeApi } from "@/app/_lib/api";
import { IncomeEntry } from "@/app/_lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Globe, Smartphone } from "lucide-react";

const PLATFORMS = ["Upwork", "Fiverr", "Toptal", "Direct Client", "UPI", "Bank Transfer", "Other"];

const PLATFORM_ICONS: Record<string, string> = {
  Upwork: "🟢", Fiverr: "🟢", Toptal: "⭐", "Direct Client": "🤝",
  UPI: "📱", "Bank Transfer": "🏦", Other: "💼",
};

export default function IncomePage() {
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState("Upwork");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [amountInr, setAmountInr] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState("domestic");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadEntries(); }, []);

  const loadEntries = async () => {
    try { setEntries(await incomeApi.list()); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to load"); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setPlatform("Upwork"); setAmount(""); setCurrency("INR"); setAmountInr("");
    setDate(new Date().toISOString().split("T")[0]); setClientName("");
    setDescription(""); setServiceType("domestic");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await incomeApi.create({
        platform, amount_original: parseFloat(amount), original_currency: currency,
        amount_inr: parseFloat(amountInr || amount), date,
        client_name: clientName || null, description: description || null, service_type: serviceType,
      });
      await loadEntries();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create entry");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this income entry?")) return;
    try { await incomeApi.delete(id); await loadEntries(); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to delete"); }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);

  if (loading) return <div className="p-6 text-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income Entries</h1>
          <p className="text-gray-500 text-sm mt-0.5">{entries.length} entries recorded</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          {showForm ? "Cancel" : <><Plus className="h-4 w-4 mr-1.5" />Add Entry</>}
        </Button>
      </div>

      {error && <Alert className="border-red-200 bg-red-50"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>}

      {showForm && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-base">New Income Entry</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">Platform <span className="text-red-500">*</span></Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="border-gray-300 bg-white text-gray-900"><SelectValue /></SelectTrigger>
                    <SelectContent>{PLATFORMS.map((p) => <SelectItem key={p} value={p}>{PLATFORM_ICONS[p]} {p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    className="border-gray-300 bg-white text-gray-900" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">Amount <span className="text-red-500">*</span></Label>
                  <Input type="number" step="0.01" placeholder="0.00" value={amount}
                    onChange={(e) => { setAmount(e.target.value); if (currency === "INR") setAmountInr(e.target.value); }}
                    className="border-gray-300 bg-white text-gray-900" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">Currency</Label>
                  <Select value={currency} onValueChange={(v) => { setCurrency(v); if (v === "INR") setAmountInr(amount); else setAmountInr(""); }}>
                    <SelectTrigger className="border-gray-300 bg-white text-gray-900"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ INR</SelectItem>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                      <SelectItem value="GBP">£ GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">
                    {currency === "INR" ? "Amount (INR)" : "INR Equivalent *"}
                  </Label>
                  <Input type="number" step="0.01" placeholder="INR value"
                    value={amountInr} onChange={(e) => setAmountInr(e.target.value)}
                    className="border-gray-300 bg-white text-gray-900"
                    required={currency !== "INR"} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">Client Name</Label>
                  <Input type="text" placeholder="Client name (optional)" value={clientName}
                    onChange={(e) => setClientName(e.target.value)} className="border-gray-300 bg-white text-gray-900" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">Service Type <span className="text-red-500">*</span></Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger className="border-gray-300 bg-white text-gray-900"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domestic">Domestic (GST 18%)</SelectItem>
                      <SelectItem value="export">Export of Services (0%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-900 text-sm">Description</Label>
                <Input type="text" placeholder="e.g. Web development project for Q1" value={description}
                  onChange={(e) => setDescription(e.target.value)} className="border-gray-300 bg-white text-gray-900" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700">
                {submitting ? "Adding..." : "Add Income Entry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {entries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-3">💰</div>
            <p className="text-gray-600 font-medium">No income entries yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first income entry to get started</p>
            <Button onClick={() => setShowForm(true)} className="mt-4 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1.5" />Add First Entry
            </Button>
          </div>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="bg-white border-gray-200 hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-lg">
                      {PLATFORM_ICONS[entry.platform] || "💼"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{entry.platform}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        {entry.client_name && ` · ${entry.client_name}`}
                      </p>
                      {entry.description && <p className="text-xs text-gray-400 mt-0.5">{entry.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{fmt(entry.amount_inr)}</p>
                      {entry.original_currency !== "INR" && (
                        <p className="text-xs text-gray-500">{entry.amount_original.toFixed(2)} {entry.original_currency}</p>
                      )}
                      <Badge variant="outline" className={`text-xs mt-1 ${entry.service_type === "export" ? "border-purple-200 text-purple-700" : "border-blue-200 text-blue-700"}`}>
                        {entry.service_type === "export" ? "Export" : "Domestic"}
                      </Badge>
                    </div>
                    <Button onClick={() => handleDelete(entry.id)} variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
