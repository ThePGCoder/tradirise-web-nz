// app/my-listings/personnel/view/[id]/page.tsx (Server Component)
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import PersonnelViewClient from "./components/PersonnelViewClient";
import { Personnel } from "@/types/personnel";

export interface PersonnelWithProfile extends Personnel {
  profiles: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

async function getPersonnelData(
  personnelId: string
): Promise<PersonnelWithProfile> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
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
    .eq("id", personnelId)
    .eq("auth_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching personnel:", error);
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

export default async function PersonnelViewPage({ params }: PageProps) {
  const { id } = await params;
  const personnel = await getPersonnelData(id);

  return <PersonnelViewClient personnel={personnel} />;
}
