-- =====================================================
-- DA5 Building Structure Enhancement Migration
-- =====================================================
-- Run this SQL in Supabase SQL Editor to set up the
-- database tables for building floors and blocks
-- =====================================================

-- 1. Add floor_count column to buildings table
ALTER TABLE buildings 
ADD COLUMN IF NOT EXISTS floor_count INTEGER DEFAULT 1;

-- 2. Create building_floors table
CREATE TABLE IF NOT EXISTS building_floors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL,
    floor_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create building_blocks table
CREATE TABLE IF NOT EXISTS building_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    block_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_building_floors_building 
ON building_floors(building_id);

CREATE INDEX IF NOT EXISTS idx_building_blocks_building 
ON building_blocks(building_id);

CREATE INDEX IF NOT EXISTS idx_building_floors_number 
ON building_floors(floor_number);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE building_floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE building_blocks ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for authenticated users
-- Allow authenticated users to read all building floors
CREATE POLICY "Allow authenticated users to read building_floors" 
ON building_floors FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to read all building blocks
CREATE POLICY "Allow authenticated users to read building_blocks" 
ON building_blocks FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to insert building floors
CREATE POLICY "Allow authenticated users to insert building_floors" 
ON building_floors FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to insert building blocks
CREATE POLICY "Allow authenticated users to insert building_blocks" 
ON building_blocks FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- =====================================================
-- Migration Complete!
-- =====================================================
-- Next steps:
-- 1. Build the Next.js application
-- 2. Test creating a building with floors and blocks
-- 3. Test DA5 registration with dynamic dropdowns
-- =====================================================
