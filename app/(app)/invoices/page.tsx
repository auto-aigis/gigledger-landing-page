"use client";

import { useState, useEffect } from "react";
import { invoiceApi } from "@/app/_lib/api";
import { Invoice } from "@/app/_lib/types";
import { useAuth } from "@/app/_lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download } from "lucide-react";

export default function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientGstin, setClientGstin] = useState("");
  const [description, setDescription] = useState("");
  const [hsacCode, setHsacCode] = useState("");
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await invoiceApi.list();
      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await invoiceApi.create(
        clientName,
        clientAddress,
        clientGstin || null,
        description,
        hsacCode || null,
        parseFloat(amount),
        parseFloat(gstRate),
        invoiceDate
      );
      await loadInvoices();
      setClientName("");
      setClientAddress("");
      setClientGstin("");
      setDescription("");
      setHsacCode("");
      setAmount("");
      setGstRate("18");
      setInvoiceDate(new Date().toISOString().split("T")[0]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
    setDownloading(invoiceId);
    try {
      const response = await invoiceApi.download(invoiceId);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      a.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(null);
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
        <p className="text-gray-500">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900">Invoices</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Create Invoice"}
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
            <CardTitle>Create New Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900">Client Name *</Label>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="border-gray-300 bg-white text-gray-900"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900">Client GSTIN</Label>
                  <Input
                    value={clientGstin}
                    onChange={(e) => setClientGstin(e.target.value)}
                    placeholder="07AABCT1234H1Z0"
                    className="border-gray-300 bg-white text-gray-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900">Client Address *</Label>
                <Input
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="border-gray-300 bg-white text-gray-900"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900">Service Description *</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Web Development Services"
                  className="border-gray-300 bg-white text-gray-900"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900">HSN/SAC Code</Label>
                  <Input
                    value={hsacCode}
                    onChange={(e) => setHsacCode(e.target.value)}
                    placeholder="998311"
                    className="border-gray-300 bg-white text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900">Invoice Date *</Label>
                  <Input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="border-gray-300 bg-white text-gray-900"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-900">Amount (INR) *</Label>
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
                  <Label className="text-gray-900">GST Rate *</Label>
                  <Select value={gstRate} onValueChange={setGstRate}>
                    <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0% (Export)</SelectItem>
                      <SelectItem value="18">18% (Domestic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? "Creating..." : "Create Invoice"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {invoices.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No invoices yet.</p>
        ) : (
          invoices.map((invoice) => (
            <Card key={invoice.id} className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Invoice #{invoice.invoice_number}
                    </p>
                    <p className="text-sm text-gray-600">{invoice.client_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(invoice.invoice_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(invoice.total_amount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      GST: {formatCurrency(invoice.cgst + invoice.sgst + invoice.igst)}
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      handleDownload(invoice.id, invoice.invoice_number)
                    }
                    disabled={downloading === invoice.id}
                    variant="ghost"
                    size="sm"
                    className="ml-4"
                  >
                    <Download className="h-4 w-4 text-blue-600" />
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
