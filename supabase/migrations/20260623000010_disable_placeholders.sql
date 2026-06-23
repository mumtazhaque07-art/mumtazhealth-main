-- Disable all old placeholder content to clean up the library
-- We only want to keep the content created today (the 7 stages we just built)
UPDATE public.wellness_content
SET is_active = false
WHERE created_at < CURRENT_DATE;

-- Ensure all our new content has images initialized to null if they don't have one,
-- so we can safely update them later.
