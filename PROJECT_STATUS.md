# Project Status

## Overview

This document tracks the status of the ERP stabilization project. The goal is to align the existing system with the real-world workflows of a CNC and Plating business.

## Current State

The initial project audit, authentication simplification, and SQL schema audit are complete. The system is now locked down to a single-user model. The employee management and attendance modules have been refactored to match business requirements.

## What is fixed

-   **Authentication System:**
    -   The public signup functionality has been completely removed.
    -   All role-based logic has been stripped from the database type definitions, enforcing a single-permission level.
    -   A secure SQL script is now provided to seed the single admin user, preventing credential exposure.
-   **SQL Schema:**
    -   The `role` column has been removed from the `public.profiles` table.
    -   The `handle_new_user` trigger has been updated to remove role assignment.
    -   The seed data script has been updated to remove its dependency on `auth.uid()` and now uses a placeholder variable.
-   **Employee Management:**
    -   The `employees` table now supports both daily and monthly salary structures.
    -   Added `salary_type`, `salary_per_month`, and `ot_rate_per_hour` columns to the `employees` table.
    -   The employee form has been updated to conditionally handle daily vs. monthly salary inputs.
    -   The employee table now displays the correct salary information based on the employee's salary type.
-   **Attendance Module:**
    -   Replaced the generic `present`/`absent` status with business-specific codes: `S` (Shift Worked), `X` (Absent), `SL` (Sick Leave), `L` (Leave), and `PC` (Paid Casual Leave).
    -   The `status` column in the `attendance` table has been renamed to `status_code` and a check constraint has been added to enforce the new codes.
    -   The attendance marking form and the attendance table have been updated to use the new status codes.
    -   Dashboard statistics now correctly calculate "present" and "absent" counts based on the 'S' and 'X' codes.
    -   Overtime (OT) rules are now enforced in the UI. OT is only allowed for status 'S'.
    -   The attendance marking form now displays the employee's OT rate and the calculated OT amount.
    -   The attendance table now displays the calculated OT amount.

## What is pending

### Immediate Priorities
1.  **Payroll Module:** Implement the two required salary models (CNC and Plating), building upon the new employee and attendance structure.

### Subsequent Steps
2.  **Production & Plating:** Simplify the plating module to its core functionality.
3.  **Delivery Challan:** Ensure the DC module is compliant with job-work regulations.
4.  **Final Consistency Check:** A full review to ensure the frontend, backend, and database are all in sync.

## What is intentionally deferred
- Multi-user support
- Advanced payroll features (PF, ESI)
- Complex plating parameters (electrical/chemical)

## Known Limitations
- The ESLint configuration is currently broken and will be skipped.
- All database changes must be applied manually by the user in the Supabase Cloud environment.
