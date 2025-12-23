-- This script creates the single admin user for the application.
-- It should be run ONLY ONCE in the Supabase SQL Editor.
--
-- Credentials:
-- Email: sethuramanvr046@gmail.com
-- Password: Spirulina12*#
--
-- This script will insert a new user into the `auth.users` table.
-- The `handle_new_user` trigger will then automatically create a corresponding
-- profile in the `public.profiles` table.

-- Before running, ensure the pgcrypto extension is enabled.
-- You can do this by running: CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Use a transaction to ensure both inserts succeed or fail together
BEGIN;

-- Insert the new user into auth.users
-- The `handle_new_user` trigger will automatically create the profile.
WITH new_user AS (
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'sethuramanvr046@gmail.com',
    crypt('Spirulina12*#', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    now(),
    now()
  )
  RETURNING id
)
-- Insert the corresponding identity into auth.identities
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  id,
  'sethuramanvr046@gmail.com',
  'email',
  format('{"sub":"%s","email":"sethuramanvr046@gmail.com"}', id)::jsonb,
  now(),
  now(),
  now()
FROM new_user;

COMMIT;
