// app/my-listings/page.tsx (Server Component)
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MyListingsClient from "./components/MyListingsClient";
import { Project } from "@/types/projects";
import { Position } from "@/types/positions";
import { Personnel } from "@/types/personnel";

// Define the PersonnelData interface
export interface PersonnelWithProfile extends Personnel {
  profiles: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

export interface PositionWithProfiles extends Position {
  profiles: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

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

async function getMyListings() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all data types in parallel
  const [personnelResult, businessesResult, positionsResult, projectsResult] =
    await Promise.all([
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

  return {
    personnel: personnelResult.data || [],
    businesses: businessesResult.data || [],
    positions: positionsResult.data || [],
    projects: projectsResult.data || [],
  };
}

export default async function MyListingsPage() {
  const listings = await getMyListings();

  return <MyListingsClient initialData={listings} />;
}
