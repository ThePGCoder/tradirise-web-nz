// app/my-listings/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { VehicleFormData } from "../listings/marketplace/vehicles/add-vehicle/vehicle-form-types";
import { PlantFormData } from "../listings/marketplace/plant/add-plant/plant-form-types";
import { MaterialFormData } from "../listings/marketplace/materials/material-form-types";

export async function deletePersonnelListing(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("personnel_ads")
    .delete()
    .eq("id", id)
    .eq("auth_id", user.id);

  if (error) {
    throw new Error(`Failed to delete personnel listing: ${error.message}`);
  }

  revalidatePath("/my-listings");
  return { success: true };
}

export async function deletePositionListing(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("position_ads")
    .delete()
    .eq("id", id)
    .eq("auth_id", user.id);

  if (error) {
    throw new Error(`Failed to delete position listing: ${error.message}`);
  }

  revalidatePath("/my-listings");
  return { success: true };
}

export async function deleteProjectListing(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("project_ads")
    .delete()
    .eq("id", id)
    .eq("auth_id", user.id);

  if (error) {
    throw new Error(`Failed to delete project listing: ${error.message}`);
  }

  revalidatePath("/my-listings");
  return { success: true };
}

export async function deleteBusinessListing(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("businesses")
    .delete()
    .eq("id", id)
    .eq("auth_id", user.id);

  if (error) {
    throw new Error(`Failed to delete business listing: ${error.message}`);
  }

  revalidatePath("/my-listings");
  return { success: true };
}

export async function deleteMaterialListing(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("materials_ads")
    .delete()
    .eq("id", id)
    .eq("auth_id", user.id);

  if (error) {
    throw new Error(`Failed to delete material listing: ${error.message}`);
  }

  revalidatePath("/my-listings");
  return { success: true };
}

export async function deletePlantListing(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("plant_ads")
    .delete()
    .eq("id", id)
    .eq("auth_id", user.id);

  if (error) {
    throw new Error(`Failed to delete equipment listing: ${error.message}`);
  }

  revalidatePath("/my-listings");
  return { success: true };
}

export async function deleteVehicleListing(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("vehicle_ads")
    .delete()
    .eq("id", id)
    .eq("auth_id", user.id);

  if (error) {
    throw new Error(`Failed to delete vehicle listing: ${error.message}`);
  }

  revalidatePath("/my-listings");
  return { success: true };
}

// Update actions
export async function updateMaterialListing(
  id: string,
  formData: MaterialFormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("materials_ads")
    .update({
      title: formData.title,
      description: formData.description,
      material_type: formData.material_type,
      category: formData.category,
      condition: formData.condition,
      quantity: formData.quantity,
      unit: formData.unit,
      price: formData.price,
      price_type: formData.price_type,
      price_unit: formData.price_unit,
      grade_quality: formData.grade_quality,
      dimensions: formData.dimensions,
      brand: formData.brand,
      delivery_available: formData.delivery_available,
      delivery_cost: formData.delivery_cost,
      minimum_order: formData.minimum_order,
      available_quantity: formData.available_quantity,
      location_details: formData.location_details,
      region: formData.region,
      images: formData.images,
      contact_name: formData.contact_name,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("auth_id", user.id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: false, error: "Material not found or unauthorized" };
  }

  revalidatePath("/my-listings");
  return { success: true, data };
}

export async function updatePlantListing(id: string, formData: PlantFormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("plant_ads")
    .update({
      title: formData.title,
      description: formData.description,
      equipment_type: formData.equipment_type,
      category: formData.category,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      condition: formData.condition,
      sale_price: formData.sale_price,
      price_type: formData.price_type,
      hours_used: formData.hours_used,
      delivery_available: formData.delivery_available,
      region: formData.region,
      features: formData.features,
      images: formData.images,
      contact_name: formData.contact_name,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("auth_id", user.id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: false, error: "Equipment not found or unauthorized" };
  }

  revalidatePath("/my-listings");
  return { success: true, data };
}

export async function updateVehicleListing(
  id: string,
  formData: VehicleFormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("vehicle_ads")
    .update({
      title: formData.title,
      description: formData.description,
      vehicle_type: formData.vehicle_type,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      condition: formData.condition,
      price: formData.price,
      price_type: formData.price_type,
      mileage: formData.mileage,
      registration_expires: formData.registration_expires,
      wof_expires: formData.wof_expires,
      transmission: formData.transmission,
      fuel_type: formData.fuel_type,

      region: formData.region,
      features: formData.features,
      images: formData.images,
      contact_name: formData.contact_name,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("auth_id", user.id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: false, error: "Vehicle not found or unauthorized" };
  }

  revalidatePath("/my-listings");
  return { success: true, data };
}
