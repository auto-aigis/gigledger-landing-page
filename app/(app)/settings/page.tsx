"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/_components/AuthProvider";
import { settingsApi } from "@/app/_lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function SettingsPage() {
  const { user, subscription } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [fxRates, setFxRates] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    try {
      const [p, fx] = await Promise.all([
        settingsApi.getProfile(),
        settingsApi.getFXRates(),
      ]);
      setProfile(p);
      setFxRates(fx || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await settingsApi.updateProfile(profile);
      alert("Profile updated!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleFXSave = async (currency: string, rate: number) => {
    try {
      await settingsApi.setFXRate(currency, rate);
      setFxRates((prev: any) => ({ ...prev, [currency]: rate }));
      alert(`FX rate for ${currency} updated!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update FX rate");
    }
  };

  if (loading) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>

      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input value={user?.email} disabled className="border-gray-300 bg-gray-50" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <Input
              value={profile?.display_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, display_name: e.target.value })
              }
              className="border-gray-300 bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">GST Status</label>
            <Select
              value={profile?.gst_status || "unregistered"}
              onValueChange={(val) =>
                setProfile({ ...profile, gst_status: val })
              }
            >
              <SelectTrigger className="border-gray-300 bg-white text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unregistered">Unregistered</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="approaching">Approaching ₹20L</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {profile?.gst_status === "registered" && (
            <div>
              <label className="text-sm font-medium text-gray-700">GSTIN</label>
              <Input
                value={profile?.gstin || ""}
                onChange={(e) =>
                  setProfile({ ...profile, gstin: e.target.value })
                }
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
          )}
          <Button onClick={handleProfileSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle>FX Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {["USD", "GBP", "EUR"].map((curr) => (
            <div key={curr} className="flex gap-2">
              <Input
                type="number"
                placeholder={`${curr} to INR`}
                defaultValue={fxRates[curr] || 80}
                onBlur={(e) =>
                  handleFXSave(curr, parseFloat(e.target.value))
                }
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {subscription?.tier === "premium" && (
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle>OpenAI API Key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Your API key is encrypted and never shared. Used only for AI Tax Copilot.
            </p>
            <Input
              type="password"
              placeholder="sk-..."
              className="border-gray-300 bg-white text-gray-900"
              onBlur={(e) =>
                settingsApi.setAPIKey("openai", e.target.value).catch(console.error)
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}