// src/app/listings/positions/add-position/page.tsx
import React from "react";
import { Container } from "@mui/material";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AddPositionClient from "./components/AddPositionClient";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface Business {
  id: string;
  business_name: string;
  logo_url?: string;
  contact_email: string;
  phone_number?: string; // Changed from contact_phone
  website?: string;
}

async function getCurrentUserAndBusinesses(): Promise<{
  user: User | null;
  businesses: Business[];
}> {
  const supabase = await createClient();

  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.error("Auth error:", authError);
      redirect("/login");
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
    }

    const user: User | null = profile
      ? {
          id: profile.id,
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          username: profile.username || profile.email?.split("@")[0] || "User",
          email: profile.email || authUser.email || "",
          avatar_url: profile.avatar_url,
        }
      : null;

    // Fetch user's businesses with correct column name
    const { data: businesses, error: businessError } = await supabase
      .from("businesses")
      .select(
        "id, business_name, logo_url, contact_email, phone_number, website"
      )
      .eq("auth_id", authUser.id);

    console.log("Businesses fetched:", businesses?.length || 0);

    if (businessError) {
      console.error("Business fetch error:", businessError);
    }

    return {
      user,
      businesses: businesses || [],
    };
  } catch (err) {
    console.error("Unexpected error fetching data:", err);
    return { user: null, businesses: [] };
  }
}

const AddPosition: React.FC = async () => {
  const { user, businesses } = await getCurrentUserAndBusinesses();

  if (!user) {
    redirect("/login");
  }

  return (
    <Container maxWidth="md" sx={{ py: 3, overflow: "visible" }}>
      <AddPositionClient currentUser={user} userBusinesses={businesses} />
    </Container>
  );
};

export default AddPosition;
