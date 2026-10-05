-- Asset Management System Database Schema
-- Run this entire script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create buildings table
CREATE TABLE buildings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  floor_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create asset_categories table
CREATE TABLE asset_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create assets table
CREATE TABLE assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  asset_tag VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES asset_categories(id),
  building_id UUID REFERENCES buildings(id) ON DELETE SET NULL,
  room_location VARCHAR(100),
  purchase_date DATE,
  purchase_price DECIMAL(10, 2),
  current_value DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired', 'disposed')),
  condition VARCHAR(50) DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  serial_number VARCHAR(100),
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  warranty_expiry DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create asset_images table
CREATE TABLE asset_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create maintenance_logs table
CREATE TABLE maintenance_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  maintenance_date DATE NOT NULL,
  maintenance_type VARCHAR(50) CHECK (maintenance_type IN ('routine', 'repair', 'inspection', 'other')),
  performed_by VARCHAR(100),
  description TEXT,
  cost DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX idx_assets_building_id ON assets(building_id);
CREATE INDEX idx_assets_category_id ON assets(category_id);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_asset_images_asset_id ON asset_images(asset_id);
CREATE INDEX idx_maintenance_logs_asset_id ON maintenance_logs(asset_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO asset_categories (name, description) VALUES
  ('Furniture', 'Office and building furniture'),
  ('Electronics', 'Computers, monitors, and electronic devices'),
  ('Equipment', 'Specialized equipment and machinery'),
  ('Vehicles', 'Government vehicles'),
  ('HVAC', 'Heating, ventilation, and air conditioning systems'),
  ('Security', 'Security systems and equipment'),
  ('Office Supplies', 'Office equipment and supplies');

-- Enable Row Level Security (RLS)
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all for now - customize based on your auth needs)
CREATE POLICY "Enable read access for all users" ON buildings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON buildings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON buildings FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON buildings FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON asset_categories FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON assets FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON assets FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON assets FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON asset_images FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON asset_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON asset_images FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON asset_images FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON maintenance_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON maintenance_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON maintenance_logs FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON maintenance_logs FOR DELETE USING (true);

-- Create da5_registrations table
CREATE TABLE da5_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  
  -- Filler info
  filled_by_user_id UUID NOT NULL,
  filled_by_name VARCHAR(255) NOT NULL,
  filled_by_position VARCHAR(255) NOT NULL,
  
  -- On-behalf registration
  is_on_behalf BOOLEAN DEFAULT FALSE,
  on_behalf_email VARCHAR(255),
  on_behalf_name VARCHAR(255),
  on_behalf_position VARCHAR(255),
  
  -- Authorizing officer
  officer_id UUID,
  officer_name VARCHAR(255) NOT NULL,
  officer_position VARCHAR(255) NOT NULL,
  
  -- Location details
  location_type VARCHAR(50) CHECK (location_type IN ('BLOCK', 'EXTERNAL')),
  block_name VARCHAR(255),
  external_building_name VARCHAR(255),
  floor VARCHAR(100),
  room VARCHAR(100),
  
  -- Finishes
  floor_finish VARCHAR(255),
  floor_area DECIMAL(10, 2),
  ceiling_finish VARCHAR(255),
  ceiling_area DECIMAL(10, 2),
  wall_finish VARCHAR(255),
  wall_area DECIMAL(10, 2),
  
  -- GPS coordinates
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Photos and notes
  photos TEXT[],
  notes TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for da5_registrations
CREATE INDEX idx_da5_registrations_building_id ON da5_registrations(building_id);
CREATE INDEX idx_da5_registrations_filled_by_user_id ON da5_registrations(filled_by_user_id);
CREATE INDEX idx_da5_registrations_status ON da5_registrations(status);
CREATE INDEX idx_da5_registrations_created_at ON da5_registrations(created_at);

-- Apply trigger to da5_registrations
CREATE TRIGGER update_da5_registrations_updated_at BEFORE UPDATE ON da5_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for da5_registrations
ALTER TABLE da5_registrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for da5_registrations
CREATE POLICY "Enable read access for all users" ON da5_registrations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON da5_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON da5_registrations FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON da5_registrations FOR DELETE USING (true);

-- Create building_floors table
CREATE TABLE IF NOT EXISTS building_floors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL,
    floor_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create building_blocks table
CREATE TABLE IF NOT EXISTS building_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    block_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for building_floors and building_blocks
CREATE INDEX IF NOT EXISTS idx_building_floors_building ON building_floors(building_id);
CREATE INDEX IF NOT EXISTS idx_building_blocks_building ON building_blocks(building_id);
CREATE INDEX IF NOT EXISTS idx_building_floors_number ON building_floors(floor_number);

-- Enable Row Level Security for building_floors and building_blocks
ALTER TABLE building_floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE building_blocks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for building_floors and building_blocks
CREATE POLICY "Enable read access for all users" ON building_floors FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON building_floors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON building_floors FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON building_floors FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON building_blocks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON building_blocks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON building_blocks FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON building_blocks FOR DELETE USING (true);

-- Create da6_registrations table (Equipment Registration)
CREATE TABLE da6_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  floor_id UUID REFERENCES building_floors(id) ON DELETE SET NULL,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  
  -- Filler info
  filled_by_user_id UUID NOT NULL,
  filled_by_name VARCHAR(255) NOT NULL,
  filled_by_position VARCHAR(255) NOT NULL,
  
  -- On-behalf registration
  is_on_behalf BOOLEAN DEFAULT FALSE,
  on_behalf_email VARCHAR(255),
  on_behalf_name VARCHAR(255),
  on_behalf_position VARCHAR(255),
  
  -- Authorizing officer
  officer_id UUID,
  officer_name VARCHAR(255) NOT NULL,
  officer_position VARCHAR(255) NOT NULL,
  
  -- Equipment details
  status VARCHAR(50) CHECK (status IN ('Active', 'Damaged', 'Inactive')),
  quantity INTEGER NOT NULL DEFAULT 1,
  measurement_value DECIMAL(10, 2),
  measurement_unit VARCHAR(10) CHECK (measurement_unit IN ('m', 'm2')),
  
  -- Photos and notes
  photos TEXT[],
  notes TEXT,
  
  -- Status
  status_record VARCHAR(50) DEFAULT 'draft' CHECK (status_record IN ('draft', 'submitted')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for da6_registrations
CREATE INDEX idx_da6_registrations_building_id ON da6_registrations(building_id);
CREATE INDEX idx_da6_registrations_floor_id ON da6_registrations(floor_id);
CREATE INDEX idx_da6_registrations_asset_id ON da6_registrations(asset_id);
CREATE INDEX idx_da6_registrations_filled_by_user_id ON da6_registrations(filled_by_user_id);
CREATE INDEX idx_da6_registrations_status_record ON da6_registrations(status_record);
CREATE INDEX idx_da6_registrations_created_at ON da6_registrations(created_at);

-- Apply trigger to da6_registrations
CREATE TRIGGER update_da6_registrations_updated_at BEFORE UPDATE ON da6_registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for da6_registrations
ALTER TABLE da6_registrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for da6_registrations
CREATE POLICY "Enable read access for all users" ON da6_registrations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON da6_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON da6_registrations FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON da6_registrations FOR DELETE USING (true);
