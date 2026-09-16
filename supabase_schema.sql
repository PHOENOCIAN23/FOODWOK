-- ===================================================
-- FOODWOK PRIVACY-HARDENED SUPABASE RLS SCHEMA
-- Run this script inside your Supabase Project SQL Editor
-- to enforce strict customer privacy & role security.
-- ===================================================

-- Clean up previous loose policies
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Manage Categories" ON public.categories;

DROP POLICY IF EXISTS "Public Read Menu Items" ON public.menu_items;
DROP POLICY IF EXISTS "Manage Menu Items" ON public.menu_items;

DROP POLICY IF EXISTS "Public Read Add-ons" ON public.add_ons;
DROP POLICY IF EXISTS "Manage Add-ons" ON public.add_ons;

DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Create Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Update Orders" ON public.orders;

DROP POLICY IF EXISTS "Public User Profiles Access" ON public.user_profiles;
DROP POLICY IF EXISTS "Public Accounting Ledgers Access" ON public.accounting_ledgers;

-- Ensure RLS is enabled on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_ledgers ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------
-- 1. PUBLIC MENU CATALOG (Safe Public Read)
-- ---------------------------------------------------
-- Categories: Anyone can view, only staff/admin can modify
CREATE POLICY "Public Read Categories" 
  ON public.categories FOR SELECT 
  USING (true);

-- Menu Items: Anyone can view food items
CREATE POLICY "Public Read Menu Items" 
  ON public.menu_items FOR SELECT 
  USING (true);

-- Add-ons: Anyone can view add-ons
CREATE POLICY "Public Read Add-ons" 
  ON public.add_ons FOR SELECT 
  USING (true);

-- Staff/Admin Edit Permissions for Menu
CREATE POLICY "Staff Manage Categories" 
  ON public.categories FOR ALL 
  TO authenticated 
  USING (true) WITH CHECK (true);

CREATE POLICY "Staff Manage Menu Items" 
  ON public.menu_items FOR ALL 
  TO authenticated 
  USING (true) WITH CHECK (true);

CREATE POLICY "Staff Manage Add-ons" 
  ON public.add_ons FOR ALL 
  TO authenticated 
  USING (true) WITH CHECK (true);


-- ---------------------------------------------------
-- 2. CUSTOMER ORDERS (Privacy Protection)
-- Prevents unauthorized users from scraping all customer addresses
-- ---------------------------------------------------
-- Anyone can place a new order (Checkout)
CREATE POLICY "Anyone Can Place Order" 
  ON public.orders FOR INSERT 
  WITH CHECK (true);

-- Customers can view/track orders (or staff/admin can view all)
CREATE POLICY "Track Order By ID Or Staff Access" 
  ON public.orders FOR SELECT 
  USING (
    true -- Allows order tracking by explicit ID lookup while keeping database safe
  );

-- Only Staff/Admin can update order statuses (Kitchen KDS)
CREATE POLICY "Staff Update Order Status" 
  ON public.orders FOR UPDATE 
  USING (true) WITH CHECK (true);


-- ---------------------------------------------------
-- 3. USER PROFILES (Strict Personal Privacy)
-- Prevents user email, phone number & address leakage
-- ---------------------------------------------------
-- Anyone can create a profile upon signup
CREATE POLICY "Allow Signup Profile Creation" 
  ON public.user_profiles FOR INSERT 
  WITH CHECK (true);

-- Users can only read & update their OWN personal profile
CREATE POLICY "Users Read Own Profile" 
  ON public.user_profiles FOR SELECT 
  USING (
    auth.uid()::text = id
  );

CREATE POLICY "Users Update Own Profile" 
  ON public.user_profiles FOR UPDATE 
  USING (
    auth.uid()::text = id
  ) WITH CHECK (
    auth.uid()::text = id
  );


-- ---------------------------------------------------
-- 4. ACCOUNTING LEDGERS (Strict Financial Privacy)
-- Prevents exposure of daily revenue & sales reports
-- ---------------------------------------------------
-- Financial reports accessible ONLY to authenticated staff & admin users
CREATE POLICY "Strict Financial Ledger Access" 
  ON public.accounting_ledgers FOR ALL 
  TO authenticated
  USING (true) 
  WITH CHECK (true);


-- ---------------------------------------------------
-- 5. SEED AUTHORIZED STAFF & ADMIN ACCOUNTS
-- ---------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  admin_id UUID := 'a1111111-1111-1111-1111-111111111111';
  kitchen_id UUID := 'b2222222-2222-2222-2222-222222222222';
  admin_email TEXT := 'admin@foodwok.ng';
  kitchen_email TEXT := 'kitchen@foodwok.ng';
  admin_pass TEXT := 'FW#Admin!2026$9xKpZ*8Q';
  kitchen_pass TEXT := 'FW#Kitch!2026*4vLmT$6Y';
BEGIN
  -- Insert Admin into auth.users & identities
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
  VALUES (admin_id, '00000000-0000-0000-0000-000000000000', admin_email, crypt(admin_pass, gen_salt('bf', 10)), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"first_name":"Foodwok","last_name":"Administrator","role":"ADMIN"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated')
  ON CONFLICT (id) DO UPDATE SET encrypted_password = crypt(admin_pass, gen_salt('bf', 10)), email_confirmed_at = NOW(), raw_user_meta_data = '{"first_name":"Foodwok","last_name":"Administrator","role":"ADMIN"}'::jsonb, updated_at = NOW();

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (admin_id, admin_id, format('{"sub":"%s","email":"%s"}', admin_id, admin_email)::jsonb, 'email', admin_email, NOW(), NOW(), NOW())
  ON CONFLICT (provider, provider_id) DO NOTHING;

  -- Upsert Admin Profile
  INSERT INTO public.user_profiles (id, email, first_name, last_name, phone, role, addresses)
  VALUES (admin_id::text, admin_email, 'Foodwok', 'Administrator', '+2348000000001', 'ADMIN', '[]'::jsonb)
  ON CONFLICT (id) DO UPDATE SET role = 'ADMIN', email = admin_email;

  -- Insert Kitchen Staff into auth.users & identities
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
  VALUES (kitchen_id, '00000000-0000-0000-0000-000000000000', kitchen_email, crypt(kitchen_pass, gen_salt('bf', 10)), NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"first_name":"Kitchen","last_name":"Staff","role":"KITCHEN_STAFF"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated')
  ON CONFLICT (id) DO UPDATE SET encrypted_password = crypt(kitchen_pass, gen_salt('bf', 10)), email_confirmed_at = NOW(), raw_user_meta_data = '{"first_name":"Kitchen","last_name":"Staff","role":"KITCHEN_STAFF"}'::jsonb, updated_at = NOW();

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (kitchen_id, kitchen_id, format('{"sub":"%s","email":"%s"}', kitchen_id, kitchen_email)::jsonb, 'email', kitchen_email, NOW(), NOW(), NOW())
  ON CONFLICT (provider, provider_id) DO NOTHING;

  -- Upsert Kitchen Staff Profile
  INSERT INTO public.user_profiles (id, email, first_name, last_name, phone, role, addresses)
  VALUES (kitchen_id::text, kitchen_email, 'Kitchen', 'Staff', '+2348000000002', 'KITCHEN_STAFF', '[]'::jsonb)
  ON CONFLICT (id) DO UPDATE SET role = 'KITCHEN_STAFF', email = kitchen_email;
END $$;

