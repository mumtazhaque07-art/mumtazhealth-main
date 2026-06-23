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
  'The Crown of Wisdom: Honoring Your Vata Years',
  'A celebration of the Wise Woman, focusing on gentle daily habits for mental sharpness, joint mobility, and setting firm emotional boundaries.',
  'To all the wise women who have reached this beautiful and profound crown of wisdom: thank you for being the foundation of our communities and sharing your invaluable experience. 

You are now fully in the Vata stage of life. While the physical body requires more gentleness, your spirit and wisdom are at their absolute peak. 

**Your Daily Grounding Habits:**
• **Morning Hydration:** Start your day with a warm, hydrating drink like hot water with a slice of lemon or fresh ginger.
• **Bed Stretches:** Follow this with very gentle stretches while still in bed to safely maintain mobility without strain.
• **Mental Sharpness:** Engage in simple daily practices to keep the mind agile—read a book, complete a crossword puzzle, or learn something entirely new.
• **Emotional Peace:** Set firm emotional boundaries to protect your peace. Prioritize your own needs in this golden chapter.

*In our Premium section, we provide safe, chair-based mobility practices and highly digestible, deeply nourishing recipes to support your brain and joints.*',
  'article',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['mental sharpness', 'mobility', 'emotional peace'],
  ARRAY['wise-woman', 'education', 'daily-habits', 'vata-stage'],
  'beginner',
  5,
  'free',
  false,
  true
),
(
  'Gentle Mobility & Spiritual Connection',
  'Deeply accessible, chair-assisted and modified movement practices designed for safety, paired with profound spiritual mantras for peace and letting go.',
  'Movement in the Wise Woman stage is about joy, circulation, and keeping vital energy flowing safely.

**Dosha-Specific Mobility:**
• **Vata (Prone to extreme stiffness):** Focus on safety and joy. Practice chair-based yoga with gentle seated twists to promote spinal mobility, and seated Sun Salutations to keep the chest open without risking balance. Rotate your ankles slowly while seated to keep joints limber.
• **Pitta (Prone to frustration over limitations):** Practice cooling breathwork like Sitali pranayama. Modify postures heavily with props: place a block under your sacrum for a supported Bridge, or rest your head on a chair seat during a seated forward fold. 
• **Kapha (Prone to deep lethargy):** Practice completely safe dynamic movements to boost circulation, such as seated marches and vigorous arm circles. Modify Chair pose by holding a stable surface for balance.

**Spiritual Wisdom & Mantras:**
• **Vata:** Acceptance means finding peace with the flow of time and surrendering anxiety. Mantra: *"I trust each moment and I am safe and held."*
• **Pitta:** Release perfectionism and embrace forgiveness for yourself and others. Move from doing to being. Mantra: *"I am complete, I rest in peace, my work is done."*
• **Kapha:** Release possessiveness and attachments to the past to make space for new growth (consider clearing items from your home). Mantra: *"I let go with love and welcome the new."*',
  'yoga',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['safe mobility', 'joint health', 'spiritual peace'],
  ARRAY['wise-woman', 'yoga', 'chair-yoga', 'mantras', 'spirituality'],
  'beginner',
  20,
  'premium',
  true,
  true
),
(
  'Nourishing the Vata Stage of Life',
  'Highly digestible, deeply warming, and nutrient-rich foods to support digestion, brain health, and joint lubrication in your golden years.',
  'In the Vata stage of life, the digestive fire naturally weakens. The focus must remain entirely on warm, cooked, and easily digested foods to address bloating and joint dryness. 

**Vata (Requires extreme lubrication and easy digestion):**
• *Focus:* Warm, wet, and soothing foods.
• *Meals:* Warm oatmeal topped with cooked apples, cinnamon, and honey. Kitchari made with mung beans, basmati rice, and ginger. Fennel and ginger soup (excellent for gas relief). Turmeric-poached cod in coconut milk. Soft omelets with spinach cooked in ghee. 
• *Support:* Drink Golden Milk (milk, turmeric, ginger, ghee) and snack on soaked, peeled almonds.

**Pitta (Requires anti-inflammatory, protein-rich cooling):**
• *Focus:* Cooling nourishment without heavy heat.
• *Meals:* Poached white fish with turmeric and coconut milk. Warm lentil stew with root vegetables and ghee. Cool mung bean and cucumber salad. Light coconut poached tofu. Eat your largest meal at lunch.

**Kapha (Requires light, warm, spice-forward meals):**
• *Focus:* Light meals to combat sluggish digestion.
• *Meals:* Sprouted mung bean stir-fry seasoned with ginger and turmeric. A hearty soup of kale and lentils. Hydrate with warm water throughout the day. Eat early in the evening to avoid heaviness before bed.',
  'nutrition',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['easy digestion', 'joint lubrication', 'gas relief'],
  ARRAY['wise-woman', 'nutrition', 'dosha', 'recipes', 'digestion'],
  'beginner',
  10,
  'premium',
  true,
  true
);
