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

    // Fetch current subscription with usage data and plan details
    const { data: userSubscription, error: subError } = await supabase
      .from("user_subscriptions")
      .select(
        `
        businesses_used,
        photos_used,
        listings_used_this_month,
        ad_responses_used_this_month,
        listings_reset_date,
        ad_responses_reset_date,
        current_period_end,
        subscription_plans (
          id,
          name,
          display_name,
          max_businesses,
          max_photos,
          max_listings_per_month,
          features
        )
      `
      )
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (subError) {
      console.error("Error fetching usage:", subError);
      return NextResponse.json(
        { error: "Failed to fetch usage data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      usage: userSubscription || null,
    });
  } catch (error) {
    console.error("Server error in usage API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
