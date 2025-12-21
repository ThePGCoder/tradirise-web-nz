// app/api/marketplace/vehicle/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createNotification } from "@/utils/supabase/notifications";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // SECURITY: Verify user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to contact seller" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId, message, senderPhone, companyName } = body;

    console.log("Vehicle contact request received:", {
      itemId,
      userId: user.id,
    });

    // SECURITY: Validate required fields
    if (!itemId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // SECURITY: Validate message length
    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    // Get vehicle record
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicle_ads")
      .select("*")
      .eq("id", itemId)
      .single();

    console.log("Vehicle check:", { vehicle, vehicleError });

    if (vehicleError || !vehicle) {
      return NextResponse.json(
        {
          error: "Vehicle listing not found",
          details: vehicleError?.message,
        },
        { status: 404 }
      );
    }

    // Get owner ID and email
    const ownerId = vehicle.auth_id;
    const ownerEmail = vehicle.contact_email;

    console.log("Owner details:", { ownerId, ownerEmail });

    if (!ownerId) {
      return NextResponse.json(
        { error: "Vehicle owner information missing" },
        { status: 404 }
      );
    }

    if (!ownerEmail) {
      return NextResponse.json(
        { error: "Vehicle contact email missing" },
        { status: 404 }
      );
    }

    // SECURITY: Check if listing is expired (30 days)
    const createdAt = new Date(vehicle.created_at);
    const expiryDate = new Date(createdAt);
    expiryDate.setDate(expiryDate.getDate() + 30);

    if (new Date() > expiryDate) {
      return NextResponse.json(
        { error: "This listing has expired" },
        { status: 400 }
      );
    }

    // SECURITY: Prevent self-contact
    if (ownerId === user.id) {
      return NextResponse.json(
        { error: "You cannot contact your own listing" },
        { status: 400 }
      );
    }

    // Get sender profile
    const { data: senderProfile, error: senderError } = await supabase
      .from("profiles")
      .select("first_name, last_name, username")
      .eq("id", user.id)
      .single();

    if (senderError || !senderProfile) {
      return NextResponse.json(
        { error: "Your profile not found" },
        { status: 404 }
      );
    }

    const senderEmail = user.email;
    if (!senderEmail) {
      return NextResponse.json(
        { error: "Your email not found" },
        { status: 404 }
      );
    }

    // Check if already contacted
    const { data: existingResponse } = await supabase
      .from("ad_responses")
      .select("id")
      .eq("ad_id", itemId)
      .eq("ad_type", "vehicle")
      .eq("user_id", user.id)
      .single();

    if (existingResponse) {
      return NextResponse.json(
        { error: "You have already contacted this listing" },
        { status: 400 }
      );
    }

    // Create ad_response record
    const { data: adResponse, error: responseError } = await supabase
      .from("ad_responses")
      .insert({
        ad_id: itemId,
        ad_type: "vehicle",
        user_id: user.id,
        message: message.trim(),
        contact_info: {
          phone: senderPhone?.trim(),
          company: companyName?.trim(),
          email: senderEmail,
        },
        status: "pending",
      })
      .select()
      .single();

    if (responseError) {
      console.error("Error creating ad_response:", responseError);
      return NextResponse.json(
        { error: "Failed to save contact request" },
        { status: 500 }
      );
    }

    const senderName =
      `${senderProfile.first_name || ""} ${senderProfile.last_name || ""}`.trim() ||
      senderProfile.username ||
      "A user";

    // CREATE IN-APP NOTIFICATION
    try {
      await createNotification({
        userId: ownerId,
        type: "vehicle_inquiry",
        title: "New Vehicle Inquiry",
        message: `${senderName} is interested in your ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        link: `/listings/marketplace/vehicles/${vehicle.id}`,
      });
      console.log("Notification created successfully");
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't fail the request if notification fails
    }

    // TODO: Send email notifications (optional)
    // await sendVehicleContactEmail({ ... });

    return NextResponse.json({
      success: true,
      message: "Contact request sent successfully",
      adResponseId: adResponse.id,
    });
  } catch (error) {
    console.error("Error in vehicle contact API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
