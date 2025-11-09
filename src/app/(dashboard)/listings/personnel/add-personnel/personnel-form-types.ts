// src/types/personnel-form-types.ts

export interface SkillItem {
  trade: string;
  skill: string;
}

export interface AccreditationItem {
  category: string;
  accreditation: string;
}

export interface PersonnelFormData {
  first_name: string;
  last_name: string;
  bio: string;
  contact_email: string;
  mobile: string;
  website?: string;
  region: string;
  suburb?: string;
  city: string;
  primary_trade_role: string;
  secondary_trade_roles: string[];
  max_servicable_radius: number;
  skills: SkillItem[];
  accreditations: AccreditationItem[];
  available_from: string;
  is_for_self: boolean;
  posted_by_name: string;
}
