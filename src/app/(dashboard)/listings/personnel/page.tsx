import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import PersonnelClient from "./components/PersonnelClient";
import { Personnel } from "@/types/personnel"; // Adjust path as needed

// Profile data joined from profiles table
export interface ProfileData {
  username: string | null;
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
}

// Extend Personnel interface to include joined profile data
export interface PersonnelWithProfile extends Personnel {
  profiles: ProfileData | null;
}

const PersonnelPage: React.FC = async () => {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch personnel data on server
  const { data: personnel, error } = await supabase
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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching personnel:", error);
    throw new Error("Failed to load personnel data");
  }

  return (
    <PersonnelClient initialPersonnel={personnel as PersonnelWithProfile[]} />
  );
};

export default PersonnelPage;
