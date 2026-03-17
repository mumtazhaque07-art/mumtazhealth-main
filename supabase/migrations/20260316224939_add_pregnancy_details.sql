-- Migration to add specific pregnancy journey details
ALTER TABLE public.user_wellness_profiles 
ADD COLUMN pregnancy_conception_type TEXT DEFAULT 'natural' CHECK (pregnancy_conception_type IN ('natural', 'ivf', 'iui')),
ADD COLUMN pregnancy_multiples TEXT DEFAULT 'singleton' CHECK (pregnancy_multiples IN ('singleton', 'twins', 'triplets', 'other')),
ADD COLUMN is_surrogate BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.user_wellness_profiles.pregnancy_conception_type IS 'Tracks if the pregnancy was natural, IVF, or IUI for personalized AI guidance';
COMMENT ON COLUMN public.user_wellness_profiles.pregnancy_multiples IS 'Tracks if the mother is expecting a singleton, twins, triplets, or more';
COMMENT ON COLUMN public.user_wellness_profiles.is_surrogate IS 'Tracks if the user is acting as a surrogate mother';
