  -- Sample Assets Seed Data
  -- Run this SQL in Supabase SQL Editor to insert 5 sample assets
  -- These assets can be used for dropdown selection in the future

  -- Insert 5 sample assets with complete details
  INSERT INTO assets (
    asset_tag,
    name,
    description,
    category_id,
    building_id,
    room_location,
    purchase_date,
    purchase_price,
    current_value,
    status,
    condition,
    serial_number,
    manufacturer,
    model,
    warranty_expiry,
    notes
  ) VALUES
  -- Asset 1: Dell Latitude Laptop (Electronics)
  (
    'ASSET-001',
    'Dell Latitude 7430 Laptop',
    '14-inch business laptop with Intel Core i7 processor, 16GB RAM, 512GB SSD',
    (SELECT id FROM asset_categories WHERE name = 'Electronics' LIMIT 1),
    NULL,
    'Office Room 101',
    '2023-06-15',
    1850.00,
    1480.00,
    'active',
    'good',
    'SN-DL7430-X78945',
    'Dell Technologies',
    'Latitude 7430',
    '2026-06-15',
    'Assigned to Marketing Department. Includes docking station.'
  ),

  -- Asset 2: Executive Office Desk (Furniture)
  (
    'ASSET-002',
    'Executive Office Desk',
    'Large executive desk with mahogany finish, includes side drawers and cable management',
    (SELECT id FROM asset_categories WHERE name = 'Furniture' LIMIT 1),
    NULL,
    'CEO Office',
    '2022-03-10',
    2500.00,
    2000.00,
    'active',
    'excellent',
    'SN-EXC-DESK-2022-001',
    'Herman Miller',
    'Executive Series Pro',
    NULL,
    'Premium desk in excellent condition. Recently polished.'
  ),

  -- Asset 3: Projector Screen (Equipment)
  (
    'ASSET-003',
    'Motorized Projector Screen 120"',
    'Electric motorized projection screen with remote control, 16:9 aspect ratio',
    (SELECT id FROM asset_categories WHERE name = 'Equipment' LIMIT 1),
    NULL,
    'Conference Room A',
    '2024-01-20',
    450.00,
    420.00,
    'active',
    'excellent',
    'SN-PROJ-120-445566',
    'Elite Screens',
    'Spectrum2 Series 120"',
    '2027-01-20',
    'Installed in main conference room. Remote control stored with IT.'
  ),

  -- Asset 4: Toyota Camry (Vehicles)
  (
    'ASSET-004',
    'Toyota Camry 2023',
    'Government vehicle - sedan, white color, automatic transmission',
    (SELECT id FROM asset_categories WHERE name = 'Vehicles' LIMIT 1),
    NULL,
    'Building Parking Lot A',
    '2023-09-01',
    28500.00,
    22800.00,
    'active',
    'good',
    'VIN: 4T1C11AK3PU123456',
    'Toyota Motor Corporation',
    'Camry LE 2023',
    '2026-09-01',
    'Assigned to Facilities Department. Regular maintenance every 5,000 miles.'
  ),

  -- Asset 5: HP LaserJet Printer (Office Supplies)
  (
    'ASSET-005',
    'HP LaserJet Pro M404n Printer',
    'Monochrome laser printer with network connectivity, duplex printing',
    (SELECT id FROM asset_categories WHERE name = 'Office Supplies' LIMIT 1),
    NULL,
    'Admin Office',
    '2023-11-05',
    320.00,
    260.00,
    'active',
    'good',
    'SN-HP-M404N-778899',
    'HP Inc.',
    'LaserJet Pro M404n',
    '2026-11-05',
    'Network printer shared by admin team. Toner replaced last month.'
  );

  -- Verify insertion
  SELECT a.asset_tag, a.name, a.status, a.condition, ac.name as category_name
  FROM assets a
  JOIN asset_categories ac ON a.category_id = ac.id
  WHERE a.asset_tag IN ('ASSET-001', 'ASSET-002', 'ASSET-003', 'ASSET-004', 'ASSET-005')
  ORDER BY a.asset_tag;


  -- ============================================================================
  -- SAMPLE BUILDINGS SEED DATA
  -- ============================================================================
  -- Run this SQL in Supabase SQL Editor to insert 5 real Malaysian government buildings
  -- These buildings can be used for dropdown selection in DA5 and DA6 forms

  -- Insert 5 sample buildings with complete details
  INSERT INTO buildings (
    name,
    address,
    city,
    state,
    postal_code,
    description,
    floor_count
  ) VALUES
  -- Building 1: Wisma Putra (Ministry of Foreign Affairs)
  (
    'Wisma Putra',
    'No. 1, Jalan Wisma Putra, Precinct 2',
    'Putrajaya',
    'Putrajaya',
    '62000',
    'Main headquarters of the Ministry of Foreign Affairs Malaysia. Houses diplomatic offices and international relations departments.',
    5
  ),

  -- Building 2: Kompleks Kementerian Kewangan (Ministry of Finance Complex)
  (
    'Kompleks Kementerian Kewangan',
    'Persiaran Perdana, Precinct 2',
    'Putrajaya',
    'Putrajaya',
    '62592',
    'Ministry of Finance Malaysia complex. Contains Treasury offices, budget divisions, and financial planning departments.',
    9
  ),

  -- Building 3: Bangunan Sultan Abdul Samad (Heritage Building)
  (
    'Bangunan Sultan Abdul Samad',
    'Jalan Raja',
    'Kuala Lumpur',
    'Wilayah Persekutuan Kuala Lumpur',
    '50050',
    'Historic colonial building built in 1897. Currently houses the Ministry of Communications and Multimedia. Features distinctive Moorish architecture.',
    4
  ),

  -- Building 4: Menara DBKL (Kuala Lumpur City Hall)
  (
    'Menara DBKL',
    'Jalan Raja Laut',
    'Kuala Lumpur',
    'Wilayah Persekutuan Kuala Lumpur',
    '50350',
    'Kuala Lumpur City Hall main administrative tower. Central hub for municipal services and city planning offices.',
    31
  ),

  -- Building 5: Parlimen Malaysia (Malaysian Parliament)
  (
    'Parlimen Malaysia',
    'Jalan Parlimen',
    'Kuala Lumpur',
    'Wilayah Persekutuan Kuala Lumpur',
    '50680',
    'Houses the Dewan Rakyat (House of Representatives) and Dewan Negara (Senate). Iconic modernist architecture with distinctive concrete dome.',
    5
  );

  -- ============================================================================
  -- INSERT BUILDING FLOORS
  -- ============================================================================
  -- Insert floors for each building

  -- Wisma Putra Floors (5 floors)
  INSERT INTO building_floors (building_id, floor_number, floor_name) VALUES
  ((SELECT id FROM buildings WHERE name = 'Wisma Putra' LIMIT 1), 0, 'Ground Floor'),
  ((SELECT id FROM buildings WHERE name = 'Wisma Putra' LIMIT 1), 1, 'Level 1'),
  ((SELECT id FROM buildings WHERE name = 'Wisma Putra' LIMIT 1), 2, 'Level 2'),
  ((SELECT id FROM buildings WHERE name = 'Wisma Putra' LIMIT 1), 3, 'Level 3'),
  ((SELECT id FROM buildings WHERE name = 'Wisma Putra' LIMIT 1), 4, 'Level 4'),
  ((SELECT id FROM buildings WHERE name = 'Wisma Putra' LIMIT 1), 5, 'Level 5');

  -- Kompleks Kementerian Kewangan Floors (9 floors)
  INSERT INTO building_floors (building_id, floor_number, floor_name) VALUES
  ((SELECT id FROM buildings WHERE name = 'Kompleks Kementerian Kewangan' LIMIT 1), -1, 'Basement'),
  ((SELECT id FROM buildings WHERE name = 'Kompleks Kementerian Kewangan' LIMIT 1), 0, 'Ground Floor'),
  ((SELECT id FROM buildings WHERE name = 'Kompleks Kementerian Kewangan' LIMIT 1), 1, 'Level 1'),
  ((SELECT id FROM buildings WHERE name = 'Kompleks Kementerian Kewangan' LIMIT 1), 2, 'Level 2'),
  ((SELECT id FROM buildings WHERE name = 'Kompleks Kementerian Kewangan' LIMIT 1), 3, 'Level 3'),
  ((SELECT id FROM buildings WHERE name = 'Kompleks Kementerian Kewangan' LIMIT 1), 4, 'Level 4'),
  ((SELECT id FROM buildings WHERE name = 'Kompleks Kementerian Kewangan' LIMIT 1), 5, 'Level 5'),
  ((SELECT id FROM buildings WHERE name = 'Kompleks Kementerian Kewangan' LIMIT 1), 6, 'Level 6'),
  ((SELECT id FROM buildings WHERE name = 'Kompleks Kementerian Kewangan' LIMIT 1), 7, 'Level 7'),
  ((SELECT id FROM buildings WHERE name = 'Kompleks Kementerian Kewangan' LIMIT 1), 8, 'Level 8');

  -- Bangunan Sultan Abdul Samad Floors (4 floors)
  INSERT INTO building_floors (building_id, floor_number, floor_name) VALUES
  ((SELECT id FROM buildings WHERE name = 'Bangunan Sultan Abdul Samad' LIMIT 1), 0, 'Ground Floor'),
  ((SELECT id FROM buildings WHERE name = 'Bangunan Sultan Abdul Samad' LIMIT 1), 1, 'Level 1'),
  ((SELECT id FROM buildings WHERE name = 'Bangunan Sultan Abdul Samad' LIMIT 1), 2, 'Level 2'),
  ((SELECT id FROM buildings WHERE name = 'Bangunan Sultan Abdul Samad' LIMIT 1), 3, 'Level 3');

  -- Menara DBKL Floors (31 floors)
  INSERT INTO building_floors (building_id, floor_number, floor_name) VALUES
  ((SELECT id FROM buildings WHERE name = 'Menara DBKL' LIMIT 1), 0, 'Ground Floor / Lobby'),
  ((SELECT id FROM buildings WHERE name = 'Menara DBKL' LIMIT 1), 1, 'Level 1'),
  ((SELECT id FROM buildings WHERE name = 'Menara DBKL' LIMIT 1), 2, 'Level 2'),
  ((SELECT id FROM buildings WHERE name = 'Menara DBKL' LIMIT 1), 3, 'Level 3'),
  ((SELECT id FROM buildings WHERE name = 'Menara DBKL' LIMIT 1), 4, 'Level 4'),
  ((SELECT id FROM buildings WHERE name = 'Menara DBKL' LIMIT 1), 5, 'Level 5'),
  ((SELECT id FROM buildings WHERE name = 'Menara DBKL' LIMIT 1), 10, 'Level 10'),
  ((SELECT id FROM buildings WHERE name = 'Menara DBKL' LIMIT 1), 15, 'Level 15'),
  ((SELECT id FROM buildings WHERE name = 'Menara DBKL' LIMIT 1), 20, 'Level 20'),
  ((SELECT id FROM buildings WHERE name = 'Menara DBKL' LIMIT 1), 25, 'Level 25'),
  ((SELECT id FROM buildings WHERE name = 'Menara DBKL' LIMIT 1), 30, 'Level 30');

  -- Parlimen Malaysia Floors (5 floors)
  INSERT INTO building_floors (building_id, floor_number, floor_name) VALUES
  ((SELECT id FROM buildings WHERE name = 'Parlimen Malaysia' LIMIT 1), 0, 'Ground Floor'),
  ((SELECT id FROM buildings WHERE name = 'Parlimen Malaysia' LIMIT 1), 1, 'Level 1 - Dewan Rakyat'),
  ((SELECT id FROM buildings WHERE name = 'Parlimen Malaysia' LIMIT 1), 2, 'Level 2 - Dewan Negara'),
  ((SELECT id FROM buildings WHERE name = 'Parlimen Malaysia' LIMIT 1), 3, 'Level 3'),
  ((SELECT id FROM buildings WHERE name = 'Parlimen Malaysia' LIMIT 1), 4, 'Level 4');

  -- ============================================================================
  -- VERIFY BUILDING INSERTION
  -- ============================================================================
  SELECT b.name, b.city, b.state, b.floor_count, COUNT(bf.id) as total_floors
  FROM buildings b
  LEFT JOIN building_floors bf ON b.id = bf.building_id
  WHERE b.name IN ('Wisma Putra', 'Kompleks Kementerian Kewangan', 'Bangunan Sultan Abdul Samad', 'Menara DBKL', 'Parlimen Malaysia')
  GROUP BY b.id, b.name, b.city, b.state, b.floor_count
  ORDER BY b.name;
