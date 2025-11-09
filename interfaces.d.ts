type ExperienceEntry = [company: string, years: string, role: string];

// types/index.ts

interface ProfileData {
  id: string;
  created_at: Date;
  updated_at: Date;
  first_name: string;
  last_name: string;

  region: string;
  contact_email: string;
  mobile: string;
  website: string;
  bio: string;
  roles: string[];
  primary_trade_role: string;
  max_servicable_radius: number;
  serviced_areas: string[];
  username: string;
  email: string;
  avatar_url?: string;
  cover_url?: string;
  history: string[][];
  skills: string[];
  accreditations: string[];
  gallery_urls: string[];
  provider_id: string;
}

interface Business {
  id: string;
  business_name: string;
  business_type: string;
  business_number: string;
  legality_type: string;
  street_address: string;
  suburb: string;
  years_in_trading: number;
  website: string;
  contact_email: string;
  phone_number: string;
  types_of_work_undertaken: string[];
  employees: string;
  created_at: string;
  logo_url?: string;
  cover_url?: string;
  gallery_urls?: string[];
}

export interface MobileContact {
  name: string;
  number: string;
}

export interface BranchAddress {
  name: string;
  street_address: string;
  suburb: string;
  city: string;
  postal_code: string;
  region: string;
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

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

export interface Business {
  id: string;
  auth_id: string;
  business_name: string;
  business_type: string;
  nzbn_number: string | null;
  legality_type: string;
  years_in_trading: number;
  website: string | null;
  contact_email: string;
  phone_number: string | null;
  types_of_work_undertaken: string[];
  employees: string;
  created_at: string;
  cover_url: string | null;
  logo_url: string | null;
  gallery_urls: string[];
  promoted_date: string | null;
  region: string;
  serviced_areas: string[] | null;
  description: string | null;
  street_address: string;
  suburb: string;
  city: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  geocoding_status: string;
  geocoding_error: string | null;
  geocoded_at: string;
  updated_at: string;
  formatted_address: string;
  gst_registered: boolean;
  mobile_contacts: MobileContact[];
  office_phone: string | null;
  insurance_policies: string[];
  operating_hours: OperatingHours;
  is_multi_branch: boolean;
  branch_addresses: BranchAddress[];
  out_of_zone_working: boolean;
  social_media_links: SocialMediaLinks;
  is_verified: boolean;
  verified_at: string | null;
  availability_date: string | null;
  certifications: string[];
}

interface TradieAdvertisement {
  name: string;
  email: string;
  phone: string;
  business_name: string;
  description: string;
  skills: string[];
  location: string;
  profile_id: string;
  expires_at: string;
}

/*interface PersonnelData {
  id: string;
  created_at: Date;
  updated_at: Date;
  available_from: Date;
  region: string;

  primary_trade_role: string;
  max_servicable_radius: number;
  serviced_areas: string[];

  accreditations: string[];
  auth_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  } | null;
}*/

interface SkillCategory {
  id: string;
  name: string;
  trades: Trade[];
}

interface Trade {
  id: string;
  name: string;
  skills: string[];
}

interface AccreditationCategory {
  id: string;
  name: string;
  accreditations: Accreditation[];
}

interface Accreditation {
  id: string;
  name: string;
  descriptions: string[];
}
