// app/api/projects/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  sendProjectContactNotificationEmail,
  sendProjectContactConfirmationEmail,
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
        { error: "Unauthorized - Please login to apply for projects" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { projectId, message, senderPhone, companyName } = body;

    console.log("Project contact request received:", {
      projectId,
      userId: user.id,
    });

    // SECURITY: Validate required fields
    if (!projectId || !message) {
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

    // Get project record with profiles and businesses data
    const { data: projectCheck, error: checkError } = await supabase
      .from("project_ads")
      .select(
        `
        *,
        profiles:auth_id (
          username,
          first_name,
          last_name,
          email
        ),
        businesses:business_id (
          business_name,
          contact_email
        )
      `
      )
      .eq("id", projectId)
      .single();

    console.log("Project check:", { projectCheck, checkError });

    if (checkError || !projectCheck) {
      return NextResponse.json(
        {
          error: "Project listing not found",
          details: checkError?.message,
          projectId,
        },
        { status: 404 }
      );
    }

    // Get owner ID and email based on listing type
    const ownerId = projectCheck.auth_id;
    let ownerEmail: string | null = null;

    if (projectCheck.is_business_listing && projectCheck.businesses) {
      ownerEmail = projectCheck.businesses.contact_email;
    } else if (projectCheck.profiles) {
      ownerEmail = projectCheck.profiles.email;
    }

    console.log("Owner details from project:", {
      ownerId,
      ownerEmail,
      isBusinessListing: projectCheck.is_business_listing,
    });

    if (!ownerId) {
      return NextResponse.json(
        { error: "Project owner information missing" },
        { status: 404 }
      );
    }

    if (!ownerEmail) {
      return NextResponse.json(
        { error: "Project contact email missing" },
        { status: 404 }
      );
    }

    // SECURITY: Check if ad is expired (30 days)
    const postedDate = new Date(projectCheck.posted_date);
    const expiryDate = new Date(postedDate);
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
        { error: "You cannot apply to your own listing" },
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

    // Check if already applied
    const { data: existingResponse } = await supabase
      .from("ad_responses")
      .select("id")
      .eq("ad_id", projectId)
      .eq("ad_type", "project")
      .eq("user_id", user.id)
      .single();

    if (existingResponse) {
      return NextResponse.json(
        { error: "You have already applied to this project" },
        { status: 400 }
      );
    }

    // Create ad_response record
    const { data: adResponse, error: responseError } = await supabase
      .from("ad_responses")
      .insert({
        ad_id: projectId,
        ad_type: "project",
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
        { error: "Failed to save application" },
        { status: 500 }
      );
    }

    // Prepare email data
    const ownerName = projectCheck.is_business_listing
      ? projectCheck.businesses?.business_name || "there"
      : `${projectCheck.profiles?.first_name || ""} ${projectCheck.profiles?.last_name || ""}`.trim() ||
        projectCheck.profiles?.username ||
        "there";

    const senderName =
      `${senderProfile.first_name || ""} ${senderProfile.last_name || ""}`.trim() ||
      senderProfile.username ||
      "A user";

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
        type: "project_application",
        title: "New Project Application",
        message: `${senderName} is interested in your ${projectCheck.title} project`,
        link: `/listings/projects/${projectCheck.id}`,
      });
      console.log("Notification created successfully");
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }
    // END ADDED

    // Send notification email to listing owner
    try {
      await sendProjectContactNotificationEmail({
        to: ownerEmail,
        ownerName,
        projectTitle: projectCheck.title,
        projectType: projectCheck.project_type,
        projectId: projectCheck.id,
        senderName,
        senderEmail: senderEmail,
        senderPhone: senderPhone?.trim(),
        message: message.trim(),
        companyName: companyName?.trim(),
        ownerId: ownerId, // ADDED
      });

      // Send confirmation email to sender
      await sendProjectContactConfirmationEmail({
        to: senderEmail,
        senderName,
        projectTitle: projectCheck.title,
        projectType: projectCheck.project_type,
        ownerName,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json({
        success: true,
        warning: "Application saved but notification email failed to send",
        adResponseId: adResponse.id,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Application sent successfully",
      adResponseId: adResponse.id,
    });
  } catch (error) {
    console.error("Error in project contact API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
