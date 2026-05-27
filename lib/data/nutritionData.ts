// Ernährungs- und Rezeptdaten
export interface Meal {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner';
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  video_url?: string;
  notes?: string;
}

export interface NutritionWeek {
  week_number: number;
  meals: Meal[];
}

export const nutritionData: Meal[] = [
  // Frühstück
  {
    id: 'meal_1',
    name: 'Haferflocken mit Protein',
    category: 'breakfast',
    ingredients: [
      'Haferflocken 50g',
      'Whey Protein 30g',
      'Milch 200ml',
      'Honig 10g',
    ],
    calories: 350,
    protein: 30,
    carbs: 40,
    fats: 8,
    video_url: 'recipe_breakfast_1.mp4',
  },
  {
    id: 'meal_2',
    name: 'Omelett mit Gemüse',
    category: 'breakfast',
    ingredients: [
      'Eier 3 Stück',
      'Spinat 100g',
      'Tomaten 50g',
      'Olivenöl 10ml',
    ],
    calories: 280,
    protein: 25,
    carbs: 8,
    fats: 15,
    video_url: 'recipe_breakfast_2.mp4',
  },

  // Mittagessen
  {
    id: 'meal_3',
    name: 'Hähnchenbrust mit Reis',
    category: 'lunch',
    ingredients: [
      'Hähnchenbrust 200g',
      'Reis 120g',
      'Broccoli 150g',
      'Olivenöl 10ml',
    ],
    calories: 480,
    protein: 45,
    carbs: 55,
    fats: 8,
    video_url: 'recipe_lunch_1.mp4',
  },
  {
    id: 'meal_4',
    name: 'Fisch mit Süßkartoffeln',
    category: 'lunch',
    ingredients: [
      'Weißfisch 180g',
      'Süßkartoffeln 150g',
      'Karotten 100g',
      'Zitrone 1 Stück',
    ],
    calories: 420,
    protein: 40,
    carbs: 48,
    fats: 6,
    video_url: 'recipe_lunch_2.mp4',
  },
  {
    id: 'meal_5',
    name: 'Rindfleisch mit Kartoffeln',
    category: 'lunch',
    ingredients: [
      'Rindfleisch 200g',
      'Kartoffeln 150g',
      'Grüne Bohnen 100g',
      'Olivenöl 10ml',
    ],
    calories: 520,
    protein: 48,
    carbs: 50,
    fats: 12,
    video_url: 'recipe_lunch_3.mp4',
  },

  // Abendessen
  {
    id: 'meal_6',
    name: 'Salat mit Thunfisch',
    category: 'dinner',
    ingredients: [
      'Thunfisch 150g',
      'Gemischter Salat 200g',
      'Gurke 100g',
      'Olivenöl 10ml',
    ],
    calories: 280,
    protein: 35,
    carbs: 15,
    fats: 12,
    video_url: 'recipe_dinner_1.mp4',
  },
  {
    id: 'meal_7',
    name: 'Hähnchen mit Gemüse',
    category: 'dinner',
    ingredients: [
      'Hähnchenbrust 180g',
      'Zucchini 150g',
      'Paprika 100g',
      'Olivenöl 10ml',
    ],
    calories: 320,
    protein: 38,
    carbs: 18,
    fats: 10,
    video_url: 'recipe_dinner_2.mp4',
  },
  {
    id: 'meal_8',
    name: 'Hüttenkäse mit Beeren',
    category: 'dinner',
    ingredients: [
      'Hüttenkäse 200g',
      'Blaubeeren 100g',
      'Mandeln 30g',
      'Honig 10g',
    ],
    calories: 350,
    protein: 32,
    carbs: 30,
    fats: 12,
    video_url: 'recipe_dinner_3.mp4',
  },
];

// Vitamine und Supplements
export interface Vitamin {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  meal_related?: string;
}

export const vitamins: Vitamin[] = [
  {
    id: 'vit_1',
    name: 'Multivitamin',
    dosage: '1 Dosis',
    timing: 'Mit 1. Mahlzeit',
  },
  {
    id: 'vit_2',
    name: 'Whey Isolat',
    dosage: '1 Scoop',
    timing: 'Mit 1. Mahlzeit & nach Training',
  },
  {
    id: 'vit_3',
    name: 'Kreatin',
    dosage: '5g',
    timing: 'Nach Training',
  },
  {
    id: 'vit_4',
    name: 'Omega 3',
    dosage: '1g',
    timing: 'Mit 1. & 3. Mahlzeit',
  },
  {
    id: 'vit_5',
    name: 'Zink',
    dosage: '50mg',
    timing: 'Vor dem Schlafen',
  },
  {
    id: 'vit_6',
    name: 'Vitamin C',
    dosage: '1 Dosis',
    timing: 'Mit 4. Mahlzeit',
  },
  {
    id: 'vit_7',
    name: 'Vitamin D',
    dosage: '1 Dosis',
    timing: 'Mit 2. Mahlzeit',
  },
];
