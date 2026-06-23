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
  'The Threshold of Wisdom: Demystifying Menopause',
  'An empowering introduction to the liberation of menopause, focusing on bone density, joint lubrication, and establishing firm emotional boundaries.',
  'Menopause isn''t an ending. It''s the beautiful beginning of a time where you can truly step into your power, stop apologizing, and embrace the liberation that comes with your life experience.

Biologically defined as 12 consecutive months without a cycle (whether natural or induced), you are now shifting deep into the Vata stage of life. The focus must now shift to maintaining bone density, lubricating joints that may feel dry, and nourishing the nervous system.

**Recognizing Your Dosha Shift:**
• **Vata:** You may experience increased dryness, significant anxiety, or sleep disturbances.
• **Pitta:** You may notice Vata symptoms mixing with heat-related issues like hot flushes.
• **Kapha:** Unexpected dryness and stiffness in a body that usually feels heavy.

**Your Daily Sacred Habit:**
Sit in a quiet space, take three deep slow breaths, and focus on profound gratitude for the wisdom you''ve gained. Try a gentle warm oil massage for joint lubrication, and take time to set firm emotional boundaries so you can truly honor your own needs in this season.

*In our Premium section, we dive deeply into weight-bearing yoga for bone density and calcium-rich, dosha-specific recipes.*',
  'article',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['empowerment', 'bone health awareness', 'emotional boundaries'],
  ARRAY['menopause', 'education', 'wisdom', 'mindset'],
  'beginner',
  5,
  'free',
  false,
  true
),
(
  'Joint Lubrication & Bone Health',
  'Weight-bearing and joint-freeing movement practices designed to maintain bone density and support the nervous system, paired with spiritual wisdom.',
  '*Disclaimer: This information is for educational purposes. Please consult a healthcare professional for specific bone health diagnosis or treatment.*

**Dosha-Specific Movement for Bone Health:**
• **Vata (Requires stability & lubrication):** Focus on the Joint Freeing Series—slow mindful rotations starting with the ankles, moving up to the knees and hips, then gently rolling the shoulders and neck. Practice Mountain Pose for grounding, Warrior Two to build leg strength and hip bone density, and Bridge Pose to strengthen the pelvic floor and counteract anxiety.
• **Pitta (Requires cooling & calming):** Focus on cooling inversions to reverse blood flow and regulate internal heat. Practice Legs Up the Wall, Shoulder Stand (to stimulate the thyroid), and Plough Pose. Use Sitali breathwork to cool the body.
• **Kapha (Requires dynamic weight-bearing):** Dynamic, weight-bearing practices are excellent for bone health. Walk with hand weights or use resistance bands. Practice Chair Pose (builds thigh strength and metabolism), Warrior Three (excellent for hip bone density), and Locust Pose (strengthens the spine).

**Spiritual Integration:**
Reflect on Surah Ibrahim (14:40) asking for steadfastness, and Surah Al-Ahqaf (46:15) asking for guidance and gratitude for blessings. Embrace universal mindfulness practices to anchor emotions and promote deep inner peace.',
  'yoga',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['bone density', 'joint lubrication', 'nervous system support'],
  ARRAY['menopause', 'yoga', 'weight-bearing', 'spirituality', 'dua'],
  'intermediate',
  25,
  'premium',
  true,
  true
),
(
  'Nourishing the Wisdom Years',
  'Calcium-rich, nutrient-dense recipes tailored to your Dosha to deeply support bone health, heart health, and joint lubrication.',
  'When estrogen drops, it affects bone density and natural lubrication. Your diet must now actively protect and nourish your skeletal system. Eat your largest meal at midday when your digestive fire is strongest.

**Vata (Requires heavy lubrication and warmth):**
• *Focus:* Protein-rich meals that are warming and lubricating to counteract dryness.
• *Meals:* Warm date and almond porridge spiced with cardamom. A sesame seed pudding (incredibly rich in calcium and healthy oils). Stewed apples with cinnamon. 
• *Protein:* Baked salmon with roasted sweet potatoes, scrambled eggs cooked with ghee and cumin, or a hearty lentil soup seasoned with warming spices.

**Pitta (Requires cooling, protein-rich nourishment):**
• *Focus:* Protein-rich meals that cool the body.
• *Meals:* Chilled quinoa salad with avocado, cucumber, mint-lime dressing, and pumpkin seeds. Tofu and broccoli bake with coriander, fennel, and turmeric.
• *Protein:* Baked white fish seasoned with mint, fennel, and lemon. Tofu and edamame stir-fry with cilantro. Baked chicken breast with a refreshing cilantro, mint, and lime marinade.

**Kapha (Requires light, warm, nutrient-dense foods):**
• *Focus:* Light, warm foods to combat lethargy without sacrificing bone-building nutrients.
• *Meals:* Sprouted mung bean stir-fry with turmeric and ginger. A hearty soup made with kale, broccoli, and lentils seasoned with cumin. Lentil and vegetable shepherd''s pie using mashed cauliflower instead of potatoes. 
• *Protein:* Baked tempeh with a spicy ginger glaze, or light white fish baked with lemon and herbs alongside a warm black bean salad.',
  'nutrition',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['calcium support', 'bone health', 'joint lubrication'],
  ARRAY['menopause', 'nutrition', 'dosha', 'recipes', 'bone-health'],
  'beginner',
  10,
  'premium',
  true,
  true
);
