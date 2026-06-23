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
  'The 4 Seasons of Your Cycle: Understanding Your Rhythm',
  'A fundamental guide to understanding your body''s natural physiological rhythm, the menstrual cycle stages, and the hormones that guide them.',
  'Welcome to the beginning of your journey. Your menstrual cycle is not just a monthly occurrence; it is a vital sign and a beautiful rhythm divided into four ''seasons''. Understanding this rhythm is the key to working *with* your body instead of fighting it.

1. **Winter (Menstruation):** A time of low energy. Your hormones drop, asking your body to rest, bleed, and release.
2. **Spring (Follicular Phase):** Energy returns as estrogen rises. A time for new beginnings and lighter, fresh energy.
3. **Summer (Ovulation):** Your peak energy, communication, and warmth.
4. **Autumn (Luteal Phase):** Energy begins to draw inward. A time for grounding and preparation.

**What to Expect Next:**
As you move forward in this sanctuary, we will unlock exactly how to nourish yourself during each of these seasons. You will learn the specific yoga flows (Vinyasa vs. Restorative) that align with your unique Dosha, the exact foods to eat to balance your hormones, and the spiritual guidance (like Islamic Dhikr and mantras) to connect your mind and body.',
  'article',
  ARRAY['vata', 'pitta', 'kapha'],
  ARRAY['menstrual', 'follicular', 'ovulatory', 'luteal'],
  ARRAY['cycle literacy', 'hormone balance', 'body awareness'],
  ARRAY['menarche', 'cycle-health', 'education', 'beginner'],
  'beginner',
  5,
  'free',
  false,
  true
),
(
  'Cycle Syncing Yoga: Flow vs. Restorative',
  'Accessible, dosha-specific guidance on when to flow with Vinyasa and when to surrender into Restorative stillness.',
  'Movement is medicine, but it must be tailored to your Dosha and your cycle phase. Whether you are a seasoned yogi or a complete beginner, here is how to honor your body:

**Adapting to Your Dosha:**
• **Vata:** Even when you have high energy, your practice must remain grounding to anchor the air element.
• **Pitta:** If you feel fiery and energetic, avoid adding "fire on fire". Your practice must be fluid, cooling, and calming, rather than regimented.
• **Kapha:** To counter stagnation, incorporate more heat, fluidity, and movement.

**Restorative Poses for the Bleed:**
When your energy is low or you are experiencing cramping, we focus on stillness:
• **Reclined Bound Angle:** Opens the womb space gently.
• **Supported Child''s Pose:** Use bolsters under your chest to lift the hips and provide immense comfort.
• **Knees-to-Chest with Massage:** Gently rock or use circular clockwise massage (Abhyanga) on the tummy with warming oils (for Vata) or cooling oils (for Pitta) to ease pain. Use deep abdominal belly breaths (Pranayama) to release tension.

**Spiritual Connection:**
Islamically, while physical prayer (Salah) is paused during menstruation, your spiritual connection remains unbroken. This time off is a beautiful gift from Allah for reflection. Focus on deep *Dhikr* that brings peace: 
• *Alhamdulillah* (Thank you Allah for the body carrying us through life)
• *Allahu Akbar* (Allah is the greatest, He is there for you)
• *Subhanallah* (Allah is magnificent)',
  'yoga',
  ARRAY['vata', 'pitta', 'kapha'],
  ARRAY['menstrual', 'luteal'],
  ARRAY['cramp relief', 'spiritual connection', 'nervous system regulation'],
  ARRAY['menarche', 'yoga', 'restorative', 'dhikr', 'spirituality'],
  'beginner',
  20,
  'premium',
  true,
  true
),
(
  'Nourishing Your Cycle by Dosha',
  'A comprehensive guide to eating for your unique constitution during your cycle, featuring culturally adaptable, comforting foods.',
  'Food is deeply personal. Your cycle nutrition should reflect your tastebuds, your geographic roots, and your unique Dosha. The goal is warm, comforting nourishment—avoiding cold foods, and adjusting to your specific needs.

**General Guidelines:**
• **Timing:** Pitta types should eat their heaviest meal between 10am and 2pm when digestion is highest. 
• **Caffeine:** Vata and Pitta should limit coffee, ideally consuming it before 12pm to avoid nervous system dysregulation.

**Vata (Requires warmth and grounding):**
• *Breakfast:* Warm spiced oatmeal cooked with almond milk, cinnamon, and ginger, topped with a little ghee.
• *Lunch/Dinner:* Soothing khichdi (basmati rice, split yellow mung beans, carrots, zucchini) with warming spices. Hearty jacket potatoes with protein.
• *Protein:* Organic eggs cooked with black pepper and cumin, or well-cooked fish like salmon for essential warmth.

**Pitta (Requires cooling and soothing):**
• *Breakfast:* Easy, soothing meals that aren''t excessively hot.
• *Lunch/Dinner:* Cool cucumber and avocado salad with a light lime dressing. Avoid extra spicy, fiery foods and hot tomatoes. 
• *Protein:* Lighter options like lean chicken or white fish, poached or baked with cooling herbs like coriander.

**Kapha (Requires stimulation and lightness):**
• *Breakfast:* Warm quinoa bowl with sautéed greens and split lentils, seasoned with turmeric and cumin.
• *Lunch/Dinner:* Basmati rice mixed with cilantro, coconut, and steamed squash. Hearty vegetable soup with ginger, garlic, and black pepper to combat stagnation.
• *Protein:* Lean, skinless chicken breast or fish cooked with pungent spices like ginger and garlic to stimulate digestion and invite lightness.',
  'nutrition',
  ARRAY['vata', 'pitta', 'kapha'],
  ARRAY['menstrual', 'follicular', 'ovulatory', 'luteal'],
  ARRAY['hormone balance', 'digestive fire', 'energy stabilization'],
  ARRAY['menarche', 'nutrition', 'dosha', 'recipes'],
  'beginner',
  10,
  'premium',
  true,
  true
);
