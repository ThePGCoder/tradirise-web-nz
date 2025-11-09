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

    const { data, error } = await supabase.rpc("can_user_respond_to_ad", {
      user_id_param: user.id,
    });

    if (error) {
      console.error("Error checking response limit:", error);
      return NextResponse.json(
        { error: "Failed to check response limit" },
        { status: 500 }
      );
    }

    const limitCheck = data[0];

    return NextResponse.json({
      can_respond: limitCheck.can_respond,
      reason: limitCheck.reason,
      current_count: limitCheck.current_count,
      limit_count: limitCheck.limit_count,
    });
  } catch (error) {
    console.error("Server error in check-limit API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
