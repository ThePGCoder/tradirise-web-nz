// app/my-listings/materials/view/[id]/page.tsx (Server Component)
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import MaterialViewClient from "../components/MaterialViewClient";

interface MaterialData {
  id: string;
  created_at: string;
  updated_at: string;
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
  delivery_available: boolean;
  delivery_cost?: string;
  minimum_order?: string;
  available_quantity?: number;
  location_details?: string;
  region: string;
  posted_date: string;
  status: string;
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

async function getMaterialData(materialId: string): Promise<MaterialData> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("materials_ads")
    .select("*")
    .eq("id", materialId)
    .eq("auth_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching material:", error);
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

export default async function MaterialViewPage({ params }: PageProps) {
  const { id } = await params;
  const material = await getMaterialData(id);

  return <MaterialViewClient material={material} />;
}
