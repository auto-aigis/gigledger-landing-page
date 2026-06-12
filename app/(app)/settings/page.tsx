"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/app/_lib/hooks";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-gray-900 font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tier</p>
            <p className="text-gray-900 font-medium capitalize">{user?.tier}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-gray-900 font-medium">
              {new Date(user?.created_at || "").toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">
            More settings and preferences coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
