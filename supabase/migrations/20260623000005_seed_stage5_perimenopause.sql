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
  'The Winds of Change: Recognizing Perimenopause',
  'An empowering introduction to the profound transition of perimenopause, emphasizing self-care, boundaries, and deep introspection.',
  'Just as we would never make a young girl feel bad about puberty, we must never make a woman feel bad about the profound transition of perimenopause. This is an empowering shift welcoming a new chapter of wisdom and self-discovery.

As the body shifts toward the Vata stage of life, subtle hormonal fluctuations begin. This can manifest as anxiety (Vata imbalance), hot flushes (Pitta imbalance), or sluggishness and weight gain (Kapha imbalance). 

**Your Daily Empowerment Habit:**
What worked in your driven, Pitta phase of life (like extreme diets and excessive exercise) will no longer work. Your body needs something different.
• **Prioritize YOU:** Make time for yourself. Read a book, walk near water. Ask yourself: am I being drained by energy vampires? 
• **Self-Care:** Prioritize sleep hygiene, sip calming teas, and establish fierce healthy boundaries with people and technology. 

*In our Premium section, we dive into the exact yoga sequences (like Moon Salutations for Pitta or dynamic flows for Kapha) and Agni-balancing foods needed to harmonize this specific transition.*',
  'article',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['empowerment', 'boundary setting', 'hormone awareness'],
  ARRAY['perimenopause', 'education', 'mindset', 'self-care'],
  'beginner',
  5,
  'free',
  false,
  true
),
(
  'Finding Balance in the Transition',
  'Yoga sequences, breathwork, and spiritual mantras specifically designed to regulate temperature, lift lethargy, and soothe anxiety during perimenopause.',
  'During perimenopause, your movement practice must be deeply intuitive.

**Dosha-Specific Movement & Breathwork:**
• **Vata (Prone to anxiety & dryness):** Focus on stability. Practice grounding postures like Mountain, Tree, and Supported Warrior. Use deep belly breathing and Ujjayi breath to soothe the nervous system. Surround yourself with grounding Kapha energy and avoid chaotic Vata environments.
• **Pitta (Prone to hot flushes & irritability):** The focus is releasing excess heat. Practice the cooling Moon Salutation (Chandra Namaskar): Mountain to Crescent Moon to Goddess to Triangle to Pyramid to Low Lunge to Side Lunge. Exhale as you fold and lower. Use cooling breathwork like Sitali (inhale through curled tongue) or Chandra Bhedana (left nostril breathing). Put down your to-do list—you have done enough.
• **Kapha (Prone to weight retention & lethargy):** Focus on dynamic, joint-friendly movement. Practice moderate Sun Salutations, Boat pose for core strength, and Lotus pose to stimulate digestion. Dry brush daily before a warm shower to stimulate lymphatic flow.

**Spiritual Integration:**
• **Quranic Comfort:** Reflect on Surah Al-Baqarah (2:286), which promises that Allah does not burden a soul beyond what it can bear. Ask for ease during this change.
• **Universal Mantra:** "I am at peace with my body and this transition. I embrace this new chapter with grace."',
  'yoga',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['nervous system regulation', 'temperature control', 'lymphatic flow'],
  ARRAY['perimenopause', 'yoga', 'moon-salutation', 'breathwork', 'spirituality'],
  'intermediate',
  20,
  'premium',
  true,
  true
),
(
  'Hormone-Harmonizing Nutrition',
  'Agni-balancing foods and recipes tailored to your Dosha to cool the fire, ground the wind, and nourish the body during hormonal shifts.',
  'Your diet must anchor you during the erratic hormonal shifts of perimenopause. Here is how to eat for your Dosha:

**Vata (Requires extreme grounding and warmth):**
• *Focus:* Warm, cooked, oily foods to counteract dryness and coldness.
• *Meals:* Warm stews, roasted root vegetables, spiced porridges, hearty soups, and plenty of pure ghee. 
• *Routine:* Establish a strict calming sleep routine: wind down early, eliminate caffeine, avoid blue light, and read or take warm baths instead of scrolling.

**Pitta (Requires deep cooling for hot flushes):**
• *Routine:* Wake before the sun, do a gentle coconut oil massage, eat your main meal at noon (avoid midday sun), and eat a light evening meal.
• *Meals:* Cooling coconut red lentil dhal with basmati rice, fennel, and coriander. Baked sweet potato stuffed with cottage cheese, cucumber, and mint. Coriander and chickpea soup with lime.
• *Protein:* Seared salmon with cucumber/dill salsa, chicken and zucchini stir-fry with coconut sauce, or tofu and broccoli curry with quinoa.

**Kapha (Requires stimulation for slowing metabolism):**
• *Focus:* Light, warm, pungent foods. Avoid excess dairy, heavy sweets, and cold fried foods.
• *Meals:* Barley or millet porridge spiced with ginger and black pepper. Hearty soups with green vegetables (asparagus, broccoli, kale) seasoned with turmeric and cumin. 
• *Protein:* Lighter sources like mung beans, lentils, tofu, and wild fish support muscle mass without adding heaviness.',
  'nutrition',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['metabolism support', 'hormone balance', 'digestive fire'],
  ARRAY['perimenopause', 'nutrition', 'dosha', 'recipes', 'sleep-hygiene'],
  'beginner',
  10,
  'premium',
  true,
  true
);
