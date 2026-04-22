export const shifaRecipes = [
  {
    id: "talbina-recipe",
    title: "Talbina: The Heart-Ease Porridge",
    description: "A soft barley porridge recommended in the Sunnah for comforting the heart and relieving anxiety.",
    prepTime: "20 min",
    servings: "2",
    difficulty: "Easy" as const,
    ingredients: [
      { item: "Whole grain barley flour", amount: "2 tbsp", shifaBenefit: "Heart-strengthening" },
      { item: "Organic Milk (or Almond Milk)", amount: "1.5 cups", shifaBenefit: "Nourishing" },
      { item: "Raw Honey", amount: "To taste", shifaBenefit: "Healing according to Sunnah" },
      { item: "Ajwa Dates (Chopped)", amount: "3-5", shifaBenefit: "Liver support & Detox" }
    ],
    steps: [
      "Mix barley flour with milk in a small pot over low heat.",
      "Stir continuously for 15-20 minutes until it thickens into a creamy consistency.",
      "Remove from heat and stir in the raw honey.",
      "Top with chopped Ajwa dates and enjoy warm, especially in the early morning."
    ],
    sunnahInsight: "The Prophet (SAW) said: 'Talbina gives rest to the heart of the patient and makes it active and relieves some of his sorrow and grief.'",
    ayurvedicInsight: "Rich in fiber and cooling properties, barley grounds the Vata dosha and clears Kapha congestion.",
    doshaSuitability: ["Vata", "Kapha"]
  },
  {
    id: "ajwa-honey-water",
    title: "Ajwa & Honey Shifa Tonic",
    description: "A simple, powerful immune-boosting tonic for daily detoxification and spiritual protection.",
    prepTime: "5 min",
    servings: "1",
    difficulty: "Easy" as const,
    ingredients: [
      { item: "Warm Water", amount: "1 cup", shifaBenefit: "Hydrating" },
      { item: "Raw Mountain Honey", amount: "1 tsp", shifaBenefit: "Enzymatic healing" },
      { item: "Ajwa Date Paste", amount: "1 tsp", shifaBenefit: "Protection against toxicity" },
      { item: "Black Seed Oil", amount: "3 drops", shifaBenefit: "Cure for everything except death" }
    ],
    steps: [
      "Dissolve honey in warm (not boiling) water to preserve its enzymes.",
      "Stir in the Ajwa date paste until well mixed.",
      "Add the drops of Black Seed oil and drink on an empty stomach.",
      "Maintain a state of presence and gratitude while consuming."
    ],
    sunnahInsight: "Ajwa dates are known for their protective qualities. Honey is mentioned in the Quran as a 'shifa' for mankind.",
    ayurvedicInsight: "A powerful Ojas-builder that strengthens the immune system (Vyadhikshamathva).",
    doshaSuitability: ["Vata", "Pitta", "Kapha"]
  },
  {
    id: "ginger-turmeric-tonic",
    title: "Vata-Pitta Balancing Tonic",
    description: "Anti-inflammatory support for joint stiffness, hormonal heat, and digestive sluggishness.",
    prepTime: "10 min",
    servings: "1",
    difficulty: "Easy" as const,
    ingredients: [
      { item: "Fresh Ginger Root", amount: "1 inch", shifaBenefit: "Digestive fire (Agni)" },
      { item: "Ground Turmeric", amount: "1/4 tsp", shifaBenefit: "Anti-inflammatory" },
      { item: "Fennel Seeds", amount: "1/2 tsp", shifaBenefit: "Cooling Pitta balance" },
      { item: "Lemon", amount: "1/2", shifaBenefit: "Vitamin C & Alkaline" }
    ],
    steps: [
      "Boil ginger and fennel seeds in water for 5 minutes.",
      "Add turmeric and simmer for 1 more minute.",
      "Squeeze in the fresh lemon after removing from heat.",
      "Strain and sip slowly throughout the morning."
    ],
    sunnahInsight: "Ginger (Zanjabil) is mentioned as a drink of Paradise.",
    ayurvedicInsight: "Balances Pitta fire through fennel while supporting Vata digestion through ginger.",
    doshaSuitability: ["Vata", "Pitta"]
  }
];
