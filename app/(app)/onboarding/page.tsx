"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/AuthProvider";
import { authApi } from "@/app/_lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function OnboardingPage() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: user?.display_name || "",
    business_type: "sole_proprietor",
    gst_status: "unregistered",
    gstin: user?.gstin || "",
    primary_currency: "INR",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.updateOnboarding(formData);
      await refresh();
      router.push("/dashboard");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-900">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input
                value={formData.display_name}
                onChange={(e) =>
                  setFormData({ ...formData, display_name: e.target.value })
                }
                className="border-gray-300 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">GST Status</label>
              <Select
                value={formData.gst_status}
                onValueChange={(val) =>
                  setFormData({ ...formData, gst_status: val })
                }
              >
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unregistered">Unregistered</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="approaching">Approaching ₹20L threshold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.gst_status === "registered" && (
              <div>
                <label className="text-sm font-medium text-gray-700">GSTIN (if registered)</label>
                <Input
                  value={formData.gstin}
                  onChange={(e) =>
                    setFormData({ ...formData, gstin: e.target.value })
                  }
                  className="border-gray-300 bg-white text-gray-900"
                  placeholder="29ABCDE1234F1Z5"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700">Primary Currency</label>
              <Select
                value={formData.primary_currency}
                onValueChange={(val) =>
                  setFormData({ ...formData, primary_currency: val })
                }
              >
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Get Started"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}