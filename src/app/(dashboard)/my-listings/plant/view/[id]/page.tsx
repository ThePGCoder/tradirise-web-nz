// app/my-listings/plant/view/[id]/page.tsx (Server Component)
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import PlantViewClient from "../components/PlantViewClient";

interface PlantData {
  id: string;
  created_at: string;
  updated_at: string;
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
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  auth_id: string;
  profiles?: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
}

async function getPlantData(plantId: string): Promise<PlantData> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("plant_ads")
    .select("*")
    .eq("id", plantId)
    .eq("auth_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching plant:", error);
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

export default async function PlantViewPage({ params }: PageProps) {
  const { id } = await params;
  const plant = await getPlantData(id);

  return <PlantViewClient plant={plant} />;
}
