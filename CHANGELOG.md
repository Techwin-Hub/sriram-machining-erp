# Changelog

All notable changes to this project will be documented in this file.

---

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
    -   `supabase/migrations_manual/20240723_seed_admin_user.sql` (new)
    -   `lib/types/database.ts` (role definitions removed)
    -   `.gitignore` (updated to exclude log files)
    -   `package-lock.json` (newly tracked)
-   **SQL Required:** Yes
    -   The administrator must run the `supabase/migrations_manual/20240723_seed_admin_user.sql` script in the Supabase Cloud SQL Editor to create the admin user.
