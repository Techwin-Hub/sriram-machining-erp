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
