import { createAdminClient } from "@/utils/supabase/admin";
import { getUser } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Helper function to avoid module-level initialization
function getStripeInstance() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion,
  });
}

interface CheckoutRequestBody {
  planId: string;
  billingPeriod: "monthly" | "yearly";
}

export const POST = async (req: Request) => {
  try {
    console.log("🚀 Checkout API called");

    const stripe = getStripeInstance();
    const supabase = createAdminClient();

    const user = await getUser();
    if (!user) {
      console.log("❌ No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("👤 User found:", { id: user.id, email: user.email });

    const body: CheckoutRequestBody = await req.json();
    const { planId, billingPeriod } = body;

    console.log("📋 Request body:", { planId, billingPeriod });

    if (!planId || !billingPeriod) {
      console.log("❌ Missing planId or billingPeriod");
      return NextResponse.json(
        { error: "Missing planId or billingPeriod" },
        { status: 400 }
      );
    }

    if (!["monthly", "yearly"].includes(billingPeriod)) {
      console.log("❌ Invalid billing period:", billingPeriod);
      return NextResponse.json(
        { error: "Invalid billing period" },
        { status: 400 }
      );
    }

    // Get plan details from Supabase
    console.log("🔍 Fetching plan from database...");

    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single();

    console.log("📋 Plan query result:", { plan, planError });

    if (planError || !plan) {
      console.log("❌ Plan not found:", planError);
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    console.log("✅ Plan found:", {
      id: plan.id,
      name: plan.name,
      display_name: plan.display_name,
    });

    // Get current subscription
    const { data: currentSub } = await supabase
      .from("user_subscriptions")
      .select("*, subscription_plans(*)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    console.log("📊 Current subscription:", currentSub);

    // Handle Free plan (downgrade)
    if (plan.name === "free") {
      console.log("🎯 Downgrading to Free plan");

      // Cancel existing Stripe subscription if it exists
      if (currentSub?.stripe_subscription_id) {
        try {
          console.log(
            "🔄 Canceling Stripe subscription:",
            currentSub.stripe_subscription_id
          );
          await stripe.subscriptions.cancel(currentSub.stripe_subscription_id);
          console.log("✅ Stripe subscription canceled");
        } catch (stripeError) {
          console.error("⚠️ Error canceling Stripe subscription:", stripeError);
          // Continue anyway - we'll update the database
        }
      }

      // Update user subscription to Free plan
      const { error: updateError } = await supabase
        .from("user_subscriptions")
        .update({
          plan_id: plan.id,
          status: "active",
          billing_period: billingPeriod,
          stripe_subscription_id: null,
          current_period_start: new Date().toISOString(),
          current_period_end: null, // Free plan has no end date
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("❌ Error updating subscription:", updateError);
        return NextResponse.json(
          { error: "Failed to update subscription" },
          { status: 500 }
        );
      }

      console.log("✅ Successfully downgraded to Free plan");

      // Return redirect URL with success parameter
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      return NextResponse.json({
        success: true,
        message: "Successfully downgraded to Free plan",
        plan: plan.display_name,
        redirect: `${baseUrl}/account?payment=success&plan=free`,
      });
    }

    // Check if it's the pro plan and free until 2025
    const isProFreeUntil2025 =
      plan.name === "pro" && new Date() < new Date("2025-12-31T23:59:59Z");

    console.log("🎁 Is pro free until 2025?", isProFreeUntil2025);

    let sessionConfig: Stripe.Checkout.SessionCreateParams;

    // Prepare metadata
    const metadata = {
      plan_id: plan.id,
      plan_name: plan.name,
      plan_display_name: plan.display_name,
      user_id: user.id,
      billing_period: billingPeriod,
      is_free_promo: isProFreeUntil2025.toString(),
    };

    console.log("📝 Metadata to be sent:", metadata);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (isProFreeUntil2025) {
      // Create a $0 checkout session for free pro plan
      sessionConfig = {
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: plan.currency.toLowerCase(),
              product_data: {
                name: `${plan.display_name} - Free until end of 2025`,
              },
              unit_amount: 0, // Free
            },
            quantity: 1,
          },
        ],
        customer_email: user.email!,
        success_url: `${baseUrl}/account?payment=success`,
        cancel_url: `${baseUrl}/account?payment=canceled`,
        metadata,
      };

      console.log("🎁 Creating free promo checkout session");
    } else {
      // Use Stripe Price IDs for recurring subscriptions
      const priceId =
        billingPeriod === "monthly"
          ? plan.stripe_price_id_monthly
          : plan.stripe_price_id_yearly;

      console.log("💰 Price ID:", priceId, "for", billingPeriod, "billing");

      if (!priceId) {
        console.log("❌ No Stripe price ID found");
        return NextResponse.json(
          { error: `No Stripe price ID found for ${billingPeriod} billing` },
          { status: 400 }
        );
      }

      sessionConfig = {
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        customer_email: user.email!,
        success_url: `${baseUrl}/account?payment=success`,
        cancel_url: `${baseUrl}/account?payment=canceled`,
        metadata,
      };

      console.log("💳 Creating subscription checkout session");
    }

    console.log("🔧 Final session config:", {
      mode: sessionConfig.mode,
      customer_email: sessionConfig.customer_email,
      success_url: sessionConfig.success_url,
      cancel_url: sessionConfig.cancel_url,
      metadata: sessionConfig.metadata,
      line_items: sessionConfig.line_items,
    });

    console.log("🚀 Creating Stripe checkout session...");
    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log("✅ Checkout session created:", {
      id: session.id,
      url: session.url,
      mode: session.mode,
      status: session.status,
      metadata: session.metadata,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      metadata: session.metadata,
    });
  } catch (err) {
    console.error("💥 Checkout error:", err);
    if (err instanceof Error) {
      console.error("Error details:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
};
