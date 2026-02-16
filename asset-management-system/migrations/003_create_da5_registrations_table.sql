-- =====================================================
-- DA5 Registration Table Migration
-- =====================================================
-- Creates the da5_registrations table for DA5 forms
-- Run this SQL in Supabase SQL Editor
-- =====================================================

-- Create da5_registrations table
CREATE TABLE IF NOT EXISTS da5_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_da5_registrations_building_id ON da5_registrations(building_id);
CREATE INDEX IF NOT EXISTS idx_da5_registrations_filled_by_user_id ON da5_registrations(filled_by_user_id);
CREATE INDEX IF NOT EXISTS idx_da5_registrations_status ON da5_registrations(status);
CREATE INDEX IF NOT EXISTS idx_da5_registrations_created_at ON da5_registrations(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE da5_registrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
-- Allow authenticated users to read all DA5 registrations
CREATE POLICY "Allow authenticated users to read da5_registrations" 
ON da5_registrations FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to insert DA5 registrations
CREATE POLICY "Allow authenticated users to insert da5_registrations" 
ON da5_registrations FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to update DA5 registrations
CREATE POLICY "Allow authenticated users to update da5_registrations" 
ON da5_registrations FOR UPDATE 
TO authenticated 
USING (true);

-- Allow authenticated users to delete DA5 registrations
CREATE POLICY "Allow authenticated users to delete da5_registrations" 
ON da5_registrations FOR DELETE 
TO authenticated 
USING (true);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to da5_registrations
CREATE TRIGGER update_da5_registrations_updated_at 
BEFORE UPDATE ON da5_registrations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Migration Complete!
-- =====================================================
-- The da5_registrations table is now ready to use.
-- Run this SQL in Supabase SQL Editor.
-- =====================================================
