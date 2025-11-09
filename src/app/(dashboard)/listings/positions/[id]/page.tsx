// app/listings/positions/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import PositionDetailClient from "./components/PositionDetailClient";

interface PositionData {
  id: string;
  title: string;
  trade: string;
  rate: string;
  region: string;
  description: string;
  start_date: string;
  remuneration: string;
  posted_date: string;
  posted_by: string;
  is_business_listing: boolean;
  business_id?: string;
  auth_id: string;
  requirements?: string[];
  benefits?: string[];
  duration?: string;
  employment_type?: string;
  suburb?: string;
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

async function getPosition(id: string): Promise<PositionData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
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
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as PositionData;
}

export default async function PositionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const position = await getPosition(id);

  if (!position) {
    notFound();
  }

  return <PositionDetailClient position={position} />;
}
