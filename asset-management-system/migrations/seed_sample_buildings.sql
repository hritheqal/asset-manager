-- Sample Buildings Seed Data
-- Run this SQL in Supabase SQL Editor to insert 5 real Malaysian government buildings
-- These buildings can be used for dropdown selection in DA5 and DA6 forms
-- Safe to run multiple times - will skip existing buildings automatically

-- ============================================================================
-- INSERT SAMPLE BUILDINGS
-- ============================================================================
-- Using WHERE NOT EXISTS to safely skip existing buildings

-- Building 1: Wisma Putra (Ministry of Foreign Affairs)
INSERT INTO buildings (name, address, city, state, postal_code, description, floor_count)
SELECT 
  'Wisma Putra',
  'No. 1, Jalan Wisma Putra, Precinct 2',
  'Putrajaya',
  'Putrajaya',
  '62000',
  'Main headquarters of the Ministry of Foreign Affairs Malaysia. Houses diplomatic offices and international relations departments.',
  5
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = 'Wisma Putra');

-- Building 2: Kompleks Kementerian Kewangan (Ministry of Finance Complex)
INSERT INTO buildings (name, address, city, state, postal_code, description, floor_count)
SELECT 
  'Kompleks Kementerian Kewangan',
  'Persiaran Perdana, Precinct 2',
  'Putrajaya',
  'Putrajaya',
  '62592',
  'Ministry of Finance Malaysia complex. Contains Treasury offices, budget divisions, and financial planning departments.',
  9
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = 'Kompleks Kementerian Kewangan');

-- Building 3: Bangunan Sultan Abdul Samad (Heritage Building)
INSERT INTO buildings (name, address, city, state, postal_code, description, floor_count)
SELECT 
  'Bangunan Sultan Abdul Samad',
  'Jalan Raja',
  'Kuala Lumpur',
  'Wilayah Persekutuan Kuala Lumpur',
  '50050',
  'Historic colonial building built in 1897. Currently houses the Ministry of Communications and Multimedia. Features distinctive Moorish architecture.',
  4
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = 'Bangunan Sultan Abdul Samad');

-- Building 4: Menara DBKL (Kuala Lumpur City Hall)
INSERT INTO buildings (name, address, city, state, postal_code, description, floor_count)
SELECT 
  'Menara DBKL',
  'Jalan Raja Laut',
  'Kuala Lumpur',
  'Wilayah Persekutuan Kuala Lumpur',
  '50350',
  'Kuala Lumpur City Hall main administrative tower. Central hub for municipal services and city planning offices.',
  31
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = 'Menara DBKL');

-- Building 5: Parlimen Malaysia (Malaysian Parliament)
INSERT INTO buildings (name, address, city, state, postal_code, description, floor_count)
SELECT 
  'Parlimen Malaysia',
  'Jalan Parlimen',
  'Kuala Lumpur',
  'Wilayah Persekutuan Kuala Lumpur',
  '50680',
  'Houses the Dewan Rakyat (House of Representatives) and Dewan Negara (Senate). Iconic modernist architecture with distinctive concrete dome.',
  5
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = 'Parlimen Malaysia');

-- ============================================================================
-- INSERT BUILDING FLOORS
-- ============================================================================
-- Using WHERE NOT EXISTS to safely skip existing floors

-- Wisma Putra Floors (6 floors: Ground + Level 1-5)
INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 0, 'Ground Floor'
FROM buildings b
WHERE b.name = 'Wisma Putra'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 0);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 1, 'Level 1'
FROM buildings b
WHERE b.name = 'Wisma Putra'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 1);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 2, 'Level 2'
FROM buildings b
WHERE b.name = 'Wisma Putra'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 2);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 3, 'Level 3'
FROM buildings b
WHERE b.name = 'Wisma Putra'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 3);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 4, 'Level 4'
FROM buildings b
WHERE b.name = 'Wisma Putra'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 4);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 5, 'Level 5'
FROM buildings b
WHERE b.name = 'Wisma Putra'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 5);

-- Kompleks Kementerian Kewangan Floors (10 floors: Basement + Ground + Level 1-8)
INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, -1, 'Basement'
FROM buildings b
WHERE b.name = 'Kompleks Kementerian Kewangan'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = -1);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 0, 'Ground Floor'
FROM buildings b
WHERE b.name = 'Kompleks Kementerian Kewangan'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 0);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 1, 'Level 1'
FROM buildings b
WHERE b.name = 'Kompleks Kementerian Kewangan'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 1);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 2, 'Level 2'
FROM buildings b
WHERE b.name = 'Kompleks Kementerian Kewangan'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 2);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 3, 'Level 3'
FROM buildings b
WHERE b.name = 'Kompleks Kementerian Kewangan'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 3);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 4, 'Level 4'
FROM buildings b
WHERE b.name = 'Kompleks Kementerian Kewangan'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 4);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 5, 'Level 5'
FROM buildings b
WHERE b.name = 'Kompleks Kementerian Kewangan'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 5);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 6, 'Level 6'
FROM buildings b
WHERE b.name = 'Kompleks Kementerian Kewangan'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 6);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 7, 'Level 7'
FROM buildings b
WHERE b.name = 'Kompleks Kementerian Kewangan'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 7);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 8, 'Level 8'
FROM buildings b
WHERE b.name = 'Kompleks Kementerian Kewangan'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 8);

-- Bangunan Sultan Abdul Samad Floors (4 floors: Ground + Level 1-3)
INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 0, 'Ground Floor'
FROM buildings b
WHERE b.name = 'Bangunan Sultan Abdul Samad'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 0);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 1, 'Level 1'
FROM buildings b
WHERE b.name = 'Bangunan Sultan Abdul Samad'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 1);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 2, 'Level 2'
FROM buildings b
WHERE b.name = 'Bangunan Sultan Abdul Samad'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 2);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 3, 'Level 3'
FROM buildings b
WHERE b.name = 'Bangunan Sultan Abdul Samad'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 3);

-- Menara DBKL Floors (11 key floors from 31 total)
INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 0, 'Ground Floor / Lobby'
FROM buildings b
WHERE b.name = 'Menara DBKL'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 0);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 1, 'Level 1'
FROM buildings b
WHERE b.name = 'Menara DBKL'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 1);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 2, 'Level 2'
FROM buildings b
WHERE b.name = 'Menara DBKL'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 2);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 3, 'Level 3'
FROM buildings b
WHERE b.name = 'Menara DBKL'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 3);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 4, 'Level 4'
FROM buildings b
WHERE b.name = 'Menara DBKL'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 4);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 5, 'Level 5'
FROM buildings b
WHERE b.name = 'Menara DBKL'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 5);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 10, 'Level 10'
FROM buildings b
WHERE b.name = 'Menara DBKL'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 10);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 15, 'Level 15'
FROM buildings b
WHERE b.name = 'Menara DBKL'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 15);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 20, 'Level 20'
FROM buildings b
WHERE b.name = 'Menara DBKL'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 20);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 25, 'Level 25'
FROM buildings b
WHERE b.name = 'Menara DBKL'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 25);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 30, 'Level 30'
FROM buildings b
WHERE b.name = 'Menara DBKL'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 30);

-- Parlimen Malaysia Floors (5 floors)
INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 0, 'Ground Floor'
FROM buildings b
WHERE b.name = 'Parlimen Malaysia'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 0);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 1, 'Level 1 - Dewan Rakyat'
FROM buildings b
WHERE b.name = 'Parlimen Malaysia'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 1);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 2, 'Level 2 - Dewan Negara'
FROM buildings b
WHERE b.name = 'Parlimen Malaysia'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 2);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 3, 'Level 3'
FROM buildings b
WHERE b.name = 'Parlimen Malaysia'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 3);

INSERT INTO building_floors (building_id, floor_number, floor_name)
SELECT b.id, 4, 'Level 4'
FROM buildings b
WHERE b.name = 'Parlimen Malaysia'
AND NOT EXISTS (SELECT 1 FROM building_floors bf WHERE bf.building_id = b.id AND bf.floor_number = 4);

-- ============================================================================
-- VERIFY BUILDING INSERTION
-- ============================================================================

SELECT 
  b.name, 
  b.city, 
  b.state, 
  b.floor_count, 
  COUNT(bf.id) as total_floors,
  CASE 
    WHEN COUNT(bf.id) > 0 THEN '✓ Has Floors'
    ELSE '⚠ No Floors'
  END as status
FROM buildings b
LEFT JOIN building_floors bf ON b.id = bf.building_id
WHERE b.name IN ('Wisma Putra', 'Kompleks Kementerian Kewangan', 'Bangunan Sultan Abdul Samad', 'Menara DBKL', 'Parlimen Malaysia')
GROUP BY b.id, b.name, b.city, b.state, b.floor_count
ORDER BY b.name;
