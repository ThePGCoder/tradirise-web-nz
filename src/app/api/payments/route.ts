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
    const { data: payments, error } = await supabase
      .from("payments")
      .select(
        `
        id,
        amount,
        currency,
        status,
        plan_name,
        created_at
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error fetching payments:", error);
      return NextResponse.json(
        { error: "Failed to fetch payments" },
        { status: 500 }
      );
    }

    return NextResponse.json({ payments: payments || [] });
  } catch (error) {
    console.error("Server error in payments API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
