-- ==============================================================================
-- FOODWOK STAFF & ADMIN SUPABASE DATABASE SEED SCRIPT
-- ==============================================================================
-- Execute this script in your Supabase Project SQL Editor (https://supabase.com/dashboard)
-- to create and authorize the staff accounts in Supabase Auth & public.user_profiles.
-- ==============================================================================

-- 1. Ensure pgcrypto extension is active for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Upsert Staff Accounts into auth.users, auth.identities, and public.user_profiles
DO $$
DECLARE
  admin_id UUID := 'a1111111-1111-1111-1111-111111111111';
  kitchen_id UUID := 'b2222222-2222-2222-2222-222222222222';
  admin_email TEXT := 'admin@foodwok.ng';
  kitchen_email TEXT := 'kitchen@foodwok.ng';
  admin_pass TEXT := 'FW#Admin!2026$9xKpZ*8Q';
  kitchen_pass TEXT := 'FW#Kitch!2026*4vLmT$6Y';
BEGIN

  -- ----------------------------------------------------------------------------
  -- A. CREATE / UPDATE ADMIN USER (admin@foodwok.ng)
  -- ----------------------------------------------------------------------------
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    aud
  ) VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    admin_email,
    crypt(admin_pass, gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Foodwok","last_name":"Administrator","role":"ADMIN"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt(admin_pass, gen_salt('bf', 10)),
    email_confirmed_at = NOW(),
    raw_user_meta_data = '{"first_name":"Foodwok","last_name":"Administrator","role":"ADMIN"}'::jsonb,
    updated_at = NOW();

  -- Identity record for Supabase Auth password signin
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    admin_id,
    admin_id,
    format('{"sub":"%s","email":"%s"}', admin_id, admin_email)::jsonb,
    'email',
    admin_email,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (provider, provider_id) DO NOTHING;

  -- Ensure public.user_profiles table exists
  CREATE TABLE IF NOT EXISTS public.user_profiles (
    id TEXT PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'CUSTOMER',
    addresses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Upsert ADMIN Profile with ADMIN role
  INSERT INTO public.user_profiles (
    id,
    email,
    first_name,
    last_name,
    phone,
    role,
    addresses
  ) VALUES (
    admin_id::text,
    admin_email,
    'Foodwok',
    'Administrator',
    '+2348000000001',
    'ADMIN',
    '[]'::jsonb
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'ADMIN',
    email = admin_email,
    first_name = 'Foodwok',
    last_name = 'Administrator';


  -- ----------------------------------------------------------------------------
  -- B. CREATE / UPDATE KITCHEN STAFF USER (kitchen@foodwok.ng)
  -- ----------------------------------------------------------------------------
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    aud
  ) VALUES (
    kitchen_id,
    '00000000-0000-0000-0000-000000000000',
    kitchen_email,
    crypt(kitchen_pass, gen_salt('bf', 10)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Kitchen","last_name":"Staff","role":"KITCHEN_STAFF"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt(kitchen_pass, gen_salt('bf', 10)),
    email_confirmed_at = NOW(),
    raw_user_meta_data = '{"first_name":"Kitchen","last_name":"Staff","role":"KITCHEN_STAFF"}'::jsonb,
    updated_at = NOW();

  -- Identity record for Supabase Auth password signin
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    kitchen_id,
    kitchen_id,
    format('{"sub":"%s","email":"%s"}', kitchen_id, kitchen_email)::jsonb,
    'email',
    kitchen_email,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (provider, provider_id) DO NOTHING;

  -- Upsert KITCHEN STAFF Profile with KITCHEN_STAFF role
  INSERT INTO public.user_profiles (
    id,
    email,
    first_name,
    last_name,
    phone,
    role,
    addresses
  ) VALUES (
    kitchen_id::text,
    kitchen_email,
    'Kitchen',
    'Staff',
    '+2348000000002',
    'KITCHEN_STAFF',
    '[]'::jsonb
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'KITCHEN_STAFF',
    email = kitchen_email,
    first_name = 'Kitchen',
    last_name = 'Staff';

END $$;

-- Verify seeded profiles
SELECT id, email, first_name, last_name, role FROM public.user_profiles WHERE email IN ('admin@foodwok.ng', 'kitchen@foodwok.ng');
