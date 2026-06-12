"use client";

import { useState } from "react";
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

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [panNumber, setPanNumber] = useState(user?.pan_number || "");
  const [gstStatus, setGstStatus] = useState(user?.gst_status || "unregistered");
  const [primaryCurrency, setPrimaryCurrency] = useState(
    user?.primary_currency || "INR"
  );
  const [address, setAddress] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
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
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900">Profile</h1>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900">
                Email (Read-only)
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="border-gray-300 bg-gray-50 text-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-gray-900">
                Full Name
              </Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panNumber" className="text-gray-900">
                PAN Number
              </Label>
              <Input
                id="panNumber"
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstStatus" className="text-gray-900">
                GST Registration Status
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
                Primary Currency
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
                Business Address
              </Label>
              <Input
                id="address"
                type="text"
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
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  Profile updated successfully!
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
