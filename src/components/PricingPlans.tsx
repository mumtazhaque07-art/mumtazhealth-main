import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Check, Sparkles, Crown, Loader2, Star } from "lucide-react";

/**
 * Pricing strategy informed by competitor analysis (March 2026):
 *
 * | Competitor   | Monthly   | Annual       |
 * |-------------|-----------|--------------|
 * | Flo         | $11.49    | $39.99/yr    |
 * | Clue Plus   | ~$3.33    | $30–39/yr    |
 * | Balance+    | $10.99    | $49.99/yr    |
 * | Down Dog    | $9.99     | $59.99/yr    |
 * | Caria       | $9.99     | $49.99/yr    |
 *
 * Mumtaz Health differentiator: Ayurvedic + Islamic wellness (unique niche).
 * Pricing positioned between Clue (budget) and Balance/Down Dog (mid-range).
 * Premium tier includes 1:1 founder sessions — justified higher price.
 */

interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
}

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free Sanctuary",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Your safe place to land.",
    features: [
      "Dosha Assessment & Life Phase Insight",
      "Core Check-In Dashboard & Tracking",
      "A Taste of Healing (Select Poses & Recipes)",
      "Daily Wellness Reminders",
    ],
  },
  {
    id: "standard",
    name: "Standard Signature",
    monthlyPrice: 15.00,
    annualPrice: 150.00,
    description: "The complete Ayurvedic & Wellness toolkit.",
    features: [
      "Full Content Library Access",
      "Deep Phase-Specific Yoga Routines",
      "All Herbal & Nutrition Pathways",
      "Advanced Breathwork Sequences",
      "Pregnancy-safe Modality Filters",
    ],
    badge: "Popular",
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium Guidance",
    monthlyPrice: 45.00,
    annualPrice: 450.00,
    description: "Personalized support directly from Mumtaz.",
    features: [
      "Everything in Standard Signature",
      "1 Monthly Group Workshop Entry",
      "Priority Q&A Email Support",
      "10% off Private 1-to-1 Consultations",
      "Early Access to Retreats",
    ],
  },
];

export function PricingPlans({ currentTier = "free" }: { currentTier?: string }) {
  const [annual, setAnnual] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.id === "free") return;

    const priceId = annual ? plan.stripePriceIdAnnual : plan.stripePriceIdMonthly;

    if (!priceId) {
      toast.info(
        `${plan.name} plan coming soon! We're finalising our payment setup.`,
        { duration: 4000 }
      );
      return;
    }

    setLoadingPlan(plan.id);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Unable to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const formatPrice = (plan: PricingPlan) => {
    if (plan.id === "free") return "Free";
    const price = annual ? plan.annualPrice : plan.monthlyPrice;
    const suffix = annual ? "/year" : "/month";
    return `£${price.toFixed(2)}${suffix}`;
  };

  const monthlySavings = (plan: PricingPlan) => {
    if (plan.id === "free") return null;
    const monthlyTotal = plan.monthlyPrice * 12;
    const saved = monthlyTotal - plan.annualPrice;
    if (saved <= 0) return null;
    return Math.round((saved / monthlyTotal) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm ${!annual ? "font-semibold" : "text-muted-foreground"}`}>
          Monthly
        </span>
        <Switch checked={annual} onCheckedChange={setAnnual} />
        <span className={`text-sm ${annual ? "font-semibold" : "text-muted-foreground"}`}>
          Annual
        </span>
        {annual && (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
            Save up to 33%
          </Badge>
        )}
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentTier;
          const savings = annual ? monthlySavings(plan) : null;

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col transition-all ${
                plan.highlight
                  ? "border-primary shadow-lg ring-1 ring-primary/20"
                  : "border-border"
              } ${isCurrent ? "bg-primary/5" : ""}`}
            >
              {plan.badge && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Badge className="text-xs px-3 py-0.5 bg-primary text-primary-foreground">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-3 pt-5">
                <div className="flex items-center gap-2">
                  {plan.id === "premium" ? (
                    <Crown className="h-5 w-5 text-amber-500" />
                  ) : plan.id === "basic" ? (
                    <Star className="h-5 w-5 text-primary" />
                  ) : plan.id === "standard" ? (
                    <Sparkles className="h-5 w-5 text-purple-500" />
                  ) : null}
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">{plan.description}</CardDescription>

                <div className="mt-2">
                  <span className="text-2xl font-bold">{formatPrice(plan)}</span>
                  {annual && savings && (
                    <p className="text-xs text-green-600 mt-0.5">
                      Save {savings}% vs monthly
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2 flex-1 mb-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button variant="outline" disabled className="w-full">
                    Current Plan
                  </Button>
                ) : plan.id === "free" ? (
                  <Button variant="ghost" disabled className="w-full text-muted-foreground">
                    Included
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={!!loadingPlan}
                    className={`w-full ${plan.highlight ? "" : "variant-outline"}`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {loadingPlan === plan.id ? "Loading..." : "Subscribe"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trust note */}
      <p className="text-center text-xs text-muted-foreground max-w-md mx-auto">
        Cancel anytime. 7-day free trial on all paid plans. Payments secured by Stripe.
        All prices in GBP.
      </p>
    </div>
  );
}
