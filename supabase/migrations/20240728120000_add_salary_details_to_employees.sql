-- Create enum only if it does not already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'salary_type_enum'
  ) THEN
    CREATE TYPE salary_type_enum AS ENUM ('daily', 'monthly');
  END IF;
END$$;

-- Add only missing columns
ALTER TABLE employees
ADD COLUMN IF NOT EXISTS salary_type salary_type_enum,
ADD COLUMN IF NOT EXISTS salary_per_month NUMERIC(10, 2);

-- Update existing employees
UPDATE employees
SET
  salary_type = CASE
    WHEN department = 'Plating' THEN 'monthly'::salary_type_enum
    ELSE 'daily'::salary_type_enum
  END,
  salary_per_month = CASE
    WHEN department = 'Plating' THEN 20000.00
    ELSE NULL
  END,
  salary_per_day = CASE
    WHEN department = 'Plating' THEN NULL
    ELSE salary_per_day
  END,
  ot_rate_per_hour = CASE
    WHEN department = 'Plating' THEN 100.00
    ELSE 75.00
  END;

-- Add constraint only if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'salary_consistency_check'
  ) THEN
    ALTER TABLE employees
    ADD CONSTRAINT salary_consistency_check CHECK (
      (salary_type = 'daily'
        AND salary_per_day IS NOT NULL
        AND salary_per_month IS NULL)
      OR
      (salary_type = 'monthly'
        AND salary_per_month IS NOT NULL
        AND salary_per_day IS NULL)
    );
  END IF;
END$$;
