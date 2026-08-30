import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Star, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkoutRequestBody, checkoutUrlFromResponse, type CheckoutTier } from "@/lib/checkout";

export default function PremiumUpgrade() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tierId: CheckoutTier) => {
    setLoading(tierId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to subscribe.");
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: checkoutRequestBody(tierId, window.location.origin),
      });

      if (error) {
        throw error;
      }

      const url = checkoutUrlFromResponse(data);
      if (!url) {
        toast.error("Checkout isn’t available yet. You can still review the plans.");
        return;
      }

      window.location.assign(url);
    } catch (error: any) {
      toast.error("Checkout isn’t available yet. You can still review the plans.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-wellness-beige flex items-center justify-center p-4 py-24">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wellness-sage/10 text-wellness-sage font-medium text-sm">
            <Sparkles className="w-4 h-4" />
            Taste Journey is always free.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            Go deeper when you are ready.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Unlimited Wisdom Guide, the full library, full tracking, and a private line to me.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-8">
          
          {/* Monthly Plan */}
          <Card className="relative overflow-hidden border-wellness-taupe/20 flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800">Monthly</CardTitle>
              <CardDescription>Flexible, month-to-month access</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-slate-900">£9.99</span>
                <span className="text-slate-500 font-medium">/ month</span>
              </div>
              
              <ul className="space-y-3">
                {['Unlimited Mumtaz Wisdom Guide chats', 'Full Daily Tracker & Journal', 'Complete Yoga & Recipe Library', 'Insights & Analytics', 'Sisterhood Sanctuary Access', 'Cancel anytime'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-wellness-sage shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-12 text-lg font-medium" 
                variant="outline"
                onClick={() => handleSubscribe('monthly')}
                disabled={loading !== null}
              >
                {loading === 'monthly' ? 'Loading...' : 'Continue monthly'}
              </Button>
            </CardFooter>
          </Card>

          {/* Annual Plan (Founding Member) */}
          <Card className="relative overflow-hidden border-wellness-sage shadow-xl flex flex-col ring-2 ring-wellness-sage">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-wellness-sage"></div>
            <div className="absolute top-4 right-4 bg-wellness-sage/10 text-wellness-sage px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3" /> BEST VALUE
            </div>
            
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 flex items-center gap-2">
                Founding Member
              </CardTitle>
              <CardDescription>Lock in our lowest price forever</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-slate-900">£50</span>
                <span className="text-slate-500 font-medium">/ year</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 line-through decoration-slate-400">Regularly £70/year</span>
                <span className="bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded text-xs">Save £20</span>
              </div>
              
              <ul className="space-y-3">
                {['Unlimited Mumtaz Wisdom Guide chats', 'Full Daily Tracker & Journal', 'Complete Yoga & Recipe Library', 'Insights & Analytics', 'Sisterhood Sanctuary Access', 'Lock in £50/yr forever (Founding rate)'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <Check className="w-5 h-5 text-wellness-sage shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-12 text-lg font-medium bg-wellness-sage hover:bg-wellness-sage/90 text-white"
                onClick={() => handleSubscribe('annual')}
                disabled={loading !== null}
              >
                {loading === 'annual' ? 'Loading...' : 'Become a Founding Member'}
              </Button>
            </CardFooter>
          </Card>

        </div>

        <div className="text-center pt-8 space-y-2 text-slate-400 text-sm">
          <p className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" /> Secure payment by Stripe, when it is live. Cancel anytime.
          </p>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Holistic suggestions only. Not medical advice. Always consult your GP or healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}
