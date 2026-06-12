"use client";

import { useState } from "react";
import { invoiceApi } from "@/app/_lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InvoiceFormProps {
  onSuccess?: () => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientGstin, setClientGstin] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [hscSacCode, setHscSacCode] = useState("");
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = {
        client_name: clientName,
        client_address: clientAddress,
        client_gstin: clientGstin || null,
        service_description: serviceDescription,
        hsc_sac_code: hscSacCode || null,
        amount: parseFloat(amount),
        gst_rate: parseFloat(gstRate),
        invoice_date: invoiceDate,
      };

      await invoiceApi.create(
        formData.client_name,
        formData.client_address,
        formData.client_gstin,
        formData.service_description,
        formData.hsc_sac_code,
        formData.amount,
        formData.gst_rate,
        formData.invoice_date
      );

      setClientName("");
      setClientAddress("");
      setClientGstin("");
      setServiceDescription("");
      setHscSacCode("");
      setAmount("");
      setGstRate("18");
      setInvoiceDate(new Date().toISOString().split("T")[0]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div>
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          type="text"
          placeholder="Client name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="clientAddress">Client Address</Label>
        <Textarea
          id="clientAddress"
          placeholder="Client address"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="clientGstin">Client GSTIN (Optional)</Label>
        <Input
          id="clientGstin"
          type="text"
          placeholder="GSTIN"
          value={clientGstin}
          onChange={(e) => setClientGstin(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="serviceDescription">Service Description</Label>
        <Textarea
          id="serviceDescription"
          placeholder="Description of services provided"
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="hscSacCode">HSC/SAC Code (Optional)</Label>
        <Input
          id="hscSacCode"
          type="text"
          placeholder="HSC/SAC Code"
          value={hscSacCode}
          onChange={(e) => setHscSacCode(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="gstRate">GST Rate (%)</Label>
        <Input
          id="gstRate"
          type="number"
          placeholder="18"
          value={gstRate}
          onChange={(e) => setGstRate(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="invoiceDate">Invoice Date</Label>
        <Input
          id="invoiceDate"
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Invoice"}
      </Button>
    </form>
  );
}
