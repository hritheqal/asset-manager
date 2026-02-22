-- Migration: 006_add_dbkl_zones.sql
-- Description: Create dbkl_zones table with polygon boundaries for zone detection

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create dbkl_zones table
CREATE TABLE dbkl_zones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  zone_id VARCHAR(20) UNIQUE NOT NULL,
  zone_name VARCHAR(100) NOT NULL,
  boundary_polygon JSONB NOT NULL,
  center_lat DECIMAL(10, 8),
  center_lng DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE dbkl_zones ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users" ON dbkl_zones FOR SELECT USING (true);

-- Insert zone data with approximate rectangular boundaries
-- These are simplified boundaries for DBKL administrative zones
INSERT INTO dbkl_zones (zone_id, zone_name, boundary_polygon, center_lat, center_lng) VALUES
(
  'zone-a', 
  'Zone A - KL', 
  '{"type":"Polygon","coordinates":[[[101.680,3.130],[101.720,3.130],[101.720,3.170],[101.680,3.170],[101.680,3.130]]]}', 
  3.150, 
  101.700
),
(
  'zone-b', 
  'Zone B - Cheras', 
  '{"type":"Polygon","coordinates":[[[101.720,3.080],[101.800,3.080],[101.800,3.180],[101.720,3.180],[101.720,3.080]]]}', 
  3.130, 
  101.760
),
(
  'zone-c', 
  'Zone C - Kepong', 
  '{"type":"Polygon","coordinates":[[[101.630,3.190],[101.700,3.190],[101.700,3.250],[101.630,3.250],[101.630,3.190]]]}', 
  3.220, 
  101.665
),
(
  'zone-d', 
  'Zone D - Lembah Pantai', 
  '{"type":"Polygon","coordinates":[[[101.670,3.070],[101.730,3.070],[101.730,3.130],[101.670,3.130],[101.670,3.070]]]}', 
  3.100, 
  101.700
),
(
  'zone-e', 
  'Zone E - Segambut', 
  '{"type":"Polygon","coordinates":[[[101.670,3.180],[101.730,3.180],[101.730,3.250],[101.670,3.250],[101.670,3.180]]]}', 
  3.215, 
  101.700
),
(
  'zone-f', 
  'Zone F - TTDI', 
  '{"type":"Polygon","coordinates":[[[101.620,3.140],[101.680,3.140],[101.680,3.200],[101.620,3.200],[101.620,3.140]]]}', 
  3.170, 
  101.650
),
(
  'zone-g', 
  'Zone G - Setapak', 
  '{"type":"Polygon","coordinates":[[[101.700,3.180],[101.760,3.180],[101.760,3.250],[101.700,3.250],[101.700,3.180]]]}', 
  3.215, 
  101.730
),
(
  'zone-h', 
  'Zone H - Wangsa Maju', 
  '{"type":"Polygon","coordinates":[[[101.730,3.180],[101.780,3.180],[101.780,3.230],[101.730,3.230],[101.730,3.180]]]}', 
  3.205, 
  101.755
),
(
  'zone-i', 
  'Zone I - Bandar Tun Razak', 
  '{"type":"Polygon","coordinates":[[[101.720,3.050],[101.800,3.050],[101.800,3.120],[101.720,3.120],[101.720,3.050]]]}', 
  3.085, 
  101.760
),
(
  'zone-j', 
  'Zone J - Bukit Jalil', 
  '{"type":"Polygon","coordinates":[[[101.680,3.000],[101.760,3.000],[101.760,3.080],[101.680,3.080],[101.680,3.000]]]}', 
  3.040, 
  101.720
),
(
  'zone-k', 
  'Zone K - Seputeh', 
  '{"type":"Polygon","coordinates":[[[101.670,3.070],[101.730,3.070],[101.730,3.140],[101.670,3.140],[101.670,3.070]]]}', 
  3.105, 
  101.700
),
(
  'zone-l', 
  'Zone L - Taman Desa', 
  '{"type":"Polygon","coordinates":[[[101.630,3.070],[101.690,3.070],[101.690,3.120],[101.630,3.120],[101.630,3.070]]]}', 
  3.095, 
  101.660
),
(
  'zone-m', 
  'Zone M - Taman Connaught', 
  '{"type":"Polygon","coordinates":[[[101.720,3.100],[101.780,3.100],[101.780,3.170],[101.720,3.170],[101.720,3.100]]]}', 
  3.135, 
  101.750
),
(
  'zone-n', 
  'Zone N - Bandar Menjalara', 
  '{"type":"Polygon","coordinates":[[[101.630,3.170],[101.690,3.170],[101.690,3.230],[101.630,3.230],[101.630,3.170]]]}', 
  3.200, 
  101.660
),
(
  'zone-o', 
  'Zone O - Sri Hartamas', 
  '{"type":"Polygon","coordinates":[[[101.650,3.140],[101.710,3.140],[101.710,3.190],[101.650,3.190],[101.650,3.140]]]}', 
  3.165, 
  101.680
);

-- Verify data
SELECT zone_id, zone_name, center_lat, center_lng FROM dbkl_zones ORDER BY zone_id;
