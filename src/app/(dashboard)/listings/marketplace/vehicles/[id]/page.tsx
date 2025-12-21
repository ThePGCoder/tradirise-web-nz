// app/listings/marketplace/vehicles/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import VehicleDetailClient from "./VehiclesDetailClient";

// Use the same interface as the marketplace page
export interface VehicleAd {
  id: string;
  title: string;
  description: string;
  vehicle_type: string;
  make: string;
  model: string;
  year: number;
  condition: string;
  price: number;
  price_type: string;
  mileage?: number;
  registration_expires?: string;
  wof_expires?: string;
  transmission?: string;
  fuel_type?: string;
  features?: string[];
  region: string;
  images?: string[];
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  is_business_listing: boolean;
  business_id?: string;
  auth_id: string;
  posted_date: string;
  updated_at: string;
  status: string;
  views: number;
  enquiries: number;
  // Flattened from view OR nested from join
  username?: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  business_logo_url?: string;
  profiles?: {
    username?: string;
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
  };
  businesses?: {
    business_name?: string;
    logo_url?: string;
  };
}

async function getVehicle(id: string): Promise<VehicleAd | null> {
  const supabase = await createClient();

  // Try to use view first
  const { error: viewTestError } = await supabase
    .from("vehicle_ads_with_details")
    .select("id")
    .limit(1);

  let data, error;

  if (viewTestError) {
    // Views don't exist, use joins
    console.log("Detail page: Using joins");
    const result = await supabase
      .from("vehicle_ads")
      .select(
        `
        *,
        profiles!vehicle_ads_auth_id_fkey (
          username,
          avatar_url,
          first_name,
          last_name
        ),
        businesses!vehicle_ads_business_id_fkey (
          business_name,
          logo_url
        )
      `
      )
      .eq("id", id)
      .single();

    data = result.data;
    error = result.error;
  } else {
    // Views exist, use them
    console.log("Detail page: Using views");
    const result = await supabase
      .from("vehicle_ads_with_details")
      .select("*")
      .eq("id", id)
      .single();

    data = result.data;
    error = result.error;
  }

  console.log("Vehicle detail fetch:", { id, error, hasData: !!data });

  if (error || !data) {
    console.error("Error fetching vehicle:", error);
    return null;
  }

  return data as VehicleAd;
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("VehicleDetailPage: Loading vehicle with ID:", id);

  const vehicle = await getVehicle(id);

  if (!vehicle) {
    console.log("VehicleDetailPage: Vehicle not found, showing 404");
    notFound();
  }

  console.log("VehicleDetailPage: Vehicle loaded successfully:", {
    id: vehicle.id,
    title: vehicle.title,
    has_avatar: !!vehicle.avatar_url,
    has_profiles: !!vehicle.profiles,
  });

  return <VehicleDetailClient vehicle={vehicle} />;
}
