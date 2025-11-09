"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PersonnelFormData } from "./personnel-form-types";

interface PersonnelActionResult {
  success: boolean;
  error?: string;
}

// Helper function to convert skill objects to formatted strings
function formatSkills(
  skills: Array<{ trade: string; skill: string }>
): string[] {
  return skills
    .filter((skill) => skill && skill.trade && skill.skill)
    .map((skill) => `${skill.trade}: ${skill.skill}`);
}

// Helper function to convert accreditation objects to formatted strings
function formatAccreditations(
  accreditations: Array<{ category: string; accreditation: string }>
): string[] {
  return accreditations
    .filter((acc) => acc && acc.category && acc.accreditation)
    .map((acc) => `${acc.category}: ${acc.accreditation}`);
}

export async function createPersonnelAction(
  formData: PersonnelFormData
): Promise<PersonnelActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Validate required fields
    if (!formData.first_name?.trim()) {
      return { success: false, error: "First name is required" };
    }

    if (!formData.last_name?.trim()) {
      return { success: false, error: "Last name is required" };
    }

    if (!formData.contact_email?.trim()) {
      return { success: false, error: "Contact email is required" };
    }

    if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    if (!formData.mobile?.trim()) {
      return { success: false, error: "Mobile number is required" };
    }

    if (!formData.primary_trade_role?.trim()) {
      return { success: false, error: "Primary trade role is required" };
    }

    if (!formData.bio?.trim() || formData.bio.trim().length < 20) {
      return {
        success: false,
        error: "Bio must be at least 20 characters long",
      };
    }

    if (!formData.region?.trim()) {
      return { success: false, error: "Region is required" };
    }

    if (!formData.available_from?.trim()) {
      return { success: false, error: "Availability date is required" };
    }

    if (!Array.isArray(formData.skills) || formData.skills.length === 0) {
      return { success: false, error: "At least one skill is required" };
    }

    if (formData.max_servicable_radius <= 0) {
      return { success: false, error: "Service radius must be greater than 0" };
    }

    // Check for existing personnel listing for this user
    const { data: existing } = await supabase
      .from("personnel_ads")
      .select("id")
      .eq("auth_id", user.id)
      .eq("first_name", formData.first_name.trim())
      .eq("last_name", formData.last_name.trim())
      .single();

    if (existing) {
      return {
        success: false,
        error: "You already have a personnel listing with this name",
      };
    }

    // Combine suburb and city into region string
    let regionString = formData.region.trim();
    if (formData.suburb?.trim() && formData.city?.trim()) {
      regionString = `${formData.suburb.trim()}, ${formData.city.trim()}`;
    } else if (formData.city?.trim()) {
      regionString = formData.city.trim();
    } else if (formData.suburb?.trim()) {
      regionString = formData.suburb.trim();
    }

    // Convert skills and accreditations to formatted strings
    // Instead of storing: [{"trade":"Plumber","skill":"Drainage"}]
    // Store as: ["Plumber: Drainage"]
    const formattedSkills = formatSkills(formData.skills);
    const formattedAccreditations = formatAccreditations(
      formData.accreditations
    );

    // Prepare personnel data
    const personnelData = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      bio: formData.bio.trim(),
      contact_email: formData.contact_email.trim().toLowerCase(),
      mobile: formData.mobile.trim(),
      website: formData.website?.trim() || null,
      region: regionString,
      primary_trade_role: formData.primary_trade_role.trim(),
      secondary_trade_roles: formData.secondary_trade_roles.filter(
        (role) => role && role.trim()
      ),
      max_servicable_radius: formData.max_servicable_radius,
      skills: formattedSkills, // Now storing as ["Plumber: Drainage"]
      accreditations: formattedAccreditations, // Now storing as ["Electrical: Registered Electrician"]
      available_from: formData.available_from,
      is_for_self: formData.is_for_self,
      posted_by_name: formData.posted_by_name.trim(),
      auth_id: user.id,
    };

    // Insert personnel listing
    const { error: insertError } = await supabase
      .from("personnel_ads")
      .insert(personnelData);

    if (insertError) {
      console.error("Error creating personnel listing:", insertError);

      if (insertError.code === "23505") {
        return {
          success: false,
          error: "A personnel listing with these details already exists",
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
        error: "Unable to create personnel listing. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in createPersonnelAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function updatePersonnelAction(
  personnelId: string,
  formData: PersonnelFormData
): Promise<PersonnelActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Validate required fields
    if (!formData.first_name?.trim()) {
      return { success: false, error: "First name is required" };
    }

    if (!formData.last_name?.trim()) {
      return { success: false, error: "Last name is required" };
    }

    if (!formData.contact_email?.trim()) {
      return { success: false, error: "Contact email is required" };
    }

    if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    if (!formData.mobile?.trim()) {
      return { success: false, error: "Mobile number is required" };
    }

    if (!formData.primary_trade_role?.trim()) {
      return { success: false, error: "Primary trade role is required" };
    }

    if (!formData.bio?.trim() || formData.bio.trim().length < 20) {
      return {
        success: false,
        error: "Bio must be at least 20 characters long",
      };
    }

    if (!formData.region?.trim()) {
      return { success: false, error: "Region is required" };
    }

    if (!formData.available_from?.trim()) {
      return { success: false, error: "Availability date is required" };
    }

    if (!Array.isArray(formData.skills) || formData.skills.length === 0) {
      return { success: false, error: "At least one skill is required" };
    }

    if (formData.max_servicable_radius <= 0) {
      return { success: false, error: "Service radius must be greater than 0" };
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from("personnel_ads")
      .select("id, auth_id")
      .eq("id", personnelId)
      .single();

    if (!existing) {
      return {
        success: false,
        error: "Personnel listing not found",
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
    } else if (formData.suburb?.trim()) {
      regionString = formData.suburb.trim();
    }

    // Convert skills and accreditations to formatted strings
    const formattedSkills = formatSkills(formData.skills);
    const formattedAccreditations = formatAccreditations(
      formData.accreditations
    );

    // Prepare personnel data
    const personnelData = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      bio: formData.bio.trim(),
      contact_email: formData.contact_email.trim().toLowerCase(),
      mobile: formData.mobile.trim(),
      website: formData.website?.trim() || null,
      region: regionString,
      primary_trade_role: formData.primary_trade_role.trim(),
      secondary_trade_roles: formData.secondary_trade_roles.filter(
        (role) => role && role.trim()
      ),
      max_servicable_radius: formData.max_servicable_radius,
      skills: formattedSkills, // Now storing as ["Plumber: Drainage"]
      accreditations: formattedAccreditations, // Now storing as ["Electrical: Registered Electrician"]
      available_from: formData.available_from,
      is_for_self: formData.is_for_self,
      posted_by_name: formData.posted_by_name.trim(),
      updated_at: new Date().toISOString(),
    };

    // Update personnel listing
    const { error: updateError } = await supabase
      .from("personnel_ads")
      .update(personnelData)
      .eq("id", personnelId)
      .eq("auth_id", user.id);

    if (updateError) {
      console.error("Error updating personnel listing:", updateError);

      if (updateError.code === "23502") {
        return {
          success: false,
          error: "Required information is missing. Please check all fields.",
        };
      }

      return {
        success: false,
        error: "Unable to update personnel listing. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in updatePersonnelAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
