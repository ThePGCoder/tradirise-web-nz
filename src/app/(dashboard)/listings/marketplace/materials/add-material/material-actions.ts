"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { MaterialFormData } from "../material-form-types";

interface MaterialActionResult {
  success: boolean;
  error?: string;
  materialId?: string;
}

export async function createMaterialAction(
  formData: MaterialFormData
): Promise<MaterialActionResult> {
  try {
    console.log("=== CREATE MATERIAL ACTION START ===");
    console.log("Form data received:", {
      title: formData.title,
      material_type: formData.material_type,
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      price: formData.price,
      region: formData.region,
      images: formData.images?.length || 0,
    });

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No user found, redirecting to login");
      redirect("/login");
    }

    console.log("User authenticated:", user.id);

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

    if (!formData.material_type?.trim()) {
      return { success: false, error: "Material type is required" };
    }

    if (!formData.category?.trim()) {
      return { success: false, error: "Category is required" };
    }

    if (!formData.condition?.trim()) {
      return { success: false, error: "Condition is required" };
    }

    if (!formData.quantity || formData.quantity <= 0) {
      return { success: false, error: "Quantity must be greater than 0" };
    }

    if (!formData.unit?.trim()) {
      return { success: false, error: "Unit is required" };
    }

    if (!formData.price || formData.price <= 0) {
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

    console.log("All validations passed");

    // Prepare material data
    const materialData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      material_type: formData.material_type.trim(),
      category: formData.category.trim(),
      condition: formData.condition.trim(),
      quantity: formData.quantity,
      unit: formData.unit.trim(),
      price: formData.price,
      price_type: formData.price_type?.trim() || "fixed",
      price_unit: formData.price_unit?.trim() || null,
      grade_quality: formData.grade_quality?.trim() || null,
      dimensions: formData.dimensions?.trim() || null,
      brand: formData.brand?.trim() || null,
      specifications: formData.specifications || null,
      delivery_available: formData.delivery_available || false,
      delivery_cost: formData.delivery_cost?.trim() || null,
      minimum_order: formData.minimum_order?.trim() || null,
      available_quantity: formData.available_quantity || null,
      location_details: formData.location_details?.trim() || null,
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

    console.log("Material data prepared:", {
      ...materialData,
      description: materialData.description.substring(0, 50) + "...",
    });

    // Insert material listing
    console.log("Attempting to insert into materials_ads table...");
    const { data: insertedMaterial, error: insertError } = await supabase
      .from("materials_ads")
      .insert(materialData)
      .select("id")
      .single();

    if (insertError) {
      console.error("=== DATABASE INSERT ERROR ===");
      console.error("Error code:", insertError.code);
      console.error("Error message:", insertError.message);
      console.error("Error details:", insertError.details);
      console.error("Error hint:", insertError.hint);
      console.error("Full error object:", JSON.stringify(insertError, null, 2));

      if (insertError.code === "23505") {
        return {
          success: false,
          error: "A material listing with these details already exists",
        };
      }

      if (insertError.code === "23502") {
        return {
          success: false,
          error: `Required information is missing: ${insertError.message}`,
        };
      }

      if (insertError.code === "42703") {
        return {
          success: false,
          error: `Database column error: ${insertError.message}. Please contact support.`,
        };
      }

      return {
        success: false,
        error: `Unable to create material listing: ${insertError.message || "Unknown error"}`,
      };
    }

    console.log("Material inserted successfully:", insertedMaterial?.id);
    console.log("=== CREATE MATERIAL ACTION END ===");

    return { success: true, materialId: insertedMaterial.id };
  } catch (error) {
    console.error("=== UNEXPECTED ERROR IN CREATE MATERIAL ACTION ===");
    console.error("Error type:", typeof error);
    console.error("Error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "N/A");

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
    };
  }
}

export async function updateMaterialAction(
  materialId: string,
  formData: MaterialFormData
): Promise<MaterialActionResult> {
  try {
    console.log("=== UPDATE MATERIAL ACTION START ===");
    console.log("Material ID:", materialId);

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
      .from("materials_ads")
      .select("id, auth_id")
      .eq("id", materialId)
      .single();

    if (!existing) {
      return {
        success: false,
        error: "Material listing not found",
      };
    }

    if (existing.auth_id !== user.id) {
      return {
        success: false,
        error: "You do not have permission to edit this listing",
      };
    }

    // Prepare material data
    const materialData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      material_type: formData.material_type.trim(),
      category: formData.category.trim(),
      condition: formData.condition.trim(),
      quantity: formData.quantity,
      unit: formData.unit.trim(),
      price: formData.price,
      price_type: formData.price_type?.trim() || "fixed",
      price_unit: formData.price_unit?.trim() || null,
      grade_quality: formData.grade_quality?.trim() || null,
      dimensions: formData.dimensions?.trim() || null,
      brand: formData.brand?.trim() || null,
      specifications: formData.specifications || null,
      delivery_available: formData.delivery_available || false,
      delivery_cost: formData.delivery_cost?.trim() || null,
      minimum_order: formData.minimum_order?.trim() || null,
      available_quantity: formData.available_quantity || null,
      location_details: formData.location_details?.trim() || null,
      region: formData.region.trim(),
      images: formData.images || [],
      contact_name: formData.contact_name.trim(),
      contact_email: formData.contact_email.trim().toLowerCase(),
      contact_phone: formData.contact_phone.trim(),
      is_business_listing: formData.is_business_listing || false,
      business_id: formData.business_id || null,
      updated_at: new Date().toISOString(),
    };

    console.log("Attempting to update material...");

    // Update material listing
    const { error: updateError } = await supabase
      .from("materials_ads")
      .update(materialData)
      .eq("id", materialId)
      .eq("auth_id", user.id);

    if (updateError) {
      console.error("=== DATABASE UPDATE ERROR ===");
      console.error("Error code:", updateError.code);
      console.error("Error message:", updateError.message);
      console.error("Full error:", JSON.stringify(updateError, null, 2));

      if (updateError.code === "23502") {
        return {
          success: false,
          error: `Required information is missing: ${updateError.message}`,
        };
      }

      return {
        success: false,
        error: `Unable to update material listing: ${updateError.message || "Unknown error"}`,
      };
    }

    console.log("Material updated successfully");
    console.log("=== UPDATE MATERIAL ACTION END ===");

    return { success: true, materialId };
  } catch (error) {
    console.error("=== UNEXPECTED ERROR IN UPDATE MATERIAL ACTION ===");
    console.error("Error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
    };
  }
}
