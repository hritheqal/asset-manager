-- =====================================================
-- Add building_type Column
-- =====================================================
-- Run this SQL in Supabase SQL Editor
-- =====================================================

-- Add building_type column to buildings table
ALTER TABLE buildings ADD COLUMN IF NOT EXISTS building_type VARCHAR(20) DEFAULT 'block' 
  CHECK (building_type IN ('block', 'outdoor'));

-- Update existing buildings to have proper types (if needed)
-- This is optional - will set default for any NULL values
UPDATE buildings SET building_type = 'block' WHERE building_type IS NULL;

-- =====================================================
-- Insert 22 Predefined Buildings (Blocks + Outdoor Structures)
-- =====================================================

-- Insert Blocks (15 buildings)
INSERT INTO buildings (name, description, floor_count, building_type) VALUES
('Guiding Gallery 1 (Information Centre) - P7', 'Commercial Building - Guiding Gallery 1', 1, 'block'),
('Guiding Gallery 2 (Cafe) - P7', 'Restaurant - Guiding Gallery 2', 1, 'block'),
('Guiding Gallery 3 (Viewing Deck) - P7', 'Commercial Building - Guiding Gallery 3', 1, 'block'),
('Guiding Light Cafe - 3A3B', 'Restaurant - Guiding Light Cafe', 1, 'block'),
('Promenade Cafe - 3A3B', 'Restaurant - Promenade Cafe', 1, 'block'),
('Selera Medan Bunus - 1C1D', 'Restaurant - Selera Medan Bunus', 1, 'block'),
('Cafe Jalan Tun Perak - 1C1D', 'Restaurant - Cafe Jalan Tun Perak', 1, 'block'),
('Kiosk 1 Pocket Park - 1C1D', 'Restaurant - Kiosk 1 Pocket Park', 1, 'block'),
('Kiosk 2 Pocket Park - 1C1D', 'Restaurant - Kiosk 2 Pocket Park', 1, 'block'),
('Old Train Station Guiding Gallery - 4A4B', 'Commercial Building - Old Train Station', 1, 'block'),
('Bike Repair Kiosk - 4A4B', 'Commercial Building - Bike Repair Kiosk', 1, 'block'),
('F&B Kiosk - 4A4B', 'Restaurant - F&B Kiosk', 1, 'block'),
('Community Guiding Gallery - 4A4B', 'Commercial Building - Community Guiding Gallery', 1, 'block'),
('Southern Gateway Guiding Gallery - 4A4B', 'Commercial Building - Southern Gateway', 1, 'block'),
('Utility Room / Pump House - 1C1D', 'Pump House - Utility Room', 1, 'block')
ON CONFLICT DO NOTHING;

-- Insert Outdoor Structures (7 buildings)
INSERT INTO buildings (name, description, floor_count, building_type) VALUES
('Cottage/ Pavilion', 'Outdoor Structure - Cottage/ Pavilion', 1, 'outdoor'),
('Landscape', 'Outdoor Structure - Landscape', 1, 'outdoor'),
('Bus Stop/ Taxi Stop', 'Outdoor Structure - Bus Stop/ Taxi Stop', 1, 'outdoor'),
('Fencing', 'Outdoor Structure - Fencing', 1, 'outdoor'),
('Walkway/ Pedestrian/ Footpath', 'Outdoor Structure - Walkway/ Pedestrian/ Footpath', 1, 'outdoor'),
('Overhead Crossing', 'Outdoor Structure - Overhead Crossing', 1, 'outdoor'),
('Pump House', 'Outdoor Structure - Pump House', 1, 'outdoor')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Create Floors for Each Building
-- =====================================================

-- Function to get building IDs and create floors
-- This will be executed after buildings are inserted

-- Get the IDs and create floors for each building
DO $$
DECLARE
    b RECORD;
    floor_name TEXT;
BEGIN
    -- Create floors for all 22 buildings
    FOR b IN SELECT id, name, floor_count FROM buildings LOOP
        -- Ground Floor (ARAS LANTAI)
        INSERT INTO building_floors (building_id, floor_number, floor_name)
        VALUES (b.id, 0, 'Ground Floor')
        ON CONFLICT DO NOTHING;
        
        -- Floor 1 (ARAS SATU)
        INSERT INTO building_floors (building_id, floor_number, floor_name)
        VALUES (b.id, 1, 'Floor 1')
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;

-- =====================================================
-- Update DA5 Registrations location_type constraint
-- =====================================================
ALTER TABLE da5_registrations DROP CONSTRAINT IF EXISTS da5_registrations_location_type_check;
ALTER TABLE da5_registrations ADD CONSTRAINT da5_registrations_location_type_check 
  CHECK (location_type IN ('BLOCK', 'OUTDOOR'));
