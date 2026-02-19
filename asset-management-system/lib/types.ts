export type UserRole = 'superadmin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  position?: string;
  role: UserRole;
  created_at?: string;
}

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
  floor_count?: number;
  created_at?: string;
  
  // Relations
  floors?: BuildingFloor[];
  blocks?: BuildingBlock[];
}

export interface BuildingFloor {
  id: string;
  building_id: string;
  floor_number: number;
  floor_name: string;
  created_at?: string;
}

export interface BuildingBlock {
  id: string;
  building_id: string;
  block_name: string;
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

export type LocationType = 'BLOCK' | 'EXTERNAL';
export type DA5Status = 'draft' | 'submitted';

export interface Officer {
  id: string;
  name: string;
  position: string;
  email?: string;
}

export interface DA5Registration {
  id: string;
  building_id: string;
  
  // Filler info
  filled_by_user_id: string;
  filled_by_name: string;
  filled_by_position: string;
  
  // On-behalf registration
  is_on_behalf: boolean;
  on_behalf_email?: string;
  on_behalf_name?: string;
  on_behalf_position?: string;
  
  // Authorizing officer
  officer_id: string;
  officer_name: string;
  officer_position: string;
  
  // Location details
  location_type: LocationType;
  block_name?: string;
  external_building_name?: string;
  floor?: string;
  room?: string;
  
  // Finishes
  floor_finish?: string;
  floor_area?: number;
  ceiling_finish?: string;
  ceiling_area?: number;
  wall_finish?: string;
  wall_area?: number;
  
  // GPS coordinates
  latitude?: number;
  longitude?: number;
  
  // Photos and notes
  photos?: string[];
  notes?: string;
  
  // Status
  status: DA5Status;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  building?: Building;
}

export interface FinishType {
  id: string;
  category: 'floor' | 'ceiling' | 'wall';
  name: string;
  created_at?: string;
}

export type DA6Status = 'draft' | 'submitted';
export type EquipmentStatus = 'Active' | 'Damaged' | 'Inactive';

export interface DA6Registration {
  id: string;
  building_id: string;
  floor_id?: string;
  asset_id?: string;
  
  // Filler info
  filled_by_user_id: string;
  filled_by_name: string;
  filled_by_position: string;
  
  // On-behalf registration
  is_on_behalf: boolean;
  on_behalf_email?: string;
  on_behalf_name?: string;
  on_behalf_position?: string;
  
  // Authorizing officer
  officer_id: string;
  officer_name: string;
  officer_position: string;
  
  // Equipment details
  status: EquipmentStatus;
  quantity: number;
  measurement_value?: number;
  measurement_unit?: 'm' | 'm2';
  
  // GPS coordinates
  latitude?: number;
  longitude?: number;
  
  // Photos and notes
  photos?: string[];
  notes?: string;
  
  // Status
  status_record: DA6Status;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  building?: Building;
  floor?: BuildingFloor;
  asset?: Asset;

}


export interface DA6Registration {
  id: string;
  building_id: string;
  floor_id?: string;
  asset_id?: string;
  
  // Filler info
  filled_by_user_id: string;
  filled_by_name: string;
  filled_by_position: string;
  
  // On-behalf registration
  is_on_behalf: boolean;
  on_behalf_email?: string;
  on_behalf_name?: string;
  on_behalf_position?: string;
  
  // Authorizing officer
  officer_id: string;
  officer_name: string;
  officer_position: string;
  
  // Equipment details
  status: EquipmentStatus;
  quantity: number;
  measurement_value?: number;
  measurement_unit?: 'm' | 'm2';
  
  // GPS coordinates
  latitude?: number;
  longitude?: number;
  
  // Photos and notes
  photos?: string[];
  notes?: string;
  
  // Status
  status_record: DA6Status;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  building?: Building;
  floor?: BuildingFloor;
  asset?: Asset;

}
