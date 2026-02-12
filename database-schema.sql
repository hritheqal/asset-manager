-- Asset Management System Database Schema
-- Run this entire script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create buildings table
CREATE TABLE buildings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  description TEXT,
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
