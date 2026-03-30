import { 
  Baby, 
  Sparkles, 
  Heart, 
  Flower2, 
  Activity, 
  Sun, 
  Moon, 
  Zap 
} from "lucide-react";

export type LifeStage = 
  | "menarche" 
  | "fertility" 
  | "pregnancy" 
  | "postpartum" 
  | "post_surgical" 
  | "perimenopause" 
  | "menopause" 
  | "golden_years";

export interface LifeMapPillars {
  biological: string;
  ayurvedic: string;
  yoga: string;
  spiritual: string;
  nutrition: string;
}

export interface LifeMapTheme {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  border: string;
}

export interface LifeMapConfig {
  id: LifeStage;
  title: string;
  description: string;
  icon: any;
  dominantDosha: "Vata" | "Pitta" | "Kapha" | "Vata/Pitta" | "Pitta/Kapha" | "Kapha/Vata" | "Kapha/Pitta" | "Vata/Kapha";
  theme: LifeMapTheme;
  pillars: LifeMapPillars;
  priorityMetrics: string[];
}

export const LIFE_MAP_CONFIGS: Record<LifeStage, LifeMapConfig> = {
  menarche: {
    id: "menarche",
    title: "Menarche: The Awakening",
    description: "Transitioning from childhood to womanhood with grace and knowledge.",
    icon: Flower2,
    dominantDosha: "Kapha/Pitta",
    theme: {
      primary: "wellness-lilac",
      secondary: "wellness-rose",
      accent: "wellness-lilac-dark",
      gradient: "from-wellness-lilac/10 to-wellness-rose/10",
      border: "border-wellness-lilac/30",
    },
    pillars: {
      biological: "Hormonal awakening and the initialization of the monthly cycle.",
      ayurvedic: "Grounding Kapha to stabilize growth; cooling Pitta to manage emotional heat.",
      yoga: "Confidence-building flows and grounding asanas like Tadasana (Mountain Pose).",
      spiritual: "The Fiqh of Bulugh (maturity) and cultivating pride in Divine womanhood.",
      nutrition: "Iron-rich 'Shifa' foods like spinach, beetroots, and dates for cycle support.",
    },
    priorityMetrics: ["Cycle Regularity", "Emotional Resilience", "Energy Levels"],
  },
  fertility: {
    id: "fertility",
    title: "Fertility: Conscious Conception",
    description: "Preparing the physical and spiritual 'soil' before planting the 'seed'.",
    icon: Zap,
    dominantDosha: "Pitta",
    theme: {
      primary: "wellness-sage",
      secondary: "wellness-taupe",
      accent: "wellness-sage-dark",
      gradient: "from-wellness-sage/10 to-wellness-taupe/10",
      border: "border-wellness-sage/30",
    },
    pillars: {
      biological: "Al-Fitra readiness: Tracking cycle rhythm and cervical mucus quality.",
      ayurvedic: "Building Ojas (vitality) with Shatavari and warm sesame oil Abhyanga.",
      yoga: "Pelvic congestion release with Baddha Konasana and Nadi Shodhana breathwork.",
      spiritual: "Tawakkul (Trust) in the Decree and seeking Istighfar for spiritual cleansing.",
      nutrition: "Shifa Protocol: Ajwa dates, raw honey 'Drink of Honey', and mineral-rich ghee.",
    },
    priorityMetrics: ["Fertile Signs", "Trust in Qadr", "Agni/Heat Sync"],
  },
  pregnancy: {
    id: "pregnancy",
    title: "Pregnancy: The Sacred Carry",
    description: "Honouring the soul as it enters this realm across three sacred trimesters.",
    icon: Baby,
    dominantDosha: "Kapha",
    theme: {
      primary: "pink-500",
      secondary: "rose-200",
      accent: "pink-700",
      gradient: "from-pink-50 to-rose-50",
      border: "border-pink-200",
    },
    pillars: {
      biological: "Divine fetal evolution and maternal hormonal modulation (Progesterone focus).",
      ayurvedic: "Maintaining Kapha stability for growth; gentle Garbhini Abhyanga.",
      yoga: "Prenatal-safe movement (no deep twists); gentle pelvic floor 'Lift' and softening.",
      spiritual: "Quranic recitation (Surah Maryam/Yusuf) for the baby's soul and maternal Sabr.",
      nutrition: "Sunnah Shifa: 7 Ajwa dates daily (trimester 3), Talbina for mental ease.",
    },
    priorityMetrics: ["Fetal Bonding", "Trimester Comfort", "Hydration/Agni"],
  },
  postpartum: {
    id: "postpartum",
    title: "Post-Pregnancy: The Sacred 40",
    description: "A 40-day window for deep physical and emotional rebuilding after birth.",
    icon: Heart,
    dominantDosha: "Vata",
    theme: {
      primary: "orange-500",
      secondary: "amber-100",
      accent: "orange-700",
      gradient: "from-orange-50 to-amber-50",
      border: "border-orange-200",
    },
    pillars: {
      biological: "Hormone stabilization and the 'closing' of the physical body (Nifas).",
      ayurvedic: "Deep Snehana (Oil massage) and belly wrapping to pacify scattered Vata.",
      yoga: "Gentle restorative rest and initial pelvic floor 're-connection'.",
      spiritual: "The Fiqh of Nifas and finding identity as a 'Portal of Life'.",
      nutrition: "Warming, digestive-friendly Sunnah soups, Fenugreek, and Ghee tonics.",
    },
    priorityMetrics: ["Healing Sabr", "Snehana Frequency", "Sleep/Rest Quality"],
  },
  post_surgical: {
    id: "post_surgical",
    title: "Post-Surgical: Healing Sabr",
    description: "Acute recovery and restorative patience after medical procedures.",
    icon: Activity,
    dominantDosha: "Vata/Pitta",
    theme: {
      primary: "blue-500",
      secondary: "cyan-100",
      accent: "blue-700",
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-200",
    },
    pillars: {
      biological: "Cellular repair, scar tissue management, and inflammation reduction.",
      ayurvedic: "Turmeric and Ginger for Shifa; managing Vata air and Pitta heat.",
      yoga: "Pranayama (Breathwork) for pain management and restorative 'No-Strain' rest.",
      spiritual: "Fiqh of illness: Understanding Rukhsah (Divine concessions) in worship.",
      nutrition: "Anti-inflammatory 'Shifa' tonics and easy-to-digest Kitchari.",
    },
    priorityMetrics: ["Inflammation", "Sabr Level", "Breath Depth"],
  },
  perimenopause: {
    id: "perimenopause",
    title: "Perimenopause: The Shift",
    description: "Navigating the erratic hormonal shift as the body prepares for transition.",
    icon: Sun,
    dominantDosha: "Vata/Pitta",
    theme: {
      primary: "amber-500",
      secondary: "yellow-100",
      accent: "amber-700",
      gradient: "from-amber-50 to-yellow-50",
      border: "border-amber-200",
    },
    pillars: {
      biological: "Managing erratic Estrogen drops and cycles that 'stutter'.",
      ayurvedic: "Cooling Pitta fire (Hot flashes) and stabilizing the emerging Vata wind.",
      yoga: "Resistance-based movement for bone density and cooling moon-breathing.",
      spiritual: "Consistency in Fard (Obligations) despite fluctuating energy and mood.",
      nutrition: "Bone-density Shifa: Sesame seeds, Calcium-rich greens, and Flax.",
    },
    priorityMetrics: ["Heat Management", "Bone Strength", "Mood Stability"],
  },
  menopause: {
    id: "menopause",
    title: "Menopause: The Second Spring",
    description: "Finding a new stillness and freedom after the monthly cycle stops.",
    icon: Moon,
    dominantDosha: "Vata",
    theme: {
      primary: "indigo-500",
      secondary: "violet-100",
      accent: "indigo-700",
      gradient: "from-indigo-50 to-violet-50",
      border: "border-indigo-200",
    },
    pillars: {
      biological: "Post-cycling cardiovascular health and metabolic maintenance.",
      ayurvedic: "Pacifying the dry/cold Vata with warm oils and internal moisture (Ghee).",
      yoga: "Heart-opening practices and cooling inversions (Viparita Karani).",
      spiritual: "Transitioning to the 'Wise Woman' stage—a time of deep spiritual insight.",
      nutrition: "Cooling Shifa: Fennel tea, Aloe Vera, and estrogen-mimicking foods.",
    },
    priorityMetrics: ["Stillness Depth", "Vata Balance", "Moisture Retention"],
  },
  golden_years: {
    id: "golden_years",
    title: "Golden Years: Longevity",
    description: "A period of profound wisdom and peaceful preparation for the journey home.",
    icon: Sparkles,
    dominantDosha: "Vata",
    theme: {
      primary: "yellow-600",
      secondary: "gold-100",
      accent: "yellow-800",
      gradient: "from-yellow-50 to-stone-50",
      border: "border-yellow-200",
    },
    pillars: {
      biological: "Cognitive vitality maintenance and preserving joint mobility.",
      ayurvedic: "Maximizing Tejas (Internal Glow) and maintaining Agni (Digestive fire).",
      yoga: "Gentle joint mobility and restorative rest to conserve vital energy.",
      spiritual: "Legacy Dhikr: A life focused on continuous connection and Tahajjud.",
      nutrition: "Sunnah Shifa: Raw honey, Olive oil, and antioxidant-rich light foods.",
    },
    priorityMetrics: ["Joint Mobility", "Tejas Glow", "Legacy Mindset"],
  },
};

export const getLifeMapConfig = (stage: string | null): LifeMapConfig => {
  if (!stage) return LIFE_MAP_CONFIGS.fertility; // Default fallback
  const normalized = stage.toLowerCase() as LifeStage;
  return LIFE_MAP_CONFIGS[normalized] || LIFE_MAP_CONFIGS.fertility;
};
