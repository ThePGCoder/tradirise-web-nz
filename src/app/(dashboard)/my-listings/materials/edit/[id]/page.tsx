// app/my-listings/materials/edit/[id]/page.tsx
import React from "react";
import { Container } from "@mui/material";
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import EditMaterialClient from "../components/EditMaterialClient";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

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

async function getMaterialAd(id: string, userId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("materials_ads")
      .select("*")
      .eq("id", id)
      .eq("auth_id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error fetching material ad:", err);
    return null;
  }
}

const EditMaterial: React.FC<PageProps> = async ({ params }) => {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const materialAd = await getMaterialAd(id, currentUser.id);

  if (!materialAd) {
    notFound();
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 3,
        overflow: "visible",
      }}
    >
      <EditMaterialClient currentUser={currentUser} materialAd={materialAd} />
    </Container>
  );
};

export default EditMaterial;
