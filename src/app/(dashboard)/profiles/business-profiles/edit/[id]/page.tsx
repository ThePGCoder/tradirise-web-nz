// src/app/listings/businesses/edit-business/[id]/page.tsx
import React from "react";
import { Container } from "@mui/material";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EditBusinessClient from "../../../../profiles/business-profiles/edit/[id]/components/EditBusinessClient";
import {
  BranchAddress,
  MobileContact,
  OperatingHours,
  SocialMediaLinks,
} from "@/app/(dashboard)/profiles/business-profiles/add-business/business-form-types";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url?: string;
}

interface BusinessData {
  id: string;
  auth_id: string;
  business_name: string;
  business_type: string;
  nzbn_number?: string;
  legality_type: string;
  years_in_trading: number;
  website?: string;
  contact_email: string;
  mobile_contacts: MobileContact[];
  office_phone?: string;
  types_of_work_undertaken: string[];
  employees: string;
  logo_url?: string;
  cover_url?: string;
  gallery_urls: string[];
  street_address?: string;
  suburb?: string;
  city: string;
  region?: string;
  postal_code?: string;
  is_multi_branch: boolean;
  branch_addresses: BranchAddress[];
  gst_registered: boolean;
  insurance_policies: string[];
  operating_hours: OperatingHours;
  out_of_zone_working: boolean;
  social_media_links: SocialMediaLinks;
  availability_date?: string;
  certifications: string[];
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

async function getBusiness(businessId: string): Promise<BusinessData | null> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data: business, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .eq("auth_id", user.id)
      .single();

    if (error || !business) {
      console.error("Error fetching business:", error);
      return null;
    }

    return business as BusinessData;
  } catch (err) {
    console.error("Error fetching business:", err);
    return null;
  }
}

interface EditBusinessProps {
  params: Promise<{ id: string }>;
}

const EditBusiness: React.FC<EditBusinessProps> = async ({ params }) => {
  const resolvedParams = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const business = await getBusiness(resolvedParams.id);

  if (!business) {
    redirect("/listings/businesses");
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 3,
        overflow: "visible",
      }}
    >
      <EditBusinessClient currentUser={currentUser} business={business} />
    </Container>
  );
};

export default EditBusiness;
