-- Row Level Security Policies for Manufacturing Management System

-- ============================================================
-- PROFILES POLICIES
-- ============================================================

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- EMPLOYEES POLICIES
-- ============================================================

CREATE POLICY "employees_select_all" ON public.employees
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "employees_insert_authenticated" ON public.employees
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "employees_update_own" ON public.employees
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "employees_delete_own" ON public.employees
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- CUSTOMERS POLICIES
-- ============================================================

CREATE POLICY "customers_select_all" ON public.customers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "customers_insert_authenticated" ON public.customers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "customers_update_own" ON public.customers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "customers_delete_own" ON public.customers
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- VENDORS POLICIES
-- ============================================================

CREATE POLICY "vendors_select_all" ON public.vendors
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "vendors_insert_authenticated" ON public.vendors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "vendors_update_own" ON public.vendors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "vendors_delete_own" ON public.vendors
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- MACHINES POLICIES
-- ============================================================

CREATE POLICY "machines_select_all" ON public.machines
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "machines_insert_authenticated" ON public.machines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "machines_update_own" ON public.machines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "machines_delete_own" ON public.machines
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- PARTS POLICIES
-- ============================================================

CREATE POLICY "parts_select_all" ON public.parts
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "parts_insert_authenticated" ON public.parts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "parts_update_own" ON public.parts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "parts_delete_own" ON public.parts
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- OPERATIONS POLICIES
-- ============================================================

CREATE POLICY "operations_select_all" ON public.operations
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "operations_insert_authenticated" ON public.operations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "operations_update_own" ON public.operations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "operations_delete_own" ON public.operations
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- ATTENDANCE POLICIES
-- ============================================================

CREATE POLICY "attendance_select_all" ON public.attendance
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "attendance_insert_authenticated" ON public.attendance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "attendance_update_own" ON public.attendance
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "attendance_delete_own" ON public.attendance
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- OVERTIME RECORDS POLICIES
-- ============================================================

CREATE POLICY "overtime_select_all" ON public.overtime_records
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "overtime_insert_authenticated" ON public.overtime_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "overtime_update_own" ON public.overtime_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "overtime_delete_own" ON public.overtime_records
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- PAYROLL POLICIES
-- ============================================================

CREATE POLICY "payroll_select_all" ON public.payroll
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "payroll_insert_authenticated" ON public.payroll
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payroll_update_own" ON public.payroll
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "payroll_delete_own" ON public.payroll
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- JOB CARDS POLICIES
-- ============================================================

CREATE POLICY "job_cards_select_all" ON public.job_cards
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "job_cards_insert_authenticated" ON public.job_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "job_cards_update_own" ON public.job_cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "job_cards_delete_own" ON public.job_cards
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- JOB CARD OPERATIONS POLICIES
-- ============================================================

CREATE POLICY "job_operations_select_all" ON public.job_card_operations
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "job_operations_insert_authenticated" ON public.job_card_operations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "job_operations_update_own" ON public.job_card_operations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "job_operations_delete_own" ON public.job_card_operations
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- PLATING JOBS POLICIES
-- ============================================================

CREATE POLICY "plating_jobs_select_all" ON public.plating_jobs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "plating_jobs_insert_authenticated" ON public.plating_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "plating_jobs_update_own" ON public.plating_jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "plating_jobs_delete_own" ON public.plating_jobs
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- PLATING CHEMICALS POLICIES
-- ============================================================

CREATE POLICY "chemicals_select_all" ON public.plating_chemicals
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "chemicals_insert_authenticated" ON public.plating_chemicals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chemicals_update_own" ON public.plating_chemicals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "chemicals_delete_own" ON public.plating_chemicals
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- DELIVERY CHALLANS POLICIES
-- ============================================================

CREATE POLICY "dc_select_all" ON public.delivery_challans
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "dc_insert_authenticated" ON public.delivery_challans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dc_update_own" ON public.delivery_challans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "dc_delete_own" ON public.delivery_challans
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- DELIVERY CHALLAN ITEMS POLICIES
-- ============================================================

CREATE POLICY "dc_items_select_all" ON public.delivery_challan_items
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "dc_items_insert_authenticated" ON public.delivery_challan_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dc_items_update_own" ON public.delivery_challan_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "dc_items_delete_own" ON public.delivery_challan_items
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- INVOICES POLICIES
-- ============================================================

CREATE POLICY "invoices_select_all" ON public.invoices
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "invoices_insert_authenticated" ON public.invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "invoices_update_own" ON public.invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "invoices_delete_own" ON public.invoices
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- INVOICE ITEMS POLICIES
-- ============================================================

CREATE POLICY "invoice_items_select_all" ON public.invoice_items
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "invoice_items_insert_authenticated" ON public.invoice_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "invoice_items_update_own" ON public.invoice_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "invoice_items_delete_own" ON public.invoice_items
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- PURCHASE ORDERS POLICIES
-- ============================================================

CREATE POLICY "po_select_all" ON public.purchase_orders
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "po_insert_authenticated" ON public.purchase_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "po_update_own" ON public.purchase_orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "po_delete_own" ON public.purchase_orders
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- PURCHASE ORDER ITEMS POLICIES
-- ============================================================

CREATE POLICY "po_items_select_all" ON public.purchase_order_items
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "po_items_insert_authenticated" ON public.purchase_order_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "po_items_update_own" ON public.purchase_order_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "po_items_delete_own" ON public.purchase_order_items
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- INVENTORY TRANSACTIONS POLICIES
-- ============================================================

CREATE POLICY "inventory_select_all" ON public.inventory_transactions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "inventory_insert_authenticated" ON public.inventory_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "inventory_update_own" ON public.inventory_transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "inventory_delete_own" ON public.inventory_transactions
  FOR DELETE USING (auth.uid() = user_id);
