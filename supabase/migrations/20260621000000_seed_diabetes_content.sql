INSERT INTO public.wellness_content (
  title,
  description,
  detailed_guidance,
  content_type,
  doshas,
  cycle_phases,
  benefits,
  tags,
  difficulty_level,
  duration_minutes,
  tier_requirement,
  is_premium,
  is_active,
  video_url
) VALUES 
(
  'Anti-Gravity Chair Flow: Uplifting Tridoshic Renewal',
  'A gentle, floor-free chair sequence designed to counter the downward pull of gravity, release joint stiffness, and boost circulation.',
  'Welcome, dear one. This deeply inclusive practice calms Vata, cools Pitta, and stimulates Kapha without placing stress on the nervous system or spiking cortisol.

1. **Seated Mountain & Breath**: Sit tall away from the back of the chair, feet flat on the earth. Inhale to sweep the arms up to the sky (lifting against gravity), and exhale to bring hands to the heart, settling your energy.
2. **Anti-Stiffness Joint Release**: Gently roll the shoulders backward and execute slow ankle and wrist circles to keep synovial fluid moving and release accumulated tension.
3. **Seated Cat-Cow**: Place hands on knees. Inhale to lift the chest and look slightly upward (countering slouching), then exhale to gently round the spine, tucking the chin to soothe the nervous system.',
  'video',
  ARRAY['vata', 'pitta', 'kapha'],
  ARRAY['luteal', 'menstrual', 'follicular', 'ovulatory'],
  ARRAY['circulation', 'nervous system', 'joint release', 'blood sugar balance'],
  ARRAY['diabetes', 'blood-sugar', 'gentle-movement', 'chair-yoga', 'relaxation'],
  'gentle',
  10,
  'free',
  false,
  true,
  'https://www.youtube.com/@MumtazWellbeing'
),
(
  'Rose & Cardamom Rice Congee: Warm Arab-Ayur Fusion',
  'A velvety, beautifully aromatic rice-based bowl inspired by traditional regional comfort for sustained, grounded energy.',
  'A warm, easy-to-digest meal that provides sustained, grounded energy and stabilizes blood sugar without taxing the digestive fire (Agni). The soothing rice grounds Vata, the rose and cardamom cool and soothe Pitta, and the light, warm preparation ensures it won''t aggravate Kapha.

1. **The Base**: Simmer white Basmati rice in a blend of water and light almond or coconut milk until it becomes beautifully soft, creamy, and highly absorbable.
2. **The Aromatic Spice Blend**: Infuse the rice with crushed cardamom pods (supports digestion and reduces acidity) and a splash of pure rose water to cool and soothe the mind.
3. **The Mindful Ritual**: Top with a tiny drizzle of raw honey (added after cooling) or a few soaked, peeled almonds. Sit in a quiet space, breathe in the calming aroma, and eat slowly to fully honor the nourishment.',
  'nutrition',
  ARRAY['vata', 'pitta', 'kapha'],
  ARRAY['luteal', 'menstrual', 'follicular', 'ovulatory'],
  ARRAY['blood sugar balance', 'easy digestion', 'sustained energy', 'grounding'],
  ARRAY['diabetes', 'blood-sugar', 'nutrition', 'mindful-eating', 'easy-digest', 'balancing'],
  'gentle',
  15,
  'free',
  false,
  true,
  NULL
);
