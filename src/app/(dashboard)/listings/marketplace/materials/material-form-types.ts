// app/listings/marketplace/material/add/material-form-types.ts

export interface MaterialFormData {
  title: string;
  description: string;
  material_type: string;
  category: string;
  condition: string;
  quantity: number;
  unit: string;
  price: number;
  price_type: string;
  price_unit?: string;
  grade_quality?: string;
  dimensions?: string;
  brand?: string;
  specifications?: Record<string, string | number | boolean>;
  delivery_available: boolean;
  delivery_cost?: string;
  minimum_order?: string;
  available_quantity?: number;
  location_details?: string;
  region: string;
  images: string[];
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  is_business_listing: boolean;
  business_id?: string;
}
