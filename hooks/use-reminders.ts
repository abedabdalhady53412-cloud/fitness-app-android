import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ReminderState {
  waterIntake: number; // in ml
  vitaminsTaken: Record<string, boolean>;
  lastResetDate: string;
}

const DEFAULT_WATER_GOAL = 2000; // 2 liters

export function useReminders() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [vitaminsTaken, setVitaminsTaken] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Lade Erinnerungen aus AsyncStorage
  useEffect(() => {
    const loadReminders = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const saved = await AsyncStorage.getItem('reminders');
        
        if (saved) {
          const data: ReminderState = JSON.parse(saved);
          
          // Wenn neuer Tag, setze zurück
          if (data.lastResetDate !== today) {
            await resetDaily();
          } else {
            setWaterIntake(data.waterIntake);
            setVitaminsTaken(data.vitaminsTaken);
          }
        } else {
          await resetDaily();
        }
      } catch (error) {
        console.error('Fehler beim Laden der Erinnerungen:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReminders();
  }, []);

  // Speichere Erinnerungen
  const saveReminders = async (water: number, vitamins: Record<string, boolean>) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data: ReminderState = {
        waterIntake: water,
        vitaminsTaken: vitamins,
        lastResetDate: today,
      };
      await AsyncStorage.setItem('reminders', JSON.stringify(data));
      setWaterIntake(water);
      setVitaminsTaken(vitamins);
    } catch (error) {
      console.error('Fehler beim Speichern der Erinnerungen:', error);
    }
  };

  // Füge Wasser hinzu
  const addWater = async (amount: number = 250) => {
    const newWater = Math.min(waterIntake + amount, DEFAULT_WATER_GOAL);
    await saveReminders(newWater, vitaminsTaken);
  };

  // Setze Wasser zurück
  const resetWater = async () => {
    await saveReminders(0, vitaminsTaken);
  };

  // Markiere Vitamin als genommen
  const toggleVitamin = async (vitaminId: string) => {
    const updated = {
      ...vitaminsTaken,
      [vitaminId]: !vitaminsTaken[vitaminId],
    };
    await saveReminders(waterIntake, updated);
  };

  // Setze tägliche Daten zurück
  const resetDaily = async () => {
    const today = new Date().toISOString().split('T')[0];
    const data: ReminderState = {
      waterIntake: 0,
      vitaminsTaken: {},
      lastResetDate: today,
    };
    await AsyncStorage.setItem('reminders', JSON.stringify(data));
    setWaterIntake(0);
    setVitaminsTaken({});
  };

  // Berechne Wasser-Prozentsatz
  const waterPercentage = (waterIntake / DEFAULT_WATER_GOAL) * 100;

  // Zähle genommene Vitamine
  const vitaminsTakenCount = Object.values(vitaminsTaken).filter(Boolean).length;

  return {
    waterIntake,
    waterGoal: DEFAULT_WATER_GOAL,
    waterPercentage,
    vitaminsTaken,
    vitaminsTakenCount,
    isLoading,
    addWater,
    resetWater,
    toggleVitamin,
    resetDaily,
    saveReminders,
  };
}
