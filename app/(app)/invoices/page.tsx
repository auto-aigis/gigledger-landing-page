"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/_components/AuthProvider";
import { invoiceApi } from "@/app/_lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InvoiceForm from "./_components/InvoiceForm";

export default function InvoicesPage() {
  const { subscription } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await invoiceApi.list();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const thisMonth = invoices.filter((inv) => {
    const invDate = new Date(inv.invoice_date);
    const now = new Date();
    return (
      invDate.getMonth() === now.getMonth() &&
      invDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const canAddMore = subscription?.tier !== "free" || thisMonth < 5;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Invoices</h1>
        <p className="text-gray-600">Manage your GST-compliant invoices</p>
      </div>

      {!canAddMore && subscription?.tier === "free" && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            Free tier limited to 5 invoices per month.{" "}
            <Link href="/pricing" className="font-medium hover:underline">
              Upgrade to Pro
            </Link>
          </p>
        </div>
      )}

      {showForm ? (
        <InvoiceForm
          onSuccess={() => {
            setShowForm(false);
            loadInvoices();
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <Button onClick={() => setShowForm(true)} disabled={!canAddMore} className="w-full">
          + Create Invoice
        </Button>
      )}

      {loading ? (
        <p className="text-gray-600">Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No invoices yet. Create your first invoice!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <Card key={inv.id} className="border-gray-200 bg-white">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">Invoice #{inv.invoice_number}</p>
                  <p className="text-sm text-gray-600">{inv.client_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{inv.total_amount.toLocaleString()}</p>
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="text-sm text-gray-900 hover:underline"
                  >
                    View
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}