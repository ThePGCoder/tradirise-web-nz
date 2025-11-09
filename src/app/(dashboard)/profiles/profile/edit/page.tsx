// src/app/profile/edit/page.tsx

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EditProfileClient from "./components/steps/EditProfileClient";
import { UserProfile } from "../types/profile-types";

export default async function EditProfilePage() {
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

  return <EditProfileClient profile={profile as UserProfile} />;
}

export const dynamic = "force-dynamic";
