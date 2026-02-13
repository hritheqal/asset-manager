export type AssetStatus = 'active' | 'maintenance' | 'retired' | 'disposed';
export type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor';

export interface AssetCategory {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  description?: string;
  created_at?: string;
}

export interface AssetImage {
  id: string;
  asset_id: string;
  image_url: string;
  storage_path: string;
  is_primary: boolean;
  caption?: string;
  created_at?: string;
}

export interface Asset {
  id: string;
  asset_tag: string;
  name: string;
  description?: string;
  category_id: string;
  building_id?: string;
  room_location?: string;
  status: AssetStatus;
  condition: AssetCondition;
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  serial_number?: string;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  category?: AssetCategory;
  building?: Building;
  images?: AssetImage[];
}

export interface MaintenanceLog {
  id: string;
  asset_id: string;
  maintenance_date: string;
  maintenance_type: string;
  performed_by: string;
  description: string;
  cost?: number;
  created_at?: string;
}
