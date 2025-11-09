// src/app/profile/profile-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  ProfileFormData,
  SkillItem,
  AccreditationItem,
} from "./types/profile-types";

interface ProfileActionResult {
  success: boolean;
  error?: string;
}

interface ProfileUpdateData {
  username: string;
  first_name: string;
  last_name: string;
  trade_profile_enabled: boolean;
  updated_at: string;
  avatar_url?: string | null;
  cover_url?: string | null;
  gallery_urls?: string[];
  bio?: string | null;
  contact_email?: string | null;
  mobile?: string | null;
  website?: string | null;
  region?: string | null;
  primary_trade_role?: string | null;
  secondary_trade_roles?: string[];
  max_servicable_radius?: number;
  skills?: string[];
  accreditations?: string[];
  years_in_trade?: number;
}

export async function updateProfileAction(
  formData: ProfileFormData
): Promise<ProfileActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Handle auth errors
  if (authError) {
    console.error("Auth error:", authError);
    return {
      success: false,
      error: "Authentication error. Please try logging in again.",
    };
  }

  if (!user) {
    redirect("/login");
  }

  try {
    // Validate required user fields
    if (!formData.username?.trim()) {
      return { success: false, error: "Username is required" };
    }

    if (!formData.first_name?.trim()) {
      return { success: false, error: "First name is required" };
    }

    if (!formData.last_name?.trim()) {
      return { success: false, error: "Last name is required" };
    }

    // Check if username is taken by another user
    if (formData.username) {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", formData.username.trim().toLowerCase())
        .neq("id", user.id)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: "Username is already taken",
        };
      }
    }

    // Validate trade profile fields if enabled
    if (formData.trade_profile_enabled) {
      if (
        formData.contact_email?.trim() &&
        !/\S+@\S+\.\S+/.test(formData.contact_email)
      ) {
        return { success: false, error: "Please enter a valid email address" };
      }

      if (formData.max_servicable_radius < 0) {
        return {
          success: false,
          error: "Service radius cannot be negative",
        };
      }
    }

    // Combine suburb and city into region string
    let regionString = formData.region?.trim() || "";
    if (formData.suburb?.trim() && formData.city?.trim()) {
      regionString = `${formData.suburb.trim()}, ${formData.city.trim()}`;
    } else if (formData.city?.trim()) {
      regionString = formData.city.trim();
    } else if (formData.suburb?.trim()) {
      regionString = formData.suburb.trim();
    }

    // Prepare profile data
    const profileData: ProfileUpdateData = {
      username: formData.username.trim().toLowerCase(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      trade_profile_enabled: formData.trade_profile_enabled,
      updated_at: new Date().toISOString(),
    };

    // Add image URLs if provided
    if (formData.avatar_url !== undefined) {
      profileData.avatar_url = formData.avatar_url;
    }
    if (formData.cover_url !== undefined) {
      profileData.cover_url = formData.cover_url;
    }
    if (formData.gallery_urls !== undefined) {
      profileData.gallery_urls = formData.gallery_urls;
    }

    // Helper function to flatten and filter skills
    const processSkills = (skills: (string | SkillItem)[]): string[] => {
      if (!skills || !Array.isArray(skills)) return [];

      return skills
        .map((skill) => {
          if (!skill) return null;

          // If it's already a string, keep it
          if (typeof skill === "string") {
            return skill.trim();
          }

          // If it's an object with trade and skill properties, flatten it
          if (
            typeof skill === "object" &&
            "trade" in skill &&
            "skill" in skill
          ) {
            return `${skill.trade}: ${skill.skill}`;
          }

          return null;
        })
        .filter((skill): skill is string => skill !== null && skill.length > 0);
    };

    // Helper function to flatten and filter accreditations
    const processAccreditations = (
      accreditations: (string | AccreditationItem)[]
    ): string[] => {
      if (!accreditations || !Array.isArray(accreditations)) return [];

      return accreditations
        .map((acc) => {
          if (!acc) return null;

          // If it's already a string, keep it
          if (typeof acc === "string") {
            return acc.trim();
          }

          // If it's an object with category and accreditation properties, flatten it
          if (
            typeof acc === "object" &&
            "category" in acc &&
            "accreditation" in acc
          ) {
            return `${acc.category}: ${acc.accreditation}`;
          }

          return null;
        })
        .filter((acc): acc is string => acc !== null && acc.length > 0);
    };

    // Add trade profile fields if enabled
    if (formData.trade_profile_enabled) {
      profileData.bio = formData.bio?.trim() || null;
      profileData.contact_email =
        formData.contact_email?.trim().toLowerCase() || null;
      profileData.mobile = formData.mobile?.trim() || null;
      profileData.website = formData.website?.trim()
        ? formData.website.startsWith("http")
          ? formData.website
          : `https://${formData.website}`
        : null;
      profileData.region = regionString || null;
      profileData.primary_trade_role =
        formData.primary_trade_role?.trim() || null;
      profileData.secondary_trade_roles =
        formData.secondary_trade_roles?.filter((role) => role && role.trim()) ||
        [];
      profileData.max_servicable_radius = formData.max_servicable_radius || 50;
      profileData.skills = processSkills(formData.skills);
      profileData.accreditations = processAccreditations(
        formData.accreditations
      );
      profileData.years_in_trade = formData.years_in_trade || 0;
    } else {
      // Clear trade profile fields if disabled
      profileData.bio = null;
      profileData.contact_email = null;
      profileData.mobile = null;
      profileData.website = null;
      profileData.region = null;
      profileData.primary_trade_role = null;
      profileData.secondary_trade_roles = [];
      profileData.max_servicable_radius = 50;
      profileData.skills = [];
      profileData.accreditations = [];
      profileData.years_in_trade = 0;
    }

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);

      if (updateError.code === "23505") {
        return {
          success: false,
          error: "Username is already taken",
        };
      }

      return {
        success: false,
        error: "Unable to update profile. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in updateProfileAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function getProfileAction(userId?: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Auth error:", authError);
    return null;
  }

  if (!user && !userId) {
    return null;
  }

  const targetUserId = userId || user!.id;

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", targetUserId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error("Unexpected error in getProfileAction:", error);
    return null;
  }
}

export async function toggleTradeProfileAction(
  enabled: boolean
): Promise<ProfileActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Auth error:", authError);
    return {
      success: false,
      error: "Authentication error. Please try logging in again.",
    };
  }

  if (!user) {
    redirect("/login");
  }

  try {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        trade_profile_enabled: enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error toggling trade profile:", updateError);
      return {
        success: false,
        error: "Unable to update trade profile status. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in toggleTradeProfileAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
