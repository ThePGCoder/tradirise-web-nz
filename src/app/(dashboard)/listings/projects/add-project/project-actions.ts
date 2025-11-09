// src/app/listings/projects/add-project/project-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProjectFormData } from "./project-form-types";

interface ProjectActionResult {
  success: boolean;
  error?: string;
}

export async function createProjectAction(
  formData: ProjectFormData
): Promise<ProjectActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Validate required fields
    if (!formData.title?.trim() || formData.title.trim().length < 3) {
      return { success: false, error: "Title must be at least 3 characters" };
    }

    if (!formData.required_trades || formData.required_trades.length === 0) {
      return { success: false, error: "At least one trade is required" };
    }

    if (
      !formData.description?.trim() ||
      formData.description.trim().length < 10
    ) {
      return {
        success: false,
        error: "Description must be at least 10 characters",
      };
    }

    if (!formData.region?.trim()) {
      return { success: false, error: "Region is required" };
    }

    if (!formData.city?.trim()) {
      return { success: false, error: "City is required" };
    }

    if (!formData.project_type?.trim()) {
      return { success: false, error: "Project type is required" };
    }

    if (!formData.budget_type) {
      return { success: false, error: "Budget type is required" };
    }

    if (!formData.proposed_start_date) {
      return { success: false, error: "Start date is required" };
    }

    if (!formData.project_duration) {
      return { success: false, error: "Project duration is required" };
    }

    if (!formData.contact_email?.trim()) {
      return { success: false, error: "Contact email is required" };
    }

    if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    if (!formData.company_name?.trim()) {
      return { success: false, error: "Company name is required" };
    }

    // Format price range based on budget type
    let priceRangeValue = formData.price_range;
    if (
      formData.budget_type === "range" &&
      formData.budget_min &&
      formData.budget_max
    ) {
      priceRangeValue = `$${formData.budget_min} - $${formData.budget_max}`;
    } else if (formData.budget_type === "fixed" && formData.price_range) {
      priceRangeValue = `$${formData.price_range}`;
    } else if (formData.budget_type === "hourly" && formData.price_range) {
      priceRangeValue = `$${formData.price_range}/hour`;
    } else if (formData.budget_type === "per_trade" && formData.price_range) {
      priceRangeValue = formData.price_range.includes("per")
        ? formData.price_range
        : `$${formData.price_range} per trade`;
    }

    // Combine suburb and city into region string
    let regionString = formData.region.trim();
    if (formData.suburb?.trim() && formData.city?.trim()) {
      regionString = `${formData.suburb.trim()}, ${formData.city.trim()}`;
    } else if (formData.city?.trim()) {
      regionString = formData.city.trim();
    }

    // Prepare project data
    const projectData = {
      title: formData.title.trim(),
      required_trades: formData.required_trades.filter((t) => t && t.trim()),
      description: formData.description.trim(),
      region: regionString,
      price_range: priceRangeValue,
      project_type: formData.project_type.trim(),
      project_duration: formData.project_duration,
      proposed_start_date: formData.proposed_start_date,
      materials_provided: formData.materials_provided.filter(
        (m) => m && m.trim()
      ),
      contact_email: formData.contact_email.trim().toLowerCase(),
      contact_phone: formData.contact_phone?.trim() || null,
      company_name: formData.company_name.trim(),
      posted_by: formData.posted_by.trim(),
      is_business_listing: formData.is_business_listing,
      business_id: formData.business_id || null,
      auth_id: user.id,
      posted_date: new Date().toISOString(),
      status: "active",
    };

    // Insert project listing
    const { error: insertError } = await supabase
      .from("project_ads")
      .insert(projectData);

    if (insertError) {
      console.error("Error creating project listing:", insertError);

      if (insertError.code === "23505") {
        return {
          success: false,
          error: "A project listing with these details already exists",
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
        error: "Unable to create project listing. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in createProjectAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
// Add this function to your project-actions.ts file

export async function updateProjectAction(
  projectId: string,
  formData: ProjectFormData
): Promise<ProjectActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Validate required fields
    if (!formData.title?.trim() || formData.title.trim().length < 3) {
      return { success: false, error: "Title must be at least 3 characters" };
    }

    if (!formData.required_trades || formData.required_trades.length === 0) {
      return { success: false, error: "At least one trade is required" };
    }

    if (
      !formData.description?.trim() ||
      formData.description.trim().length < 10
    ) {
      return {
        success: false,
        error: "Description must be at least 10 characters",
      };
    }

    if (!formData.region?.trim()) {
      return { success: false, error: "Region is required" };
    }

    if (!formData.city?.trim()) {
      return { success: false, error: "City is required" };
    }

    if (!formData.project_type?.trim()) {
      return { success: false, error: "Project type is required" };
    }

    if (!formData.budget_type) {
      return { success: false, error: "Budget type is required" };
    }

    if (!formData.proposed_start_date) {
      return { success: false, error: "Start date is required" };
    }

    if (!formData.project_duration) {
      return { success: false, error: "Project duration is required" };
    }

    if (!formData.contact_email?.trim()) {
      return { success: false, error: "Contact email is required" };
    }

    if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    if (!formData.company_name?.trim()) {
      return { success: false, error: "Company name is required" };
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from("project_ads")
      .select("id, auth_id")
      .eq("id", projectId)
      .single();

    if (!existing) {
      return {
        success: false,
        error: "Project listing not found",
      };
    }

    if (existing.auth_id !== user.id) {
      return {
        success: false,
        error: "You do not have permission to edit this listing",
      };
    }

    // Format price range based on budget type
    let priceRangeValue = formData.price_range;
    if (
      formData.budget_type === "range" &&
      formData.budget_min &&
      formData.budget_max
    ) {
      priceRangeValue = `$${formData.budget_min} - $${formData.budget_max}`;
    } else if (formData.budget_type === "fixed" && formData.price_range) {
      priceRangeValue = `$${formData.price_range}`;
    } else if (formData.budget_type === "hourly" && formData.price_range) {
      priceRangeValue = `$${formData.price_range}/hour`;
    } else if (formData.budget_type === "per_trade" && formData.price_range) {
      priceRangeValue = formData.price_range.includes("per")
        ? formData.price_range
        : `$${formData.price_range} per trade`;
    }

    // Combine suburb and city into region string
    let regionString = formData.region.trim();
    if (formData.suburb?.trim() && formData.city?.trim()) {
      regionString = `${formData.suburb.trim()}, ${formData.city.trim()}`;
    } else if (formData.city?.trim()) {
      regionString = formData.city.trim();
    }

    // Prepare project data
    const projectData = {
      title: formData.title.trim(),
      required_trades: formData.required_trades.filter((t) => t && t.trim()),
      description: formData.description.trim(),
      region: regionString,
      price_range: priceRangeValue,
      project_type: formData.project_type.trim(),
      project_duration: formData.project_duration,
      proposed_start_date: formData.proposed_start_date,
      materials_provided: formData.materials_provided.filter(
        (m) => m && m.trim()
      ),
      contact_email: formData.contact_email.trim().toLowerCase(),
      contact_phone: formData.contact_phone?.trim() || null,
      company_name: formData.company_name.trim(),
      posted_by: formData.posted_by.trim(),
      is_business_listing: formData.is_business_listing,
      business_id: formData.business_id || null,
      updated_at: new Date().toISOString(),
    };

    // Update project listing
    const { error: updateError } = await supabase
      .from("project_ads")
      .update(projectData)
      .eq("id", projectId)
      .eq("auth_id", user.id);

    if (updateError) {
      console.error("Error updating project listing:", updateError);

      if (updateError.code === "23502") {
        return {
          success: false,
          error: "Required information is missing. Please check all fields.",
        };
      }

      return {
        success: false,
        error: "Unable to update project listing. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in updateProjectAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
