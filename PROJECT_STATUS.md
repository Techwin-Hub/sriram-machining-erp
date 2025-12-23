# Project Status

## Overview

This document tracks the status of the ERP stabilization project. The goal is to align the existing system with the real-world workflows of a CNC and Plating business.

## Current State

The initial project audit, authentication simplification, and SQL schema audit are complete. The system is now locked down to a single-user model, and the core SQL scripts have been updated to remove all role-based logic.

## What is fixed

-   **Authentication System:**
    -   The public signup functionality has been completely removed.
    -   All role-based logic has been stripped from the database type definitions, enforcing a single-permission level.
    -   A secure SQL script is now provided to seed the single admin user, preventing credential exposure.
-   **SQL Schema:**
    -   The `role` column has been removed from the `public.profiles` table.
    -   The `handle_new_user` trigger has been updated to remove role assignment.
    -   The seed data script has been updated to remove its dependency on `auth.uid()` and now uses a placeholder variable.

## What is pending

### Immediate Priorities
1.  **Project Audit:** Continue the full codebase review to identify other misaligned or overbuilt features.

### Subsequent Steps
2.  **Attendance Module:** Rework the attendance logic to match the Excel-based system.
3.  **Payroll Module:** Implement the two required salary models (CNC and Plating).
4.  **Production & Plating:** Simplify the plating module to its core functionality.
5.  **Delivery Challan:** Ensure the DC module is compliant with job-work regulations.
6.  **Final Consistency Check:** A full review to ensure the frontend, backend, and database are all in sync.

## What is intentionally deferred
- Multi-user support
- Advanced payroll features (PF, ESI)
- Complex plating parameters (electrical/chemical)

## Known Limitations
- The ESLint configuration is currently broken and will be skipped.
- All database changes must be applied manually by the user in the Supabase Cloud environment.
