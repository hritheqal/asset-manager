-- Add GPS coordinates to buildings table
-- Run this in Supabase SQL Editor

ALTER TABLE buildings 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create indexes for location queries
CREATE INDEX IF NOT EXISTS idx_buildings_location ON buildings(latitude, longitude);
