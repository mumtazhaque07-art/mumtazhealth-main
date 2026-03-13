import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

// Map Stripe price IDs to subscription tiers
// These must be configured once Stripe products are created
const PRICE_TO_TIER: Record<string, string> = {
  // Set these after creating Stripe products:
  // "price_xxxxx_basic_monthly": "basic",
  // "price_xxxxx_basic_annual": "basic",
  // "price_xxxxx_standard_monthly": "standard",
  // "price_xxxxx_standard_annual": "standard",
  // "price_xxxxx_premium_monthly": "premium",
  // "price_xxxxx_premium_annual": "premium",
};

function getTierFromPriceId(priceId: string): string {
  return PRICE_TO_TIER[priceId] || "free";
}

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;

        if (!userId) {
          console.error("No supabase_user_id in checkout session metadata");
          break;
        }

        // Get the subscription to find the price ID
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const priceId = subscription.items.data[0]?.price.id;
          const tier = getTierFromPriceId(priceId || "");

          const { error } = await supabaseAdmin
            .from("user_wellness_profiles")
            .update({ subscription_tier: tier })
            .eq("user_id", userId);

          if (error) {
            console.error("Error updating subscription tier:", error);
          } else {
            console.log(`User ${userId} upgraded to ${tier}`);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        const priceId = subscription.items.data[0]?.price.id;
        const tier = subscription.status === "active"
          ? getTierFromPriceId(priceId || "")
          : "free";

        const { error } = await supabaseAdmin
          .from("user_wellness_profiles")
          .update({ subscription_tier: tier })
          .eq("user_id", userId);

        if (error) {
          console.error("Error updating subscription:", error);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        const { error } = await supabaseAdmin
          .from("user_wellness_profiles")
          .update({ subscription_tier: "free" })
          .eq("user_id", userId);

        if (error) {
          console.error("Error downgrading subscription:", error);
        } else {
          console.log(`User ${userId} downgraded to free`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
