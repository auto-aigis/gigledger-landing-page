"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useAuth } from "@/app/_lib/hooks";


const tiers = [
  {
    name: "Free",
    price: 0,
    period: "Forever",
    priceId: null,
    description: "Perfect to get started",
    features: [
      "1 income source",
      "Up to 10 invoices/month",
      "Basic GST estimate",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: 499,
    period: "per month",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO,
    description: "For active freelancers",
    features: [
      "Unlimited income sources",
      "Unlimited invoices",
      "Advanced GST estimates",
      "Advance tax alerts",
      "Priority support",
    ],
  },
  {
    name: "Premium",
    price: 999,
    period: "per month",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PREMIUM,
    description: "Complete financial toolkit",
    features: [
      "Everything in Pro",
      "CA filing prep export",
      "Tax deduction calculator",
      "Quarterly reports",
      "Dedicated support",
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [paddleLoaded, setPaddleLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      const win = window as any;
      if (win.Paddle) {
        win.Paddle.Environment.set("sandbox");
        win.Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
        });
        setPaddleLoaded(true);
      }
    };
    document.body.appendChild(script);
  }, []);


  const handleUpgrade = (tier: typeof tiers[0]) => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!tier.priceId) return;

    setLoading(tier.name);
    const win = window as any;
    if (win.Paddle && paddleLoaded) {
      win.Paddle.Checkout.open({
        items: [
          {
            priceId: tier.priceId,
          },
        ],
        customData: {
          user_id: user.id,
        },
        settings: {
          successUrl: `${window.location.origin}/dashboard?checkout=success`,
          locale: "en",
        },
        eventCallback: (data: any) => {
          if (data.event === "checkout.completed") {
            const txnId = data.data?.transaction_id;
            if (txnId) {
              win.Paddle.Checkout.close();
              window.location.href = `/dashboard?checkout=success&transaction_id=${txnId}`;
            }
          }
        },
      });
    }
    setLoading(null);
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900">Pricing</h1>
        <p className="text-gray-600 mt-2">
          Choose the perfect plan for your freelance business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`bg-white border-2 flex flex-col ${
              tier.name === "Pro"
                ? "border-blue-600 shadow-lg relative"
                : "border-gray-200"
            }`}
          >
            {tier.name === "Pro" && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-gray-900">{tier.name}</CardTitle>
              <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
              <div className="mt-4">
                <p className="text-4xl font-bold text-gray-900">
                  {tier.price === 0 ? "Free" : `₹${tier.price}`}
                </p>
                <p className="text-sm text-gray-600">{tier.period}</p>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-3 mb-6 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              {user?.tier === tier.name.toLowerCase() ? (
                <Button className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpgrade(tier)}
                  disabled={loading !== null || tier.priceId === null}
                  className={`w-full ${
                    tier.name === "Pro"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : ""
                  }`}
                  variant={tier.name === "Free" ? "outline" : "default"}
                >
                  {loading === tier.name
                    ? "Processing..."
                    : tier.name === "Free"
                      ? "Get Started"
                      : "Upgrade"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          All tiers include:
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Email/password authentication",
            "Income tracking & aggregation",
            "GST liability calculations",
            "Invoice generation & storage",
            "Multi-currency support",
            "Dashboard analytics",
          ].map((feature) => (
            <li key={feature} className="flex items-center text-gray-700">
              <Check className="h-4 w-4 text-green-600 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
