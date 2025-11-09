// app/my-favourites/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MyFavouritesClient from "./components/MyFavouritesClient";

export const metadata = {
  title: "My Favourites",
  description: "View your saved personnel, businesses, positions, and projects",
};

interface Personnel {
  id: string;
  first_name: string;
  last_name: string;
  primary_trade_role?: string;

  region?: string;
  auth_id: string;
}

interface Business {
  id: string;
  business_name: string;
  business_type?: string;
  logo_url?: string;
  region?: string;
  city?: string;
  years_in_trading?: number;
}

interface Position {
  id: string;
  title: string;
  trade: string;
  rate: string;
  region: string;
  start_date: string;
  posted_date: string;
  remuneration: string;
  description: string;
  posted_by: string;
  is_business_listing: boolean;
  auth_id: string;
  business_id?: string | null;
}

interface Project {
  id: string;
  title: string;
  project_type: string;
  price_range: string;
  region: string;
  proposed_start_date: string;
  posted_date: string;
  description: string;
  posted_by: string;
  is_business_listing: boolean;
  auth_id: string;
  business_id?: string | null;
  project_duration?: string;
  required_trades?: string[];
  // Legacy fields for backwards compatibility
  budget_min?: number;
  budget_max?: number;
  start_date?: string;
  suburb?: string;
}

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  first_name: string;
  last_name: string;
}

interface BusinessProfile {
  id: string;
  business_name: string;
  logo_url: string;
}

interface Favourite {
  id: string;
  user_id: string;
  item_type: string;
  item_id: string;
  created_at: string;
  notes: string | null;
  personnel?: Personnel;
  businesses?: Business;
  position?: Position;
  project?: Project;
  poster_profile?: UserProfile;
  poster_business?: BusinessProfile;
}

export default async function MyFavouritesPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  console.log("Fetching favourites for user:", user.id);

  // Fetch all favourites
  const { data: favourites, error } = await supabase
    .from("my_favourites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching favourites:", error);
  }

  console.log("Favourites found:", favourites?.length || 0);

  // If we have favourites, fetch related data separately
  let enrichedFavourites: Favourite[] = [];

  if (favourites && favourites.length > 0) {
    // Get IDs for each type
    const personnelIds = favourites
      .filter((f) => f.item_type === "personnel")
      .map((f) => f.item_id);

    const businessIds = favourites
      .filter((f) => f.item_type === "business")
      .map((f) => f.item_id);

    const positionIds = favourites
      .filter((f) => f.item_type === "position")
      .map((f) => f.item_id);

    const projectIds = favourites
      .filter((f) => f.item_type === "project")
      .map((f) => f.item_id);

    // Fetch personnel data
    let personnelData: Personnel[] = [];
    if (personnelIds.length > 0) {
      const { data, error: personnelError } = await supabase
        .from("personnel_ads")
        .select(
          "id, first_name, last_name, primary_trade_role, region, auth_id"
        )
        .in("id", personnelIds);

      if (personnelError) {
        console.error("Error fetching personnel:", personnelError);
        console.error(
          "Personnel error details:",
          JSON.stringify(personnelError, null, 2)
        );
      } else {
        personnelData = (data as Personnel[]) || [];
        console.log("Personnel data fetched:", personnelData.length);
      }
    }

    // Fetch business data
    let businessData: Business[] = [];
    if (businessIds.length > 0) {
      const { data, error: businessError } = await supabase
        .from("businesses")
        .select(
          "id, business_name, business_type, logo_url, region, city, years_in_trading"
        )
        .in("id", businessIds);

      if (businessError) {
        console.error("Error fetching businesses:", businessError);
      } else {
        businessData = (data as Business[]) || [];
        console.log("Business data fetched:", businessData.length);
      }
    }

    // Fetch position data
    let positionData: Position[] = [];
    if (positionIds.length > 0) {
      const { data, error: positionError } = await supabase
        .from("position_ads")
        .select(
          "id, title, trade, rate, region, start_date, posted_date, remuneration, description, posted_by, is_business_listing, auth_id, business_id"
        )
        .in("id", positionIds);

      if (positionError) {
        console.error("Error fetching positions:", positionError);
        console.error(
          "Position error details:",
          JSON.stringify(positionError, null, 2)
        );
      } else {
        positionData = (data as Position[]) || [];
        console.log("Position data fetched:", positionData.length);
      }
    }

    // Fetch project data
    let projectData: Project[] = [];
    if (projectIds.length > 0) {
      const { data, error: projectError } = await supabase
        .from("project_ads")
        .select(
          "id, title, project_type, price_range, region, proposed_start_date, posted_date, description, posted_by, is_business_listing, auth_id, business_id, project_duration, required_trades"
        )
        .in("id", projectIds);

      if (projectError) {
        console.error("Error fetching projects:", projectError);
        console.error(
          "Project error details:",
          JSON.stringify(projectError, null, 2)
        );
      } else {
        projectData = (data as Project[]) || [];
        console.log("Project data fetched:", projectData.length);
      }
    }

    // Collect all unique auth_ids and business_ids from positions and projects
    const authIds = [
      ...new Set([
        ...positionData
          .filter((p) => !p.is_business_listing)
          .map((p) => p.auth_id),
        ...projectData
          .filter((p) => !p.is_business_listing)
          .map((p) => p.auth_id),
        ...personnelData.map((p) => p.auth_id), // Add personnel auth_ids
      ]),
    ];

    const businessIdsForPosters = [
      ...new Set([
        ...positionData
          .filter((p) => p.is_business_listing && p.business_id)
          .map((p) => p.business_id!),
        ...projectData
          .filter((p) => p.is_business_listing && p.business_id)
          .map((p) => p.business_id!),
      ]),
    ];

    // Fetch user profiles for posters (includes personnel avatars)
    let userProfiles: UserProfile[] = [];
    if (authIds.length > 0) {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, first_name, last_name")
        .in("id", authIds);

      if (profileError) {
        console.error("Error fetching user profiles:", profileError);
      } else {
        userProfiles = (data as UserProfile[]) || [];
        console.log("User profiles fetched:", userProfiles.length);
      }
    }

    // Fetch business profiles for posters
    let businessProfiles: BusinessProfile[] = [];
    if (businessIdsForPosters.length > 0) {
      const { data, error: businessProfileError } = await supabase
        .from("businesses")
        .select("id, business_name, logo_url")
        .in("id", businessIdsForPosters);

      if (businessProfileError) {
        console.error(
          "Error fetching business profiles:",
          businessProfileError
        );
      } else {
        businessProfiles = (data as BusinessProfile[]) || [];
        console.log("Business profiles fetched:", businessProfiles.length);
      }
    }

    // Enrich favourites with related data
    enrichedFavourites = favourites.map((favourite) => {
      const enriched: Favourite = { ...favourite };

      if (favourite.item_type === "personnel") {
        const personnel = personnelData.find((p) => p.id === favourite.item_id);
        enriched.personnel = personnel;

        // Add profile avatar for personnel
        if (personnel) {
          enriched.poster_profile = userProfiles.find(
            (u) => u.id === personnel.auth_id
          );
        }
      } else if (favourite.item_type === "business") {
        const business = businessData.find((b) => b.id === favourite.item_id);
        enriched.businesses = business;
      } else if (favourite.item_type === "position") {
        const position = positionData.find((p) => p.id === favourite.item_id);
        enriched.position = position;

        // Add poster info
        if (position) {
          if (position.is_business_listing && position.business_id) {
            enriched.poster_business = businessProfiles.find(
              (b) => b.id === position.business_id
            );
          } else {
            enriched.poster_profile = userProfiles.find(
              (u) => u.id === position.auth_id
            );
          }
        }
      } else if (favourite.item_type === "project") {
        const project = projectData.find((p) => p.id === favourite.item_id);
        enriched.project = project;

        // Add poster info
        if (project) {
          if (project.is_business_listing && project.business_id) {
            enriched.poster_business = businessProfiles.find(
              (b) => b.id === project.business_id
            );
          } else {
            enriched.poster_profile = userProfiles.find(
              (u) => u.id === project.auth_id
            );
          }
        }
      }

      return enriched;
    }) as Favourite[];

    console.log("Enriched favourites:", enrichedFavourites.length);
  }

  return (
    <MyFavouritesClient
      initialFavourites={enrichedFavourites}
      userId={user.id}
    />
  );
}
