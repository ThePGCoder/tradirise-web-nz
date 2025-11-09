// src/app/listings/projects/add-project/project-form-types.ts
export interface ProjectFormData {
  title: string;
  required_trades: string[];
  description: string;
  region: string;
  suburb?: string;
  city: string;
  price_range: string;
  budget_type: string;
  budget_min?: string;
  budget_max?: string;
  proposed_start_date: string;
  project_duration: string;
  contact_email: string;
  contact_phone?: string;
  company_name: string;
  project_type: string;
  materials_provided: string[];
  posted_by: string;
  is_business_listing: boolean;
  business_id?: string;
}
