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
  'Holistic Awareness: PCOS & Endometriosis',
  'Understanding how PCOS and Endometriosis manifest across the Doshas, and how to gently support your body holistically.',
  'When navigating fertility, it is crucial to recognize how conditions like PCOS and Endometriosis interact with your unique Ayurvedic constitution. 

*Disclaimer: This guidance is for holistic recognition and support only. We are not treating these conditions medically. Please consult your physician, and if you need deeply tailored holistic guidance, we highly encourage you to book a 1-to-1 appointment with Mumtaz.*

**Understanding the Doshas in Reproductive Health:**
• **PCOS:** Often involves an imbalance of **Kapha** (leading to sluggishness and cysts), though it can have Vata or Pitta subtypes. For Kapha dominance, focusing on light, warm foods and dynamic yoga helps stimulate circulation and clear stagnation.
• **Endometriosis:** Typically linked to **Pitta** due to inflammation and excess heat, or **Vata** causing pain and energetic stagnation. For Pitta dominance, cooling foods and gentle, expansive yoga are highly beneficial to release heat and inflammation.

**Spiritual & Emotional Support:**
Navigating these conditions requires immense emotional resilience. Spiritual practices that encourage patience and trust in natural timing are crucial. Focus on specific *Dhikr* (remembrance) or Universal Meditation to anchor your mind and provide deep emotional support during your journey.

Remember, you do not have to walk this path alone. If you require specific, 1-to-1 help tailored exactly to your body''s presentation, please visit the Bookings tab to schedule a private consultation.',
  'article',
  ARRAY['vata', 'pitta', 'kapha'],
  ARRAY['follicular', 'ovulatory', 'luteal', 'menstrual'],
  ARRAY['holistic awareness', 'emotional support', 'dosha balance'],
  ARRAY['fertility', 'ttc', 'pcos', 'endometriosis', 'education'],
  'beginner',
  8,
  'premium',
  true,
  true
);
