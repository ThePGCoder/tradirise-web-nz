// src/app/listings/businesses/add-business/page.tsx
import React from "react";
import { Container } from "@mui/material";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AddBusinessClient from "./components/AddBusinessClient";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

// Server-side data fetching
async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      return {
        id: profile.id,
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        username: profile.username || profile.email?.split("@")[0] || "User",
        email: profile.email || "",
        avatar_url: profile.avatar_url,
      };
    }

    return null;
  } catch (err) {
    console.error("Error fetching current user:", err);
    return null;
  }
}

const AddBusiness: React.FC = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 3,
        overflow: "visible", // ADD THIS
      }}
    >
      <AddBusinessClient currentUser={currentUser} />
    </Container>
  );
};

export default AddBusiness;
