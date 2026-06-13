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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [gstStatus, setGstStatus] = useState("unregistered");
  const [gstin, setGstin] = useState("");
  const [primaryCurrency, setPrimaryCurrency] = useState("INR");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.saveOnboarding({
        display_name: displayName,
        pan_number: panNumber || null,
        gst_status: gstStatus,
        gstin: gstStatus === "registered" ? gstin || null : null,
        primary_currency: primaryCurrency,
        address: address || null,
      });
      await refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-8">
      <Card className="w-full max-w-2xl border-gray-200 bg-white shadow-lg">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">₹</span>
            </div>
            <div>
              <CardTitle className="text-2xl text-gray-900">Welcome to GigLedger</CardTitle>
              <p className="text-gray-500 text-sm mt-0.5">Set up your profile — takes under 5 minutes</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-gray-900 font-medium">
                Full Name / Business Name <span className="text-red-500">*</span>
              </Label>
              <Input id="displayName" type="text" placeholder="e.g. Rajesh Kumar" value={displayName}
                onChange={(e) => setDisplayName(e.target.value)} required
                className="border-gray-300 bg-white text-gray-900" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="panNumber" className="text-gray-900 font-medium">
                  PAN Number <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </Label>
                <Input id="panNumber" type="text" placeholder="AAAPQ5055K" value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  maxLength={10} className="border-gray-300 bg-white text-gray-900 uppercase" />
                <p className="text-xs text-gray-400">Used for invoice generation only</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryCurrency" className="text-gray-900 font-medium">
                  Primary Income Currency <span className="text-red-500">*</span>
                </Label>
                <Select value={primaryCurrency} onValueChange={setPrimaryCurrency}>
                  <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (₹ INR)</SelectItem>
                    <SelectItem value="USD">US Dollar ($ USD)</SelectItem>
                    <SelectItem value="mixed">Mixed / Multiple Currencies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstStatus" className="text-gray-900 font-medium">
                GST Registration Status <span className="text-red-500">*</span>
              </Label>
              <Select value={gstStatus} onValueChange={setGstStatus}>
                <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unregistered">Unregistered (below ₹20L threshold)</SelectItem>
                  <SelectItem value="threshold-approaching">Approaching Threshold (₹16L–₹20L)</SelectItem>
                  <SelectItem value="registered">Registered (have GSTIN)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {gstStatus === "registered" && (
              <div className="space-y-2">
                <Label htmlFor="gstin" className="text-gray-900 font-medium">
                  GSTIN <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </Label>
                <Input id="gstin" type="text" placeholder="22AAAAA0000A1Z5" value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  maxLength={15} className="border-gray-300 bg-white text-gray-900 uppercase" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-900 font-medium">
                Business / Home Address <span className="text-gray-400 font-normal text-xs">(Optional)</span>
              </Label>
              <Input id="address" type="text" placeholder="123 MG Road, Bengaluru, Karnataka 560001"
                value={address} onChange={(e) => setAddress(e.target.value)}
                className="border-gray-300 bg-white text-gray-900" />
              <p className="text-xs text-gray-400">Appears on your invoices as supplier address</p>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading || !displayName}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-base">
              {loading ? "Setting up your account..." : "Continue to Dashboard →"}
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-green-700">
              Your profile is used to auto-fill invoices. You can update all details anytime from the Profile page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
