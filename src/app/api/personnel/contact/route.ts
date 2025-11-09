// app/api/personnel/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  sendPersonnelContactConfirmationEmail,
  sendPersonnelContactNotificationEmail,
} from "@/lib/emailService";
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
        { error: "Unauthorized - Please login to contact personnel" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { personnelId, message, senderPhone, companyName } = body;

    console.log("Contact request received:", { personnelId, userId: user.id });

    // SECURITY: Validate required fields
    if (!personnelId || !message) {
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

    // Get personnel record
    const { data: personnelCheck, error: checkError } = await supabase
      .from("personnel_ads")
      .select("*")
      .eq("id", personnelId)
      .single();

    console.log("Personnel check:", { personnelCheck, checkError });

    if (checkError || !personnelCheck) {
      return NextResponse.json(
        {
          error: "Personnel listing not found",
          details: checkError?.message,
          personnelId,
        },
        { status: 404 }
      );
    }

    // Get owner ID and email directly from personnel record
    const ownerId = personnelCheck.auth_id;
    const ownerEmail = personnelCheck.contact_email;

    console.log("Owner details from personnel:", { ownerId, ownerEmail });

    if (!ownerId) {
      return NextResponse.json(
        { error: "Personnel owner information missing" },
        { status: 404 }
      );
    }

    if (!ownerEmail) {
      return NextResponse.json(
        { error: "Personnel contact email missing" },
        { status: 404 }
      );
    }

    // SECURITY: Check if ad is expired (30 days)
    const createdAt = new Date(personnelCheck.created_at);
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

    // Get sender email from auth
    const senderEmail = user.email;
    if (!senderEmail) {
      return NextResponse.json(
        { error: "Your email not found" },
        { status: 404 }
      );
    }

    // Check if already contacted (use user_id to match your table)
    const { data: existingResponse } = await supabase
      .from("ad_responses")
      .select("id")
      .eq("ad_id", personnelId)
      .eq("ad_type", "personnel")
      .eq("user_id", user.id)
      .single();

    if (existingResponse) {
      return NextResponse.json(
        { error: "You have already contacted this listing" },
        { status: 400 }
      );
    }

    // Create ad_response record (matches your existing table structure)
    const { data: adResponse, error: responseError } = await supabase
      .from("ad_responses")
      .insert({
        ad_id: personnelId,
        ad_type: "personnel",
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

    // Prepare email data using personnel record data
    const ownerName =
      `${personnelCheck.first_name || ""} ${personnelCheck.last_name || ""}`.trim() ||
      "there";
    const senderName =
      `${senderProfile.first_name || ""} ${senderProfile.last_name || ""}`.trim() ||
      senderProfile.username ||
      "A user";
    const personnelName =
      `${personnelCheck.first_name || ""} ${personnelCheck.last_name || ""}`.trim() ||
      personnelCheck.primary_trade_role;

    console.log("Email details:", {
      ownerName,
      ownerEmail,
      senderName,
      senderEmail,
    });

    // ADDED: Create in-app notification
    try {
      await createNotification({
        userId: ownerId,
        type: "personnel_contact",
        title: "New Contact Request",
        message: `${senderName} is interested in your ${personnelCheck.primary_trade_role || "Personnel"} listing`,
        link: `/personnel/${personnelCheck.id}`,
      });
      console.log("Notification created successfully");
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }
    // END ADDED

    // Send notification email to listing owner
    try {
      await sendPersonnelContactNotificationEmail({
        to: ownerEmail,
        ownerName,
        personnelRole: personnelCheck.primary_trade_role || "Personnel",
        personnelId: personnelCheck.id,
        senderName,
        senderEmail: senderEmail,
        senderPhone: senderPhone?.trim(),
        message: message.trim(),
        companyName: companyName?.trim(),
        ownerId: ownerId, // ADDED
      });

      // Send confirmation email to sender
      await sendPersonnelContactConfirmationEmail({
        to: senderEmail,
        senderName,
        personnelRole: personnelCheck.primary_trade_role || "Personnel",
        ownerName: personnelName,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json({
        success: true,
        warning: "Contact saved but notification email failed to send",
        adResponseId: adResponse.id,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Contact request sent successfully",
      adResponseId: adResponse.id,
    });
  } catch (error) {
    console.error("Error in contact API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
