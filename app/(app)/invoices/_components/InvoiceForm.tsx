"use client";
import { useState } from "react";
import { invoiceApi } from "@/app/_lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const GST_RATES = [0, 5, 12, 18, 28];

export default function InvoiceForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    client_name: "",
    client_address: "",
    client_gstin: "",
    line_items: [{ description: "", quantity: 1, rate: 0 }],
    gst_rate: 18,
    hsn_sac_code: "",
    place_of_supply: "IN",
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await invoiceApi.create({
        ...formData,
        line_items: formData.line_items.map((item) => ({
          ...item,
          quantity: parseFloat(String(item.quantity)),
          rate: parseFloat(String(item.rate)),
        })),
        gst_rate: parseInt(String(formData.gst_rate)),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleLineItemChange = (
    idx: number,
    field: string,
    value: any
  ) => {
    const newItems = [...formData.line_items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setFormData({ ...formData, line_items: newItems });
  };

  const addLineItem = () => {
    setFormData({
      ...formData,
      line_items: [
        ...formData.line_items,
        { description: "", quantity: 1, rate: 0 },
      ],
    });
  };

  const removeLineItem = (idx: number) => {
    setFormData({
      ...formData,
      line_items: formData.line_items.filter((_, i) => i !== idx),
    });
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <CardTitle>Create Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Client Details</h3>
            <Input
              placeholder="Client Name"
              value={formData.client_name}
              onChange={(e) =>
                setFormData({ ...formData, client_name: e.target.value })
              }
              className="border-gray-300 bg-white text-gray-900"
              required
            />
            <Input
              placeholder="Client Address"
              value={formData.client_address}
              onChange={(e) =>
                setFormData({ ...formData, client_address: e.target.value })
              }
              className="border-gray-300 bg-white text-gray-900"
            />
            <Input
              placeholder="Client GSTIN (if B2B)"
              value={formData.client_gstin}
              onChange={(e) =>
                setFormData({ ...formData, client_gstin: e.target.value })
              }
              className="border-gray-300 bg-white text-gray-900"
            />
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-900">Line Items</h3>
            {formData.line_items.map((item, idx) => (
              <div key={idx} className="grid gap-2 rounded-md bg-gray-50 p-3 md:grid-cols-4">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleLineItemChange(idx, "description", e.target.value)
                  }
                  className="border-gray-300 bg-white text-gray-900 md:col-span-2"
                  required
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) =>
                    handleLineItemChange(
                      idx,
                      "quantity",
                      parseFloat(e.target.value)
                    )
                  }
                  className="border-gray-300 bg-white text-gray-900"
                  required
                />
                <Input
                  type="number"
                  placeholder="Rate"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) =>
                    handleLineItemChange(
                      idx,
                      "rate",
                      parseFloat(e.target.value)
                    )
                  }
                  className="border-gray-300 bg-white text-gray-900"
                  required
                />
                {formData.line_items.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeLineItem(idx)}
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addLineItem} variant="outline" className="w-full">
              + Add Line Item
            </Button>
          </div>

          <div className="grid gap-4 border-t border-gray-200 pt-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-700">GST Rate (%)</label>
              <Select
                value={String(formData.gst_rate)}
                onValueChange={(val) =>
                  setFormData({ ...formData, gst_rate: parseInt(val) })
                }
              >
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GST_RATES.map((rate) => (
                    <SelectItem key={rate} value={String(rate)}>
                      {rate}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Invoice Date"
              type="date"
              value={formData.invoice_date}
              onChange={(e) =>
                setFormData({ ...formData, invoice_date: e.target.value })
              }
              className="border-gray-300 bg-white text-gray-900"
              required
            />
            <Input
              placeholder="Due Date"
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              className="border-gray-300 bg-white text-gray-900"
              required
            />
          </div>

          <div className="flex gap-2 border-t border-gray-200 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Invoice"}
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