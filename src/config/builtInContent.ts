import seatedMeditation from "@/assets/poses/seated-meditation.jpeg";
import { getBrandImage } from "@/assets/brandImages";

export const builtInContent = [
  {
    id: "seated-foundation-agni-01",
    title: "Seated Foundation (Sukhasana)",
    description: "The primary posture for awakening Agni and establishing a stable center. Suitable for all doshas, accessible on the floor, wall, or chair.",
    detailed_guidance: `
**The Essence of the Posture:**
Sukhasana (Easy Pose) is the foundational posture for all grounding, centering, and digestive (Agni) work. When we sit tall with intention, we create space in the abdominal cavity, allowing the digestive organs to function optimally while stabilizing the mind.

**How to Practice:**
* **Find Your Seat:** Sit on the floor, on a block/bolster, or on a chair. Ensure both sitting bones are equally grounded.
* **The Foundation:** If on the floor, loosely cross your shins. If in a chair, place both feet firmly on the ground.
* **The Spine:** Lengthen through the crown of your head. Imagine a golden thread pulling you upward. 
* **The Shoulders:** Roll them up, back, and down. Let them relax entirely away from your ears, opening up the chest space (Heart Chakra).
* **The Core (Uddiyana Bandha):** Gently draw your navel in and slightly up toward your spine. This is the "navel lock" that ignites your internal fire (Agni) and protects your lower back.

**Variations for Every Body:**
* **With Back Issues:** Sit with your back fully supported against a wall.
* **With Knee/Hip Issues:** Sit on a sturdy chair with feet hip-width apart on the floor. Maintain the navel lock and tall spine.

**Timing & Universal Benefits:**
This posture brings all three doshas (Vata, Pitta, and Kapha) into immediate equilibrium. You can practice this whenever you feel scattered or heavy. *If you don't have time for a full physical practice, you can do just five minutes of this in the morning to awaken your Agni, or five minutes in the evening to digest the day.*

**The Intention:**
Hold this posture for 3-5 minutes while practicing slow, deep breathing. Visualize a warm, golden fire in your center, digesting your food, your thoughts, and your experiences.
    `,
    content_type: "yoga",
    doshas: ["vata", "pitta", "kapha"],
    cycle_phases: ["menstrual", "follicular", "ovulatory", "luteal", "fertility", "perimenopause", "menopause"],
    pregnancy_statuses: ["trying", "pregnant", "postpartum", "none"],
    pregnancy_trimesters: [1, 2, 3],
    benefits: ["Builds core stability", "Ignites digestive fire (Agni)", "Calms the nervous system", "Improves posture"],
    tags: ["core", "grounding", "gentle", "seated", "meditation", "fertility", "pre-conception", "ttc"],
    difficulty_level: "beginner",
    duration_minutes: 5,
    image_url: seatedMeditation,
    video_url: "",
    animation_url: "",
    audio_url: "",
    tier_requirement: "free",
    is_premium: false,
    preview_content: "A fundamental grounding posture to awaken your core fire.",
    unlock_after_completions: 0
  },
  {
    id: "agni-mint-fennel-tea-01",
    title: "Agni-Kindling Mint & Fennel Tea",
    description: "A soothing, tridoshic herbal brew designed to gently stimulate digestion after meals without overheating the system.",
    detailed_guidance: `
**Why This Recipe Works:**
Ayurveda teaches us that digestion (Agni) is the root of all health. While ginger and black pepper can sometimes be too heating for Pitta dosha, this Mint & Fennel blend is the perfect middle ground. Mint cools and soothes the lining of the stomach, while Fennel is renowned for its ability to gently stoke the digestive fire, reduce bloating, and process stagnant energy.

**Ingredients:**
* 1 tsp whole fennel seeds
* 1 small handful of fresh mint leaves (or 1 tsp dried mint)
* 2 cups of filtered water
* Optional: A tiny pinch of cardamom powder for sweetness and mental clarity.

**The Ritual:**
1. In a small saucepan, bring the water to a gentle boil.
2. Lightly crush the fennel seeds in a mortar and pestle (or with the back of a spoon) to release their volatile oils.
3. Add the crushed fennel seeds and mint to the boiling water.
4. Immediately turn off the heat, cover the pot, and let it steep for 5-7 minutes.
5. Strain into your favorite mug.

**When to Drink:**
Sip this tea slowly about 20-30 minutes *after* a meal to aid in digestion. Do not drink it ice cold; it should be warm to properly support your Agni.
    `,
    content_type: "nutrition",
    doshas: ["vata", "pitta", "kapha"],
    cycle_phases: ["menstrual", "follicular", "ovulatory", "luteal", "perimenopause", "menopause"],
    pregnancy_statuses: ["trying", "pregnant", "postpartum", "none"],
    pregnancy_trimesters: [1, 2, 3],
    benefits: ["Soothes digestion", "Reduces bloating", "Balances Pitta", "Clears the mind"],
    tags: ["nutrition", "recipe", "digestion", "tea"],
    difficulty_level: "beginner",
    duration_minutes: 10,
    image_url: getBrandImage('article', ['tea', 'digestion']),
    video_url: "",
    animation_url: "",
    audio_url: "",
    tier_requirement: "free",
    is_premium: false,
    preview_content: "A tridoshic tea blend to gently support your digestive fire.",
    unlock_after_completions: 0
  },
  {
    id: "chair-yoga-mobility-01",
    title: "Chair Yoga for Mobility & Pregnancy",
    description: "A supportive, gentle practice designed for pregnancy, the wisdom years, and anyone experiencing mobility issues.",
    detailed_guidance: "This chair yoga sequence offers a fully supported way to move, stretch, and breathe without the pressure of getting down to the floor. It is perfect for pregnancy, the wisdom years, or days when your energy requires a softer approach.",
    content_type: "yoga",
    doshas: ["vata", "kapha"],
    cycle_phases: ["menstrual", "perimenopause", "menopause"],
    pregnancy_statuses: ["pregnant", "postpartum", "none"],
    pregnancy_trimesters: [1, 2, 3],
    benefits: ["Supports joint mobility", "Accessible movement", "Eases pregnancy discomfort"],
    tags: ["chair", "mobility", "pregnancy", "gentle", "wisdom years"],
    difficulty_level: "beginner",
    duration_minutes: 15,
    image_url: getBrandImage('yoga', ['chair', 'gentle']),
    video_url: "https://youtu.be/I2lexcYoQDY",
    animation_url: "",
    audio_url: "",
    tier_requirement: "premium",
    is_premium: true,
    preview_content: "Chair yoga sequence for pregnancy, mobility issues, and the wisdom years.",
    unlock_after_completions: 0
  },
  {
    id: "hips-legs-bed-yoga-01",
    title: "Hips & Legs (Bed or Floor Practice)",
    description: "A beginner-friendly practice for hips and legs that can be done lying on your bed or the floor.",
    detailed_guidance: "This accessible practice focuses on releasing tension in the hips and legs. Because you are lying down, it is completely adaptable—you can do it from the comfort of your bed or on a yoga mat. Highly recommended for pregnancy and beginners.",
    content_type: "yoga",
    doshas: ["vata", "pitta", "kapha"],
    cycle_phases: ["menstrual", "follicular", "ovulatory", "luteal", "fertility", "perimenopause", "menopause"],
    pregnancy_statuses: ["trying", "pregnant", "postpartum", "none"],
    pregnancy_trimesters: [1, 2, 3],
    benefits: ["Releases hip tension", "Improves leg circulation", "Deeply relaxing"],
    tags: ["hips", "legs", "bed", "pregnancy", "beginner", "fertility", "pre-conception", "ttc"],
    difficulty_level: "beginner",
    duration_minutes: 10,
    image_url: getBrandImage('yoga', ['hips', 'bed']),
    video_url: "https://youtu.be/GRGrfHIrsAk",
    animation_url: "",
    audio_url: "",
    tier_requirement: "free",
    is_premium: false,
    preview_content: "Release hip and leg tension from the comfort of your bed.",
    unlock_after_completions: 0
  },
  {
    id: "triangle-pose-back-01",
    title: "Triangle Pose for Back Support",
    description: "A beginner-friendly guide to Triangle pose, excellent for supporting the back and adaptable for the second trimester.",
    detailed_guidance: "Triangle pose (Trikonasana) is foundational for creating space in the spine and stretching the side body. This tutorial breaks it down for beginners and shows how to safely adapt it for back support and during the second trimester of pregnancy.",
    content_type: "yoga",
    doshas: ["pitta", "kapha"],
    cycle_phases: ["follicular", "ovulatory", "luteal", "perimenopause", "menopause"],
    pregnancy_statuses: ["pregnant", "postpartum", "none"],
    pregnancy_trimesters: [2],
    benefits: ["Stretches side body", "Supports back health", "Builds leg strength"],
    tags: ["triangle", "back", "pregnancy", "beginner"],
    difficulty_level: "beginner",
    duration_minutes: 8,
    image_url: getBrandImage('yoga', ['triangle', 'standing']),
    video_url: "https://youtu.be/VndlJt9AWa0",
    animation_url: "",
    audio_url: "",
    tier_requirement: "premium",
    is_premium: true,
    preview_content: "Learn Triangle pose with variations for back support and pregnancy.",
    unlock_after_completions: 0
  },
  {
    id: "cobra-pose-hormones-01",
    title: "Cobra Pose for Hormonal Health",
    description: "A targeted practice using Cobra pose, excellent for the menstrual cycle, perimenopause, and menopause.",
    detailed_guidance: "Cobra pose (Bhujangasana) gently opens the heart space and stimulates the pelvic region. It is incredibly supportive during the menstrual cycle to relieve cramping, and highly beneficial during perimenopause and menopause to support hormonal balance and uplift energy.",
    content_type: "yoga",
    doshas: ["vata", "kapha"],
    cycle_phases: ["menstrual", "perimenopause", "menopause"],
    pregnancy_statuses: ["postpartum", "none"],
    pregnancy_trimesters: [],
    benefits: ["Supports hormonal balance", "Relieves menstrual cramps", "Opens the chest"],
    tags: ["cobra", "hormones", "menopause", "menstrual"],
    difficulty_level: "beginner",
    duration_minutes: 8,
    image_url: getBrandImage('yoga', ['cobra', 'floor']),
    video_url: "https://youtu.be/FG4NunznzQs",
    animation_url: "",
    audio_url: "",
    tier_requirement: "premium",
    is_premium: true,
    preview_content: "Cobra pose variations specifically for hormonal shifts and the menstrual cycle.",
    unlock_after_completions: 0
  },
  {
    id: "chaturanga-variations-01",
    title: "Chaturanga Variations (Block & Full)",
    description: "Learn Chaturanga with supportive variations using a block for pregnancy/older years, or full variations for a challenge.",
    detailed_guidance: "Chaturanga is a powerful posture for building upper body strength, but it requires the right foundation. This video breaks down accessible variations using a block (perfect for pregnancy or the wisdom years) and offers full hands-and-feet variations for those seeking a stronger challenge.",
    content_type: "yoga",
    doshas: ["pitta", "kapha"],
    cycle_phases: ["follicular", "ovulatory", "luteal"],
    pregnancy_statuses: ["pregnant", "postpartum", "none"],
    pregnancy_trimesters: [1, 2, 3],
    benefits: ["Builds upper body strength", "Offers accessible variations", "Empowers the practitioner"],
    tags: ["chaturanga", "strength", "blocks", "pregnancy", "wisdom years"],
    difficulty_level: "intermediate",
    duration_minutes: 12,
    image_url: getBrandImage('yoga', ['chaturanga', 'strength']),
    video_url: "https://youtu.be/XYjZlMoE3ig",
    animation_url: "",
    audio_url: "",
    tier_requirement: "premium",
    is_premium: true,
    preview_content: "Master Chaturanga safely with modifications for every body.",
    unlock_after_completions: 0
  }
];
