// app/listings/marketplace/plant/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import PlantDetailClient from "./PlantDetailClient";

export interface PlantAd {
  id: string;
  title: string;
  description: string;
  equipment_type: string;
  category: string;
  make?: string;
  model?: string;
  year?: number;
  condition: string;
  listing_type: string;
  sale_price?: number; // nullable in DB
  price_type: string; // 'fixed', 'negotiable', 'or near offer'
  hours_used?: number;
  specifications?: Record<string, string | number | boolean>;
  features?: string[];
  delivery_available: boolean;
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

async function getPlant(id: string): Promise<PlantAd | null> {
  const supabase = await createClient();

  // Try to use view first
  const { error: viewTestError } = await supabase
    .from("plant_ads_with_details")
    .select("id")
    .limit(1);

  let data, error;

  if (viewTestError) {
    // Views don't exist, use joins
    console.log("Detail page: Using joins");
    const result = await supabase
      .from("plant_ads")
      .select(
        `
        *,
        profiles!plant_ads_auth_id_fkey (
          username,
          avatar_url,
          first_name,
          last_name
        ),
        businesses!plant_ads_business_id_fkey (
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
      .from("plant_ads_with_details")
      .select("*")
      .eq("id", id)
      .single();

    data = result.data;
    error = result.error;
  }

  console.log("Plant detail fetch:", { id, error, hasData: !!data });

  if (error || !data) {
    console.error("Error fetching plant:", error);
    return null;
  }

  return data as PlantAd;
}

export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("PlantDetailPage: Loading plant with ID:", id);

  const plant = await getPlant(id);

  if (!plant) {
    console.log("PlantDetailPage: Plant not found, showing 404");
    notFound();
  }

  console.log("PlantDetailPage: Plant loaded successfully:", {
    id: plant.id,
    title: plant.title,
    has_avatar: !!plant.avatar_url,
    has_profiles: !!plant.profiles,
  });

  return <PlantDetailClient plant={plant} />;
}
