-- Seed Data for Manufacturing Management System
--
-- Note: This script should be run AFTER the admin user has been created.
-- Before running, you must set the admin_user_id variable.
-- Example for psql: \set admin_user_id "'<your-admin-uuid>'"
--
-- You can get the admin user's ID by running this query AFTER creating the user:
-- SELECT id FROM auth.users WHERE email = 'sethuramanvr046@gmail.com';

-- Sample Parts
INSERT INTO public.parts (user_id, part_code, part_name, description, unit_of_measurement, minimum_stock_level, current_stock, reorder_level, status)
VALUES
  (:'admin_user_id', 'PART-001', 'Steel Bracket', 'Heavy duty steel bracket', 'pieces', 50, 100, 75, 'active'),
  (:'admin_user_id', 'PART-002', 'Aluminum Plate', '10mm aluminum plate', 'pieces', 30, 60, 45, 'active'),
  (:'admin_user_id', 'PART-003', 'Copper Rod', '12mm copper rod', 'pieces', 20, 40, 30, 'active')
ON CONFLICT (part_code) DO NOTHING;

-- Sample Operations
INSERT INTO public.operations (user_id, operation_code, operation_name, description, standard_time_minutes, cost_per_operation)
VALUES
  (:'admin_user_id', 'OP-001', 'Cutting', 'Metal cutting operation', 15, 50.00),
  (:'admin_user_id', 'OP-002', 'Drilling', 'Drilling holes', 10, 30.00),
  (:'admin_user_id', 'OP-003', 'Grinding', 'Surface grinding', 20, 60.00),
  (:'admin_user_id', 'OP-004', 'Assembly', 'Part assembly', 25, 75.00)
ON CONFLICT (operation_code) DO NOTHING;

-- Sample Machines
INSERT INTO public.machines (user_id, machine_code, machine_name, machine_type, location, status)
VALUES
  (:'admin_user_id', 'MCH-001', 'CNC Lathe 1', 'Lathe', 'Shop Floor A', 'active'),
  (:'admin_user_id', 'MCH-002', 'Milling Machine 1', 'Milling', 'Shop Floor A', 'active'),
  (:'admin_user_id', 'MCH-003', 'Drill Press 1', 'Drilling', 'Shop Floor B', 'active'),
  (:'admin_user_id', 'MCH-004', 'Grinder 1', 'Grinding', 'Shop Floor B', 'active')
ON CONFLICT (machine_code) DO NOTHING;

-- Sample Plating Chemicals
INSERT INTO public.plating_chemicals (user_id, chemical_name, chemical_code, unit_of_measurement, current_stock, minimum_level, reorder_level, cost_per_unit)
VALUES
  (:'admin_user_id', 'CHEM-001', 'Nickel Sulfate', 'kg', 50.000, 10.000, 20.000, 150.00),
  (:'admin_user_id', 'CHEM-002', 'Chrome Acid', 'liters', 30.000, 5.000, 10.000, 200.00),
  (:'admin_user_id', 'CHEM-003', 'Zinc Chloride', 'kg', 40.000, 8.000, 15.000, 120.00)
ON CONFLICT (chemical_code) DO NOTHING;
