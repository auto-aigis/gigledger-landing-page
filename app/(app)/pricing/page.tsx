"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Star, Crown } from "lucide-react";
import { useAuth } from "@/app/_lib/hooks";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: 0,
    period: "Forever",
    description: "Perfect to get started",
    icon: Star,
    iconColor: "text-gray-600",
    iconBg: "bg-gray-100",
    features: [
      "1 income source / platform",
      "Up to 10 invoices/month",
      "Basic GST estimate",
      "All 7 platforms visible",
      "PDF invoice download",
    ],
    cta: "Current Plan",
    highlight: false,
  },
  {
    name: "Pro",
    price: 499,
    period: "per month",
    description: "For active freelancers",
    icon: Zap,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    features: [
      "Unlimited income sources",
      "Unlimited invoices",
      "Advanced GST breakdown (CGST/SGST/IGST)",
      "Advance tax due date tracker",
      "Export income tracking",
      "Priority support",
    ],
    cta: "Coming Soon",
    highlight: true,
  },
  {
    name: "Premium",
    price: 999,
    period: "per month",
    description: "Complete financial toolkit",
    icon: Crown,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
    features: [
      "Everything in Pro",
      "CA-assisted filing prep",
      "Tax deduction calculator",
      "Quarterly financial reports",
      "Dedicated CA support",
      "Export to Tally / Excel",
    ],
    cta: "Coming Soon",
    highlight: false,
  },
];

export default function PricingPage() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h1>
        <p className="text-gray-500 mt-2 text-base">Built for Indian freelancers. No hidden fees.</p>
        <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm text-blue-700">
          <Zap className="h-3.5 w-3.5" />
          Pro & Premium launching soon — join the waitlist!
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isCurrentTier = user?.tier === tier.name.toLowerCase();
          const Icon = tier.icon;
          return (
            <Card key={tier.name} className={`bg-white flex flex-col ${tier.highlight ? "border-2 border-blue-600 shadow-xl relative" : "border border-gray-200"}`}>
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-0.5">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <div className={`w-10 h-10 ${tier.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${tier.iconColor}`} />
                </div>
                <CardTitle className="text-gray-900 text-xl">{tier.name}</CardTitle>
                <p className="text-sm text-gray-500">{tier.description}</p>
                <div className="mt-4">
                  <div className="flex items-end gap-1">
                    <p className="text-4xl font-bold text-gray-900">
                      {tier.price === 0 ? "Free" : `₹${tier.price}`}
                    </p>
                    {tier.price > 0 && <p className="text-sm text-gray-500 mb-1">/{tier.period.replace("per ", "")}</p>}
                  </div>
                  {tier.price === 0 && <p className="text-sm text-gray-500">{tier.period}</p>}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
                {isCurrentTier ? (
                  <Button className="w-full" disabled variant="outline">✓ Current Plan</Button>
                ) : tier.price === 0 ? (
                  <Link href="/register">
                    <Button className="w-full" variant="outline">Get Started Free</Button>
                  </Link>
                ) : (
                  <Button className={`w-full ${tier.highlight ? "bg-blue-600 hover:bg-blue-700" : ""}`} disabled>
                    {tier.cta}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All plans include:</h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            "Email/password authentication",
            "Income tracking across all platforms",
            "GST liability calculations",
            "GST-compliant PDF invoices",
            "Multi-currency support (INR/USD/EUR)",
            "Dashboard analytics",
            "Data stored securely per account",
            "Sequential invoice numbering (GL-YYYY-NNN)",
            "Advance tax awareness",
          ].map((f) => (
            <li key={f} className="flex items-center gap-2 text-gray-700 text-sm">
              <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />{f}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center text-sm text-gray-500">
        Questions? Email us at <a href="mailto:support@gigledger.in" className="text-blue-600 hover:underline">support@gigledger.in</a>
      </div>
    </div>
  );
}
