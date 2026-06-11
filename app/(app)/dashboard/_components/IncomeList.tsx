"use client";
import { incomeApi } from "@/app/_lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function IncomeList({
  entries,
  onDelete,
}: {
  entries: any[];
  onDelete: () => void;
}) {
  const handleDelete = async (id: string) => {
    if (confirm("Delete this entry?")) {
      try {
        await incomeApi.delete(id);
        onDelete();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Delete failed");
      }
    }
  };

  if (entries.length === 0) {
    return (
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-6 text-center text-gray-600">
          No income entries yet. Add your first entry!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-900">Income Ledger</h2>
      {entries.map((entry) => (
        <Card key={entry.id} className="border-gray-200 bg-white">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-gray-900">{entry.platform_source}</p>
              <p className="text-sm text-gray-600">
                {entry.currency} {entry.amount.toLocaleString()} = ₹
                {entry.amount_inr.toLocaleString()}
              </p>
              {entry.client_name && (
                <p className="text-xs text-gray-500">{entry.client_name}</p>
              )}
            </div>
            <Button
              onClick={() => handleDelete(entry.id)}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}