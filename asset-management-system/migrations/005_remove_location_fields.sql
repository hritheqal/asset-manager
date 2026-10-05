-- Migration: 005_remove_location_fields.sql
-- Description: Remove location-related fields from buildings and da6_registrations tables
-- This migration removes GPS coordinates, address fields from buildings, and GPS from DA6

-- Remove latitude and longitude from buildings table
ALTER TABLE buildings DROP COLUMN IF EXISTS latitude;
ALTER TABLE buildings DROP COLUMN IF EXISTS longitude;
ALTER TABLE buildings DROP COLUMN IF EXISTS address;
ALTER TABLE buildings DROP COLUMN IF EXISTS city;
ALTER TABLE buildings DROP COLUMN IF EXISTS state;
ALTER TABLE buildings DROP COLUMN IF EXISTS postal_code;

-- Remove latitude and longitude from da6_registrations table
ALTER TABLE da6_registrations DROP COLUMN IF EXISTS latitude;
ALTER TABLE da6_registrations DROP COLUMN IF EXISTS longitude;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'buildings' 
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'da6_registrations' 
ORDER BY ordinal_position;
