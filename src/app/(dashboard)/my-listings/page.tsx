// app/my-listings/page.tsx (Server Component)
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MyListingsClient from "./components/MyListingsClient";
import { Project } from "@/types/projects";
import { Position } from "@/types/positions";
import { Personnel } from "@/types/personnel";
//import { Business } from "@/types/business";

// Define interface for Personnel
export interface PersonnelWithProfile extends Personnel {
  profiles: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

// Define interface for Position
export interface PositionWithProfiles extends Position {
  profiles: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

// Define interface for Project
export interface ProjectWithProfiles extends Project {
  profiles?: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
  businesses?: {
    business_name: string;
    logo_url: string;
  } | null;
}

// Define interface for Material (without profile join for now)
export interface MaterialWithProfile {
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
  region: string;
  delivery_available: boolean;
  posted_date: string;
  status: string;
  auth_id: string;
  images?: string[];
  profiles?: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

// Define interface for Plant (Equipment) (without profile join for now)
export interface PlantWithProfile {
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
  sale_price?: number;
  price_type: string;
  hours_used?: number;
  delivery_available: boolean;
  region: string;
  posted_date: string;
  status: string;
  features?: string[];
  images?: string[];
  auth_id: string;
  profiles?: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

// Define interface for Vehicle (without profile join for now)
export interface VehicleWithProfile {
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
  region: string;
  posted_date: string;
  status: string;
  features?: string[];
  images?: string[];
  auth_id: string;
  profiles?: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

async function getMyListings() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all data types in parallel
  const [
    personnelResult,
    businessesResult,
    positionsResult,
    projectsResult,
    materialsResult,
    plantResult,
    vehiclesResult,
  ] = await Promise.all([
    supabase
      .from("personnel_ads")
      .select(
        `
        *,
        profiles (
          username,
          avatar_url,
          first_name,
          last_name
        )
      `
      )
      .eq("auth_id", user.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("businesses")
      .select("*")
      .eq("auth_id", user.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("position_ads")
      .select(
        `
        *,
        profiles (
          username,
          avatar_url,
          first_name,
          last_name
        )
      `
      )
      .eq("auth_id", user.id)
      .order("posted_date", { ascending: false }),

    supabase
      .from("project_ads")
      .select(
        `
        *,
        profiles (
          username,
          avatar_url,
          first_name,
          last_name
        ),
        businesses (
          business_name,
          logo_url
        )
      `
      )
      .eq("auth_id", user.id)
      .order("posted_date", { ascending: false }),

    // Materials - without profile join since FK doesn't exist yet
    supabase
      .from("materials_ads")
      .select("*")
      .eq("auth_id", user.id)
      .order("posted_date", { ascending: false }),

    // Equipment/Plant - without profile join since FK doesn't exist yet
    supabase
      .from("plant_ads")
      .select("*")
      .eq("auth_id", user.id)
      .order("posted_date", { ascending: false }),

    // Vehicles - without profile join since FK doesn't exist yet
    supabase
      .from("vehicle_ads")
      .select("*")
      .eq("auth_id", user.id)
      .order("posted_date", { ascending: false }),
  ]);

  // Log errors but don't throw
  if (personnelResult.error)
    console.error("Error fetching personnel:", personnelResult.error);
  if (businessesResult.error)
    console.error("Error fetching businesses:", businessesResult.error);
  if (positionsResult.error)
    console.error("Error fetching positions:", positionsResult.error);
  if (projectsResult.error)
    console.error("Error fetching projects:", projectsResult.error);
  if (materialsResult.error)
    console.error("Error fetching materials:", materialsResult.error);
  if (plantResult.error)
    console.error("Error fetching plant:", plantResult.error);
  if (vehiclesResult.error)
    console.error("Error fetching vehicles:", vehiclesResult.error);

  return {
    personnel: personnelResult.data || [],
    businesses: businessesResult.data || [],
    positions: positionsResult.data || [],
    projects: projectsResult.data || [],
    materials: materialsResult.data || [],
    plant: plantResult.data || [],
    vehicles: vehiclesResult.data || [],
  };
}

export default async function MyListingsPage() {
  const listings = await getMyListings();

  return <MyListingsClient initialData={listings} />;
}
