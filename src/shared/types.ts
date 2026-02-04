export interface Quote {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shop_name?: string;
  shop_address: string;
  shop_latitude: number;
  shop_longitude: number;
  machine_type?: string;
  issue_description: string;
  preferred_date?: string;
  travel_distance?: number;
  estimated_cost?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: number;
  title?: string;
  description?: string;
  image_key: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
