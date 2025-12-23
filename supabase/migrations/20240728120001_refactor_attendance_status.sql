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
