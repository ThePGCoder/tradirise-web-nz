// src/app/profile/page.tsx

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserProfile } from "./types/profile-types";
import ProfileClient from "./components/ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    console.error("Error fetching profile:", error);
    redirect("/login");
  }

  return <ProfileClient profile={profile as UserProfile} />;
}

export const dynamic = "force-dynamic";
