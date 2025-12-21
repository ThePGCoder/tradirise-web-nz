"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { VehicleFormData } from "./vehicle-form-types";

interface VehicleActionResult {
  success: boolean;
  error?: string;
  vehicleId?: string;
}

export async function createVehicleAction(
  formData: VehicleFormData
): Promise<VehicleActionResult> {
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

    if (!formData.vehicle_type?.trim()) {
      return { success: false, error: "Vehicle type is required" };
    }

    if (!formData.make?.trim()) {
      return { success: false, error: "Make is required" };
    }

    if (!formData.model?.trim()) {
      return { success: false, error: "Model is required" };
    }

    if (
      !formData.year ||
      formData.year < 1900 ||
      formData.year > new Date().getFullYear() + 1
    ) {
      return { success: false, error: "Please enter a valid year" };
    }

    if (!formData.condition?.trim()) {
      return { success: false, error: "Condition is required" };
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

    // Prepare vehicle data
    const vehicleData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      vehicle_type: formData.vehicle_type.trim(),
      make: formData.make.trim(),
      model: formData.model.trim(),
      year: formData.year,
      condition: formData.condition.trim(),
      price: formData.price,
      price_type: formData.price_type || "fixed",
      mileage: formData.mileage || null,
      registration_expires: formData.registration_expires || null,
      wof_expires: formData.wof_expires || null,
      transmission: formData.transmission || null,
      fuel_type: formData.fuel_type || null,
      features: formData.features || [],
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

    // Insert vehicle listing
    const { data: insertedVehicle, error: insertError } = await supabase
      .from("vehicle_ads")
      .insert(vehicleData)
      .select("id")
      .single();

    if (insertError) {
      console.error("Error creating vehicle listing:", insertError);

      if (insertError.code === "23505") {
        return {
          success: false,
          error: "A vehicle listing with these details already exists",
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
        error: "Unable to create vehicle listing. Please try again.",
      };
    }

    return { success: true, vehicleId: insertedVehicle.id };
  } catch (error) {
    console.error("Unexpected error in createVehicleAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function updateVehicleAction(
  vehicleId: string,
  formData: VehicleFormData
): Promise<VehicleActionResult> {
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

    if (!formData.vehicle_type?.trim()) {
      return { success: false, error: "Vehicle type is required" };
    }

    if (!formData.make?.trim()) {
      return { success: false, error: "Make is required" };
    }

    if (!formData.model?.trim()) {
      return { success: false, error: "Model is required" };
    }

    if (
      !formData.year ||
      formData.year < 1900 ||
      formData.year > new Date().getFullYear() + 1
    ) {
      return { success: false, error: "Please enter a valid year" };
    }

    if (!formData.condition?.trim()) {
      return { success: false, error: "Condition is required" };
    }

    if (!formData.price || formData.price <= 0) {
      return { success: false, error: "Price must be greater than 0" };
    }

    if (!formData.region?.trim()) {
      return { success: false, error: "Region is required" };
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from("vehicle_ads")
      .select("id, auth_id")
      .eq("id", vehicleId)
      .single();

    if (!existing) {
      return {
        success: false,
        error: "Vehicle listing not found",
      };
    }

    if (existing.auth_id !== user.id) {
      return {
        success: false,
        error: "You do not have permission to edit this listing",
      };
    }

    // Prepare vehicle data
    const vehicleData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      vehicle_type: formData.vehicle_type.trim(),
      make: formData.make.trim(),
      model: formData.model.trim(),
      year: formData.year,
      condition: formData.condition.trim(),
      price: formData.price,
      price_type: formData.price_type || "fixed",
      mileage: formData.mileage || null,
      registration_expires: formData.registration_expires || null,
      wof_expires: formData.wof_expires || null,
      transmission: formData.transmission || null,
      fuel_type: formData.fuel_type || null,
      features: formData.features || [],
      region: formData.region.trim(),
      images: formData.images || [],
      contact_name: formData.contact_name.trim(),
      contact_email: formData.contact_email.trim().toLowerCase(),
      contact_phone: formData.contact_phone.trim(),
      is_business_listing: formData.is_business_listing || false,
      business_id: formData.business_id || null,
      updated_at: new Date().toISOString(),
    };

    // Update vehicle listing
    const { error: updateError } = await supabase
      .from("vehicle_ads")
      .update(vehicleData)
      .eq("id", vehicleId)
      .eq("auth_id", user.id);

    if (updateError) {
      console.error("Error updating vehicle listing:", updateError);

      if (updateError.code === "23502") {
        return {
          success: false,
          error: "Required information is missing. Please check all fields.",
        };
      }

      return {
        success: false,
        error: "Unable to update vehicle listing. Please try again.",
      };
    }

    return { success: true, vehicleId };
  } catch (error) {
    console.error("Unexpected error in updateVehicleAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
