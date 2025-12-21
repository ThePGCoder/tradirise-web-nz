"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PlantFormData } from "./plant-form-types";

interface PlantActionResult {
  success: boolean;
  error?: string;
  plantId?: string;
}

export async function createPlantAction(
  formData: PlantFormData
): Promise<PlantActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Validate required fields
    if (!formData.title?.trim()) {
      return { success: false, error: "Title is required" };
    }

    if (
      !formData.description?.trim() ||
      formData.description.trim().length < 20
    ) {
      return {
        success: false,
        error: "Description must be at least 20 characters long",
      };
    }

    if (!formData.equipment_type?.trim()) {
      return { success: false, error: "Equipment type is required" };
    }

    if (!formData.category?.trim()) {
      return { success: false, error: "Category is required" };
    }

    if (!formData.condition?.trim()) {
      return { success: false, error: "Condition is required" };
    }

    if (!formData.sale_price || formData.sale_price <= 0) {
      return { success: false, error: "Price must be greater than 0" };
    }

    if (!formData.region?.trim()) {
      return { success: false, error: "Region is required" };
    }

    if (!formData.contact_name?.trim()) {
      return { success: false, error: "Contact name is required" };
    }

    if (!formData.contact_email?.trim()) {
      return { success: false, error: "Contact email is required" };
    }

    if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    if (!formData.contact_phone?.trim()) {
      return { success: false, error: "Contact phone is required" };
    }

    // Prepare plant data - FIXED MAPPING
    const plantData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      equipment_type: formData.equipment_type.trim(),
      category: formData.category.trim(),
      make: formData.make?.trim() || null,
      model: formData.model?.trim() || null,
      year: formData.year || null,
      condition: formData.condition.trim(),
      listing_type: "sale", // ✅ REQUIRED FIELD - always "sale" since hire is removed
      sale_price: formData.sale_price, // ✅ CORRECT: use sale_price not price
      hire_rate: null, // ✅ Set to null since hire is removed
      hire_rate_type: null, // ✅ Set to null since hire is removed
      hours_used: formData.hours_used || null,
      specifications: formData.specifications || null,
      features: formData.features || [],
      delivery_available: formData.delivery_available || false,
      region: formData.region.trim(),
      images: formData.images || [],
      contact_name: formData.contact_name.trim(),
      contact_email: formData.contact_email.trim().toLowerCase(),
      contact_phone: formData.contact_phone.trim(),
      is_business_listing: formData.is_business_listing || false,
      business_id: formData.business_id || null,
      auth_id: user.id,
      status: "active",
    };

    // Insert plant listing
    const { data: insertedPlant, error: insertError } = await supabase
      .from("plant_ads")
      .insert(plantData)
      .select("id")
      .single();

    if (insertError) {
      console.error("Error creating plant listing:", insertError);

      if (insertError.code === "23505") {
        return {
          success: false,
          error: "A plant listing with these details already exists",
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
        error: "Unable to create plant listing. Please try again.",
      };
    }

    return { success: true, plantId: insertedPlant.id };
  } catch (error) {
    console.error("Unexpected error in createPlantAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function updatePlantAction(
  plantId: string,
  formData: PlantFormData
): Promise<PlantActionResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Validate required fields (same as create)
    if (!formData.title?.trim()) {
      return { success: false, error: "Title is required" };
    }

    if (
      !formData.description?.trim() ||
      formData.description.trim().length < 20
    ) {
      return {
        success: false,
        error: "Description must be at least 20 characters long",
      };
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from("plant_ads")
      .select("id, auth_id")
      .eq("id", plantId)
      .single();

    if (!existing) {
      return {
        success: false,
        error: "Plant listing not found",
      };
    }

    if (existing.auth_id !== user.id) {
      return {
        success: false,
        error: "You do not have permission to edit this listing",
      };
    }

    // Prepare plant data - FIXED MAPPING
    const plantData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      equipment_type: formData.equipment_type.trim(),
      category: formData.category.trim(),
      make: formData.make?.trim() || null,
      model: formData.model?.trim() || null,
      year: formData.year || null,
      condition: formData.condition.trim(),
      listing_type: "sale", // ✅ REQUIRED FIELD
      sale_price: formData.sale_price, // ✅ CORRECT: use sale_price
      hire_rate: null, // ✅ Set to null
      hire_rate_type: null, // ✅ Set to null
      hours_used: formData.hours_used || null,
      specifications: formData.specifications || null,
      features: formData.features || [],
      delivery_available: formData.delivery_available || false,
      region: formData.region.trim(),
      images: formData.images || [],
      contact_name: formData.contact_name.trim(),
      contact_email: formData.contact_email.trim().toLowerCase(),
      contact_phone: formData.contact_phone.trim(),
      is_business_listing: formData.is_business_listing || false,
      business_id: formData.business_id || null,
      updated_at: new Date().toISOString(),
    };

    // Update plant listing
    const { error: updateError } = await supabase
      .from("plant_ads")
      .update(plantData)
      .eq("id", plantId)
      .eq("auth_id", user.id);

    if (updateError) {
      console.error("Error updating plant listing:", updateError);

      if (updateError.code === "23502") {
        return {
          success: false,
          error: "Required information is missing. Please check all fields.",
        };
      }

      return {
        success: false,
        error: "Unable to update plant listing. Please try again.",
      };
    }

    return { success: true, plantId };
  } catch (error) {
    console.error("Unexpected error in updatePlantAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
