// app/positions/page.tsx
import { createClient } from "@/utils/supabase/server";
import PositionsClient from "./PositionsClient";
import { Position } from "@/types/positions";

const ITEMS_PER_PAGE = 20;

// Extended Position with profiles and businesses joins
export interface PositionWithProfiles extends Position {
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

interface PositionsPageProps {
  searchParams: Promise<{ page?: string }>;
}

const PositionsPage = async ({ searchParams }: PositionsPageProps) => {
  const supabase = await createClient();

  // Get page from search params
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Fetch positions data with pagination
  const { data, error, count } = await supabase
    .from("position_ads")
    .select(
      `
      *,
      profiles!position_ads_auth_id_fkey (
        username,
        avatar_url,
        first_name,
        last_name
      ),
      businesses!position_ads_business_id_fkey (
        business_name,
        logo_url
      )
    `,
      { count: "exact" }
    )
    .order("posted_date", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching positions:", error);
    throw new Error("Failed to load positions data");
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  return (
    <PositionsClient
      initialPositions={(data as Position[]) || []}
      currentPage={page}
      totalPages={totalPages}
      totalCount={count || 0}
    />
  );
};

export default PositionsPage;
