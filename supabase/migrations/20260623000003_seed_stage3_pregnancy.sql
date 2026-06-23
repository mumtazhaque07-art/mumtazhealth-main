INSERT INTO public.wellness_content (
  title,
  description,
  detailed_guidance,
  content_type,
  doshas,
  cycle_phases,
  pregnancy_statuses,
  benefits,
  tags,
  difficulty_level,
  duration_minutes,
  tier_requirement,
  is_premium,
  is_active
) VALUES 
(
  'The Trimesters of Transformation: Safety & Surrender',
  'A foundational guide to deep rest, diaphragmatic breathing, and dosha-specific hydration for a calm and healthy pregnancy.',
  'Pregnancy is a profound state of transformation. You are growing life, and deep rest is not a luxury—it is a biological requirement.

**Diaphragmatic Breathing for Deep Calm:**
The most powerful tool you have right now is your breath. Place one hand on your chest and the other on your abdomen. Inhale slowly and feel your belly expand; exhale gently and let it fall. This practice directly stimulates the vagus nerve, reducing anxiety and keeping both you and your baby in a state of calm.

**Dosha-Specific Hydration:**
Hydration is critical. Sip warm or room-temperature water throughout the day, customized to your constitution:
• **Pitta:** Add a squeeze of fresh lime (lemon is too acidic for Pittas).
• **Kapha/Vata:** Add a squeeze of lemon to aid digestion.
• **1st Trimester Magic:** Drink coconut water, especially in the first trimester, to replenish vital electrolytes and deeply soothe nausea.

*In our Premium section, we dive into the exact trimester-safe yoga modifications, spiritual practices, and dosha-balancing recipes to sustain you through this journey.*',
  'article',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['first-trimester', 'second-trimester', 'third-trimester'],
  ARRAY['nervous system regulation', 'nausea relief', 'hydration'],
  ARRAY['pregnancy', 'education', 'breathing', 'hydration'],
  'beginner',
  5,
  'free',
  false,
  true
),
(
  'Trimester-Safe Yoga & Spiritual Surrender',
  'Deeply modified, trimester-specific yoga practices paired with spiritual connection for both mother and baby.',
  'Safety is our ultimate priority. During pregnancy, the hormone relaxin softens your joints, meaning we focus on stability, not deep stretching.

**1st Trimester (Balancing Vata):**
Fatigue and anxiety are high, throwing Vata out of balance. Focus on deep rest and stability.
• **Practice:** Grounding poses like Child''s Pose and Legs Up the Wall. 
• **Avoid:** Absolutely avoid core work and twists.
• **Spirituality:** Meditations focused on profound trust and patience as the foundation of life is built.

**2nd Trimester (Balancing Pitta):**
Your energy often returns, but Pitta (heat) can rise.
• **Practice:** Modified side stretches, gentle backbends like a heavily modified Cobra (always prioritizing safety), and Warrior poses to feel strong and expansive.
• **Spirituality:** Focus your spiritual practice on building a deep, conscious bond with your growing baby.

**3rd Trimester (Balancing Kapha):**
Feelings of heaviness and stagnation can throw Kapha out of balance.
• **Practice:** Focus heavily on pelvic floor preparation and relieving back pain. Use supported squats, pelvic tilts, and rely on bolsters, blocks, and cushions for absolute support.
• **Spirituality:** A time for meditations and prayers asking the Divine for courage, strength, and a safe transition into labor.',
  'yoga',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['first-trimester', 'second-trimester', 'third-trimester'],
  ARRAY['pelvic floor prep', 'back pain relief', 'spiritual connection'],
  ARRAY['pregnancy', 'yoga', 'modifications', 'spirituality'],
  'beginner',
  20,
  'premium',
  true,
  true
),
(
  'Nourishing Two: Pregnancy Nutrition by Trimester',
  'Trimester and dosha-specific nutritional guidance to safely support the immense biological work your body is doing.',
  'Your nutritional needs shift drastically as you move through pregnancy. Here is how to eat for your current trimester and Dosha:

**1st Trimester (Calming Vata):**
Focus on easy-to-digest, warming foods to combat nausea and ground Vata.
• **Meals:** Spiced oatmeal made with almond milk, cinnamon, and ginger (if palatable during sickness). Spiced pear compote gently cooked with cinnamon, cardamom, and fresh ginger.
• **Protein:** Well-cooked red lentils added to soups, or organic eggs if they sit well with your stomach.

**2nd Trimester (Cooling Pitta):**
As energy rises, so does heat. The goal is to balance Pitta with cooling, hydrating options.
• **Meals:** Refreshing cucumber and avocado salads. Cooling coconut rice pudding made with basmati rice, shredded coconut, and a touch of honey.
• **Protein:** Incorporate cooling, light proteins like tofu, mung beans, or light white fish.

**3rd Trimester (Supporting Kapha):**
The emphasis shifts to light, nutrient-dense foods to combat heaviness and prepare the body for the physical marathon of labor.
• **Meals:** A warm quinoa bowl with sautéed greens and lentils. Sprouted mung bean vegetable soup seasoned with warm spices.
• **Protein:** Lean proteins like skinless chicken breast or sprouted chickpeas to provide sustained energy for labor.',
  'nutrition',
  ARRAY['vata', 'pitta', 'kapha'],
  NULL,
  ARRAY['first-trimester', 'second-trimester', 'third-trimester'],
  ARRAY['nausea relief', 'labor prep', 'digestive support'],
  ARRAY['pregnancy', 'nutrition', 'dosha', 'recipes'],
  'beginner',
  10,
  'premium',
  true,
  true
);
