"use client";
import { useAuth } from "@/app/_components/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CopilotPage() {
  const { subscription } = useAuth();

  if (subscription?.tier !== "premium") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md border-gray-200 bg-white">
          <CardContent className="space-y-4 p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900">AI Tax Copilot</h2>
            <p className="text-gray-600">Premium feature only</p>
            <p className="text-sm text-gray-600">
              Unlock AI-powered tax guidance with Premium tier.
            </p>
            <Link href="/pricing">
              <Button className="w-full">Upgrade to Premium</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-3xl font-semibold text-gray-900">AI Tax Copilot</h1>
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-6 text-center text-gray-600">
          Coming soon! Your AI assistant for tax guidance.
        </CardContent>
      </Card>
    </div>
  );
}