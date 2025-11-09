import { createAdminClient } from "@/utils/supabase/admin";
import { getUser } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ad_id, ad_type, message, contact_info } = await request.json();

    if (!ad_id || !ad_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Check if user can respond
    const { data: canRespondData, error: checkError } = await supabase.rpc(
      "can_user_respond_to_ad",
      { user_id_param: user.id }
    );

    if (checkError) {
      console.error("Error checking response limit:", checkError);
      return NextResponse.json(
        { error: "Failed to check response limit" },
        { status: 500 }
      );
    }

    const limitCheck = canRespondData[0];
    if (!limitCheck.can_respond) {
      return NextResponse.json(
        {
          error: limitCheck.reason,
          current_count: limitCheck.current_count,
          limit_count: limitCheck.limit_count,
        },
        { status: 403 }
      );
    }

    // Check if user already responded to this ad
    const { data: existingResponse } = await supabase
      .from("ad_responses")
      .select("id")
      .eq("user_id", user.id)
      .eq("ad_id", ad_id)
      .eq("ad_type", ad_type)
      .single();

    if (existingResponse) {
      return NextResponse.json(
        { error: "You've already responded to this ad" },
        { status: 400 }
      );
    }

    // Create the response
    const { data: response, error: insertError } = await supabase
      .from("ad_responses")
      .insert({
        user_id: user.id,
        ad_id,
        ad_type,
        message,
        contact_info,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating response:", insertError);
      return NextResponse.json(
        { error: "Failed to record response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Server error in ad-responses API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
