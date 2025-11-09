// src/types/business-form.ts
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

export interface ImageFile {
  file: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
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

  // Images (stored as files until upload)
  logo_file?: ImageFile;
  cover_file?: ImageFile;
  gallery_files: ImageFile[];

  // Address
  street_address?: string;
  suburb?: string;
  city: string;
  region?: string;
  postal_code?: string;

  // Multi-branch
  is_multi_branch: boolean;
  branch_addresses: BranchAddress[];

  // New fields
  gst_registered: boolean;
  insurance_policies: string[];
  operating_hours: OperatingHours;
  out_of_zone_working: boolean;
  social_media_links: SocialMediaLinks;
  availability_date?: string;
  certifications: string[];
}
