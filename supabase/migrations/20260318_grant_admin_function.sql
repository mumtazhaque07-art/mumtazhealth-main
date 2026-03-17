-- Create a secure function to grant admin role (bypasses RLS with SECURITY DEFINER)
-- This is safe because it only grants admin to the CALLING user (auth.uid())
CREATE OR REPLACE FUNCTION public.grant_admin_to_self()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if already admin
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = current_user_id AND role = 'admin'
  ) THEN
    -- Already admin, nothing to do
    RETURN;
  END IF;

  -- Grant admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (current_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;
