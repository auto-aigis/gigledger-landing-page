"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  IndianRupee,
  FileText,
  Calculator,
  Clock,
  ArrowRight,
  Check,
  Zap,
  Shield,
  BarChart3,
  Users,
  Star,
  Menu,
  X,
} from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  const features: Feature[] = [
    {
      icon: <BarChart3 className="h-6 w-6 text-emerald-600" />,
      title: "Unified Income Dashboard",
      description:
        "Consolidate earnings from Upwork, Fiverr, Toptal, YouTube, and local clients into one clean view.",
    },
    {
      icon: <Calculator className="h-6 w-6 text-emerald-600" />,
      title: "Auto GST Calculation",
      description:
        "Automatically calculate your GST liability based on income slabs, with reminders before due dates.",
    },
    {
      icon: <FileText className="h-6 w-6 text-emerald-600" />,
      title: "India-Compliant Invoices",
      description:
        "Generate professional GST invoices in seconds with auto-filled GSTIN, SAC codes, and HSN details.",
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-600" />,
      title: "Advance Tax Reminders",
      description:
        "Never miss a quarterly advance tax deadline again. Smart alerts 15 days before each due date.",
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      title: "ITR-Ready Reports",
      description:
        "Export income summaries formatted for ITR-3 and ITR-4 filing. Share directly with your CA.",
    },
    {
      icon: <Zap className="h-6 w-6 text-emerald-600" />,
      title: "5-Minute Setup",
      description:
        "Connect your platforms, import past data, and get your tax picture — all in under 5 minutes.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Connect Your Platforms",
      description:
        "Link Upwork, Fiverr, Toptal, Razorpay, or manually add local client payments.",
    },
    {
      number: "02",
      title: "See Your Full Picture",
      description:
        "Your unified dashboard shows total earnings, platform-wise breakdown, and monthly trends.",
    },
    {
      number: "03",
      title: "Auto-Calculate Taxes",
      description:
        "GigLedger computes your GST, advance tax, and TDS credits — no spreadsheets needed.",
    },
    {
      number: "04",
      title: "Invoice & File with Confidence",
      description:
        "Generate compliant invoices, export tax reports, and file on time — every quarter.",
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "₹0",
      period: "forever",
      description: "Perfect for freelancers just getting started",
      features: [
        "Up to 2 platform connections",
        "Basic income dashboard",
        "5 invoices per month",
        "Advance tax reminders",
        "Email support",
      ],
      popular: false,
      cta: "Start Free",
    },
    {
      name: "Pro",
      price: "₹499",
      period: "/month",
      description: "For serious freelancers earning from multiple sources",
      features: [
        "Unlimited platform connections",
        "Full analytics dashboard",
        "Unlimited invoices",
        "Auto GST calculation",
        "ITR-ready export reports",
        "Priority support",
        "CA consultation (1/quarter)",
      ],
      popular: true,
      cta: "Start 14-Day Trial",
    },
    {
      name: "Business",
      price: "₹1,499",
      period: "/month",
      description: "For agencies and high-earning freelancers",
      features: [
        "Everything in Pro",
        "Multi-entity support",
        "Team collaboration",
        "Custom invoice branding",
        "API access",
        "Dedicated account manager",
        "Quarterly CA review",
      ],
      popular: false,
      cta: "Contact Sales",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Priya Sharma",
      role: "Full-Stack Developer, Upwork + Toptal",
      quote:
        "I used to spend 3 hours every month on spreadsheets. GigLedger does it all in seconds. My CA is happier too!",
      rating: 5,
    },
    {
      name: "Rohit Mehta",
      role: "Content Creator, YouTube + Freelance",
      quote:
        "Finally a tool that understands Indian tax rules. The advance tax reminders alone saved me from a penalty.",
      rating: 5,
    },
    {
      name: "Ananya Reddy",
      role: "UI/UX Designer, Fiverr + Local Clients",
      quote:
        "Generating GST invoices used to take me 20 minutes each. Now it takes 20 seconds. Game changer.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Do I need a GST registration to use GigLedger?",
      answer:
        "No! GigLedger works for both registered and unregistered freelancers. If you are below the ₹20L threshold, we help you track when you might need to register. If you are registered, we auto-calculate your GST liability.",
    },
    {
      question: "How does GigLedger connect to my freelance platforms?",
      answer:
        "We use secure API connections for platforms like Upwork, Fiverr, and Toptal. For local clients or platforms without APIs, you can manually log payments or upload bank statements for auto-categorization.",
    },
    {
      question: "Is my financial data safe?",
      answer:
        "Absolutely. We use bank-grade 256-bit encryption, store data on AWS Mumbai servers (data never leaves India), and are SOC 2 Type II compliant. We never share your data with third parties.",
    },
    {
      question: "Can GigLedger replace my CA?",
      answer:
        "GigLedger handles the day-to-day tracking, calculations, and compliance reminders. For complex tax planning or ITR filing, we recommend working with a CA — and our Pro plan includes quarterly CA consultations.",
    },
    {
      question: "What if I earn in foreign currency?",
      answer:
        "GigLedger automatically converts foreign earnings to INR using RBI reference rates on the date of receipt. We also handle the export-of-services GST exemption rules for you.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-7 w-7 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">GigLedger</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Get Started Free
              </Button>
            </div>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
              How It Works
            </a>
            <a href="#pricing" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </a>
            <a href="#faq" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </a>
            <Separator />
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Log In
            </Button>
            <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Get Started Free
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
              🇮🇳 Built for Indian Freelancers
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              The income {"&"} tax co-pilot for{" "}
              <span className="text-emerald-600">multi-gig freelancers</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Consolidate earnings from Upwork, Fiverr, Toptal {"&"} local clients. Auto-calculate GST,
              track advance tax, and generate compliant invoices — all in under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex w-full sm:w-auto gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-72"
                />
                <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap">
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Free forever plan available. No credit card required.
            </p>

            {/* Social Proof */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>2,400+ freelancers onboarded</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span>4.9/5 average rating</span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                <span>₹12Cr+ income tracked</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 max-w-5xl mx-auto rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-emerald-50 p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500 mb-1">Total Earnings (FY 24-25)</p>
                  <p className="text-2xl font-bold text-gray-900">₹18,42,500</p>
                  <p className="text-xs text-emerald-600 mt-1">↑ 23% from last quarter</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500 mb-1">GST Liability (Q3)</p>
                  <p className="text-2xl font-bold text-gray-900">₹1,65,825</p>
                  <p className="text-xs text-orange-600 mt-1">Due: 20 Jan 2025</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-500 mb-1">Advance Tax (Next)</p>
                  <p className="text-2xl font-bold text-gray-900">₹45,200</p>
                  <p className="text-xs text-blue-600 mt-1">Due: 15 Mar 2025</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage gig income
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Replace spreadsheets, CA consultations, and 3 different apps with one simple dashboard
              built for Indian tax compliance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:border-emerald-200 hover:shadow-md transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              From chaos to clarity in 4 steps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your complete tax picture in under 5 minutes. No accounting degree required.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-5xl font-bold text-emerald-100 mb-4">{step.number}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-4 h-5 w-5 text-emerald-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by freelancers across India
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">{`"${testimonial.quote}"`}</p>
                  <Separator className="mb-4" />
                  <p className="font-semibold text-sm text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more. Still cheaper than one CA consultation.
            </p>
          </div>
          <Tabs defaultValue="monthly" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual (Save 20%)</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="monthly">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {pricingPlans.map((plan, index) => (
                  <Card
                    key={index}
                    className={`relative ${
                      plan.popular ? "border-emerald-600 border-2 shadow-lg scale-105" : "border-gray-200"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-emerald-600 text-white">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-500 ml-1">{plan.period}</span>
                      </div>
                      <ul className="space-y-3">
                        {plan.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-gray-900 hover:bg-gray-800"
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="annual">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {pricingPlans.map((plan, index) => {
                  const annualPrice =
                    plan.price === "₹0"
                      ? "₹0"
                      : plan.price === "₹499"
                      ? "₹399"
                      : "₹1,199";
                  return (
                    <Card
                      key={index}
                      className={`relative ${
                        plan.popular ? "border-emerald-600 border-2 shadow-lg scale-105" : "border-gray-200"
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-emerald-600 text-white">Most Popular</Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6">
                          <span className="text-4xl font-bold text-gray-900">{annualPrice}</span>
                          <span className="text-gray-500 ml-1">{plan.price === "₹0" ? "forever" : "/month"}</span>
                        </div>
                        <ul className="space-y-3">
                          {plan.features.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-start gap-2 text-sm text-gray-600">
                              <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className={`w-full ${
                            plan.popular
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "bg-gray-900 hover:bg-gray-800"
                          }`}
                        >
                          {plan.cta}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
          </div>
          <Accordion className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-10 sm:p-16 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stop letting GST feel like punishment
            </h2>
            <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join 2,400+ Indian freelancers who{"'"}ve replaced spreadsheet chaos with GigLedger.
              Set up in 5 minutes, stay compliant all year.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold">
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white border border-white/30 hover:bg-white/10"
              >
                Watch 2-Min Demo
              </Button>
            </div>
            <p className="text-sm text-emerald-200 mt-6">
              No credit card required • Free plan available forever
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <IndianRupee className="h-6 w-6 text-emerald-600" />
                <span className="text-lg font-bold">GigLedger</span>
              </div>
              <p className="text-sm text-gray-600">
                The income {"&"} tax co-pilot for Indian multi-gig freelancers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                <li><a href="#pricing" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900">Integrations</a></li>
                <li><a href="#" className="hover:text-gray-900">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">GST Guide for Freelancers</a></li>
                <li><a href="#" className="hover:text-gray-900">Tax Calendar 2025</a></li>
                <li><a href="#faq" className="hover:text-gray-900">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2025 GigLedger. Made with ❤️ in India.
            </p>
            <p className="text-sm text-gray-500">
              Not a CA firm. For professional tax advice, consult a qualified Chartered Accountant.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}