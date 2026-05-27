import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { workoutPlan, type WorkoutDay } from '@/lib/data/workoutData';

export function useWorkoutPlan() {
  const [plan, setPlan] = useState<WorkoutDay[]>(workoutPlan);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Lade Trainingsplan aus AsyncStorage
  useEffect(() => {
    const loadPlan = async () => {
      try {
        const saved = await AsyncStorage.getItem('workoutPlan');
        if (saved) {
          setPlan(JSON.parse(saved));
        } else {
          // Speichere Standard-Plan
          await AsyncStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
        }

        // Lade aktuellen Tag
        const savedDay = await AsyncStorage.getItem('currentWorkoutDay');
        if (savedDay) {
          setCurrentDay(parseInt(savedDay, 10));
        }
      } catch (error) {
        console.error('Fehler beim Laden des Trainingsplans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlan();
  }, []);

  // Speichere Änderungen
  const savePlan = async (updatedPlan: WorkoutDay[]) => {
    try {
      await AsyncStorage.setItem('workoutPlan', JSON.stringify(updatedPlan));
      setPlan(updatedPlan);
    } catch (error) {
      console.error('Fehler beim Speichern des Trainingsplans:', error);
    }
  };

  // Wechsle zum nächsten Tag
  const nextDay = async () => {
    const nextDayIndex = (currentDay + 1) % plan.length;
    await AsyncStorage.setItem('currentWorkoutDay', nextDayIndex.toString());
    setCurrentDay(nextDayIndex);
  };

  // Wechsle zum vorherigen Tag
  const previousDay = async () => {
    const prevDayIndex = currentDay === 0 ? plan.length - 1 : currentDay - 1;
    await AsyncStorage.setItem('currentWorkoutDay', prevDayIndex.toString());
    setCurrentDay(prevDayIndex);
  };

  // Setze einen bestimmten Tag
  const setDay = async (dayIndex: number) => {
    if (dayIndex >= 0 && dayIndex < plan.length) {
      await AsyncStorage.setItem('currentWorkoutDay', dayIndex.toString());
      setCurrentDay(dayIndex);
    }
  };

  return {
    plan,
    currentDay,
    currentDayData: plan[currentDay],
    isLoading,
    savePlan,
    nextDay,
    previousDay,
    setDay,
  };
}
