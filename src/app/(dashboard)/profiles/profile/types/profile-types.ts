// src/app/profile/types/profile-types.ts

// Skill and Accreditation item types
export interface SkillItem {
  trade: string;
  skill: string;
}

export interface AccreditationItem {
  category: string;
  accreditation: string;
}

export interface UserProfile {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string | null;
  provider_id: string;

  // Trade profile fields
  trade_profile_enabled: boolean;
  bio: string | null;
  contact_email: string | null;
  mobile: string | null;
  website: string | null;
  region: string | null;
  suburb: string | null;
  city: string | null;
  primary_trade_role: string | null;
  secondary_trade_roles: string[] | null;
  max_servicable_radius: number;
  skills: string[] | null;
  accreditations: string[] | null;
  years_in_trade: number;
  gallery_urls: string[] | null;
}

export interface ProfileFormData {
  // User profile
  first_name: string;
  last_name: string;
  username: string;

  // Trade profile
  trade_profile_enabled: boolean;
  bio: string;
  contact_email: string;
  mobile: string;
  website: string;
  region: string;
  suburb: string;
  city: string;
  primary_trade_role: string;
  secondary_trade_roles: string[];
  max_servicable_radius: number;
  // Allow both string arrays and structured objects
  skills: (string | SkillItem)[];
  accreditations: (string | AccreditationItem)[];
  years_in_trade: number;

  // Image URLs
  avatar_url?: string | null;
  cover_url?: string | null;
  gallery_urls?: string[];
}
