
-- Supabase User Management Setup SQL Script

-- 0. (Optional but Recommended) Clean up old types/tables if re-running
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP TRIGGER IF EXISTS handle_profile_updated_at ON public.profiles;
-- DROP FUNCTION IF EXISTS public.update_updated_at_column();
-- DROP TABLE IF EXISTS public.profiles;
-- DROP TYPE IF EXISTS public.app_role;

-- 1. Create the app_role enum type
CREATE TYPE public.app_role AS ENUM ('user', 'support', 'admin');

-- 2. Create the profiles table
-- This table will store additional user information, including their role.
-- It's linked to the auth.users table via the id (UUID).
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE, -- Kept for easier querying, should match auth.users.email
  full_name TEXT,
  role public.app_role NOT NULL DEFAULT 'user'::public.app_role,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comment on table and columns for clarity
COMMENT ON TABLE public.profiles IS 'Stores user profile information, including roles, linked to auth.users.';
COMMENT ON COLUMN public.profiles.id IS 'User ID, references auth.users.id.';
COMMENT ON COLUMN public.profiles.email IS 'User''s email, should be kept in sync with auth.users.email.';
COMMENT ON COLUMN public.profiles.full_name IS 'Full name of the user.';
COMMENT ON COLUMN public.profiles.role IS 'Application-specific role for the user (user, support, admin).';

-- 3. Function to automatically create a profile entry when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER -- Allows the function to run with higher privileges to insert into public.profiles
SET search_path = public -- Ensures the function can find the profiles table
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user'::public.app_role); -- New users default to 'user' role
  RETURN NEW;
END;
$$;

-- 4. Trigger to execute handle_new_user function after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger to update updated_at on profiles table before any update operation
CREATE TRIGGER handle_profile_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

-- 7. Enable Row Level Security (RLS) on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies for 'profiles' table:
-- Policy 1: Users can view their own profile.
CREATE POLICY "Allow individuals to view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile (e.g., full_name).
CREATE POLICY "Allow individuals to update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id); -- Ensure they are only updating their own record

-- Policy 3: Admins can view all profiles.
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'::public.app_role
  )
);

-- Policy 4: Admins can update any profile (e.g., to change a role).
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'::public.app_role
  )
)
WITH CHECK ( -- Optional: add checks if admins can only perform certain updates
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'::public.app_role
  )
);
-- Note: For simplicity, INSERT and DELETE for profiles are not covered here.
-- INSERT is handled by the trigger. DELETE might be restricted or admin-only.


-- 9. RLS Policies for 'tickets' table (adjust as needed):
-- Ensure RLS is enabled on the tickets table first if not already:
-- ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own tickets (matching email or a user_id field if you add one).
-- Assuming tickets have an 'email' column matching the creator's email.
CREATE POLICY "Users can view their own tickets"
ON public.tickets
FOR SELECT
USING (auth.email() = email); -- Or auth.uid() = user_id if you add user_id to tickets

-- Policy 2: Users can insert new tickets.
-- The check condition ensures the email in the new ticket matches the authenticated user's email.
CREATE POLICY "Users can insert new tickets"
ON public.tickets
FOR INSERT
WITH CHECK (auth.email() = email AND status = 'Open'); -- Or auth.uid() = user_id

-- Policy 3: Users can update limited fields of their own *open* tickets.
CREATE POLICY "Users can update their own open tickets"
ON public.tickets
FOR UPDATE
USING (auth.email() = email AND status = 'Open')
WITH CHECK (auth.email() = email AND status = 'Open'); -- Add specific columns if needed

-- Policy 4: Support staff can view all tickets.
CREATE POLICY "Support can view all tickets"
ON public.tickets
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE public.profiles.id = auth.uid() AND (public.profiles.role = 'support'::public.app_role OR public.profiles.role = 'admin'::public.app_role)
  )
);

-- Policy 5: Support staff can update any ticket (e.g., change status, add comments).
CREATE POLICY "Support can update any ticket"
ON public.tickets
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE public.profiles.id = auth.uid() AND (public.profiles.role = 'support'::public.app_role OR public.profiles.role = 'admin'::public.app_role)
  )
); -- No WITH CHECK here means they can change to any valid value. Add if needed.

-- Policy 6: Admins have full access to tickets (covered by support role policies if admin is a superset, or create specific admin policies).
-- If admins need more permissions than support (e.g., DELETE), add specific policies:
CREATE POLICY "Admins can delete tickets"
ON public.tickets
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'::public.app_role
  )
);

-- After setting up, you might want to manually set a user's role to 'admin' or 'support'
-- for testing purposes. Example:
-- UPDATE public.profiles SET role = 'admin'::public.app_role WHERE email = 'admin@example.com';
-- UPDATE public.profiles SET role = 'support'::public.app_role WHERE email = 'support@example.com';

-- Remember to ensure your application logic correctly handles user authentication
-- and passes the JWT to Supabase for RLS to work.
