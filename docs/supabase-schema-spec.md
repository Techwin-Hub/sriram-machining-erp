# Supabase Database Schema Specification

## 1. Overview

This document provides a detailed specification of the Supabase (PostgreSQL) database schema for the Manufacturing ERP system. It is intended for developers, administrators, and anyone who needs to understand the data model.

The schema is designed to support a single-user (admin) model for a small manufacturing business, covering master data management, attendance, production, and basic financial tracking.

## 2. Global Conventions

### Primary Keys
- All primary keys are of type `UUID`.
- Most are auto-generated using `uuid_generate_v4()`.

### Ownership & Timestamps
- Most tables have a `user_id` column (UUID) which is a foreign key to `auth.users(id)`. This links every record to the single admin user.
- All tables include `created_at` and `updated_at` (TIMESTAMP WITH TIME ZONE) for auditing. The `updated_at` column is automatically updated by a trigger.

### Row Level Security (RLS)
- RLS is **enabled** on all tables.
- The policies are simple and enforce that only the authenticated user (the single admin) can create, read, update, or delete their own data. There is no multi-tenant or role-based logic.

### Naming Conventions
- Table names are plural (e.g., `employees`, `customers`).
- Column names are `snake_case`.

---

## 3. Enums and Custom Types

### `salary_type_enum`
- **Purpose:** Defines the two supported salary structures for an employee.
- **Values:**
  - `daily`: Employee is paid a fixed rate per day worked.
  - `monthly`: Employee is paid a fixed salary per month.

### Attendance Status Codes
- **Purpose:** Defines the possible statuses for a daily attendance record. These are not a formal enum but are enforced by a `CHECK` constraint.
- **Values:**
  - `S`: Shift Worked (eligible for pay/OT).
  - `X`: Absent (unpaid).
  - `SL`: Sick Leave (unpaid).
  - `L`: Leave (unpaid).
  - `PC`: Paid Casual Leave (paid).

---

## 4. Triggers & Functions

### `handle_new_user()`
- **Event:** Fires `AFTER INSERT` on the `auth.users` table.
- **Action:** Automatically creates a corresponding record in the `public.profiles` table to store user-related public data.

### `update_updated_at_column()`
- **Event:** Fires `BEFORE UPDATE` on almost every table in the schema.
- **Action:** Automatically sets the `updated_at` column to the current timestamp (`NOW()`) whenever a row is modified.

### `update_part_inventory()`
- **Event:** Fires `AFTER INSERT` on the `public.inventory_transactions` table.
- **Action:** Updates the `current_stock` in the `public.parts` table based on the transaction type.
  - Increases stock for 'purchase', 'production', 'return'.
  - Decreases stock for 'sale', 'adjustment'.

---

## 5. Table-by-Table Specification

### AUTH / CORE

#### `auth.users`
- **Purpose:** Supabase's built-in table for user authentication.
- **Business Meaning:** Contains the core identity of the single admin user.
- **Editable via UI?** No
- **Editable via SQL only?** Yes (for creating the initial admin user).
- **Common Mistakes:** Do not modify this table directly after the initial setup. Use the Supabase Auth UI or API for any user management.

#### `public.profiles`
- **Purpose:** Stores public-facing data for users from `auth.users`.
- **Business Meaning:** Holds the admin's full name and email.
- **Columns:**
  - `id` (UUID, PK, FK to `auth.users`): User's unique identifier.
  - `full_name` (TEXT, required): The user's full name.
  - `email` (TEXT, required): The user's email address.
  - `created_at` / `updated_at`: Timestamps.
- **Relationships:** One-to-one with `auth.users`.
- **Editable via UI?** Yes (via a "Profile" page).
- **Editable via SQL only?** No
- **Common Mistakes:** This table is automatically populated by the `handle_new_user` trigger. Manual inserts are not needed.

### MASTER DATA

#### `public.employees`
- **Purpose:** Master list of all employees.
- **Business Meaning:** The central record for all workers, their salary details, and status.
- **Columns:**
  - `id` (UUID, PK): Unique employee identifier.
  - `user_id` (UUID, FK to `auth.users`): Ownership link to the admin.
  - `employee_code` (TEXT, required, unique): A unique code for each employee.
  - `name` (TEXT, required): Employee's full name.
  - `designation` (TEXT, required): Job title.
  - `department` (TEXT, required): Department (e.g., "CNC", "Plating").
  - `date_of_joining` (DATE, required): When the employee started.
  - `phone` (TEXT, nullable): Contact phone number.
  - `address` (TEXT, nullable): Home address.
  - `salary_type` (`salary_type_enum`, nullable): 'daily' or 'monthly'.
  - `salary_per_day` (DECIMAL(10, 2), nullable): Required if `salary_type` is 'daily'.
  - `salary_per_month` (DECIMAL(10, 2), nullable): Required if `salary_type` is 'monthly'.
  - `ot_rate_per_hour` (DECIMAL(10, 2), nullable): Overtime rate.
  - `status` (TEXT, default: 'active'): 'active' or 'inactive'.
- **Relationships:** Referenced by `attendance`, `overtime_records`, `payroll`.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** Violating the `salary_consistency_check`. An employee must have either `salary_per_day` OR `salary_per_month` set, but not both, depending on their `salary_type`.

#### `public.customers`
- **Purpose:** Master list of all customers.
- **Business Meaning:** All companies or individuals who purchase goods/services.
- **Columns:**
  - `id` (UUID, PK): Unique customer identifier.
  - `customer_code` (TEXT, required, unique): Unique business-friendly code.
  - `company_name` (TEXT, required): Customer's company name.
  - `gst_number` (TEXT, nullable): GSTIN.
  - `billing_address` / `shipping_address` (TEXT, nullable): Addresses.
  - `status` (TEXT, default: 'active'): 'active' or 'inactive'.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** Creating duplicate customers. Ensure `customer_code` is unique.

#### `public.vendors`
- **Purpose:** Master list of all suppliers.
- **Business Meaning:** Companies from whom materials or services are purchased.
- **Columns:**
  - `id` (UUID, PK): Unique vendor identifier.
  - `vendor_code` (TEXT, required, unique): Unique business-friendly code.
  - `company_name` (TEXT, required): Vendor's company name.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

#### `public.machines`
- **Purpose:** Master list of all machinery.
- **Business Meaning:** Records of all physical machines used in production.
- **Columns:**
  - `id` (UUID, PK): Unique machine identifier.
  - `machine_code` (TEXT, required, unique): Unique code for the machine.
  - `machine_name` (TEXT, required): Name of the machine.
  - `status` (TEXT, default: 'active'): 'active', 'under_maintenance', 'inactive'.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

#### `public.parts`
- **Purpose:** Master list of all parts (raw materials, finished goods).
- **Business Meaning:** The definitive catalog of all items that can be stocked, produced, or sold.
- **Columns:**
  - `id` (UUID, PK): Unique part identifier.
  - `part_code` (TEXT, required, unique): Unique code for the part.
  - `part_name` (TEXT, required): Name of the part.
  - `current_stock` (INTEGER, default: 0): Current inventory level.
- **Editable via UI?** Yes
- **Editable via SQL only?** No (stock is edited via transactions).
- **Common Mistakes:** Manually editing `current_stock`. This field should only be changed by the `update_part_inventory` trigger via the `inventory_transactions` table.

#### `public.operations`
- **Purpose:** Master list of all manufacturing operations.
- **Business Meaning:** A catalog of production steps (e.g., "Cutting", "Drilling", "Plating").
- **Columns:**
  - `id` (UUID, PK): Unique operation identifier.
  - `operation_code` (TEXT, required, unique): Unique code for the operation.
  - `operation_name` (TEXT, required): Name of the operation.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

#### `public.plating_chemicals`
- **Purpose:** Master list of chemicals used in the plating process.
- **Business Meaning:** Inventory tracking for plating chemicals.
- **Columns:**
  - `id` (UUID, PK): Unique chemical identifier.
  - `chemical_code` (TEXT, required, unique): Unique code for the chemical.
  - `chemical_name` (TEXT, required): Name of the chemical.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

### OPERATIONS

#### `public.attendance`
- **Purpose:** Records daily attendance for each employee.
- **Business Meaning:** The source of truth for tracking who worked on which day.
- **Columns:**
  - `id` (UUID, PK): Unique attendance record ID.
  - `employee_id` (UUID, FK to `employees`, required): The employee being marked.
  - `date` (DATE, required): The date of the attendance record.
  - `status_code` (TEXT, required): Must be one of 'X', 'S', 'SL', 'L', 'PC'.
  - `ot_hours` (DECIMAL(5, 2), default: 0): Overtime hours worked.
- **Relationships:** Belongs to one `employee`.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** Entering an invalid `status_code`. Using this table for historical corrections is fine.

#### `public.overtime_records`
- **Purpose:** A dedicated table to track overtime, although the primary OT data is now on the `attendance` table.
- **Business Meaning:** This table appears to be a legacy or secondary method for tracking overtime. The `attendance.ot_hours` is the primary source of data.
- **Columns:**
  - `id` (UUID, PK): Unique record ID.
  - `employee_id` (UUID, FK to `employees`, required): The employee.
  - `date` (DATE, required): Date of overtime.
  - `hours` (DECIMAL(5, 2), required): OT hours.
  - `rate_per_hour` (DECIMAL(10, 2), required): The rate at the time of OT.
  - `total_amount` (DECIMAL(10, 2), generated): `hours * rate_per_hour`.
- **Editable via UI?** No
- **Editable via SQL only?** Yes
- **Common Mistakes:** Using this table instead of the `attendance` table for new OT entries.

#### `public.job_cards`
- **Purpose:** Tracks a specific production order for a customer.
- **Business Meaning:** A single work order to produce a certain quantity of a part.
- **Columns:**
  - `id` (UUID, PK): Unique job card identifier.
  - `job_card_number` (TEXT, required, unique): A unique number for the work order.
  - `customer_id` (UUID, FK to `customers`): The customer who placed the order.
  - `part_id` (UUID, FK to `parts`): The part being produced.
  - `quantity` (INTEGER, required): The number of parts to produce.
  - `status` (TEXT, default: 'pending'): 'pending', 'in_progress', 'completed', 'cancelled'.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

#### `public.job_card_operations`
- **Purpose:** Tracks the individual operations (steps) for a given job card.
- **Business Meaning:** A checklist of manufacturing steps for a work order.
- **Columns:**
  - `id` (UUID, PK): Unique ID for the job card step.
  - `job_card_id` (UUID, FK to `job_cards`, required): The parent job card.
  - `operation_id` (UUID, FK to `operations`, required): The operation to be performed.
  - `status` (TEXT, default: 'pending'): 'pending', 'in_progress', 'completed', 'on_hold'.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

#### `public.plating_jobs`
- **Purpose:** Tracks plating-specific jobs.
- **Business Meaning:** Detailed records for plating operations, including chemical and electrical parameters.
- **Columns:**
  - `id` (UUID, PK): Unique plating job ID.
  - `job_card_id` (UUID, FK to `job_cards`): The parent job card.
  - `plating_type` (TEXT, required): 'nickel', 'chrome', etc.
  - `status` (TEXT, default: 'pending'): 'pending', 'in_process', 'completed', etc.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

### SALES & FINANCE

#### `public.delivery_challans`
- **Purpose:** Records goods being sent out to a customer.
- **Business Meaning:** A delivery note or challan that accompanies a shipment.
- **Columns:**
  - `id` (UUID, PK): Unique DC identifier.
  - `dc_number` (TEXT, required, unique): The delivery challan number.
  - `customer_id` (UUID, FK to `customers`, required): The customer receiving the goods.
  - `dc_date` (DATE, required): Date of dispatch.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

#### `public.delivery_challan_items`
- **Purpose:** Line items for a delivery challan.
- **Business Meaning:** The specific parts and quantities included in a shipment.
- **Columns:**
  - `id` (UUID, PK): Unique line item ID.
  - `dc_id` (UUID, FK to `delivery_challans`, required): The parent DC.
  - `part_id` (UUID, FK to `parts`, required): The part being shipped.
  - `quantity` (INTEGER, required): Quantity of the part.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

#### `public.invoices`
- **Purpose:** Represents a bill sent to a customer for goods/services.
- **Business Meaning:** The formal invoice for a sale.
- **Columns:**
  - `id` (UUID, PK): Unique invoice ID.
  - `invoice_number` (TEXT, required, unique): The invoice number.
  - `customer_id` (UUID, FK to `customers`, required): The billed customer.
  - `total_amount` (DECIMAL(12, 2), required): The total amount due.
  - `payment_status` (TEXT, default: 'unpaid'): 'unpaid', 'partially_paid', 'paid', 'overdue'.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

#### `public.invoice_items`
- **Purpose:** Line items for an invoice.
- **Business Meaning:** The breakdown of charges on an invoice.
- **Columns:**
  - `id` (UUID, PK): Unique line item ID.
  - `invoice_id` (UUID, FK to `invoices`, required): The parent invoice.
  - `part_id` (UUID, FK to `parts`, required): The part being billed for.
  - `quantity` (INTEGER, required): Quantity of the part.
  - `unit_price` (DECIMAL(10, 2), required): Price per unit.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

#### `public.purchase_orders`
- **Purpose:** Represents an order placed with a vendor.
- **Business Meaning:** A purchase order for raw materials or other goods.
- **Columns:**
  - `id` (UUID, PK): Unique PO identifier.
  - `po_number` (TEXT, required, unique): The PO number.
  - `vendor_id` (UUID, FK to `vendors`, required): The vendor the order is for.
  - `status` (TEXT, default: 'draft'): 'draft', 'sent', 'received', etc.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

#### `public.purchase_order_items`
- **Purpose:** Line items for a purchase order.
- **Business Meaning:** The specific parts and quantities being ordered from a vendor.
- **Columns:**
  - `id` (UUID, PK): Unique line item ID.
  - `po_id` (UUID, FK to `purchase_orders`, required): The parent PO.
  - `part_id` (UUID, FK to `parts`, required): The part being ordered.
  - `quantity` (INTEGER, required): Quantity of the part.
- **Editable via UI?** Yes
- **Editable via SQL only?** No
- **Common Mistakes:** N/A

### SYSTEM

#### `public.inventory_transactions`
- **Purpose:** An audit log of all changes to inventory levels.
- **Business Meaning:** The ledger for all stock movements. This is a critical table for inventory accuracy.
- **Columns:**
  - `id` (UUID, PK): Unique transaction ID.
  - `part_id` (UUID, FK to `parts`, required): The part whose stock is changing.
  - `transaction_type` (TEXT, required): 'purchase', 'production', 'sale', 'adjustment', 'return'.
  - `quantity` (INTEGER, required): The amount of stock change (positive or negative is handled by the trigger).
- **Editable via UI?** No (transactions should be generated by other actions).
- **Editable via SQL only?** Yes (for manual stock adjustments).
- **Common Mistakes:** Manually inserting records without understanding the impact on `parts.current_stock`.
