-- Migration: 007_add_zone_detection_function.sql
-- Description: Add PostGIS extension and zone detection function

-- Enable PostGIS extension for spatial operations
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create function to detect zone from coordinates
-- Returns the zone that contains the given point
CREATE OR REPLACE FUNCTION detect_zone_from_point(p_lat DECIMAL, p_lng DECIMAL)
RETURNS TABLE(zone_id VARCHAR, zone_name VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT z.zone_id, z.zone_name
  FROM dbkl_zones z
  WHERE ST_Contains(
    ST_GeomFromGeoJSON(z.boundary_polygon),
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)
  )
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Test the function with sample coordinates
-- SELECT * FROM detect_zone_from_point(3.1390, 101.6869); -- Should return Zone A - KL

-- Create a simpler version that returns zone_name only
CREATE OR REPLACE FUNCTION get_zone_name(p_lat DECIMAL, p_lng DECIMAL)
RETURNS VARCHAR AS $$
DECLARE
  v_zone_name VARCHAR;
BEGIN
  SELECT z.zone_name INTO v_zone_name
  FROM dbkl_zones z
  WHERE ST_Contains(
    ST_GeomFromGeoJSON(z.boundary_polygon),
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)
  )
  LIMIT 1;
  
  RETURN v_zone_name;
END;
$$ LANGUAGE plpgsql;

-- Create function to get zone_id from coordinates
CREATE OR REPLACE FUNCTION get_zone_id(p_lat DECIMAL, p_lng DECIMAL)
RETURNS VARCHAR AS $$
DECLARE
  v_zone_id VARCHAR;
BEGIN
  SELECT z.zone_id INTO v_zone_id
  FROM dbkl_zones z
  WHERE ST_Contains(
    ST_GeomFromGeoJSON(z.boundary_polygon),
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)
  )
  LIMIT 1;
  
  RETURN v_zone_id;
END;
$$ LANGUAGE plpgsql;

-- Test queries (uncomment to test)
-- SELECT get_zone_name(3.1390, 101.6869) as zone_name; -- Test KL center
-- SELECT get_zone_id(3.1390, 101.6869) as zone_id;
-- SELECT * FROM detect_zone_from_point(3.1390, 101.6869);
