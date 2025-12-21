// app/api/my-favourites/route.ts - DEBUG VERSION
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type FavouriteItemType =
  | "personnel"
  | "business"
  | "position"
  | "project"
  | "vehicle"
  | "plant"
  | "material";

/**
 * HEAD - Check if an item is favourited
 */
export async function HEAD(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const itemType = searchParams.get("item_type") as FavouriteItemType;
  const itemId = searchParams.get("item_id");

  if (!itemType || !itemId) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("my_favourites")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_type", itemType)
      .eq("item_id", itemId)
      .single();

    if (error || !data) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error checking favourite:", error);
    return new NextResponse(null, { status: 500 });
  }
}

/**
 * POST - Add an item to favourites
 */
export async function POST(request: NextRequest) {
  console.log("=== POST /api/my-favourites START ===");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User authenticated:", !!user, user?.id);

  if (!user) {
    console.log("ERROR: No user authenticated");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const { item_type, item_id, notes } = body;

    if (!item_type || !item_id) {
      console.log("ERROR: Missing required fields", { item_type, item_id });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate item_type
    const validTypes: FavouriteItemType[] = [
      "personnel",
      "business",
      "position",
      "project",
      "vehicle",
      "plant",
      "material",
    ];

    if (!validTypes.includes(item_type as FavouriteItemType)) {
      console.log("ERROR: Invalid item type", item_type);
      return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
    }

    console.log("Checking if favourite already exists...");

    // Check if already exists
    const { data: existing, error: checkError } = await supabase
      .from("my_favourites")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_type", item_type)
      .eq("item_id", item_id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing favourite:", checkError);
    }

    console.log("Existing favourite:", existing);

    if (existing) {
      console.log("ERROR: Item already in favourites");
      return NextResponse.json(
        { error: "Item already in favourites" },
        { status: 409 }
      );
    }

    const insertData: {
      user_id: string;
      item_type: string;
      item_id: string;
      notes?: string;
    } = {
      user_id: user.id,
      item_type: item_type,
      item_id: item_id,
    };

    // Add notes if provided
    if (notes) {
      insertData.notes = notes;
    }

    console.log("Inserting favourite:", JSON.stringify(insertData, null, 2));

    const { data: insertResult, error } = await supabase
      .from("my_favourites")
      .insert(insertData)
      .select();

    if (error) {
      console.error("ERROR inserting to favourites:");
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", JSON.stringify(error, null, 2));

      return NextResponse.json(
        { error: error.message || "Failed to add favourite" },
        { status: 500 }
      );
    }

    console.log("SUCCESS: Favourite added", insertResult);
    console.log("=== POST /api/my-favourites END ===");

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("EXCEPTION in POST /api/my-favourites:");
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove an item from favourites
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const itemType = searchParams.get("item_type") as FavouriteItemType;
  const itemId = searchParams.get("item_id");

  if (!itemType || !itemId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase
      .from("my_favourites")
      .delete()
      .eq("user_id", user.id)
      .eq("item_type", itemType)
      .eq("item_id", itemId);

    if (error) {
      console.error("Error removing from favourites:", error);
      return NextResponse.json(
        { error: error.message || "Failed to remove favourite" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error removing from favourites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET - Get all favourites for the current user (optional: filtered by type)
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const itemType = searchParams.get("item_type") as FavouriteItemType | null;

  try {
    let query = supabase
      .from("my_favourites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Filter by type if specified
    if (itemType) {
      query = query.eq("item_type", itemType);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching favourites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
