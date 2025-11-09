// app/my-listings/positions/view/[id]/page.tsx (Server Component)
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import PositionViewClient from "./components/PositionViewClient";

interface PositionData {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  trade: string;
  rate: string;
  region: string;
  description: string;
  start_date: string;
  remuneration: string;
  posted_date: string;
  auth_id: string;
  posted_by_name: string;
  profiles: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

async function getPositionData(positionId: string): Promise<PositionData> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
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
    .eq("id", positionId)
    .eq("auth_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching position:", error);
    notFound();
  }

  if (!data) {
    notFound();
  }

  return data;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PositionViewPage({ params }: PageProps) {
  const { id } = await params;
  const position = await getPositionData(id);

  return <PositionViewClient position={position} />;
}
