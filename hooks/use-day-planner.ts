import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DayPlan, DailyTask, MealPlanItem, UserSettings } from '@/lib/data/appData';
import { DEFAULT_DAILY_TASKS, DEFAULT_USER_SETTINGS, DEFAULT_RECIPES, DEFAULT_WORKOUT_PLAN } from '@/lib/data/appData';

const STORAGE_KEY_DAY_PLANS = 'dayPlans';
const STORAGE_KEY_USER_SETTINGS = 'userSettings';

export function useDayPlanner() {
  const [dayPlans, setDayPlans] = useState<Map<string, DayPlan>>(new Map());
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [todayPlan, setTodayPlan] = useState<DayPlan | null>(null);

  // Lade Daten beim Start
  useEffect(() => {
    loadData();
  }, []);

  // Aktualisiere heute's Plan wenn sich dayPlans ändert
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const plan = dayPlans.get(today);
    setTodayPlan(plan || null);
  }, [dayPlans]);

  const loadData = useCallback(async () => {
    try {
      const [plansJson, settingsJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_DAY_PLANS),
        AsyncStorage.getItem(STORAGE_KEY_USER_SETTINGS),
      ]);

      if (plansJson) {
        const plans = new Map<string, DayPlan>(JSON.parse(plansJson));
        setDayPlans(plans);
      }

      if (settingsJson) {
        setUserSettings(JSON.parse(settingsJson));
      } else {
        // Speichere Default-Einstellungen
        await AsyncStorage.setItem(STORAGE_KEY_USER_SETTINGS, JSON.stringify(DEFAULT_USER_SETTINGS));
      }
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
  }, []);

  const saveDayPlan = useCallback(async (date: string, plan: DayPlan) => {
    try {
      const newPlans = new Map(dayPlans);
      newPlans.set(date, plan);
      setDayPlans(newPlans);

      await AsyncStorage.setItem(STORAGE_KEY_DAY_PLANS, JSON.stringify(Array.from(newPlans.entries())));
    } catch (error) {
      console.error('Fehler beim Speichern des Tagesplans:', error);
    }
  }, [dayPlans]);

  const saveUserSettings = useCallback(async (settings: UserSettings) => {
    try {
      setUserSettings(settings);
      await AsyncStorage.setItem(STORAGE_KEY_USER_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Fehler beim Speichern der Einstellungen:', error);
    }
  }, []);

  const getDayPlan = useCallback((date: string): DayPlan => {
    let plan = dayPlans.get(date);

    if (!plan) {
      // Erstelle einen neuen Plan für diesen Tag
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay();
      const isTrainingDay = userSettings.trainingDays.includes(dayOfWeek);

      // Bestimme welcher Trainingstag
      let workoutDayId: string | undefined;
      if (isTrainingDay) {
        const trainingDayIndex = userSettings.trainingDays.indexOf(dayOfWeek);
        workoutDayId = userSettings.trainingDayOrder[trainingDayIndex % userSettings.trainingDayOrder.length];
      }

      // Erstelle Mahlzeiten für diesen Tag
      const mealPlan: MealPlanItem[] = [];
      ['breakfast', 'lunch', 'dinner', 'snack', 'shake'].forEach((mealType) => {
        const recipe = DEFAULT_RECIPES.find(
          (r) => r.mealType === mealType && r.weekDay === dayOfWeek
        );
        if (recipe) {
          mealPlan.push({
            mealType: mealType as any,
            recipeId: recipe.id,
          });
        }
      });

      plan = {
        date,
        dayOfWeek,
        isTrainingDay,
        workoutDayId,
        tasks: [...DEFAULT_DAILY_TASKS],
        mealPlan,
      };

      saveDayPlan(date, plan);
    }

    return plan;
  }, [dayPlans, userSettings, saveDayPlan]);

  const toggleTaskDone = useCallback(
    (date: string, taskId: string) => {
      const plan = getDayPlan(date);
      const updatedPlan = {
        ...plan,
        tasks: plan.tasks.map((t) =>
          t.id === taskId ? { ...t, done: !(t as any).done } : t
        ),
      };
      saveDayPlan(date, updatedPlan);
    },
    [getDayPlan, saveDayPlan]
  );

  const addTask = useCallback(
    (date: string, task: DailyTask) => {
      const plan = getDayPlan(date);
      const updatedPlan = {
        ...plan,
        tasks: [...plan.tasks, task],
      };
      saveDayPlan(date, updatedPlan);
    },
    [getDayPlan, saveDayPlan]
  );

  const deleteTask = useCallback(
    (date: string, taskId: string) => {
      const plan = getDayPlan(date);
      const updatedPlan = {
        ...plan,
        tasks: plan.tasks.filter((t) => t.id !== taskId),
      };
      saveDayPlan(date, updatedPlan);
    },
    [getDayPlan, saveDayPlan]
  );

  const updateTask = useCallback(
    (date: string, taskId: string, updates: Partial<DailyTask>) => {
      const plan = getDayPlan(date);
      const updatedPlan = {
        ...plan,
        tasks: plan.tasks.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
      };
      saveDayPlan(date, updatedPlan);
    },
    [getDayPlan, saveDayPlan]
  );

  const changeMeal = useCallback(
    (date: string, mealType: string, newRecipeId: string) => {
      const plan = getDayPlan(date);
      const updatedPlan = {
        ...plan,
        mealPlan: plan.mealPlan.map((m) =>
          m.mealType === mealType ? { ...m, recipeId: newRecipeId } : m
        ),
      };
      saveDayPlan(date, updatedPlan);
    },
    [getDayPlan, saveDayPlan]
  );

  const setTrainingDay = useCallback(
    (date: string, workoutDayId: string | undefined) => {
      const plan = getDayPlan(date);
      const updatedPlan = {
        ...plan,
        isTrainingDay: !!workoutDayId,
        workoutDayId,
      };
      saveDayPlan(date, updatedPlan);
    },
    [getDayPlan, saveDayPlan]
  );

  const updateTrainingDays = useCallback(
    (trainingDays: number[]) => {
      const newSettings = { ...userSettings, trainingDays };
      saveUserSettings(newSettings);
    },
    [userSettings, saveUserSettings]
  );

  return {
    dayPlans,
    userSettings,
    todayPlan,
    getDayPlan,
    saveDayPlan,
    toggleTaskDone,
    addTask,
    deleteTask,
    updateTask,
    changeMeal,
    setTrainingDay,
    updateTrainingDays,
    saveUserSettings,
  };
}
