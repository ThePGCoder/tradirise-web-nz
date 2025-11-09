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
