"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { smartGeocodeAddress } from "@/lib/geocoding-service";

export interface MobileContact {
  name: string;
  number: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export interface OperatingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface BranchAddress {
  name: string;
  street_address: string;
  suburb?: string;
  city: string;
  region?: string;
  postal_code?: string;
}

export interface BusinessFormData {
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

export interface ActionResult {
  success: boolean;
  error?: string;
  businessId?: string;
  geocoded?: boolean;
  geocoding_error?: string;
}

export async function createBusinessAction(
  formData: BusinessFormData
): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "You must be logged in to create a business listing",
      };
    }

    // Validate required fields
    if (!formData.business_name?.trim()) {
      return { success: false, error: "Business name is required" };
    }
    if (!formData.business_type) {
      return { success: false, error: "Business type is required" };
    }
    if (!formData.city?.trim()) {
      return { success: false, error: "City is required" };
    }

    // Validate that at least one contact method is provided
    const hasContactEmail = formData.contact_email?.trim();
    const hasMobileContact = formData.mobile_contacts.some((c) =>
      c.number.trim()
    );
    const hasOfficePhone = formData.office_phone?.trim();

    if (!hasContactEmail && !hasMobileContact && !hasOfficePhone) {
      return {
        success: false,
        error:
          "At least one contact method (email, mobile, or office phone) is required",
      };
    }

    // Attempt geocoding
    console.log("Starting geocoding for new business...");
    let geocodeResult = null;
    let geocoding_status = "pending";
    let geocoding_error = null;

    try {
      geocodeResult = await smartGeocodeAddress({
        street_address: formData.street_address,
        suburb: formData.suburb,
        city: formData.city,
        region: formData.region,
        postal_code: formData.postal_code,
      });

      if (geocodeResult.success) {
        geocoding_status = "success";
        console.log(
          `Geocoding successful: ${geocodeResult.latitude}, ${geocodeResult.longitude}`
        );
      } else {
        geocoding_status = "failed";
        geocoding_error = geocodeResult.error;
        console.warn(`Geocoding failed: ${geocodeResult.error}`);
      }
    } catch (geocodingErr) {
      geocoding_status = "failed";
      geocoding_error =
        geocodingErr instanceof Error
          ? geocodingErr.message
          : "Geocoding error";
      console.error("Geocoding exception:", geocodingErr);
    }

    // Prepare data for insertion
    const insertData = {
      business_name: formData.business_name.trim(),
      business_type: formData.business_type,
      nzbn_number: formData.nzbn_number?.trim() || null,
      legality_type: formData.legality_type,
      years_in_trading: Math.max(0, formData.years_in_trading || 0),
      website: formData.website?.trim() || null,
      contact_email: formData.contact_email?.trim() || null,
      mobile_contacts: formData.mobile_contacts || [],
      office_phone: formData.office_phone?.trim() || null,
      types_of_work_undertaken: formData.types_of_work_undertaken || [],
      employees: formData.employees,
      logo_url: formData.logo_url?.trim() || null,
      cover_url: formData.cover_url?.trim() || null,
      gallery_urls: formData.gallery_urls || [],

      // Address fields
      street_address: formData.street_address?.trim() || null,
      suburb: formData.suburb?.trim() || null,
      city: formData.city.trim(),
      region: formData.region?.trim() || null,
      postal_code: formData.postal_code?.trim() || null,

      // Multi-branch
      is_multi_branch: formData.is_multi_branch || false,
      branch_addresses: formData.branch_addresses || [],

      // Additional fields
      gst_registered: formData.gst_registered || false,
      insurance_policies: formData.insurance_policies || [],
      operating_hours: formData.operating_hours || {},
      out_of_zone_working: formData.out_of_zone_working || false,
      social_media_links: formData.social_media_links || {},
      availability_date: formData.availability_date || null,
      certifications: formData.certifications || [],

      // Geocoding results
      latitude: geocodeResult?.success ? geocodeResult.latitude : null,
      longitude: geocodeResult?.success ? geocodeResult.longitude : null,
      formatted_address: geocodeResult?.success
        ? geocodeResult.formatted_address
        : null,
      geocoding_status,
      geocoding_error,
      geocoded_at: geocodeResult?.success ? new Date().toISOString() : null,

      // Metadata
      auth_id: user.id,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert business
    const { data: business, error: insertError } = await supabase
      .from("businesses")
      .insert(insertData)
      .select("id")
      .single();

    if (insertError) {
      console.error("Database error:", insertError);
      return {
        success: false,
        error: "Failed to create business listing. Please try again.",
      };
    }

    if (!business) {
      return { success: false, error: "Failed to create business listing." };
    }

    // Revalidate the businesses page
    revalidatePath("/listings/businesses");

    return {
      success: true,
      businessId: business.id,
      geocoded: geocodeResult?.success || false,
      geocoding_error: geocoding_error || undefined,
    };
  } catch (error) {
    console.error("Unexpected error creating business:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
