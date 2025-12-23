# Changelog

All notable changes to this project will be documented in this file.

---

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
