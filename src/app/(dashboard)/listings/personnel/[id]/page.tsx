// app/listings/personnel/[id]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { Personnel } from "@/types/personnel";
import PersonnelDetailClient from "./components/PersonnelDetailClient";

// Profile data joined from profiles table
interface ProfileData {
  username: string | null;
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
}

// Extend Personnel interface to include joined profile data
interface PersonnelWithProfile extends Personnel {
  profiles: ProfileData | null;
}

interface PersonnelPageProps {
  params: Promise<{ id: string }>;
}

// ============================================
// Generate Metadata for Facebook/SEO
// ============================================
export async function generateMetadata({
  params,
}: PersonnelPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("personnel_ads")
    .select(
      `
      id,
      first_name,
      last_name,
      primary_trade_role,
      region,
      bio,
      profiles (
        avatar_url
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return {
      title: "Personnel Not Found - TradesFort",
      description: "This personnel listing could not be found.",
    };
  }

  const name =
    `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Personnel";
  const title = `${name} - ${data.primary_trade_role || "Trade Professional"}`;
  const description =
    data.bio ||
    `${name}, a ${data.primary_trade_role || "professional"} in ${
      data.region || "your area"
    }`;

  // Get avatar image
  let imageUrl: string | undefined;
  const profiles = data.profiles as
    | { avatar_url?: string }
    | { avatar_url?: string }[]
    | null;

  if (Array.isArray(profiles)) {
    imageUrl = profiles[0]?.avatar_url;
  } else if (profiles) {
    imageUrl = profiles.avatar_url;
  }

  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${imageUrl}`;
  }

  if (!imageUrl) {
    imageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/default-personnel.png`;
  }

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/listings/personnel/${data.id}`;

  return {
    title,
    description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL || "https://tradesfort.com"
    ),
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "TradesFort",
      locale: "en_NZ",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

async function getPersonnel(id: string): Promise<PersonnelWithProfile | null> {
  const supabase = await createClient();

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
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as PersonnelWithProfile;
}

export default async function PersonnelDetailPage({
  params,
}: PersonnelPageProps) {
  const { id } = await params;
  const personnel = await getPersonnel(id);

  if (!personnel) {
    notFound();
  }

  return <PersonnelDetailClient personnel={personnel} />;
}
