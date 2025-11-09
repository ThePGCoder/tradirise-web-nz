import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Helper functions to avoid module-level initialization
function getStripeInstance() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion,
  });
}

function getEndpointSecret() {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return process.env.STRIPE_WEBHOOK_SECRET;
}

// Add GET handler for basic testing
export async function GET() {
  return NextResponse.json({
    message: "Stripe webhook endpoint is running",
    timestamp: new Date().toISOString(),
    hasEndpointSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
  });
}

export async function POST(req: Request) {
  console.log("🔥 WEBHOOK CALLED - Starting processing...");

  try {
    // Initialize inside the function to avoid build-time errors
    const stripe = getStripeInstance();
    const endpointSecret = getEndpointSecret();
    const supabase = createAdminClient();

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    console.log("📝 Webhook details:", {
      bodyLength: body.length,
      hasSignature: !!sig,
      hasEndpointSecret: !!endpointSecret,
    });

    if (!sig) {
      console.error("❌ No Stripe signature found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
      console.log("✅ Webhook signature verified successfully");
      console.log("📋 Event type:", event.type);
      console.log("📋 Event ID:", event.id);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        console.log("🎯 Processing checkout.session.completed");

        const session = event.data.object as Stripe.Checkout.Session;

        console.log("📊 Session details:", {
          id: session.id,
          mode: session.mode,
          status: session.status,
          payment_status: session.payment_status,
          customer_email: session.customer_email,
          amount_total: session.amount_total,
          currency: session.currency,
          metadata: session.metadata,
        });

        const userEmail = session.customer_email;
        const planId = session.metadata?.plan_id;
        const planName = session.metadata?.plan_name;
        const planDisplayName = session.metadata?.plan_display_name;
        const userId = session.metadata?.user_id;
        const billingPeriod = session.metadata?.billing_period as
          | "monthly"
          | "yearly";
        const isFreePromo = session.metadata?.is_free_promo === "true";

        console.log("🔍 Extracted metadata:", {
          userEmail,
          planId,
          planName,
          planDisplayName,
          userId,
          billingPeriod,
          isFreePromo,
        });

        if (!userId || !planId) {
          console.error("❌ Missing required metadata: userId or planId");
          console.log(
            "💡 Available metadata keys:",
            Object.keys(session.metadata || {})
          );
          break;
        }

        // Verify user exists
        const { data: userExists, error: userError } = await supabase
          .from("user_subscriptions")
          .select("user_id")
          .eq("user_id", userId)
          .maybeSingle();

        console.log("👤 User verification:", {
          userExists: !!userExists,
          userError,
        });

        // Verify plan exists
        const { data: planExists, error: planError } = await supabase
          .from("subscription_plans")
          .select("id, name, display_name")
          .eq("id", planId)
          .maybeSingle();

        console.log("📋 Plan verification:", { planExists, planError });

        // Insert into payments table
        console.log("💰 Inserting payment record...");

        // Handle different payment scenarios
        let stripePaymentId = session.payment_intent as string;

        if (!stripePaymentId) {
          if (session.subscription) {
            stripePaymentId = `sub_${session.subscription}`;
            console.log(
              "💡 Using subscription ID as payment identifier:",
              stripePaymentId
            );
          } else if (isFreePromo) {
            stripePaymentId = `promo_${session.id}`;
            console.log(
              "💡 Using promo session ID as payment identifier:",
              stripePaymentId
            );
          } else {
            stripePaymentId = `sess_${session.id}`;
            console.log(
              "💡 Using session ID as payment identifier:",
              stripePaymentId
            );
          }
        }

        const paymentData = {
          user_id: userId,
          stripe_payment_id: stripePaymentId,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? "nzd",
          status: "succeeded",
          plan_name: planDisplayName || planName,
        };

        console.log("💰 Payment data:", paymentData);

        const { data: paymentResult, error: paymentError } = await supabase
          .from("payments")
          .insert(paymentData)
          .select();

        if (paymentError) {
          console.error("❌ Error inserting payment:", paymentError);
        } else {
          console.log("✅ Payment record created successfully:", paymentResult);
        }

        // Calculate subscription end date
        let subscriptionEndDate: string | null = null;

        if (isFreePromo) {
          subscriptionEndDate = "2025-12-31T23:59:59Z";
          console.log("🎁 Using free promo end date:", subscriptionEndDate);
        } else if (session.mode === "subscription" && session.subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );
            subscriptionEndDate = new Date(
              subscription.items.data[0].current_period_end * 1000
            ).toISOString();
            console.log(
              "📅 Retrieved subscription end date:",
              subscriptionEndDate
            );
          } catch (subError) {
            console.error("❌ Error retrieving subscription:", subError);
          }
        } else {
          const now = new Date();
          if (billingPeriod === "yearly") {
            now.setFullYear(now.getFullYear() + 1);
          } else {
            now.setMonth(now.getMonth() + 1);
          }
          subscriptionEndDate = now.toISOString();
          console.log("🗓️ Calculated fallback end date:", subscriptionEndDate);
        }

        // Update user_subscriptions table
        console.log("📝 Upserting subscription...");
        const subscriptionData = {
          user_id: userId,
          plan_id: planId,
          stripe_session_id: session.id,
          stripe_subscription_id: (session.subscription as string) || null,
          stripe_customer_id: (session.customer as string) || null,
          status: "active",
          billing_period: billingPeriod,
          current_period_start: new Date(session.created * 1000).toISOString(),
          current_period_end: subscriptionEndDate,
          cancel_at_period_end: false,
        };

        console.log("📝 Subscription data:", subscriptionData);

        const { data: subscriptionResult, error: subscriptionError } =
          await supabase
            .from("user_subscriptions")
            .upsert(subscriptionData, {
              onConflict: "user_id",
            })
            .select();

        if (subscriptionError) {
          console.error("❌ Error upserting subscription:", subscriptionError);
        } else {
          console.log(
            "✅ Successfully updated subscription:",
            subscriptionResult
          );
        }

        console.log("🎉 Checkout session completed processing finished");
        break;
      }

      case "invoice.payment_succeeded": {
        console.log("🎯 Processing invoice.payment_succeeded");
        const invoice = event.data.object as Stripe.Invoice;
        console.log("📊 Invoice details:", {
          id: invoice.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          subscription: (invoice as any).subscription,
          amount_paid: invoice.amount_paid,
          status: invoice.status,
        });

        // Extract subscription ID safely
        const subscriptionId =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          typeof (invoice as any).subscription === "string"
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (invoice as any).subscription
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (invoice as any).subscription?.id;

        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId
            );

            const { data: result, error } = await supabase
              .from("user_subscriptions")
              .update({
                status: "active",
                current_period_start: new Date(
                  subscription.items.data[0].current_period_start * 1000
                ).toISOString(),
                current_period_end: new Date(
                  subscription.items.data[0].current_period_end * 1000
                ).toISOString(),
              })
              .eq("stripe_subscription_id", subscriptionId)
              .select();

            if (error) {
              console.error("❌ Error updating subscription period:", error);
            } else {
              console.log("✅ Updated subscription period:", result);
            }
          } catch (subError) {
            console.error(
              "❌ Error retrieving subscription for invoice:",
              subError
            );
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        console.log("🎯 Processing invoice.payment_failed");
        const invoice = event.data.object as Stripe.Invoice;

        const subscriptionId =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          typeof (invoice as any).subscription === "string"
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (invoice as any).subscription
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (invoice as any).subscription?.id;

        if (subscriptionId) {
          const { data: result, error } = await supabase
            .from("user_subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", subscriptionId)
            .select();

          if (error) {
            console.error("❌ Error updating subscription to past_due:", error);
          } else {
            console.log("✅ Updated subscription to past_due:", result);
          }
        } else {
          console.error(
            "❌ Could not find subscription ID on invoice:",
            invoice.id
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        console.log("🎯 Processing customer.subscription.deleted");
        const subscription = event.data.object as Stripe.Subscription;

        const { data: result, error } = await supabase
          .from("user_subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id)
          .select();

        if (error) {
          console.error("❌ Error updating subscription to canceled:", error);
        } else {
          console.log("✅ Updated subscription to canceled:", result);
        }
        break;
      }

      case "customer.subscription.updated": {
        console.log("🎯 Processing customer.subscription.updated");
        const subscription = event.data.object as Stripe.Subscription;

        const { data: result, error } = await supabase
          .from("user_subscriptions")
          .update({
            status:
              subscription.status === "active" ? "active" : subscription.status,
            current_period_start: new Date(
              subscription.items.data[0].current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.items.data[0].current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq("stripe_subscription_id", subscription.id)
          .select();

        if (error) {
          console.error("❌ Error updating subscription:", error);
        } else {
          console.log(
            "✅ Updated subscription from subscription.updated event:",
            result
          );
        }
        break;
      }

      default:
        console.log(`🤷‍♂️ Unhandled event type: ${event.type}`);
    }

    console.log("🏁 Webhook processing completed successfully");
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("💥 Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
