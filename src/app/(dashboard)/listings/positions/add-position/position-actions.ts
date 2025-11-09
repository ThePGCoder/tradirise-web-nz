// src/app/listings/positions/add-position/position-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PositionFormData } from "./position-form-types";

interface PositionActionResult {
  success: boolean;
  error?: string;
}

export async function createPositionAction(
  formData: PositionFormData
): Promise<PositionActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Validate required fields
    if (!formData.title?.trim() || formData.title.trim().length < 5) {
      return { success: false, error: "Title must be at least 5 characters" };
    }

    if (!formData.trade?.trim()) {
      return { success: false, error: "Trade category is required" };
    }

    if (
      !formData.description?.trim() ||
      formData.description.trim().length < 50
    ) {
      return {
        success: false,
        error: "Description must be at least 50 characters",
      };
    }

    if (!formData.contact_email?.trim()) {
      return { success: false, error: "Contact email is required" };
    }

    if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    if (!formData.region?.trim()) {
      return { success: false, error: "Region is required" };
    }

    if (!formData.city?.trim()) {
      return { success: false, error: "City is required" };
    }

    if (!formData.rate?.trim()) {
      return { success: false, error: "Rate is required" };
    }

    if (!formData.remuneration) {
      return { success: false, error: "Remuneration type is required" };
    }

    if (!formData.start_date?.trim()) {
      return { success: false, error: "Start date is required" };
    }

    if (
      !Array.isArray(formData.requirements) ||
      formData.requirements.length === 0
    ) {
      return { success: false, error: "At least one requirement is needed" };
    }

    // Combine suburb and city into region string
    let regionString = formData.region.trim();
    if (formData.suburb?.trim() && formData.city?.trim()) {
      regionString = `${formData.suburb.trim()}, ${formData.city.trim()}`;
    } else if (formData.city?.trim()) {
      regionString = formData.city.trim();
    }

    // Prepare position data
    const positionData = {
      title: formData.title.trim(),
      trade: formData.trade.trim(),
      description: formData.description.trim(),
      region: regionString,
      rate: formData.rate.trim(),
      rate_type: formData.rate_type || null,
      remuneration: formData.remuneration,
      start_date: formData.start_date,
      good_to_have: formData.good_to_have.filter((item) => item && item.trim()),
      requirements: formData.requirements.filter((item) => item && item.trim()),
      benefits: formData.benefits.filter((item) => item && item.trim()),
      website: formData.website?.trim() || null,
      contact_email: formData.contact_email.trim().toLowerCase(),
      contact_phone: formData.contact_phone?.trim() || null,
      posted_by: formData.posted_by.trim(),
      is_business_listing: formData.is_business_listing,
      business_id: formData.business_id || null,
      auth_id: user.id,
      status: "active",
      views: 0,
      applications: 0,
    };

    // Insert position listing
    const { error: insertError } = await supabase
      .from("position_ads")
      .insert(positionData);

    if (insertError) {
      console.error("Error creating position listing:", insertError);

      if (insertError.code === "23505") {
        return {
          success: false,
          error: "A position listing with these details already exists",
        };
      }

      if (insertError.code === "23502") {
        return {
          success: false,
          error: "Required information is missing. Please check all fields.",
        };
      }

      return {
        success: false,
        error: "Unable to create position listing. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in createPositionAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Add this function to your position-actions.ts file

export async function updatePositionAction(
  positionId: string,
  formData: PositionFormData
): Promise<PositionActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Validate required fields
    if (!formData.title?.trim() || formData.title.trim().length < 5) {
      return { success: false, error: "Title must be at least 5 characters" };
    }

    if (!formData.trade?.trim()) {
      return { success: false, error: "Trade category is required" };
    }

    if (
      !formData.description?.trim() ||
      formData.description.trim().length < 50
    ) {
      return {
        success: false,
        error: "Description must be at least 50 characters",
      };
    }

    if (!formData.contact_email?.trim()) {
      return { success: false, error: "Contact email is required" };
    }

    if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    if (!formData.region?.trim()) {
      return { success: false, error: "Region is required" };
    }

    if (!formData.city?.trim()) {
      return { success: false, error: "City is required" };
    }

    if (!formData.rate?.trim()) {
      return { success: false, error: "Rate is required" };
    }

    if (!formData.remuneration) {
      return { success: false, error: "Remuneration type is required" };
    }

    if (!formData.start_date?.trim()) {
      return { success: false, error: "Start date is required" };
    }

    if (
      !Array.isArray(formData.requirements) ||
      formData.requirements.length === 0
    ) {
      return { success: false, error: "At least one requirement is needed" };
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from("position_ads")
      .select("id, auth_id")
      .eq("id", positionId)
      .single();

    if (!existing) {
      return {
        success: false,
        error: "Position listing not found",
      };
    }

    if (existing.auth_id !== user.id) {
      return {
        success: false,
        error: "You do not have permission to edit this listing",
      };
    }

    // Combine suburb and city into region string
    let regionString = formData.region.trim();
    if (formData.suburb?.trim() && formData.city?.trim()) {
      regionString = `${formData.suburb.trim()}, ${formData.city.trim()}`;
    } else if (formData.city?.trim()) {
      regionString = formData.city.trim();
    }

    // Prepare position data
    const positionData = {
      title: formData.title.trim(),
      trade: formData.trade.trim(),
      description: formData.description.trim(),
      region: regionString,
      rate: formData.rate.trim(),
      rate_type: formData.rate_type || null,
      remuneration: formData.remuneration,
      start_date: formData.start_date,
      good_to_have: formData.good_to_have.filter((item) => item && item.trim()),
      requirements: formData.requirements.filter((item) => item && item.trim()),
      benefits: formData.benefits.filter((item) => item && item.trim()),
      website: formData.website?.trim() || null,
      contact_email: formData.contact_email.trim().toLowerCase(),
      contact_phone: formData.contact_phone?.trim() || null,
      posted_by: formData.posted_by.trim(),
      is_business_listing: formData.is_business_listing,
      business_id: formData.business_id || null,
      updated_at: new Date().toISOString(),
    };

    // Update position listing
    const { error: updateError } = await supabase
      .from("position_ads")
      .update(positionData)
      .eq("id", positionId)
      .eq("auth_id", user.id);

    if (updateError) {
      console.error("Error updating position listing:", updateError);

      if (updateError.code === "23502") {
        return {
          success: false,
          error: "Required information is missing. Please check all fields.",
        };
      }

      return {
        success: false,
        error: "Unable to update position listing. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in updatePositionAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
