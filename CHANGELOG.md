# Changelog

All notable changes to this project will be documented in this file.

---

## 2024-07-29 (Fix) - Attendance UI Flow

-   **UI Flow Overhaul**
    -   Resolved a critical UI flow issue where "View History" and "Mark Attendance" led to the same page.
    -   The attendance module is now split into three distinct, functional pages:
        1.  **Mark Attendance (`/dashboard/attendance/mark`)**: The existing page for marking daily attendance.
        2.  **Attendance History (`/dashboard/attendance/history`)**: A new, dedicated page that displays a complete history of attendance records, grouped by date for clarity.
        3.  **Edit Attendance (`/dashboard/attendance/edit/[date]/[employeeId]`)**: A new page that allows for the editing of individual attendance records, correcting a 404 error.
-   **Files Affected**
    -   `components/attendance-history.tsx` (updated)
    -   `app/dashboard/attendance/history/page.tsx` (updated)
    -   `app/dashboard/attendance/edit/[date]/[employeeId]/page.tsx` (new)
-   **SQL Required:** No

## 2024-07-29 (Fix)

-   **Attendance Form Bug**
    -   Fixed a critical bug where the attendance form was submitting the full status description (e.g., "S - Shift Worked") instead of the status code (e.g., "S"), causing a database check constraint violation.
-   **Files Affected**
    -   `components/attendance-mark-form.tsx`
-   **SQL Required:** No

## 2024-07-29

-   **Attendance Module OT Rules**
    -   Implemented UI logic to enforce overtime (OT) rules.
    -   The "OT Hours" input is now disabled unless the attendance status is 'S' (Shift Worked).
    -   The attendance marking form now displays the selected employee's OT rate.
    -   A read-only field now shows the calculated OT amount in real-time on the attendance form.
    -   Added an "OT Amount" column to the main attendance table to show the calculated overtime pay for each entry.
-   **Files Affected**
    -   `components/attendance-mark-form.tsx`
    -   `components/attendance-table.tsx`
    -   `app/dashboard/attendance/page.tsx`
    -   `PROJECT_STATUS.md`
-   **SQL Required:** No

## 2024-07-28 (Fix)

-   **Code Review Fixes**
    -   **Database Migration Fix:** Corrected a failing SQL migration (`20240728120000_add_salary_details_to_employees.sql`) by ensuring the `UPDATE` statement sets `salary_per_day` to `NULL` for employees converted to a 'monthly' salary type. This prevents the subsequent `ADD CONSTRAINT` command from failing.
    -   **Refactoring:** Extracted the duplicated `attendanceStatusCodes` object into a single, shared constant in `lib/constants.ts` to improve maintainability and consistency. The `attendance-mark-form.tsx` and `attendance-table.tsx` components now import this constant.
-   **Files Affected**
    -   `supabase/migrations/20240728120000_add_salary_details_to_employees.sql`
    -   `SUPABASE_CHANGES.md`
    -   `lib/constants.ts` (new)
    -   `components/attendance-mark-form.tsx`
    -   `components/attendance-table.tsx`
-   **SQL Required:** Yes
    -   **Instructions:** The user must manually apply the corrected SQL from the migration file.

## 2024-07-28

-   **Employee & Attendance Module Refactor**
    -   **Employee Management:**
        -   Enhanced the `employees` table to support both "daily" and "monthly" salary types.
        -   Added `salary_type`, `salary_per_month`, and `ot_rate_per_hour` columns to the `employees` table.
        -   Updated the employee form to conditionally show salary inputs based on `salary_type`.
        -   Modified the employees table to correctly display salary information.
    -   **Attendance System:**
        -   Replaced generic attendance statuses with business-specific codes (`S`, `X`, `SL`, `L`, `PC`).
        -   Renamed the `status` column to `status_code` in the `attendance` table and added a check constraint.
        -   Updated the attendance marking form and display table to use the new status codes.
        -   Corrected the dashboard attendance statistics to align with the new codes.
-   **Files Affected**
    -   `components/employee-form.tsx`
    -   `components/employees-table.tsx`
    -   `components/attendance-mark-form.tsx`
    -   `components/attendance-table.tsx`
    -   `app/dashboard/attendance/page.tsx`
    -   `supabase/migrations/20240728120000_add_salary_details_to_employees.sql` (new)
    -   `supabase/migrations/20240728120001_refactor_attendance_status.sql` (new)
    -   `SUPABASE_CHANGES.md` (new)
-   **SQL Required:** Yes
    -   **Instructions:**
        1.  The user must manually apply the SQL from the two new migration files located in `supabase/migrations/` to their Supabase Cloud database. The full scripts are also documented in `SUPABASE_CHANGES.md`.

## 2024-07-24

-   **SQL Schema Audit and Fixes**
    -   Removed the `role` column from the `public.profiles` table.
    -   Updated the `handle_new_user` trigger to remove role assignment logic.
    -   Modified the seed data script to use a placeholder variable instead of `auth.uid()`, making it runnable in a standalone SQL environment.
    -   Renamed and clarified the admin user seeding script.
-   **Files Affected**
    -   `scripts/001_create_tables.sql`
    -   `scripts/003_triggers_functions.sql`
    -   `scripts/004_seed_data.sql`
    -   `supabase/migrations_manual/seed_single_admin.sql` (renamed and updated)
-   **SQL Required:** Yes
    -   **Instructions for a clean setup:**
        1.  Run the updated `scripts/001_create_tables.sql` to create the schema.
        2.  Run the updated `scripts/002_rls_policies.sql` to apply security policies.
        3.  Run the updated `scripts/003_triggers_functions.sql` to create the necessary functions.
        4.  Run `supabase/migrations_manual/seed_single_admin.sql` to create the admin user.
        5.  Run the updated `scripts/004_seed_data.sql` (after setting the `admin_user_id` variable) to populate the database with sample data.

## 2024-07-23

-   **Authentication Simplified (Secure Method)**
    -   Removed the user signup functionality to enforce a single-user system.
    -   Created a secure SQL script to seed the single admin user directly in the Supabase database.
    -   Removed the dead link to the signup page from the login form.
    -   Removed all role-based logic from the database type definitions.
-   **Files Affected**
    -   `app/auth/login/page.tsx` (dead link removed)
    -   `app/auth/sign-up/` (deleted)
    -   `app/auth/sign-up-success/` (deleted)
    -   `lib/types/database.ts` (role definitions removed)
    -   `.gitignore` (updated to exclude log files)
    -   `package-lock.json` (newly tracked)
-   **SQL Required:** No (covered by the 2024-07-24 changes)
