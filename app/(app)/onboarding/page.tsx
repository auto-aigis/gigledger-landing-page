"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OnboardingPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [gstStatus, setGstStatus] = useState("unregistered");
  const [primaryCurrency, setPrimaryCurrency] = useState("INR");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.saveOnboarding(
        displayName,
        panNumber || null,
        gstStatus,
        primaryCurrency,
        address || null
      );
      await refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-2xl border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl text-gray-900">
            Welcome to ₹ GigLedger
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Let&apos;s set up your freelancer profile
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-gray-900">
                Full Name *
              </Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Rajesh Kumar"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panNumber" className="text-gray-900">
                PAN Number (Optional)
              </Label>
              <Input
                id="panNumber"
                type="text"
                placeholder="AAAPQ5055K"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstStatus" className="text-gray-900">
                GST Registration Status *
              </Label>
              <Select value={gstStatus} onValueChange={setGstStatus}>
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unregistered">Unregistered</SelectItem>
                  <SelectItem value="threshold-approaching">
                    Threshold Approaching
                  </SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryCurrency" className="text-gray-900">
                Primary Income Currency *
              </Label>
              <Select value={primaryCurrency} onValueChange={setPrimaryCurrency}>
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="mixed">Mixed / Multiple</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-900">
                Business Address (Optional)
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St, New Delhi"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Setting up..." : "Continue"}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Takes less than 5 minutes. You can update this later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
