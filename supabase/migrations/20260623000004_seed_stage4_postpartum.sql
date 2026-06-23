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
  'The Sacred Pause: Healing After Birth',
  'A profound reminder to reject the pressure to "bounce back" and embrace the sacred period of recovery with gentle daily habits.',
  'First, congratulations. Your body has just performed a true miracle. 

Whether through natural labor or surgery, you are likely experiencing profound fatigue. We must entirely reject the social media pressure to "bounce back." It took nine months to grow your baby; it will take time to transition into your new normal. Every season has its beauty—let us embrace the beauty here.

**Your Daily Sacred Pause:**
• **Gentle Belly Binding:** This can provide immense physical support and comfort. *Crucial Note: You MUST get medical clearance from your physician before starting any binding practice. Safety and your unique healing process come first.*
• **Hydration:** Sip warm water or soothing herbal teas throughout the day to aid digestion and keep your tissues hydrated.
• **Mindset Shift:** Honor this slow, spiritual process of physical healing and emotional processing. Recovery is not a race.

*In our Premium section, we dive into the exact restorative practices, emotional support tools, and deeply nourishing recipes tailored to your Dosha for this sacred fourth trimester.*',
  'article',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['emotional support', 'physical recovery', 'mindset shift'],
  ARRAY['postpartum', 'education', 'healing', 'sacred-pause'],
  'beginner',
  5,
  'free',
  false,
  true
),
(
  'Pelvic Healing & Emotional Support',
  'Deeply gentle restorative practices, emotional support tools, and sacred affirmations to combat isolation and speed recovery.',
  'Right now, movement is not about fitness; it is about rehabilitation, energetic healing, and calming the nervous system.

**Dosha-Specific Movement:**
• **Vata (Prone to extreme depletion):** Your practice must focus on profound rest. Use guided breathing exercises, Yoga Nidra, and gentle Pranayama to calm your highly sensitive nervous system.
• **Pitta (Prone to frustration & inflammation):** Focus on gentle heart openers to release emotional heat and physical tension in the chest and shoulders.
• **Kapha (Prone to heaviness & lethargy):** Focus on gentle, warming movements and deep breathing to slowly lift lethargy without overexertion.

**Emotional & Spiritual Support:**
Breastfeeding struggles and emotional difficulties are entirely normal. Do not walk this path alone. To combat isolation, schedule short video calls with a trusted group of women.
• **Quranic Dua:** *Rabbi habli min ladunka dhurriyatan tayyibatan innaka sami''ud-dua* (My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication).
• **Daily Affirmation:** "I am the perfect mother for my baby and I trust my instincts. I am exactly what my baby needs."',
  'yoga',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['nervous system regulation', 'emotional healing', 'isolation relief'],
  ARRAY['postpartum', 'yoga', 'spirituality', 'affirmations', 'dua'],
  'beginner',
  15,
  'premium',
  true,
  true
),
(
  'Rebuilding the Mother: Postpartum Nutrition',
  'Deeply nourishing, easy-to-digest, pre-prepared meals tailored to your Dosha to support tissue repair and breast nourishment.',
  'After birth, your digestive fire (Agni) is often weak. The focus is on warm, highly digestible foods. To support yourself during this incredibly demanding time, focus on pre-prepared meals that are easy to grab and reheat.

**Vata (Requires extreme warmth and oiliness):**
• *Focus:* Warm, wet, and oily foods.
• *Meals:* Make a large batch of Khichdi with plenty of pure ghee and healing spices. Hearty lentil soups, warm black bean stews, or a deeply nourishing chicken and root vegetable soup.

**Pitta (Requires soothing, anti-inflammatory nourishment):**
• *Focus:* Cooling and hydrating options.
• *Meals:* Hydrate with fresh coconut water. Prepare a cooling coconut rice pudding or a cucumber and chickpea salad. For warm meals that are cooling in effect, try coconut red lentil dhal with basmati rice, a vegetable quinoa bowl with mild turmeric, or baked sweet potatoes stuffed with cottage cheese and coriander.

**Kapha (Requires light but nutrient-dense warmth):**
• *Focus:* Light, warming foods that clear stagnation.
• *Meals:* A light vegetable soup seasoned with fresh ginger and garlic—deeply nourishing but never heavy. A light chicken and vegetable stir-fry to keep digestion and energy moving.',
  'nutrition',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['tissue repair', 'digestive support', 'breast nourishment'],
  ARRAY['postpartum', 'nutrition', 'dosha', 'recipes', 'meal-prep'],
  'beginner',
  10,
  'premium',
  true,
  true
);
