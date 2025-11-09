import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/utils/supabase/server";

// POST /api/my-saved-trades
export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { item_type, item_id, notes } = await req.json();

    if (!item_type || !item_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate item_type is only personnel or business
    if (!["personnel", "business"].includes(item_type)) {
      return NextResponse.json(
        { error: "Invalid item type. Only 'personnel' or 'business' allowed." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("my_saved_trades")
      .insert({
        user_id: user.id,
        item_type,
        item_id,
        notes,
      })
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Trade already saved" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error saving trade:", error);
    return NextResponse.json(
      { error: "Failed to save trade" },
      { status: 500 }
    );
  }
}

// DELETE /api/my-saved-trades
export async function DELETE(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const item_type = searchParams.get("item_type");
    const item_id = searchParams.get("item_id");

    if (!item_type || !item_id) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("my_saved_trades")
      .delete()
      .eq("user_id", user.id)
      .eq("item_type", item_type)
      .eq("item_id", item_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing saved trade:", error);
    return NextResponse.json(
      { error: "Failed to remove saved trade" },
      { status: 500 }
    );
  }
}

// GET /api/my-saved-trades
export async function GET(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const item_type = searchParams.get("type"); // Optional filter: 'personnel' or 'business'

    const supabase = await createClient();

    let query = supabase
      .from("my_saved_trades")
      .select(
        `
        *,
        personnel:personnel(*),
        businesses:businesses(*)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Optional filter by type
    if (item_type && ["personnel", "business"].includes(item_type)) {
      query = query.eq("item_type", item_type);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching saved trades:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved trades" },
      { status: 500 }
    );
  }
}
