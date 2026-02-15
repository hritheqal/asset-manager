-- Diagnostic script to check database setup for building creation
-- Run this in Supabase SQL Editor to verify everything is set up correctly

-- 1. Check if floor_count column exists in buildings table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'buildings' AND column_name = 'floor_count';

-- 2. Check if building_floors table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'building_floors'
);

-- 3. Check if building_blocks table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'building_blocks'
);

-- 4. Check RLS policies on building_floors
SELECT * FROM pg_policies WHERE tablename = 'building_floors';

-- 5. Check RLS policies on building_blocks
SELECT * FROM pg_policies WHERE tablename = 'building_blocks';

-- If any of the above checks fail, run the migration script:
-- migrations/001_add_building_floors_and_blocks.sql
