-- Fix cycle_phases for Stage 2 (Fertility)
UPDATE public.wellness_content
SET cycle_phases = ARRAY['fertility']
WHERE 'fertility' = ANY(tags) AND (cycle_phases IS NULL OR array_length(cycle_phases, 1) IS NULL);

-- Fix cycle_phases for Stage 3 (Pregnancy)
UPDATE public.wellness_content
SET cycle_phases = ARRAY['pregnancy'],
    pregnancy_statuses = ARRAY['pregnant']
WHERE 'pregnancy' = ANY(tags) AND (cycle_phases IS NULL OR array_length(cycle_phases, 1) IS NULL);

-- Fix cycle_phases for Stage 5 (Perimenopause)
UPDATE public.wellness_content
SET cycle_phases = ARRAY['perimenopause']
WHERE 'perimenopause' = ANY(tags) AND (cycle_phases IS NULL OR array_length(cycle_phases, 1) IS NULL);

-- Fix cycle_phases for Stage 6 (Menopause & Beyond)
UPDATE public.wellness_content
SET cycle_phases = ARRAY['menopause']
WHERE 'menopause' = ANY(tags) AND (cycle_phases IS NULL OR array_length(cycle_phases, 1) IS NULL);

-- Fix cycle_phases for Stage 7 (Wise Woman / Post Menopause)
UPDATE public.wellness_content
SET cycle_phases = ARRAY['post-menopause']
WHERE 'wise-woman' = ANY(tags) AND (cycle_phases IS NULL OR array_length(cycle_phases, 1) IS NULL);
