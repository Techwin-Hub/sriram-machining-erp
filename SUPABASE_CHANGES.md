-- FILE: supabase/migrations/20240728120000_add_salary_details_to_employees.sql

-- Create a new type for salary_type enum
CREATE TYPE salary_type_enum AS ENUM ('daily', 'monthly');

-- Add the new columns to the employees table
ALTER TABLE employees
ADD COLUMN salary_type salary_type_enum,
ADD COLUMN salary_per_month NUMERIC(10, 2),
ADD COLUMN ot_rate_per_hour NUMERIC(10, 2);

-- Update existing employees based on their department
UPDATE employees
SET
  salary_type = CASE
    WHEN department = 'Plating' THEN 'monthly'::salary_type_enum
    ELSE 'daily'::salary_type_enum
  END,
  salary_per_month = CASE
    WHEN department = 'Plating' THEN 20000.00 -- Default value for existing plating workers
    ELSE NULL
  END,
  salary_per_day = CASE
    WHEN department = 'Plating' THEN NULL
    ELSE salary_per_day
  END,
  ot_rate_per_hour = CASE
    WHEN department = 'Plating' THEN 100.00 -- Default value for existing plating workers
    ELSE 75.00 -- Default value for other workers
  END;

-- Add a check constraint to ensure data integrity
ALTER TABLE employees
ADD CONSTRAINT salary_consistency_check CHECK (
  (salary_type = 'daily' AND salary_per_day IS NOT NULL AND salary_per_month IS NULL) OR
  (salary_type = 'monthly' AND salary_per_month IS NOT NULL AND salary_per_day IS NULL)
);

-- FILE: supabase/migrations/20240728120001_refactor_attendance_status.sql

-- Rename the status column to status_code
ALTER TABLE public.attendance
RENAME COLUMN status TO status_code;

-- Update existing data to the new status codes
-- Note: 'half_day' is mapped to 'S' (Shift worked). Payroll logic should handle the distinction.
UPDATE public.attendance
SET status_code = CASE
    WHEN status_code = 'present' THEN 'S'
    WHEN status_code = 'absent' THEN 'X'
    WHEN status_code = 'leave' THEN 'L'
    WHEN status_code = 'half_day' THEN 'S'
    ELSE status_code -- Keep other values, they might fail the constraint if they don't match
END;

-- Add a check constraint for the allowed values
ALTER TABLE public.attendance
ADD CONSTRAINT attendance_status_code_check
CHECK (status_code IN ('X', 'S', 'SL', 'L', 'PC'));
