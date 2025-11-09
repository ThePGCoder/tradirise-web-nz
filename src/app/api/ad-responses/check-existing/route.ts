import { createAdminClient } from "@/utils/supabase/admin";
import { getUser } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ad_id = searchParams.get("ad_id");
    const ad_type = searchParams.get("ad_type");

    console.log("Checking existing response for:", {
      user_id: user.id,
      ad_id,
      ad_type,
    });

    if (!ad_id || !ad_type) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("ad_responses")
      .select("id")
      .eq("user_id", user.id)
      .eq("ad_id", ad_id)
      .eq("ad_type", ad_type)
      .maybeSingle();

    console.log("Query result:", { data, error });

    if (error) {
      console.error("Error checking existing response:", error);
      return NextResponse.json(
        { error: "Failed to check response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      has_responded: !!data,
    });
  } catch (error) {
    console.error("Server error in check-existing API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
