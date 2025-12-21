// app/listings/marketplace/vehicles/add/vehicle-form-types.ts

export interface VehicleFormData {
  title: string;
  description: string;
  vehicle_type: string;
  make: string;
  model: string;
  year: number;
  condition: string;
  price: number;
  price_type: string;
  mileage?: number;
  registration_expires?: string;
  wof_expires?: string;
  transmission?: string;
  fuel_type?: string;
  features: string[];
  region: string;
  images: string[]; // Array of R2 URLs
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  is_business_listing: boolean;
  business_id?: string;
}
