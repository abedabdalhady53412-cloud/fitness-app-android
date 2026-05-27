import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_VIDEOS, DEFAULT_WORKOUT_PLAN, DEFAULT_RECIPES, DEFAULT_VITAMINS,
  type Video, type WorkoutDay, type Recipe, type Vitamin, type Exercise,
} from '@/lib/data/appData';

const KEYS = {
  VIDEOS: 'app_videos',
  WORKOUT: 'app_workout_plan',
  RECIPES: 'app_recipes',
  VITAMINS: 'app_vitamins',
  WATER: 'app_water_today',
  WATER_DATE: 'app_water_date',
  VITAMIN_DONE: 'app_vitamins_done',
  VITAMIN_DATE: 'app_vitamins_date',
  WORKOUT_PROGRESS: 'app_workout_progress',
  WORKOUT_PROGRESS_DATE: 'app_workout_progress_date',
};

export interface WorkoutProgress {
  dayId: string;
  completedExercises: string[];
  dayCompleted: boolean;
  date: string;
}

export function useAppStore() {
  const [videos, setVideos] = useState<Video[]>(DEFAULT_VIDEOS);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>(DEFAULT_WORKOUT_PLAN);
  const [recipes, setRecipes] = useState<Recipe[]>(DEFAULT_RECIPES);
  const [vitamins, setVitamins] = useState<Vitamin[]>(DEFAULT_VITAMINS);
  const [waterMl, setWaterMl] = useState(0);
  const [vitaminsDone, setVitaminsDone] = useState<string[]>([]);
  const [workoutProgress, setWorkoutProgress] = useState<WorkoutProgress | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Lade alle Daten beim Start
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [vids, plan, recs, vits, water, waterDate, vitDone, vitDate, progress, progressDate] =
          await Promise.all([
            AsyncStorage.getItem(KEYS.VIDEOS),
            AsyncStorage.getItem(KEYS.WORKOUT),
            AsyncStorage.getItem(KEYS.RECIPES),
            AsyncStorage.getItem(KEYS.VITAMINS),
            AsyncStorage.getItem(KEYS.WATER),
            AsyncStorage.getItem(KEYS.WATER_DATE),
            AsyncStorage.getItem(KEYS.VITAMIN_DONE),
            AsyncStorage.getItem(KEYS.VITAMIN_DATE),
            AsyncStorage.getItem(KEYS.WORKOUT_PROGRESS),
            AsyncStorage.getItem(KEYS.WORKOUT_PROGRESS_DATE),
          ]);

        if (vids) setVideos(JSON.parse(vids));
        if (plan) setWorkoutPlan(JSON.parse(plan));
        if (recs) setRecipes(JSON.parse(recs));
        if (vits) setVitamins(JSON.parse(vits));

        // Wasser: täglich zurücksetzen
        if (waterDate === today && water) setWaterMl(parseInt(water, 10));
        else { setWaterMl(0); await AsyncStorage.setItem(KEYS.WATER_DATE, today); }

        // Vitamine: täglich zurücksetzen
        if (vitDate === today && vitDone) setVitaminsDone(JSON.parse(vitDone));
        else { setVitaminsDone([]); await AsyncStorage.setItem(KEYS.VITAMIN_DATE, today); }

        // Trainingsfortschritt: täglich zurücksetzen
        if (progressDate === today && progress) setWorkoutProgress(JSON.parse(progress));
        else { setWorkoutProgress(null); await AsyncStorage.setItem(KEYS.WORKOUT_PROGRESS_DATE, today); }
      } catch (e) {
        console.error('Fehler beim Laden:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadAll();
  }, []);

  // ---- VIDEOS ----
  const saveVideos = useCallback(async (newVideos: Video[]) => {
    setVideos(newVideos);
    await AsyncStorage.setItem(KEYS.VIDEOS, JSON.stringify(newVideos));
  }, []);

  const addVideo = useCallback(async (video: Video) => {
    const updated = [...videos, video];
    await saveVideos(updated);
  }, [videos, saveVideos]);

  const updateVideo = useCallback(async (id: string, data: Partial<Video>) => {
    const updated = videos.map(v => v.id === id ? { ...v, ...data } : v);
    await saveVideos(updated);
  }, [videos, saveVideos]);

  const deleteVideo = useCallback(async (id: string) => {
    const updated = videos.filter(v => v.id !== id);
    await saveVideos(updated);
  }, [videos, saveVideos]);

  // ---- TRAININGSPLAN ----
  const saveWorkoutPlan = useCallback(async (plan: WorkoutDay[]) => {
    setWorkoutPlan(plan);
    await AsyncStorage.setItem(KEYS.WORKOUT, JSON.stringify(plan));
  }, []);

  const updateExercise = useCallback(async (dayId: string, exerciseId: string, data: Partial<Exercise>) => {
    const updated = workoutPlan.map(day => {
      if (day.id !== dayId) return day;
      return { ...day, exercises: day.exercises.map(e => e.id === exerciseId ? { ...e, ...data } : e) };
    });
    await saveWorkoutPlan(updated);
  }, [workoutPlan, saveWorkoutPlan]);

  const addExercise = useCallback(async (dayId: string, exercise: Exercise) => {
    const updated = workoutPlan.map(day => {
      if (day.id !== dayId) return day;
      return { ...day, exercises: [...day.exercises, exercise] };
    });
    await saveWorkoutPlan(updated);
  }, [workoutPlan, saveWorkoutPlan]);

  const deleteExercise = useCallback(async (dayId: string, exerciseId: string) => {
    const updated = workoutPlan.map(day => {
      if (day.id !== dayId) return day;
      return { ...day, exercises: day.exercises.filter(e => e.id !== exerciseId) };
    });
    await saveWorkoutPlan(updated);
  }, [workoutPlan, saveWorkoutPlan]);

  // ---- REZEPTE ----
  const saveRecipes = useCallback(async (recs: Recipe[]) => {
    setRecipes(recs);
    await AsyncStorage.setItem(KEYS.RECIPES, JSON.stringify(recs));
  }, []);

  const addRecipe = useCallback(async (recipe: Recipe) => {
    await saveRecipes([...recipes, recipe]);
  }, [recipes, saveRecipes]);

  const updateRecipe = useCallback(async (id: string, data: Partial<Recipe>) => {
    const updated = recipes.map(r => r.id === id ? { ...r, ...data } : r);
    await saveRecipes(updated);
  }, [recipes, saveRecipes]);

  const deleteRecipe = useCallback(async (id: string) => {
    await saveRecipes(recipes.filter(r => r.id !== id));
  }, [recipes, saveRecipes]);

  // ---- VITAMINE ----
  const saveVitamins = useCallback(async (vits: Vitamin[]) => {
    setVitamins(vits);
    await AsyncStorage.setItem(KEYS.VITAMINS, JSON.stringify(vits));
  }, []);

  const toggleVitaminDone = useCallback(async (id: string) => {
    const updated = vitaminsDone.includes(id)
      ? vitaminsDone.filter(v => v !== id)
      : [...vitaminsDone, id];
    setVitaminsDone(updated);
    await AsyncStorage.setItem(KEYS.VITAMIN_DONE, JSON.stringify(updated));
    await AsyncStorage.setItem(KEYS.VITAMIN_DATE, today);
  }, [vitaminsDone, today]);

  // ---- WASSER ----
  const addWater = useCallback(async (ml: number) => {
    const newAmount = waterMl + ml;
    setWaterMl(newAmount);
    await AsyncStorage.setItem(KEYS.WATER, String(newAmount));
    await AsyncStorage.setItem(KEYS.WATER_DATE, today);
  }, [waterMl, today]);

  const resetWater = useCallback(async () => {
    setWaterMl(0);
    await AsyncStorage.setItem(KEYS.WATER, '0');
  }, []);

  // ---- TRAININGSFORTSCHRITT ----
  const startWorkout = useCallback(async (dayId: string) => {
    const progress: WorkoutProgress = { dayId, completedExercises: [], dayCompleted: false, date: today };
    setWorkoutProgress(progress);
    await AsyncStorage.setItem(KEYS.WORKOUT_PROGRESS, JSON.stringify(progress));
    await AsyncStorage.setItem(KEYS.WORKOUT_PROGRESS_DATE, today);
  }, [today]);

  const toggleExerciseDone = useCallback(async (exerciseId: string) => {
    if (!workoutProgress) return;
    const completed = workoutProgress.completedExercises.includes(exerciseId)
      ? workoutProgress.completedExercises.filter(e => e !== exerciseId)
      : [...workoutProgress.completedExercises, exerciseId];
    const updated = { ...workoutProgress, completedExercises: completed };
    setWorkoutProgress(updated);
    await AsyncStorage.setItem(KEYS.WORKOUT_PROGRESS, JSON.stringify(updated));
  }, [workoutProgress]);

  const completeDay = useCallback(async () => {
    if (!workoutProgress) return;
    const updated = { ...workoutProgress, dayCompleted: true };
    setWorkoutProgress(updated);
    await AsyncStorage.setItem(KEYS.WORKOUT_PROGRESS, JSON.stringify(updated));
  }, [workoutProgress]);

  // ---- HILFSFUNKTIONEN ----
  const getVideoById = useCallback((id?: string) => {
    if (!id) return undefined;
    return videos.find(v => v.id === id);
  }, [videos]);

  const getWeeklyRecipes = useCallback(() => {
    const dayOfWeek = new Date().getDay();
    return recipes.filter(r => r.weekDay === dayOfWeek);
  }, [recipes]);

  const resetToDefaults = useCallback(async () => {
    await Promise.all([
      AsyncStorage.setItem(KEYS.VIDEOS, JSON.stringify(DEFAULT_VIDEOS)),
      AsyncStorage.setItem(KEYS.WORKOUT, JSON.stringify(DEFAULT_WORKOUT_PLAN)),
      AsyncStorage.setItem(KEYS.RECIPES, JSON.stringify(DEFAULT_RECIPES)),
      AsyncStorage.setItem(KEYS.VITAMINS, JSON.stringify(DEFAULT_VITAMINS)),
    ]);
    setVideos(DEFAULT_VIDEOS);
    setWorkoutPlan(DEFAULT_WORKOUT_PLAN);
    setRecipes(DEFAULT_RECIPES);
    setVitamins(DEFAULT_VITAMINS);
  }, []);

  return {
    // State
    videos, workoutPlan, recipes, vitamins, waterMl, vitaminsDone, workoutProgress, isLoaded,
    // Videos
    addVideo, updateVideo, deleteVideo,
    // Workout
    saveWorkoutPlan, updateExercise, addExercise, deleteExercise,
    startWorkout, toggleExerciseDone, completeDay,
    // Rezepte
    addRecipe, updateRecipe, deleteRecipe,
    // Vitamine
    saveVitamins, toggleVitaminDone,
    // Wasser
    addWater, resetWater,
    // Helpers
    getVideoById, getWeeklyRecipes, resetToDefaults,
  };
}
