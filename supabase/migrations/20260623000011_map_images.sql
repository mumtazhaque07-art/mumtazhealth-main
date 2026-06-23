-- Image Mapping for Stage 1: First Time & Cycle Health
UPDATE public.wellness_content
SET image_url = '/src/assets/poses/prayer-pose.jpeg'
WHERE 'first-time' = ANY(tags) OR 'cycle-health' = ANY(tags) OR cycle_phases @> ARRAY['menstrual'] OR cycle_phases @> ARRAY['first time'] OR 'cycle syncing' = ANY(tags) OR 'period' = ANY(tags) OR 'first-time' = ANY(tags);

-- More robust update for Stage 1 (using titles we inserted):
UPDATE public.wellness_content
SET image_url = '/src/assets/poses/prayer-pose.jpeg'
WHERE title IN ('Understanding Your Cycle', 'Cycle Syncing Movement', 'Dosha-Specific Nutrition');

-- Stage 2: Fertility & TTC
UPDATE public.wellness_content
SET image_url = '/src/assets/poses/seated-meditation.jpeg'
WHERE title IN ('Understanding Your Fertility Cycle', 'Preparing the Vessel', 'Building Ojas for Fertility') OR 'fertility' = ANY(cycle_phases);

-- Stage 3: Pregnancy
UPDATE public.wellness_content
SET image_url = '/src/assets/poses/seated-welcome.jpeg'
WHERE title IN ('The Sacred Journey', 'Trimester-Specific Movement', 'Nourishing the Mother') OR 'pregnancy' = ANY(cycle_phases);

-- Stage 4: Postpartum
UPDATE public.wellness_content
SET image_url = '/src/assets/poses/low-lunge-block.jpeg'
WHERE title IN ('The Sacred Pause', 'Gentle Recovery & Grounding', 'Restorative Nutrition') OR 'postpartum' = ANY(cycle_phases);

-- Stage 5: Perimenopause
UPDATE public.wellness_content
SET image_url = '/src/assets/poses/eagle-arms-seated.jpeg'
WHERE title IN ('The Transition of Empowerment', 'Moon Salutations & Stability', 'Hormone-Balancing Nutrition') OR 'perimenopause' = ANY(cycle_phases);

-- Stage 6: Menopause & Beyond
UPDATE public.wellness_content
SET image_url = '/src/assets/poses/downward-dog-blocks.jpeg'
WHERE title IN ('The Threshold of Wisdom', 'Joint Lubrication & Bone Health', 'Nourishing the Wisdom Years') OR 'menopause' = ANY(cycle_phases);

-- Stage 7: The Wise Woman
UPDATE public.wellness_content
SET image_url = '/src/assets/joint-care-chair-yoga.jpg'
WHERE title IN ('The Crown of Wisdom', 'Gentle Mobility & Spiritual Connection', 'Nourishing the Vata Stage of Life') OR 'post-menopause' = ANY(cycle_phases);
