import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nutritionData, vitamins, type Meal, type Vitamin } from '@/lib/data/nutritionData';

export function useNutrition() {
  const [meals, setMeals] = useState<Meal[]>(nutritionData);
  const [vitaminList, setVitaminList] = useState<Vitamin[]>(vitamins);
  const [isLoading, setIsLoading] = useState(true);
  const [vitaminsTaken, setVitaminsTaken] = useState<Record<string, boolean>>({});

  // Lade Ernährungsdaten aus AsyncStorage
  useEffect(() => {
    const loadNutrition = async () => {
      try {
        const saved = await AsyncStorage.getItem('nutrition');
        if (saved) {
          setMeals(JSON.parse(saved));
        } else {
          await AsyncStorage.setItem('nutrition', JSON.stringify(nutritionData));
        }

        // Lade Vitamine-Status
        const savedVitamins = await AsyncStorage.getItem('vitaminsTaken');
        if (savedVitamins) {
          setVitaminsTaken(JSON.parse(savedVitamins));
        }
      } catch (error) {
        console.error('Fehler beim Laden der Ernährungsdaten:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNutrition();
  }, []);

  // Speichere Mahlzeiten
  const saveMeals = async (updatedMeals: Meal[]) => {
    try {
      await AsyncStorage.setItem('nutrition', JSON.stringify(updatedMeals));
      setMeals(updatedMeals);
    } catch (error) {
      console.error('Fehler beim Speichern der Mahlzeiten:', error);
    }
  };

  // Markiere Vitamin als genommen
  const toggleVitamin = async (vitaminId: string) => {
    const updated = {
      ...vitaminsTaken,
      [vitaminId]: !vitaminsTaken[vitaminId],
    };
    try {
      await AsyncStorage.setItem('vitaminsTaken', JSON.stringify(updated));
      setVitaminsTaken(updated);
    } catch (error) {
      console.error('Fehler beim Speichern des Vitamin-Status:', error);
    }
  };

  // Wechsle Rezepte für nächste Woche
  const rotateRecipes = async () => {
    const rotated = meals.sort(() => Math.random() - 0.5);
    await saveMeals(rotated);
  };

  // Hole Mahlzeiten nach Kategorie
  const getMealsByCategory = (category: 'breakfast' | 'lunch' | 'dinner') => {
    return meals.filter(meal => meal.category === category);
  };

  return {
    meals,
    vitaminList,
    vitaminsTaken,
    isLoading,
    saveMeals,
    toggleVitamin,
    rotateRecipes,
    getMealsByCategory,
  };
}
