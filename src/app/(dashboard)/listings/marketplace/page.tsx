// app/listings/marketplace/page.tsx
import { createClient } from "@/utils/supabase/server";
import MarketplaceClient from "./MarketPlaceClient";

const ITEMS_PER_PAGE = 20;

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
  // Flattened from view OR nested from join - both supported
  username?: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  business_logo_url?: string;
  // Nested structure (if views don't exist yet)
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

interface MarketplacePageProps {
  searchParams: Promise<{ page?: string; tab?: string }>;
}

const MarketplacePage = async ({ searchParams }: MarketplacePageProps) => {
  const supabase = await createClient();
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const activeTab = params.tab || "vehicles";
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Try to use views first, fallback to joins
  let vehiclesQuery;

  // Test if views exist
  const { error: viewTestError } = await supabase
    .from("vehicle_ads_with_details")
    .select("id")
    .limit(1);

  if (viewTestError) {
    console.log("Views not found, using joins instead");
    // Views don't exist, use joins
    vehiclesQuery = supabase
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
      `,
        { count: "exact" }
      )
      .order("posted_date", { ascending: false })
      .range(from, to);
  } else {
    console.log("Using views");
    // Views exist, use them
    vehiclesQuery = supabase
      .from("vehicle_ads_with_details")
      .select("*", { count: "exact" })
      .order("posted_date", { ascending: false })
      .range(from, to);
  }

  // Same for plant
  const { error: plantViewTestError } = await supabase
    .from("plant_ads_with_details")
    .select("id")
    .limit(1);

  const plantQuery = plantViewTestError
    ? supabase
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
        `,
          { count: "exact" }
        )
        .order("posted_date", { ascending: false })
        .range(from, to)
    : supabase
        .from("plant_ads_with_details")
        .select("*", { count: "exact" })
        .order("posted_date", { ascending: false })
        .range(from, to);

  // Same for materials
  const { error: materialsViewTestError } = await supabase
    .from("materials_ads_with_details")
    .select("id")
    .limit(1);

  const materialsQuery = materialsViewTestError
    ? supabase
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
        `,
          { count: "exact" }
        )
        .order("posted_date", { ascending: false })
        .range(from, to)
    : supabase
        .from("materials_ads_with_details")
        .select("*", { count: "exact" })
        .order("posted_date", { ascending: false })
        .range(from, to);

  const [
    { data: vehiclesData, error: vehiclesError, count: vehiclesCount },
    { data: plantData, error: plantError, count: plantCount },
    { data: materialsData, error: materialsError, count: materialsCount },
  ] = await Promise.all([vehiclesQuery, plantQuery, materialsQuery]);

  // Debug logging
  console.log("=== MARKETPLACE DEBUG ===");
  console.log("Vehicles error:", vehiclesError);
  console.log("Vehicles count:", vehiclesCount);
  console.log(
    "First vehicle sample:",
    vehiclesData?.[0]
      ? {
          id: vehiclesData[0].id,
          title: vehiclesData[0].title,
          has_profiles: !!vehiclesData[0].profiles,
          has_businesses: !!vehiclesData[0].businesses,
          has_avatar_url: !!vehiclesData[0].avatar_url,
          has_business_name: !!vehiclesData[0].business_name,
        }
      : "No vehicles"
  );

  if (vehiclesError) console.error("Vehicles error:", vehiclesError);
  if (plantError) console.error("Plant error:", plantError);
  if (materialsError) console.error("Materials error:", materialsError);

  // Calculate totals
  const totalVehiclePages = vehiclesCount
    ? Math.ceil(vehiclesCount / ITEMS_PER_PAGE)
    : 1;
  const totalPlantPages = plantCount
    ? Math.ceil(plantCount / ITEMS_PER_PAGE)
    : 1;
  const totalMaterialPages = materialsCount
    ? Math.ceil(materialsCount / ITEMS_PER_PAGE)
    : 1;

  return (
    <MarketplaceClient
      initialVehicles={(vehiclesData || []) as VehicleAd[]}
      initialPlant={(plantData || []) as PlantAd[]}
      initialMaterials={(materialsData || []) as MaterialAd[]}
      currentPage={page}
      totalVehiclePages={totalVehiclePages}
      totalPlantPages={totalPlantPages}
      totalMaterialPages={totalMaterialPages}
      vehicleCount={vehiclesCount || 0}
      plantCount={plantCount || 0}
      materialCount={materialsCount || 0}
      activeTab={activeTab}
    />
  );
};

export default MarketplacePage;
