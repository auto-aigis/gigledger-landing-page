"use client";

import { useState } from "react";
import { authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [panNumber, setPanNumber] = useState(user?.pan_number || "");
  const [gstStatus, setGstStatus] = useState(user?.gst_status || "unregistered");
  const [gstin, setGstin] = useState(user?.gstin || "");
  const [primaryCurrency, setPrimaryCurrency] = useState(user?.primary_currency || "INR");
  const [address, setAddress] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(false); setLoading(true);
    try {
      await authApi.saveOnboarding({
        display_name: displayName, pan_number: panNumber || null,
        gst_status: gstStatus, gstin: gstStatus === "registered" ? gstin || null : null,
        primary_currency: primaryCurrency, address: address || null,
      });
      await refresh();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <Badge variant="outline" className="capitalize border-blue-200 text-blue-700">{user?.tier} Plan</Badge>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base">Freelancer Profile</CardTitle>
          <p className="text-xs text-gray-500">This information appears on your invoices</p>
        </CardHeader>
        <CardContent className="pt-5">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-gray-600 text-sm">Email (Read-only)</Label>
              <Input type="email" value={user?.email || ""} disabled
                className="border-gray-200 bg-gray-50 text-gray-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="displayName" className="text-gray-900 text-sm font-medium">Full Name</Label>
                <Input id="displayName" type="text" value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="border-gray-300 bg-white text-gray-900" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="panNumber" className="text-gray-900 text-sm font-medium">
                  PAN Number <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </Label>
                <Input id="panNumber" type="text" value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  maxLength={10} placeholder="AAAPQ5055K"
                  className="border-gray-300 bg-white text-gray-900 uppercase" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-gray-900 text-sm font-medium">GST Status</Label>
                <Select value={gstStatus} onValueChange={setGstStatus}>
                  <SelectTrigger className="border-gray-300 bg-white text-gray-900"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unregistered">Unregistered</SelectItem>
                    <SelectItem value="threshold-approaching">Approaching Threshold</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-900 text-sm font-medium">Primary Currency</Label>
                <Select value={primaryCurrency} onValueChange={setPrimaryCurrency}>
                  <SelectTrigger className="border-gray-300 bg-white text-gray-900"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">₹ INR</SelectItem>
                    <SelectItem value="USD">$ USD</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {gstStatus === "registered" && (
              <div className="space-y-1.5">
                <Label htmlFor="gstin" className="text-gray-900 text-sm font-medium">
                  GSTIN <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </Label>
                <Input id="gstin" type="text" value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  maxLength={15} placeholder="22AAAAA0000A1Z5"
                  className="border-gray-300 bg-white text-gray-900 uppercase" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-gray-900 text-sm font-medium">Business Address</Label>
              <Input id="address" type="text" value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 MG Road, Bengaluru, Karnataka 560001"
                className="border-gray-300 bg-white text-gray-900" />
            </div>

            {error && <Alert className="border-red-200 bg-red-50"><AlertDescription className="text-red-800">{error}</AlertDescription></Alert>}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">Profile updated successfully!</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
