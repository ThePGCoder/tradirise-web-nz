type Remuneration = "labour_only" | "wages";
type RateType = "hourly" | "daily";
type PositionStatus = "active" | "inactive" | "closed";

export interface Position {
  id: string;
  title: string;
  trade: string;
  description: string;
  region: string;
  rate: string;
  remuneration: Remuneration;
  start_date: string;
  good_to_have: string[];
  requirements: string[];
  benefits: string[];
  website: string | null;
  contact_email: string;
  contact_phone: string | null;
  posted_by: string;
  is_business_listing: boolean;
  auth_id: string;
  posted_date: string;
  updated_at: string;
  status: PositionStatus;
  views: number;
  applications: number;
  business_id: string | null;
  rate_type: RateType | null;
}
