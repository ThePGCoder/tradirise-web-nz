export interface Project {
  id: string;
  title: string;
  required_trades: string[];
  description: string;
  region: string;
  price_range: string;
  proposed_start_date: string;
  project_duration: string;
  project_type: string;
  materials_provided: string[];
  contact_email: string;
  contact_phone: string | null;
  company_name: string;
  posted_by: string;
  is_business_listing: boolean;
  auth_id: string;
  posted_date: string;
  updated_at: string;
  status: string;
  business_id: string;
}
