-- Seed Data for Manufacturing Management System

-- Note: This script should be run AFTER user signup
-- The user_id values will need to be replaced with actual authenticated user IDs

-- Sample Parts (using placeholder user_id - will be replaced in app)
INSERT INTO public.parts (user_id, part_code, part_name, description, unit_of_measurement, minimum_stock_level, current_stock, reorder_level, status)
VALUES
  (auth.uid(), 'PART-001', 'Steel Bracket', 'Heavy duty steel bracket', 'pieces', 50, 100, 75, 'active'),
  (auth.uid(), 'PART-002', 'Aluminum Plate', '10mm aluminum plate', 'pieces', 30, 60, 45, 'active'),
  (auth.uid(), 'PART-003', 'Copper Rod', '12mm copper rod', 'pieces', 20, 40, 30, 'active')
ON CONFLICT (part_code) DO NOTHING;

-- Sample Operations
INSERT INTO public.operations (user_id, operation_code, operation_name, description, standard_time_minutes, cost_per_operation)
VALUES
  (auth.uid(), 'OP-001', 'Cutting', 'Metal cutting operation', 15, 50.00),
  (auth.uid(), 'OP-002', 'Drilling', 'Drilling holes', 10, 30.00),
  (auth.uid(), 'OP-003', 'Grinding', 'Surface grinding', 20, 60.00),
  (auth.uid(), 'OP-004', 'Assembly', 'Part assembly', 25, 75.00)
ON CONFLICT (operation_code) DO NOTHING;

-- Sample Machines
INSERT INTO public.machines (user_id, machine_code, machine_name, machine_type, location, status)
VALUES
  (auth.uid(), 'MCH-001', 'CNC Lathe 1', 'Lathe', 'Shop Floor A', 'active'),
  (auth.uid(), 'MCH-002', 'Milling Machine 1', 'Milling', 'Shop Floor A', 'active'),
  (auth.uid(), 'MCH-003', 'Drill Press 1', 'Drilling', 'Shop Floor B', 'active'),
  (auth.uid(), 'MCH-004', 'Grinder 1', 'Grinding', 'Shop Floor B', 'active')
ON CONFLICT (machine_code) DO NOTHING;

-- Sample Plating Chemicals
INSERT INTO public.plating_chemicals (user_id, chemical_name, chemical_code, unit_of_measurement, current_stock, minimum_level, reorder_level, cost_per_unit)
VALUES
  (auth.uid(), 'Nickel Sulfate', 'CHEM-001', 'kg', 50.000, 10.000, 20.000, 150.00),
  (auth.uid(), 'Chrome Acid', 'CHEM-002', 'liters', 30.000, 5.000, 10.000, 200.00),
  (auth.uid(), 'Zinc Chloride', 'CHEM-003', 'kg', 40.000, 8.000, 15.000, 120.00)
ON CONFLICT (chemical_code) DO NOTHING;
