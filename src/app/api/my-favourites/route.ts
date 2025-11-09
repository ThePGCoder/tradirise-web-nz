// app/api/my-favourites/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Helper function to get authenticated user
async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

// POST /api/my-favourites - Add item to favourites
export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { item_type, item_id, notes } = body;

    // Validate required fields
    if (!item_type || !item_id) {
      return NextResponse.json(
        { error: "Missing required fields: item_type and item_id" },
        { status: 400 }
      );
    }

    // Validate item_type
    const validTypes = ["personnel", "business", "position", "project"];
    if (!validTypes.includes(item_type)) {
      return NextResponse.json(
        {
          error: `Invalid item_type. Must be one of: ${validTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insert favourite
    const { data, error } = await supabase
      .from("my_favourites")
      .insert({
        user_id: user.id,
        item_type,
        item_id,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate error
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Item already in favourites" },
          { status: 409 }
        );
      }

      console.error("Error inserting favourite:", error);
      return NextResponse.json(
        { error: "Failed to add to favourites" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/my-favourites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/my-favourites - Remove item from favourites
export async function DELETE(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const item_type = searchParams.get("item_type");
    const item_id = searchParams.get("item_id");

    // Validate required parameters
    if (!item_type || !item_id) {
      return NextResponse.json(
        { error: "Missing required parameters: item_type and item_id" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Delete favourite
    const { error } = await supabase
      .from("my_favourites")
      .delete()
      .eq("user_id", user.id)
      .eq("item_type", item_type)
      .eq("item_id", item_id);

    if (error) {
      console.error("Error deleting favourite:", error);
      return NextResponse.json(
        { error: "Failed to remove from favourites" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/my-favourites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/my-favourites - Get all favourites for user
export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // Optional filter

    const supabase = await createClient();

    let query = supabase
      .from("my_favourites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Optional filter by type
    if (type) {
      const validTypes = ["personnel", "business", "position", "project"];
      if (validTypes.includes(type)) {
        query = query.eq("item_type", type);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching favourites:", error);
      return NextResponse.json(
        { error: "Failed to fetch favourites" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/my-favourites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// HEAD /api/my-favourites - Check if item is favourited
export async function HEAD(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return new NextResponse(null, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const item_type = searchParams.get("item_type");
    const item_id = searchParams.get("item_id");

    if (!item_type || !item_id) {
      return new NextResponse(null, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("my_favourites")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_type", item_type)
      .eq("item_id", item_id)
      .maybeSingle();

    if (error) {
      console.error("Error checking favourite:", error);
      return new NextResponse(null, { status: 500 });
    }

    // Return 200 if favourited, 404 if not
    return new NextResponse(null, { status: data ? 200 : 404 });
  } catch (error) {
    console.error("Error in HEAD /api/my-favourites:", error);
    return new NextResponse(null, { status: 500 });
  }
}
