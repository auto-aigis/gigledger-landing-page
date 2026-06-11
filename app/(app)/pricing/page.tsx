"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/_components/AuthProvider";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { paddleApi } from "@/app/_lib/api";

const TIERS = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    priceId: null,
    features: [
      "1 income source/platform",
      "Up to 5 invoices per month",
      "Basic GST estimate (total only)",
      "1 advance tax reminder",
      "Invoice preview only",
    ],
    button: "Current Plan",
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO ?? null,
    features: [
      "Unlimited income sources",
      "Unlimited invoices",
      "Full GST breakdown (CGST/SGST/IGST)",
      "All 4 advance tax reminders",
      "Invoice PDF download",
      "Multi-currency conversion",
      "Up to 2 user seats",
      "Basic expense tracking",
    ],
    button: "Upgrade to Pro",
  },
  {
    name: "Premium",
    price: "₹999",
    period: "/month",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PREMIUM ?? null,
    features: [
      "Everything in Pro",
      "AI Tax Copilot",
      "Export-of-services guidance",
      "Audit-ready CSV/Excel export",
      "GST filing summary report",
      "Up to 5 user seats",
      "Priority Support badge",
    ],
    button: "Upgrade to Premium",
  },
];

function PricingContent() {
  const { user, subscription, refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const txnId = searchParams.get("transaction_id");
  const checkoutSuccess = searchParams.get("checkout");

   useEffect(() => {
     const verifyTransaction = async () => {
       setLoading(true);
       try {
         const result = await paddleApi.verifyTransaction(txnId || "");
         await refresh();
         window.history.replaceState({}, "", "/pricing");
         alert(`Payment verified! Your ${result.tier} plan is active.`);
       } catch (err) {
         console.error("Transaction verification failed:", err);
       } finally {
         setLoading(false);
       }
     };

     if (txnId && checkoutSuccess === "success") {
       verifyTransaction();
     }
   }, [txnId, checkoutSuccess, refresh]);


  const handleUpgrade = (priceId: string | null) => {
    if (!priceId) {
      alert("Price not configured");
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    const Paddle = (window as any).Paddle;
    if (!Paddle) {
      alert("Payment system not ready");
      return;
    }

    Paddle.Checkout.open({
      items: [{ priceId }],
      customer: { email: user.email },
      customData: { user_id: user.id },
      settings: {
        displayMode: "overlay",
        theme: "light",
      },
      eventCallback: (data: any) => {
        if (data.event === "checkout.completed") {
          const txnId = data.data.transaction_id;
          Paddle.Checkout.close();
          window.location.href = `/pricing?checkout=success&transaction_id=${txnId}`;
        }
      },
    });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      const Paddle = (window as any).Paddle;
      if (Paddle) {
        Paddle.Environment.set("sandbox");
        Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
          eventCallback: () => {},
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p className="mt-2 text-lg text-gray-600">
          Choose the plan that works for your freelancing business
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <Card key={tier.name} className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">{tier.name}</CardTitle>
              <div className="mt-2 text-3xl font-bold text-gray-900">
                {tier.price}
                <span className="text-lg font-normal text-gray-600">{tier.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() =>
                  tier.priceId
                    ? handleUpgrade(tier.priceId)
                    : alert("Already on Free plan")
                }
                disabled={subscription?.tier === tier.name.toLowerCase() || loading}
                className="w-full"
              >
                {subscription?.tier === tier.name.toLowerCase()
                  ? "Current Plan"
                  : tier.button}
              </Button>
              <div className="space-y-2">
                {tier.features.map((feat, idx) => (
                  <div key={idx} className="flex gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-gray-600" />
                    <span className="text-sm text-gray-600">{feat}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-600">
          All plans include ₹0 setup fee. Cancel anytime. 14-day free trial available.
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}