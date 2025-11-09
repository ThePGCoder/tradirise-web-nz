// src/types/position-form-types.ts

export interface PositionFormData {
  title: string;
  trade: string;
  description: string;
  region: string;
  suburb?: string;
  city: string;
  rate: string;
  rate_type?: "hourly" | "daily" | "weekly" | "project";
  remuneration: "wages" | "labour_only" | "negotiable";
  start_date: string;
  good_to_have: string[];
  requirements: string[];
  benefits: string[];
  website?: string;
  contact_email: string;
  contact_phone?: string; // This stays as contact_phone (for the form field)
  posted_by: string;
  is_business_listing: boolean;
  business_id?: string;
}
