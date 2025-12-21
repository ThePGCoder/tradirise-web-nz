// app/listings/marketplace/material/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import MaterialDetailClient from "./MaterialDetailClient";

export interface MaterialAd {
  id: string;
  title: string;
  description: string;
  material_type: string;
  category: string;
  condition: string;
  quantity: number;
  unit: string;
  price: number;
  price_type: string;
  price_unit?: string;
  grade_quality?: string;
  dimensions?: string;
  brand?: string;
  specifications?: Record<string, string | number | boolean>;
  delivery_available: boolean;
  delivery_cost?: string;
  minimum_order?: string;
  available_quantity?: number;
  location_details?: string;
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

async function getMaterial(id: string): Promise<MaterialAd | null> {
  const supabase = await createClient();

  // Try to use view first
  const { error: viewTestError } = await supabase
    .from("materials_ads_with_details")
    .select("id")
    .limit(1);

  let data, error;

  if (viewTestError) {
    // Views don't exist, use joins
    console.log("Detail page: Using joins");
    const result = await supabase
      .from("materials_ads")
      .select(
        `
        *,
        profiles!materials_ads_auth_id_fkey (
          username,
          avatar_url,
          first_name,
          last_name
        ),
        businesses!materials_ads_business_id_fkey (
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
      .from("materials_ads_with_details")
      .select("*")
      .eq("id", id)
      .single();

    data = result.data;
    error = result.error;
  }

  console.log("Material detail fetch:", { id, error, hasData: !!data });

  if (error || !data) {
    console.error("Error fetching material:", error);
    return null;
  }

  return data as MaterialAd;
}

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("MaterialDetailPage: Loading material with ID:", id);

  const material = await getMaterial(id);

  if (!material) {
    console.log("MaterialDetailPage: Material not found, showing 404");
    notFound();
  }

  console.log("MaterialDetailPage: Material loaded successfully:", {
    id: material.id,
    title: material.title,
    has_avatar: !!material.avatar_url,
    has_profiles: !!material.profiles,
  });

  return <MaterialDetailClient material={material} />;
}
