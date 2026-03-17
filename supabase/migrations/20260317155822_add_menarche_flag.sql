-- Add is_menarche_journey column to user_wellness_profiles
ALTER TABLE public.user_wellness_profiles 
ADD COLUMN IF NOT EXISTS is_menarche_journey BOOLEAN DEFAULT FALSE;

-- Add a comment to describe the column
COMMENT ON COLUMN public.user_wellness_profiles.is_menarche_journey IS 'Flag to indicate if the user is a young girl just starting her period journey (Menarche)';
