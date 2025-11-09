// src/app/my-listings/projects/edit/[id]/page.tsx
import React from "react";
import { Container } from "@mui/material";
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import EditProjectClient from "./components/EditProjectClient";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

interface Business {
  id: string;
  business_name: string;
  logo_url?: string;
  contact_email: string;
  phone_number?: string;
  website?: string;
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
        phone: profile.phone || "",
        avatar_url: profile.avatar_url,
      };
    }

    return null;
  } catch (err) {
    console.error("Error fetching current user:", err);
    return null;
  }
}

async function getProjectAd(id: string, userId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("project_ads")
      .select("*")
      .eq("id", id)
      .eq("auth_id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error fetching project ad:", err);
    return null;
  }
}

async function getBusiness(businessId: string): Promise<Business | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("businesses")
      .select(
        "id, business_name, logo_url, contact_email, phone_number, website"
      )
      .eq("id", businessId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error fetching business:", err);
    return null;
  }
}

const EditProject: React.FC<PageProps> = async ({ params }) => {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const projectAd = await getProjectAd(id, currentUser.id);

  if (!projectAd) {
    notFound();
  }

  // Fetch business if this is a business listing
  let business: Business | undefined;
  if (projectAd.is_business_listing && projectAd.business_id) {
    const fetchedBusiness = await getBusiness(projectAd.business_id);
    if (fetchedBusiness) {
      business = fetchedBusiness;
    }
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 3,
        overflow: "visible",
      }}
    >
      <EditProjectClient
        currentUser={currentUser}
        projectAd={projectAd}
        business={business}
      />
    </Container>
  );
};

export default EditProject;
