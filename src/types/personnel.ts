// Personnel interface based on the data structure
export interface Personnel {
  id: string;
  created_at: string;
  updated_at: string;
  region: string;
  primary_trade_role: string;
  max_servicable_radius: number;

  accreditations: string[];
  auth_id: string;
  available_from: string;
  bio: string | null;
  contact_email: string | null;
  first_name: string | null;
  last_name: string | null;
  is_for_self: boolean | null;
  mobile: string | null;
  posted_by_name: string | null;

  skills: string[] | null;
  website: string | null;
  years_in_trade: string | null;
  secondary_trade_roles: string[] | null;
}

// Optional: Helper type for creating new personnel (without system-generated fields)
export type CreatePersonnelInput = Omit<
  Personnel,
  "id" | "created_at" | "updated_at"
>;

// Optional: Helper type for updating personnel (all fields optional except id)
export type UpdatePersonnelInput = Partial<
  Omit<Personnel, "id" | "created_at" | "auth_id">
> & {
  id: string;
};
