// app/api/subscription/route.ts
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

    // Fetch current subscription with plan details
    const { data: userPlan, error: planError } = await supabase
      .from("user_subscriptions")
      .select(
        `
        id,
        plan_id,
        status,
        billing_period,
        current_period_end,
        cancel_at_period_end,
        subscription_plans (
          id,
          name,
          display_name,
          price_monthly,
          price_yearly,
          currency
        )
      `
      )
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (planError) {
      console.error("Error fetching subscription:", planError);
      return NextResponse.json(
        { error: "Failed to fetch subscription details" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscription: userPlan || null,
    });
  } catch (error) {
    console.error("Server error in subscription API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
