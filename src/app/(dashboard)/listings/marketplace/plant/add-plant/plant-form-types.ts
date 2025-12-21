// app/listings/marketplace/plant/add/plant-form-types.ts

export interface PlantFormData {
  title: string;
  description: string;
  equipment_type: string;
  category: string;
  make?: string;
  model?: string;
  year?: number;
  condition: string;
  sale_price: number;
  price_type: string; // 'fixed', 'negotiable', 'or near offer'
  hours_used?: number;
  specifications?: Record<string, string | number | boolean>;
  features: string[];
  delivery_available: boolean;
  region: string;
  images: string[]; // Array of R2 URLs
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  is_business_listing: boolean;
  business_id?: string;
}
