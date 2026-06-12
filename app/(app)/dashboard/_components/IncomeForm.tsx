"use client";

import { useState } from "react";
import { incomeApi } from "@/app/_lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IncomeFormProps {
  onSuccess?: () => void;
}

export function IncomeForm({ onSuccess }: IncomeFormProps) {
  const [platform, setPlatform] = useState("Upwork");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [amountInr, setAmountInr] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [clientName, setClientName] = useState("");
  const [serviceType, setServiceType] = useState("domestic");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = {
        platform,
        amount_original: parseFloat(amount),
        original_currency: currency,
        amount_inr: parseFloat(amountInr || amount),
        date,
        client_name: clientName || null,
        service_type: serviceType,
      };

      await incomeApi.create(
        formData.platform,
        formData.amount_original,
        formData.original_currency,
        formData.amount_inr,
        formData.date,
        formData.client_name,
        formData.service_type
      );

      setPlatform("Upwork");
      setAmount("");
      setCurrency("INR");
      setAmountInr("");
      setDate(new Date().toISOString().split("T")[0]);
      setClientName("");
      setServiceType("domestic");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create entry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div>
        <Label htmlFor="platform">Platform</Label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger id="platform">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Upwork">Upwork</SelectItem>
            <SelectItem value="Fiverr">Fiverr</SelectItem>
            <SelectItem value="Freelancer">Freelancer</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
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
        <Label htmlFor="currency">Currency</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger id="currency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INR">INR</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="amountInr">Amount in INR</Label>
        <Input
          id="amountInr"
          type="number"
          placeholder="0.00"
          value={amountInr}
          onChange={(e) => setAmountInr(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          type="text"
          placeholder="Client name (optional)"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="serviceType">Service Type</Label>
        <Select value={serviceType} onValueChange={setServiceType}>
          <SelectTrigger id="serviceType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="domestic">Domestic</SelectItem>
            <SelectItem value="export">Export</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Income"}
      </Button>
    </form>
  );
}
