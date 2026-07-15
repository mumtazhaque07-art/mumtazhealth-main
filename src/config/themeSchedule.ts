import seatedMeditation from "@/assets/poses/seated-meditation.jpeg";

export interface MonthlyTheme {
  title: string;
  description: string;
  posture: string;
  recipe: string;
  image_url?: string;
  month_year: string; 
}

// Format should be exactly like "August 2026", "September 2026", etc.
export const scheduledThemes: Record<string, MonthlyTheme> = {
  "July 2026": {
    title: "The Month of Agni: Awakening the Center",
    description: "All true balance starts from the center. Whether it is your digestive fire (Agni), the physical stability of your core through Uddiyana Bandha, or the deep spiritual faith that grounds you. This month, we focus on digesting our food, our thoughts, and our experiences to create a stable foundation for the journey ahead.",
    posture: "Seated Foundation (Sukhasana)",
    recipe: "Agni-Kindling Mint & Fennel Tea",
    image_url: seatedMeditation,
    month_year: "July 2026"
  },
  "August 2026": {
    title: "The Month of Agni: Awakening the Center",
    description: "All true balance starts from the center. Whether it is your digestive fire (Agni), the physical stability of your core through Uddiyana Bandha, or the deep spiritual faith that grounds you. This month, we focus on digesting our food, our thoughts, and our experiences to create a stable foundation for the journey ahead.",
    posture: "Seated Foundation (Sukhasana)",
    recipe: "Agni-Kindling Mint & Fennel Tea",
    image_url: seatedMeditation,
    month_year: "August 2026"
  },
  // Add future months here as they are developed
};

export const getScheduledTheme = (monthYear: string): MonthlyTheme | null => {
  return scheduledThemes[monthYear] || null;
};
