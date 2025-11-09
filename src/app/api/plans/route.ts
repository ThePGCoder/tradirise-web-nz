import { createAdminClient } from "@/utils/supabase/admin";
import { getUser } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Fetch current subscription
    const { data: userPlan, error: userPlanError } = await supabase
      .from("user_subscriptions")
      .select(
        `
        id,
        plan_id,
        status,
        billing_period,
        subscription_plans (
          id,
          name,
          display_name,
          price_monthly,
          price_yearly,
          currency,
          max_businesses,
          max_photos,
          max_listings_per_month
        )
      `
      )
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (userPlanError) {
      console.error("Error fetching user plan:", userPlanError);
    }

    // Fetch available plans
    const { data: allPlans, error: plansError } = await supabase
      .from("subscription_plans")
      .select(
        `
        id,
        name,
        display_name,
        price_monthly,
        price_yearly,
        currency,
        max_businesses,
        max_photos,
        max_listings_per_month,
        stripe_price_id_monthly,
        stripe_price_id_yearly
      `
      )
      .order("price_monthly");

    if (plansError) {
      console.error("Error fetching plans:", plansError);
      return NextResponse.json(
        { error: "Failed to fetch plans" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      currentPlan: userPlan || null,
      plans: allPlans || [],
    });
  } catch (error) {
    console.error("Server error in plans API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
