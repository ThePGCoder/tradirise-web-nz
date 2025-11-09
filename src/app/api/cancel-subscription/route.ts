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

interface CancelSubscriptionRequestBody {
  subscriptionId: string;
}

export const POST = async (req: Request) => {
  try {
    console.log("Cancel subscription API called");

    // Initialize Stripe inside the function
    const stripe = getStripeInstance();

    const user = await getUser();
    if (!user) {
      console.log("No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User found:", { id: user.id, email: user.email });

    const body: CancelSubscriptionRequestBody = await req.json();
    const { subscriptionId } = body;

    console.log("Request body:", { subscriptionId });

    // Validate input
    if (!subscriptionId || typeof subscriptionId !== "string") {
      console.log("Invalid subscriptionId");
      return NextResponse.json(
        { error: "Invalid subscription ID" },
        { status: 400 }
      );
    }

    // Verify the subscription belongs to the user (using database ID)
    const supabase = createAdminClient();
    const { data: userSubscription, error: subError } = await supabase
      .from("user_subscriptions")
      .select("id, stripe_subscription_id, cancel_at_period_end")
      .eq("user_id", user.id)
      .eq("id", subscriptionId) // Query by database ID, not Stripe ID
      .eq("status", "active")
      .single();

    if (subError || !userSubscription) {
      console.log(
        "Subscription not found or doesn't belong to user:",
        subError
      );
      return NextResponse.json(
        { error: "Subscription not found or unauthorized" },
        { status: 404 }
      );
    }

    // Check if subscription is already scheduled for cancellation
    if (userSubscription.cancel_at_period_end) {
      console.log("Subscription is already scheduled for cancellation");
      return NextResponse.json(
        { error: "Subscription is already scheduled for cancellation" },
        { status: 400 }
      );
    }

    // Verify we have a Stripe subscription ID
    if (!userSubscription.stripe_subscription_id) {
      console.log("Subscription has no Stripe ID");
      return NextResponse.json(
        { error: "Subscription has no Stripe ID" },
        { status: 400 }
      );
    }

    console.log("Subscription verified:", userSubscription.id);

    // Cancel the subscription in Stripe (at period end)
    console.log("Canceling subscription in Stripe...");
    const canceledSubscription = await stripe.subscriptions.update(
      userSubscription.stripe_subscription_id,
      {
        cancel_at_period_end: true,
      }
    );

    console.log("Subscription canceled in Stripe:", canceledSubscription);

    // Update the subscription in our database
    console.log("Updating subscription in database...");
    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userSubscription.id);

    if (updateError) {
      console.error("Error updating subscription in database:", updateError);
      // Don't return error here since Stripe was successful
      // The webhook will eventually sync this
    } else {
      console.log("Subscription updated in database");
    }

    return NextResponse.json({
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
      subscription: {
        id: canceledSubscription.id,
        cancel_at_period_end: canceledSubscription.cancel_at_period_end,
      },
    });
  } catch (err) {
    console.error("Cancel subscription error:", err);

    if (err instanceof Stripe.errors.StripeError) {
      console.error("Stripe error details:", {
        type: err.type,
        code: err.code,
        message: err.message,
      });
      return NextResponse.json(
        { error: `Stripe error: ${err.message}` },
        { status: 400 }
      );
    }

    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
};
