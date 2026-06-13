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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Download, Plus, FileText } from "lucide-react";

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
  const [hsacCode, setHsacCode] = useState("998311");
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [taxType, setTaxType] = useState("cgst_sgst");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => { loadInvoices(); }, []);

  const loadInvoices = async () => {
    try { setInvoices(await invoiceApi.list()); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to load invoices"); }
    finally { setLoading(false); }
  };

  const computedGst = () => {
    const a = parseFloat(amount) || 0;
    const r = parseFloat(gstRate) || 0;
    if (r === 0) return { cgst: 0, sgst: 0, igst: 0, total: a };
    if (taxType === "igst") return { cgst: 0, sgst: 0, igst: a * r / 100, total: a + a * r / 100 };
    return { cgst: a * r / 2 / 100, sgst: a * r / 2 / 100, igst: 0, total: a + a * r / 100 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await invoiceApi.create({
        client_name: clientName, client_address: clientAddress,
        client_gstin: clientGstin || null, service_description: description,
        hsc_sac_code: hsacCode || null, amount: parseFloat(amount),
        gst_rate: parseFloat(gstRate), tax_type: taxType, invoice_date: invoiceDate,
      });
      await loadInvoices();
      setClientName(""); setClientAddress(""); setClientGstin(""); setDescription("");
      setHsacCode("998311"); setAmount(""); setGstRate("18"); setTaxType("cgst_sgst");
      setInvoiceDate(new Date().toISOString().split("T")[0]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invoice");
    } finally { setSubmitting(false); }
  };

  const handleDownload = async (id: string, num: string) => {
    setDownloading(id);
    try {
      const r = await invoiceApi.download(id);
      if (!r.ok) throw new Error("Download failed");
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${num}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally { setDownloading(null); }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n);

  if (loading) return <div className="p-6 text-center"><p className="text-gray-500">Loading...</p></div>;

  const gst = computedGst();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 text-sm mt-0.5">GST-compliant PDF invoices • {invoices.length} created</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          {showForm ? "Cancel" : <><Plus className="h-4 w-4 mr-1.5" />Create Invoice</>}
        </Button>
      </div>

      {error && <Alert className="border-red-200 bg-red-50"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>}

      {showForm && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-base">New GST Invoice</CardTitle>
            {user?.display_name && (
              <p className="text-xs text-gray-500 mt-1">
                Supplier: <strong>{user.display_name}</strong>
                {user.address && ` · ${user.address}`}
              </p>
            )}
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">Client Name <span className="text-red-500">*</span></Label>
                  <Input value={clientName} onChange={(e) => setClientName(e.target.value)}
                    placeholder="Acme Corp" className="border-gray-300 bg-white text-gray-900" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">Client GSTIN <span className="text-gray-400 text-xs font-normal">(Optional)</span></Label>
                  <Input value={clientGstin} onChange={(e) => setClientGstin(e.target.value.toUpperCase())}
                    placeholder="07AABCT1234H1Z0" maxLength={15}
                    className="border-gray-300 bg-white text-gray-900 uppercase" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-900 text-sm">Client Address <span className="text-red-500">*</span></Label>
                <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="123 Business Park, Mumbai, Maharashtra 400001"
                  className="border-gray-300 bg-white text-gray-900" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-900 text-sm">Service Description <span className="text-red-500">*</span></Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Web Development Services for Jan 2025" rows={2}
                  className="border-gray-300 bg-white text-gray-900" required />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">HSN/SAC Code</Label>
                  <Input value={hsacCode} onChange={(e) => setHsacCode(e.target.value)}
                    placeholder="998311" className="border-gray-300 bg-white text-gray-900" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">Invoice Date <span className="text-red-500">*</span></Label>
                  <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)}
                    className="border-gray-300 bg-white text-gray-900" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">Amount (₹) <span className="text-red-500">*</span></Label>
                  <Input type="number" step="0.01" placeholder="0.00" value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border-gray-300 bg-white text-gray-900" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">GST Rate</Label>
                  <Select value={gstRate} onValueChange={(v) => { setGstRate(v); if (v === "0") setTaxType("igst"); }}>
                    <SelectTrigger className="border-gray-300 bg-white text-gray-900"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0% (Export)</SelectItem>
                      <SelectItem value="18">18% (Standard)</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {gstRate !== "0" && (
                <div className="space-y-1.5">
                  <Label className="text-gray-900 text-sm">Tax Type</Label>
                  <Select value={taxType} onValueChange={setTaxType}>
                    <SelectTrigger className="border-gray-300 bg-white text-gray-900"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cgst_sgst">CGST + SGST (Intra-state)</SelectItem>
                      <SelectItem value="igst">IGST (Inter-state)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {amount && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                  <p className="font-medium text-blue-900 mb-2">Invoice Preview</p>
                  <div className="space-y-1 text-blue-800">
                    <div className="flex justify-between"><span>Taxable Amount</span><span>{fmt(parseFloat(amount) || 0)}</span></div>
                    {gst.cgst > 0 && <div className="flex justify-between text-xs"><span>CGST @ {parseFloat(gstRate)/2}%</span><span>{fmt(gst.cgst)}</span></div>}
                    {gst.sgst > 0 && <div className="flex justify-between text-xs"><span>SGST @ {parseFloat(gstRate)/2}%</span><span>{fmt(gst.sgst)}</span></div>}
                    {gst.igst > 0 && <div className="flex justify-between text-xs"><span>IGST @ {gstRate}%</span><span>{fmt(gst.igst)}</span></div>}
                    <div className="flex justify-between font-bold border-t border-blue-200 pt-1 mt-1"><span>Total</span><span>{fmt(gst.total)}</span></div>
                  </div>
                </div>
              )}
              <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700">
                {submitting ? "Creating..." : "Create Invoice & Download PDF"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {invoices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No invoices yet</p>
            <p className="text-gray-400 text-sm mt-1">Create your first GST-compliant invoice</p>
            <Button onClick={() => setShowForm(true)} className="mt-4 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1.5" />Create First Invoice
            </Button>
          </div>
        ) : (
          invoices.map((invoice) => (
            <Card key={invoice.id} className="bg-white border-gray-200 hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{invoice.invoice_number}</p>
                        <Badge variant="outline" className={`text-xs ${parseFloat(String(invoice.gst_rate)) === 0 ? "border-purple-200 text-purple-700" : "border-green-200 text-green-700"}`}>
                          {parseFloat(String(invoice.gst_rate)) === 0 ? "Export" : `GST ${invoice.gst_rate}%`}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{invoice.client_name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(invoice.invoice_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{fmt(invoice.total_amount)}</p>
                      <p className="text-xs text-gray-500">
                        Tax: {fmt(Number(invoice.cgst) + Number(invoice.sgst) + Number(invoice.igst))}
                      </p>
                    </div>
                    <Button onClick={() => handleDownload(invoice.id, invoice.invoice_number)}
                      disabled={downloading === invoice.id} variant="outline" size="sm"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Download className="h-4 w-4" />
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
