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
  is_active
) VALUES 
(
  'Preparing the Vessel: A Holistic View of Fertility',
  'A guide to empowering your body through foundational cycle tracking, building Ojas, and surrendering to natural timing.',
  'Fertility is a state of deep nourishment. It requires us to prepare not just the physical vessel, but the mind and the spirit. In Ayurveda, this means building your vital essence, known as *Ojas*.

**Connecting With Your Body:**
Before focusing heavily on timing, we start by empowering you to observe your body''s natural rhythms. Begin foundational cycle tracking: log your days and observe changes in your cervical fluid. This awareness is your greatest tool.

**Building Ojas (Vital Essence):**
We build Ojas through deep self-care. Try adding these simple habits to your daily routine:
• **Warm Oil Massage (Abhyanga):** Use a heating oil (like sesame) if you are Vata/Kapha, or a cooling oil (like coconut) if you are Pitta.
• **Evening Herbal Tea:** A calming blend to prepare the body for restorative sleep.
• **Breathwork:** Deep, guided breathing to shift your nervous system from "fight or flight" into a state of profound calm.

*In our Premium section, we dive deeply into the exact breathing techniques, dosha-specific yoga sequences, and nutritional recipes to fully support this journey.*',
  'article',
  ARRAY['vata', 'pitta', 'kapha'],
  ARRAY['follicular', 'ovulatory', 'luteal', 'menstrual'],
  ARRAY['nervous system regulation', 'body awareness', 'stress reduction'],
  ARRAY['fertility', 'ttc', 'ojas', 'tracking', 'education'],
  'beginner',
  5,
  'free',
  false,
  true
),
(
  'Yoga & Spirituality for Conception',
  'Dosha-specific yoga sequences designed to enhance fertility, reduce stress, and open the hips, paired with spiritual meditation.',
  'To prepare the vessel, we must release tension stored in the hips and the pelvic floor, creating space and reducing cortisol. Here is your tailored practice:

**Dosha-Specific Sequences:**
• **Vata (Grounding & Relaxation):** Begin with a grounding Child''s Pose to center the mind. Move through a very gentle, slow Sun Salutation to warm the body, and end with Legs Up the Wall to deeply calm the nervous system and reduce stress.
• **Pitta (Cooling & Expansive):** Focus on cooling postures to release excess internal heat. Practice Cobra Pose and Supported Bridge to open the chest and hips without adding "fire on fire."
• **Kapha (Warming & Stimulating):** Emphasize dynamic, warming movements. A more vigorous Sun Salutation sequence will help lift lethargy and stimulate vital circulation to the reproductive organs.

**Spiritual Integration:**
Conception is ultimately a divine decree. For Muslim women, focus on the beautiful Dua of Prophet Zakariya (found in the Quran), asking Allah for righteous offspring. If you follow another faith, focus your meditation on universal love, deep patience, and surrendering to the divine timing of your journey.',
  'yoga',
  ARRAY['vata', 'pitta', 'kapha'],
  ARRAY['follicular', 'ovulatory', 'luteal'],
  ARRAY['pelvic opening', 'circulation', 'spiritual connection'],
  ARRAY['fertility', 'ttc', 'yoga', 'spirituality', 'dua'],
  'beginner',
  25,
  'premium',
  true,
  true
),
(
  'Building Ojas: Fertility Nutrition by Dosha',
  'Deeply nourishing, warm, and grounding foods to build your reproductive vitality (Ojas) based on your unique Ayurvedic constitution.',
  'To build *Ojas* (vital essence), your body requires foods that support your digestive fire and provide deep, easily absorbable nourishment.

**Vata (Requires grounding and warmth):**
Your body needs extreme grounding to combat dryness in the reproductive tract. Focus on warm, cooked grain soups, deeply roasted root vegetables, and healthy fats like pure ghee to bring profound warmth and nourishment to the womb.

**Pitta (Requires cooling nourishment):**
Your body needs cooling nourishment to prevent becoming too acidic or hot, which can affect implantation. Focus on a diet rich in cooling cucumber, fresh leafy greens, sweet hydrating fruits, and pure coconut water to release excess heat.

**Kapha (Requires light stimulation):**
Your body needs light but nourishing foods that clear sluggishness from the reproductive channels. Focus on warm, easily digestible meals seasoned with potent, metabolism-supporting spices like fresh ginger, turmeric, and black pepper.',
  'nutrition',
  ARRAY['vata', 'pitta', 'kapha'],
  ARRAY['follicular', 'ovulatory', 'luteal', 'menstrual'],
  ARRAY['ojas building', 'reproductive health', 'hormone balance'],
  ARRAY['fertility', 'ttc', 'nutrition', 'dosha'],
  'beginner',
  10,
  'premium',
  true,
  true
);
