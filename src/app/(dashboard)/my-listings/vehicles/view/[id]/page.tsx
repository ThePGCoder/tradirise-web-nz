// app/my-listings/vehicles/view/[id]/page.tsx (Server Component)
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import VehicleViewClient from "../components/VehicleViewClient";

interface VehicleData {
  id: string;
  created_at: string;
  updated_at: string;
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
  body_type?: string;
  engine_size?: string;
  doors?: number;
  seats?: number;
  color?: string;
  vin?: string;
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

async function getVehicleData(vehicleId: string): Promise<VehicleData> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("vehicle_ads")
    .select("*")
    .eq("id", vehicleId)
    .eq("auth_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching vehicle:", error);
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

export default async function VehicleViewPage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = await getVehicleData(id);

  return <VehicleViewClient vehicle={vehicle} />;
}
