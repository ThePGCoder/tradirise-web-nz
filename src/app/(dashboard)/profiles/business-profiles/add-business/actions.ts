"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  BranchAddress,
  MobileContact,
  OperatingHours,
  SocialMediaLinks,
} from "./business-form-types";

interface StepValidationState {
  error?: string;
  fieldErrors?: Record<string, string>;
  isValid?: boolean;
}

interface AddBusinessState {
  error?: string;
  success?: boolean;
}

// Step 0: Basic Information Validation
export async function validateBasicInfoAction(
  prevState: StepValidationState,
  formData: FormData
): Promise<StepValidationState> {
  try {
    const business_name = formData.get("business_name") as string;
    const business_type = formData.get("business_type") as string;
    const contact_email = formData.get("contact_email") as string;
    const website = formData.get("website") as string;

    const fieldErrors: Record<string, string> = {};

    // Required field validation
    if (!business_name?.trim()) {
      fieldErrors.business_name = "Business name is required";
    } else if (business_name.trim().length < 2) {
      fieldErrors.business_name = "Business name must be at least 2 characters";
    }

    if (!business_type?.trim()) {
      fieldErrors.business_type = "Business type is required";
    }

    if (!contact_email?.trim()) {
      fieldErrors.contact_email = "Contact email is required";
    } else if (!/\S+@\S+\.\S+/.test(contact_email.trim())) {
      fieldErrors.contact_email = "Please enter a valid email address";
    }

    // Optional website validation
    if (website?.trim() && !/^https?:\/\/.+\..+/.test(website.trim())) {
      fieldErrors.website =
        "Please enter a valid website URL starting with http:// or https://";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { fieldErrors };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error in validateBasicInfoAction:", error);
    return { error: "Validation error occurred. Please try again." };
  }
}

// Step 1: Business Details Validation
export async function validateBusinessDetailsAction(
  prevState: StepValidationState,
  formData: FormData
): Promise<StepValidationState> {
  try {
    const legality_type = formData.get("legality_type") as string;
    const employees = formData.get("employees") as string;
    const years_in_trading = formData.get("years_in_trading") as string;

    const fieldErrors: Record<string, string> = {};

    if (!legality_type?.trim()) {
      fieldErrors.legality_type = "Legal structure is required";
    }

    if (!employees?.trim()) {
      fieldErrors.employees = "Number of employees is required";
    }

    if (!years_in_trading?.trim()) {
      fieldErrors.years_in_trading = "Years in trading is required";
    } else {
      const yearsNum = parseInt(years_in_trading, 10);
      if (isNaN(yearsNum) || yearsNum < 1 || yearsNum > 100) {
        fieldErrors.years_in_trading =
          "Years in trading must be between 1 and 100";
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { fieldErrors };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error in validateBusinessDetailsAction:", error);
    return { error: "Validation error occurred. Please try again." };
  }
}

// Step 2: Location Validation
export async function validateLocationAction(
  prevState: StepValidationState,
  formData: FormData
): Promise<StepValidationState> {
  try {
    const region = formData.get("region") as string;

    if (!region?.trim()) {
      return {
        fieldErrors: {
          region: "Business location is required",
        },
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error in validateLocationAction:", error);
    return { error: "Validation error occurred. Please try again." };
  }
}

// Step 3: Work Types Validation
export async function validateWorkTypesAction(
  prevState: StepValidationState,
  formData: FormData
): Promise<StepValidationState> {
  try {
    const types_of_work_undertaken = formData.get(
      "types_of_work_undertaken"
    ) as string;

    let workTypesArray: string[] = [];

    try {
      workTypesArray = types_of_work_undertaken
        ? JSON.parse(types_of_work_undertaken)
        : [];
    } catch (parseError) {
      console.error("Error parsing work types:", parseError);
      return {
        error: "Invalid work types data format",
      };
    }

    if (!Array.isArray(workTypesArray) || workTypesArray.length === 0) {
      return {
        fieldErrors: {
          types_of_work_undertaken: "At least one type of work is required",
        },
      };
    }

    // Validate that work types are not empty strings
    const validWorkTypes = workTypesArray.filter((type) => type && type.trim());
    if (validWorkTypes.length === 0) {
      return {
        fieldErrors: {
          types_of_work_undertaken:
            "At least one valid type of work is required",
        },
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error in validateWorkTypesAction:", error);
    return { error: "Validation error occurred. Please try again." };
  }
}

// Helper function to check if business name exists for user
async function checkBusinessNameExists(
  businessName: string,
  userId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("id")
      .eq("business_name", businessName.trim())
      .eq("auth_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error
      console.error("Error checking business name:", error);
      return false; // If we can't check, allow it through
    }

    return !!data; // Returns true if business exists
  } catch (error) {
    console.error("Error in checkBusinessNameExists:", error);
    return false;
  }
}

// Final submission action
export async function addBusinessAction(
  prevState: AddBusinessState,
  formData: FormData
): Promise<AddBusinessState> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Extract form data
    const business_name = formData.get("business_name") as string;
    const business_type = formData.get("business_type") as string;
    const business_number = formData.get("business_number") as string;
    const description = formData.get("description") as string;
    const website = formData.get("website") as string;
    const contact_email = formData.get("contact_email") as string;
    const phone_number = formData.get("phone_number") as string;
    const logo_url = formData.get("logo_url") as string;
    const region = formData.get("region") as string;
    const legality_type = formData.get("legality_type") as string;
    const employees = formData.get("employees") as string;
    const years_in_trading = formData.get("years_in_trading") as string;
    const types_of_work_undertaken = formData.get(
      "types_of_work_undertaken"
    ) as string;
    const serviced_areas = formData.get("serviced_areas") as string;

    // Validate required fields
    if (!business_name?.trim()) {
      return { error: "Business name is required" };
    }

    if (!business_type?.trim()) {
      return { error: "Business type is required" };
    }

    if (!contact_email?.trim()) {
      return { error: "Contact email is required" };
    }

    if (!legality_type?.trim()) {
      return { error: "Legal structure is required" };
    }

    if (!employees?.trim()) {
      return { error: "Number of employees is required" };
    }

    if (!region?.trim()) {
      return { error: "Business location is required" };
    }

    // Check if business name already exists for this user
    const businessExists = await checkBusinessNameExists(
      business_name,
      user.id
    );
    if (businessExists) {
      return {
        error: "A business with this name already exists for your account.",
      };
    }

    // Parse arrays
    let workTypesArray: string[] = [];
    let serviceAreasArray: string[] = [];

    try {
      workTypesArray = types_of_work_undertaken
        ? JSON.parse(types_of_work_undertaken)
        : [];
      serviceAreasArray = serviced_areas ? JSON.parse(serviced_areas) : [];
    } catch (parseError) {
      console.error("Error parsing arrays:", parseError);
      return {
        error: "Data formatting error. Please try again.",
      };
    }

    // Validate work types
    if (!Array.isArray(workTypesArray) || workTypesArray.length === 0) {
      return {
        error: "At least one type of work is required.",
      };
    }

    // Clean and validate arrays
    workTypesArray = workTypesArray
      .filter((type) => type && type.trim())
      .map((type) => type.trim());
    serviceAreasArray = serviceAreasArray
      .filter((area) => area && area.trim())
      .map((area) => area.trim());

    if (workTypesArray.length === 0) {
      return {
        error: "At least one valid type of work is required.",
      };
    }

    // Validate years in trading
    const yearsInTradingNum = parseInt(years_in_trading, 10);
    if (
      isNaN(yearsInTradingNum) ||
      yearsInTradingNum < 1 ||
      yearsInTradingNum > 100
    ) {
      return {
        error: "Years in trading must be between 1 and 100.",
      };
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(contact_email.trim())) {
      return {
        error: "Please enter a valid contact email address.",
      };
    }

    // Validate website if provided
    if (website?.trim() && !/^https?:\/\/.+\..+/.test(website.trim())) {
      return {
        error:
          "Please enter a valid website URL starting with http:// or https://",
      };
    }

    // Prepare business data
    const businessData = {
      business_name: business_name.trim(),
      business_type: business_type.trim(),
      business_number: business_number?.trim() || null,
      description: description?.trim() || null,
      website: website?.trim() || null,
      contact_email: contact_email.trim().toLowerCase(),
      phone_number: phone_number?.trim() || null,
      logo_url: logo_url?.trim() || null,
      region: region.trim(),
      legality_type: legality_type.trim(),
      employees: employees.trim(),
      years_in_trading: yearsInTradingNum,
      types_of_work_undertaken: workTypesArray,
      serviced_areas: serviceAreasArray,
      auth_id: user.id,
    };

    // Insert business
    const { error: insertError } = await supabase
      .from("businesses")
      .insert(businessData);

    if (insertError) {
      console.error("Error creating business:", insertError);

      if (insertError.code === "23505") {
        // Handle unique constraint violations
        if (insertError.message?.includes("business_name")) {
          return {
            error: "A business with this name already exists for your account.",
          };
        }
        return {
          error:
            "This business information already exists. Please use different details.",
        };
      }

      // Handle other specific database errors
      if (insertError.code === "23502") {
        return {
          error:
            "Required business information is missing. Please check all fields.",
        };
      }

      if (insertError.code === "23514") {
        return {
          error:
            "Invalid business information provided. Please check your input.",
        };
      }

      return {
        error: "Unable to create business. Please try again.",
      };
    }

    // Success - redirect to businesses page
    redirect("/my-businesses");
  } catch (error) {
    console.error("Unexpected error in addBusinessAction:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Add this to your business-actions.ts file

interface UpdateBusinessData {
  id: string;
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

interface UpdateBusinessResult {
  success: boolean;
  error?: string;
  geocoded?: boolean;
  geocoding_error?: string;
}

export async function updateBusinessAction(
  data: UpdateBusinessData
): Promise<UpdateBusinessResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    // Verify ownership
    const { data: existingBusiness, error: ownershipError } = await supabase
      .from("businesses")
      .select("auth_id")
      .eq("id", data.id)
      .single();

    if (ownershipError || !existingBusiness) {
      return {
        success: false,
        error: "Business not found",
      };
    }

    if (existingBusiness.auth_id !== user.id) {
      return {
        success: false,
        error: "You do not have permission to edit this business",
      };
    }

    // Validate required fields
    if (!data.business_name?.trim()) {
      return { success: false, error: "Business name is required" };
    }

    if (!data.business_type?.trim()) {
      return { success: false, error: "Business type is required" };
    }

    if (!data.contact_email?.trim()) {
      return { success: false, error: "Contact email is required" };
    }

    if (!data.legality_type?.trim()) {
      return { success: false, error: "Legal structure is required" };
    }

    if (!data.employees?.trim()) {
      return { success: false, error: "Number of employees is required" };
    }

    if (!data.city?.trim()) {
      return { success: false, error: "City is required" };
    }

    // Validate work types
    if (
      !Array.isArray(data.types_of_work_undertaken) ||
      data.types_of_work_undertaken.length === 0
    ) {
      return {
        success: false,
        error: "At least one type of work is required",
      };
    }

    // Validate years in trading
    if (
      isNaN(data.years_in_trading) ||
      data.years_in_trading < 0 ||
      data.years_in_trading > 100
    ) {
      return {
        success: false,
        error: "Years in trading must be between 0 and 100",
      };
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(data.contact_email.trim())) {
      return {
        success: false,
        error: "Please enter a valid contact email address",
      };
    }

    // Validate website if provided
    if (
      data.website?.trim() &&
      !/^https?:\/\/.+\..+/.test(data.website.trim())
    ) {
      return {
        success: false,
        error:
          "Please enter a valid website URL starting with http:// or https://",
      };
    }

    // Geocode address if it has changed
    let latitude: number | null = null;
    let longitude: number | null = null;
    let geocoded = false;
    let geocoding_error: string | undefined;

    const fullAddress = [
      data.street_address,
      data.suburb,
      data.city,
      data.region,
      data.postal_code,
      "New Zealand",
    ]
      .filter(Boolean)
      .join(", ");

    // Check if address has changed by comparing with existing business
    const { data: oldBusiness } = await supabase
      .from("businesses")
      .select("street_address, suburb, city, region, postal_code")
      .eq("id", data.id)
      .single();

    const addressChanged =
      oldBusiness &&
      (oldBusiness.street_address !== data.street_address ||
        oldBusiness.suburb !== data.suburb ||
        oldBusiness.city !== data.city ||
        oldBusiness.region !== data.region ||
        oldBusiness.postal_code !== data.postal_code);

    if (addressChanged && fullAddress) {
      try {
        const geocodeResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            fullAddress
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );

        const geocodeData = await geocodeResponse.json();

        if (geocodeData.status === "OK" && geocodeData.results[0]) {
          latitude = geocodeData.results[0].geometry.location.lat;
          longitude = geocodeData.results[0].geometry.location.lng;
          geocoded = true;
        } else {
          geocoding_error = `Geocoding failed: ${geocodeData.status}`;
          console.warn(geocoding_error);
        }
      } catch (geocodeError) {
        geocoding_error =
          geocodeError instanceof Error
            ? geocodeError.message
            : "Unknown geocoding error";
        console.error("Geocoding error:", geocodeError);
      }
    }

    // Prepare update data
    const updateData: {
      business_name: string;
      business_type: string;
      nzbn_number: string | null;
      legality_type: string;
      years_in_trading: number;
      website: string | null;
      contact_email: string;
      mobile_contacts: MobileContact[];
      office_phone: string | null;
      types_of_work_undertaken: string[];
      employees: string;
      logo_url: string | null | undefined;
      cover_url: string | null | undefined;
      gallery_urls: string[];
      street_address: string | null;
      suburb: string | null;
      city: string;
      region: string | null;
      postal_code: string | null;
      is_multi_branch: boolean;
      branch_addresses: BranchAddress[];
      gst_registered: boolean;
      insurance_policies: string[];
      operating_hours: OperatingHours;
      out_of_zone_working: boolean;
      social_media_links: SocialMediaLinks;
      availability_date: string | null;
      certifications: string[];
      updated_at: string;
      latitude?: number;
      longitude?: number;
    } = {
      business_name: data.business_name.trim(),
      business_type: data.business_type.trim(),
      nzbn_number: data.nzbn_number?.trim() || null,
      legality_type: data.legality_type.trim(),
      years_in_trading: data.years_in_trading,
      website: data.website?.trim() || null,
      contact_email: data.contact_email.trim().toLowerCase(),
      mobile_contacts: data.mobile_contacts || [],
      office_phone: data.office_phone?.trim() || null,
      types_of_work_undertaken: data.types_of_work_undertaken,
      employees: data.employees.trim(),
      logo_url: data.logo_url || null,
      cover_url: data.cover_url || null,
      gallery_urls: data.gallery_urls || [],
      street_address: data.street_address?.trim() || null,
      suburb: data.suburb?.trim() || null,
      city: data.city.trim(),
      region: data.region?.trim() || null,
      postal_code: data.postal_code?.trim() || null,
      is_multi_branch: data.is_multi_branch || false,
      branch_addresses: data.branch_addresses || [],
      gst_registered: data.gst_registered || false,
      insurance_policies: data.insurance_policies || [],
      operating_hours: data.operating_hours || {},
      out_of_zone_working: data.out_of_zone_working || false,
      social_media_links: data.social_media_links || {},
      availability_date: data.availability_date || null,
      certifications: data.certifications || [],
      updated_at: new Date().toISOString(),
    };

    // Only update coordinates if address changed and geocoding succeeded
    if (addressChanged && latitude && longitude) {
      updateData.latitude = latitude;
      updateData.longitude = longitude;
    }

    // Update business
    const { error: updateError } = await supabase
      .from("businesses")
      .update(updateData)
      .eq("id", data.id);

    if (updateError) {
      console.error("Error updating business:", updateError);

      if (updateError.code === "23505") {
        if (updateError.message?.includes("business_name")) {
          return {
            success: false,
            error: "A business with this name already exists for your account",
          };
        }
        return {
          success: false,
          error: "This business information already exists",
        };
      }

      return {
        success: false,
        error: "Unable to update business. Please try again",
      };
    }

    return {
      success: true,
      geocoded: addressChanged ? geocoded : true,
      geocoding_error: addressChanged ? geocoding_error : undefined,
    };
  } catch (error) {
    console.error("Unexpected error in updateBusinessAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again",
    };
  }
}
