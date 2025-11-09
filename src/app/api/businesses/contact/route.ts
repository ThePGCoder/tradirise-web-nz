// app/api/businesses/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  sendBusinessContactNotificationEmail,
  sendBusinessContactConfirmationEmail,
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
        { error: "Unauthorized - Please login to contact businesses" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { businessId, message, senderPhone, companyName } = body;

    console.log("Business contact request received:", {
      businessId,
      userId: user.id,
    });

    // SECURITY: Validate required fields
    if (!businessId || !message) {
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

    // Get business record
    const { data: businessCheck, error: checkError } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();

    console.log("Business check:", { businessCheck, checkError });

    if (checkError || !businessCheck) {
      return NextResponse.json(
        {
          error: "Business not found",
          details: checkError?.message,
          businessId,
        },
        { status: 404 }
      );
    }

    const businessEmail = businessCheck.contact_email;

    if (!businessEmail) {
      return NextResponse.json(
        { error: "Business contact email missing" },
        { status: 404 }
      );
    }

    // SECURITY: Prevent self-contact (if business owner)
    if (businessCheck.user_id === user.id) {
      return NextResponse.json(
        { error: "You cannot contact your own business" },
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

    // Check if already contacted recently (within last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const { data: recentContact } = await supabase
      .from("business_inquiries")
      .select("id")
      .eq("business_id", businessId)
      .eq("user_id", user.id)
      .gte("created_at", oneDayAgo.toISOString())
      .single();

    if (recentContact) {
      return NextResponse.json(
        {
          error:
            "You have already contacted this business recently. Please wait 24 hours before contacting again.",
        },
        { status: 400 }
      );
    }

    // Create business_inquiry record
    const { data: inquiry, error: inquiryError } = await supabase
      .from("business_inquiries")
      .insert({
        business_id: businessId,
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

    if (inquiryError) {
      console.error("Error creating business_inquiry:", inquiryError);
      return NextResponse.json(
        { error: "Failed to save inquiry" },
        { status: 500 }
      );
    }

    // Prepare email data
    const senderName =
      `${senderProfile.first_name || ""} ${senderProfile.last_name || ""}`.trim() ||
      senderProfile.username ||
      "A user";

    console.log("Email details:", {
      businessName: businessCheck.business_name,
      businessEmail,
      senderName,
      senderEmail,
    });

    // ADDED: Create in-app notification for business owner
    try {
      // Debug: Check what fields are available
      console.log("Business record fields:", Object.keys(businessCheck));
      console.log("Business user_id:", businessCheck.user_id);
      console.log("Business auth_id:", businessCheck.auth_id);

      // Use auth_id instead of user_id (common pattern in your other tables)
      const businessOwnerId = businessCheck.auth_id || businessCheck.user_id;

      if (!businessOwnerId) {
        console.error("No owner ID found for business:", businessCheck.id);
        throw new Error("Business owner ID not found");
      }

      await createNotification({
        userId: businessOwnerId,
        type: "business_inquiry",
        title: "New Business Inquiry",
        message: `${senderName} sent you a message about ${businessCheck.business_name}`,
        link: `/businesses/${businessCheck.id}`,
      });
      console.log(
        "Notification created successfully for user:",
        businessOwnerId
      );
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't fail the request if notification fails
    }
    // END ADDED

    // Send notification email to business
    try {
      const businessOwnerId = businessCheck.auth_id || businessCheck.user_id;

      await sendBusinessContactNotificationEmail({
        to: businessEmail,
        businessName: businessCheck.business_name,
        businessType: businessCheck.business_type,
        businessId: businessCheck.id,
        senderName,
        senderEmail: senderEmail,
        senderPhone: senderPhone?.trim(),
        message: message.trim(),
        companyName: companyName?.trim(),
        ownerId: businessOwnerId, // ADDED: Pass ownerId for email notification check
      });

      // Send confirmation email to sender
      await sendBusinessContactConfirmationEmail({
        to: senderEmail,
        senderName,
        businessName: businessCheck.business_name,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json({
        success: true,
        warning: "Inquiry saved but notification email failed to send",
        inquiryId: inquiry.id,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      inquiryId: inquiry.id,
    });
  } catch (error) {
    console.error("Error in business contact API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
