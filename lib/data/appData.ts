// VOLLSTÄNDIGE APP-DATEN - ARABISCH
// Alle Videos, Übungen, Rezepte, Vitamine, Tagesplanung
// ============================================================

export interface Video {
  id: string;
  filename: string;
  storagePath: string;
  title: string;
  titleAr: string;
  duration: number; // Sekunden
  type: 'exercise' | 'recipe';
}

export interface Exercise {
  id: string;
  nameAr: string;
  nameDe: string;
  sets: number;
  reps: string;
  weight?: string;
  notes?: string;
  videoId?: string;
}

export interface WorkoutDay {
  id: string;
  dayNumber: number;
  nameAr: string;
  nameDe: string;
  muscleGroupAr: string;
  muscleGroupDe: string;
  exercises: Exercise[];
}

export interface Recipe {
  id: string;
  nameAr: string;
  nameDe: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'shake';
  mealTypeAr: string;
  ingredients?: string[];
  videoId?: string;
  weekDay?: number; // 0-6 für wöchentliche Rotation
}

export interface Vitamin {
  id: string;
  nameAr: string;
  nameDe: string;
  dose: string;
  timeAr: string;
  timeDe: string;
  hour: number;
  minute: number;
  color: string;
}

// ============================================================
// NEUE DATENSTRUKTUREN FÜR TAGESPLANUNG
// ============================================================

export interface DailyTask {
  id: string;
  nameAr: string;
  nameDe: string;
  categoryAr: string; // 'صباح' (Morgen), 'تنظيف' (Haushalt), 'تمرين' (Training), 'طعام' (Essen), 'مساء' (Abend)
  categoryDe: string;
  time?: string; // z.B. "08:00"
  duration?: number; // Minuten
  order: number; // Sortierung
  color: string;
}

export interface DayPlan {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0-6 (Sonntag-Samstag)
  isTrainingDay: boolean;
  workoutDayId?: string; // Welcher Trainingstag (day1, day2, etc.)
  tasks: DailyTask[]; // Alle Aufgaben für diesen Tag
  mealPlan: MealPlanItem[];
  notes?: string;
}

export interface MealPlanItem {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'shake';
  recipeId: string;
  time?: string;
}

export interface UserSettings {
  trainingDays: number[]; // z.B. [0, 2, 4, 6] = Sonntag, Dienstag, Donnerstag, Samstag
  trainingDayOrder: string[]; // z.B. ['day1', 'day2', 'day3', 'day4']
  wakeUpTime: string; // z.B. "06:00"
  sleepTime: string; // z.B. "23:00"
  waterGoal: number; // ml
}

// ============================================================
// VIDEOS (52 Videos - alle auf Server hochgeladen)
// ============================================================
export const DEFAULT_VIDEOS: Video[] = [
  // TRAININGS-VIDEOS
  { id: 'v01', filename: 'VID-20231103-WA0002.mp4', storagePath: '/manus-storage/VID-20231103-WA0002_d3b8ede7.mp4', title: 'Beinbeuger sitzend', titleAr: 'ثني الركبة جالساً', duration: 17, type: 'exercise' },
  { id: 'v02', filename: 'VID-20231103-WA0003.mp4', storagePath: '/manus-storage/VID-20231103-WA0003_d4e9db99.mp4', title: 'Bizepscurls', titleAr: 'تمرين البايسبس', duration: 21, type: 'exercise' },
  { id: 'v03', filename: 'VID-20231103-WA0004.mp4', storagePath: '/manus-storage/VID-20231103-WA0004_938611d7.mp4', title: 'Trizepsdrücken Kabelzug', titleAr: 'تمرين الترايسبس بالكابل', duration: 17, type: 'exercise' },
  { id: 'v04', filename: 'VID-20231103-WA0005.mp4', storagePath: '/manus-storage/VID-20231103-WA0005_11af0af4.mp4', title: 'Schrägbankdrücken', titleAr: 'ضغط الصدر المائل', duration: 19, type: 'exercise' },
  { id: 'v05', filename: 'VID-20231103-WA0006.mp4', storagePath: '/manus-storage/VID-20231103-WA0006_52e884a9.mp4', title: 'Seitheben', titleAr: 'رفع جانبي للكتف', duration: 12, type: 'exercise' },
  { id: 'v06', filename: 'VID-20231103-WA0007.mp4', storagePath: '/manus-storage/VID-20231103-WA0007_9499f9b9.mp4', title: 'Einarmiges Rudern', titleAr: 'تجديف بيد واحدة', duration: 18, type: 'exercise' },
  { id: 'v07', filename: 'VID-20231103-WA0008.mp4', storagePath: '/manus-storage/VID-20231103-WA0008_9cf9acc4.mp4', title: 'Wadenheben', titleAr: 'رفع الكعب', duration: 24, type: 'exercise' },
  { id: 'v08', filename: 'VID-20231103-WA0009.mp4', storagePath: '/manus-storage/VID-20231103-WA0009_3564f222.mp4', title: 'Beinbeuger liegend', titleAr: 'ثني الركبة مستلقياً', duration: 18, type: 'exercise' },
  { id: 'v09', filename: 'VID-20231103-WA0010.mp4', storagePath: '/manus-storage/VID-20231103-WA0010_0cec7348.mp4', title: 'Latziehen', titleAr: 'تمرين اللات', duration: 19, type: 'exercise' },
  { id: 'v10', filename: 'VID-20231103-WA0011.mp4', storagePath: '/manus-storage/VID-20231103-WA0011_badaccc6.mp4', title: 'Sitzendes Rudern', titleAr: 'تجديف جالساً', duration: 19, type: 'exercise' },
  { id: 'v11', filename: 'VID-20231103-WA0012.mp4', storagePath: '/manus-storage/VID-20231103-WA0012_1512a960.mp4', title: 'Vorgebeugtes Rudern', titleAr: 'تجديف منحنياً', duration: 18, type: 'exercise' },
  { id: 'v12', filename: 'VID-20231103-WA0013.mp4', storagePath: '/manus-storage/VID-20231103-WA0013_95a170f0.mp4', title: 'T-Bar Rudern', titleAr: 'تجديف T-Bar', duration: 15, type: 'exercise' },
  { id: 'v13', filename: 'VID-20231103-WA0014.mp4', storagePath: '/manus-storage/VID-20231103-WA0014_1673eee7.mp4', title: 'Schulterdrücken', titleAr: 'ضغط الكتف', duration: 18, type: 'exercise' },
  { id: 'v14', filename: 'VID-20231103-WA0038.mp4', storagePath: '/manus-storage/VID-20231103-WA0038_f6180940.mp4', title: 'Kurzhantel-Bizepscurls', titleAr: 'تمرين البايسبس بالدمبل', duration: 22, type: 'exercise' },
  { id: 'v15', filename: 'VID-20231103-WA0039.mp4', storagePath: '/manus-storage/VID-20231103-WA0039_05b11cd5.mp4', title: 'Kurzhantel-Shrugs', titleAr: 'رفع الكتفين', duration: 30, type: 'exercise' },
  { id: 'v16', filename: 'VID-20231103-WA0040.mp4', storagePath: '/manus-storage/VID-20231103-WA0040_6c2e398e.mp4', title: 'Frontheben', titleAr: 'رفع أمامي', duration: 21, type: 'exercise' },
  { id: 'v17', filename: 'VID-20231103-WA0042.mp4', storagePath: '/manus-storage/VID-20231103-WA0042_62e587f2.mp4', title: 'Schrägbankdrücken (LH)', titleAr: 'ضغط الصدر المائل بالبار', duration: 25, type: 'exercise' },
  { id: 'v18', filename: 'VID-20231103-WA0043.mp4', storagePath: '/manus-storage/VID-20231103-WA0043_f8595689.mp4', title: 'Schrägbankdrücken (KH)', titleAr: 'ضغط الصدر المائل بالدمبل', duration: 20, type: 'exercise' },
  { id: 'v19', filename: 'VID-20231103-WA0044.mp4', storagePath: '/manus-storage/VID-20231103-WA0044_2c11646a.mp4', title: 'Brustübung Kabelzug', titleAr: 'تمرين الصدر بالكابل', duration: 20, type: 'exercise' },
  { id: 'v20', filename: 'VID-20231103-WA0045.mp4', storagePath: '/manus-storage/VID-20231103-WA0045_68d57798.mp4', title: 'Butterfly', titleAr: 'تمرين الفراشة', duration: 20, type: 'exercise' },
  { id: 'v21', filename: 'VID-20231103-WA0046.mp4', storagePath: '/manus-storage/VID-20231103-WA0046_4c05891f.mp4', title: 'Dips', titleAr: 'تمرين الديبس', duration: 10, type: 'exercise' },
  { id: 'v22', filename: 'VID-20231103-WA0047.mp4', storagePath: '/manus-storage/VID-20231103-WA0047_eb69d45c.mp4', title: 'Trizepsdrücken liegend', titleAr: 'ضغط الترايسبس مستلقياً', duration: 19, type: 'exercise' },
  { id: 'v23', filename: 'VID-20231103-WA0048.mp4', storagePath: '/manus-storage/VID-20231103-WA0048_fbbe43a6.mp4', title: 'Trizepsdrücken Kabelzug', titleAr: 'ضغط الترايسبس بالكابل', duration: 16, type: 'exercise' },
  { id: 'v24', filename: 'VID-20231103-WA0049.mp4', storagePath: '/manus-storage/VID-20231103-WA0049_1d3ffb64.mp4', title: 'Bizeps-Curls SZ-Stange', titleAr: 'تمرين البايسبس بالبار الملتوي', duration: 18, type: 'exercise' },
  { id: 'v25', filename: 'VID-20231103-WA0051.mp4', storagePath: '/manus-storage/VID-20231103-WA0051_caef6abc.mp4', title: 'Kniebeugen', titleAr: 'القرفصاء', duration: 24, type: 'exercise' },
  { id: 'v26', filename: 'VID-20231103-WA0052.mp4', storagePath: '/manus-storage/VID-20231103-WA0052_aa49d35b.mp4', title: 'Ausfallschritte', titleAr: 'خطوات الانقضاض', duration: 14, type: 'exercise' },
  { id: 'v27', filename: 'VID-20231103-WA0053.mp4', storagePath: '/manus-storage/VID-20231103-WA0053_6d075112.mp4', title: 'Beinstrecken', titleAr: 'مد الساق', duration: 17, type: 'exercise' },
  { id: 'v28', filename: 'VID-20231103-WA0054.mp4', storagePath: '/manus-storage/VID-20231103-WA0054_f7c96ca4.mp4', title: 'Beinpresse', titleAr: 'ضغط الساق', duration: 27, type: 'exercise' },
  // REZEPT-VIDEOS
  { id: 'r01', filename: 'VID-20231103-WA0015.mp4', storagePath: '/manus-storage/VID-20231103-WA0015_ed583313.mp4', title: 'Hähnchenspieße', titleAr: 'أسياخ الدجاج', duration: 44, type: 'recipe' },
  { id: 'r02', filename: 'VID-20231103-WA0016.mp4', storagePath: '/manus-storage/VID-20231103-WA0016_6c03fa41.mp4', title: 'Kalbfleisch mit Champignons', titleAr: 'لحم العجل مع الفطر', duration: 59, type: 'recipe' },
  { id: 'r03', filename: 'VID-20231103-WA0017.mp4', storagePath: '/manus-storage/VID-20231103-WA0017_60c2b274.mp4', title: 'Hähnchen-Pizza', titleAr: 'بيتزا الدجاج', duration: 57, type: 'recipe' },
  { id: 'r04', filename: 'VID-20231103-WA0018.mp4', storagePath: '/manus-storage/VID-20231103-WA0018_bb0f1726.mp4', title: 'Lachs mit Spargel', titleAr: 'سمك السلمون مع الهليون', duration: 58, type: 'recipe' },
  { id: 'r05', filename: 'VID-20231103-WA0019.mp4', storagePath: '/manus-storage/VID-20231103-WA0019_38d82f1f.mp4', title: 'Weight Gainer Shake', titleAr: 'شيك زيادة الوزن', duration: 48, type: 'recipe' },
  { id: 'r06', filename: 'VID-20231103-WA0020.mp4', storagePath: '/manus-storage/VID-20231103-WA0020_2c9ae5a1.mp4', title: 'Gesunder Kebab', titleAr: 'كباب صحي', duration: 58, type: 'recipe' },
  { id: 'r07', filename: 'VID-20231103-WA0021.mp4', storagePath: '/manus-storage/VID-20231103-WA0021_37ed2a10.mp4', title: 'Hähnchen mit Kartoffeln', titleAr: 'دجاج مع البطاطس', duration: 62, type: 'recipe' },
  { id: 'r08', filename: 'VID-20231103-WA0022.mp4', storagePath: '/manus-storage/VID-20231103-WA0022_ffc83b8b.mp4', title: 'Obstsalat', titleAr: 'سلطة الفاكهة', duration: 62, type: 'recipe' },
  { id: 'r09', filename: 'VID-20231103-WA0023.mp4', storagePath: '/manus-storage/VID-20231103-WA0023_0c39357f.mp4', title: 'Pasta mit Hähnchen', titleAr: 'باستا بالدجاج', duration: 62, type: 'recipe' },
  { id: 'r10', filename: 'VID-20231103-WA0024.mp4', storagePath: '/manus-storage/VID-20231103-WA0024_b0527533.mp4', title: 'Gesundes Shawarma', titleAr: 'شاورما صحية', duration: 62, type: 'recipe' },
  { id: 'r11', filename: 'VID-20231103-WA0025.mp4', storagePath: '/manus-storage/VID-20231103-WA0025_b3e25188.mp4', title: 'Hähnchensalat', titleAr: 'سلطة الدجاج', duration: 63, type: 'recipe' },
  { id: 'r12', filename: 'VID-20231103-WA0026.mp4', storagePath: '/manus-storage/VID-20231103-WA0026_25dfd21e.mp4', title: 'Hähnchenbrust mit Gemüse', titleAr: 'صدر الدجاج مع الخضار', duration: 63, type: 'recipe' },
  { id: 'r13', filename: 'VID-20231103-WA0027.mp4', storagePath: '/manus-storage/VID-20231103-WA0027_9a5a757e.mp4', title: 'Gebratenes Fischfilet', titleAr: 'فيليه السمك المقلي', duration: 52, type: 'recipe' },
  { id: 'r14', filename: 'VID-20231103-WA0028.mp4', storagePath: '/manus-storage/VID-20231103-WA0028_5493dd54.mp4', title: 'Hähnchenspieße (Vorbereitung)', titleAr: 'تحضير أسياخ الدجاج', duration: 14, type: 'recipe' },
  { id: 'r15', filename: 'VID-20231103-WA0029.mp4', storagePath: '/manus-storage/VID-20231103-WA0029_7c7c7f0b.mp4', title: 'Hähnchenspieße (Braten)', titleAr: 'شوي أسياخ الدجاج', duration: 10, type: 'recipe' },
  { id: 'r16', filename: 'VID-20231103-WA0030.mp4', storagePath: '/manus-storage/VID-20231103-WA0030_6f748f46.mp4', title: 'Ernährungstipps', titleAr: 'نصائح غذائية', duration: 55, type: 'recipe' },
  { id: 'r17', filename: 'VID-20231103-WA0031.mp4', storagePath: '/manus-storage/VID-20231103-WA0031_cd823ca8.mp4', title: 'Hähnchen-Burger', titleAr: 'برغر الدجاج', duration: 97, type: 'recipe' },
  { id: 'r18', filename: 'VID-20231103-WA0032.mp4', storagePath: '/manus-storage/VID-20231103-WA0032_b9f9bde8.mp4', title: 'Kartoffelspalten', titleAr: 'أوتاد البطاطس', duration: 60, type: 'recipe' },
  { id: 'r19', filename: 'VID-20231103-WA0033.mp4', storagePath: '/manus-storage/VID-20231103-WA0033_f33dbbd0.mp4', title: 'Sandwich', titleAr: 'ساندويش', duration: 70, type: 'recipe' },
  { id: 'r20', filename: 'VID-20231103-WA0034.mp4', storagePath: '/manus-storage/VID-20231103-WA0034_f44dda7b.mp4', title: 'Gefüllte Paprika', titleAr: 'فلفل محشي', duration: 58, type: 'recipe' },
  { id: 'r21', filename: 'VID-20231103-WA0035.mp4', storagePath: '/manus-storage/VID-20231103-WA0035_359b8ee3.mp4', title: 'Protein-Bowl', titleAr: 'وعاء البروتين', duration: 66, type: 'recipe' },
  { id: 'r22', filename: 'VID-20231103-WA0036.mp4', storagePath: '/manus-storage/VID-20231103-WA0036_58b47ffe.mp4', title: 'Frühstück Alternativen', titleAr: 'بدائل الإفطار', duration: 33, type: 'recipe' },
  { id: 'r23', filename: 'VID-20231103-WA0037.mp4', storagePath: '/manus-storage/VID-20231103-WA0037_2cc677c9.mp4', title: 'Thunfisch mit Spargel', titleAr: 'تونة مع الهليون', duration: 37, type: 'recipe' },
  { id: 'r24', filename: 'VID-20231103-WA0056.mp4', storagePath: '/manus-storage/VID-20231103-WA0056_d8a6605b.mp4', title: 'Sandwich (Pute)', titleAr: 'ساندويش الديك الرومي', duration: 59, type: 'recipe' },
];

// ============================================================
// TRAININGSPLAN (4-Tage-Split)
// ============================================================
export const DEFAULT_WORKOUT_PLAN: WorkoutDay[] = [
  {
    id: 'day1',
    dayNumber: 1,
    nameAr: 'اليوم الأول',
    nameDe: 'Tag 1',
    muscleGroupAr: 'الظهر والبايسبس',
    muscleGroupDe: 'Rücken & Bizeps',
    exercises: [
      { id: 'e01', nameAr: 'تمرين اللات', nameDe: 'Latziehen', sets: 4, reps: '10-12', videoId: 'v09' },
      { id: 'e02', nameAr: 'تجديف جالساً', nameDe: 'Sitzendes Rudern', sets: 4, reps: '10-12', videoId: 'v10' },
      { id: 'e03', nameAr: 'تجديف منحنياً', nameDe: 'Vorgebeugtes Rudern', sets: 3, reps: '10-12', videoId: 'v11' },
      { id: 'e04', nameAr: 'تجديف T-Bar', nameDe: 'T-Bar Rudern', sets: 3, reps: '10-12', videoId: 'v12' },
      { id: 'e05', nameAr: 'تجديف بيد واحدة', nameDe: 'Einarmiges Rudern', sets: 3, reps: '10-12', videoId: 'v06' },
      { id: 'e06', nameAr: 'تمرين البايسبس بالدمبل', nameDe: 'Kurzhantel-Bizepscurls', sets: 4, reps: '10-12', videoId: 'v14' },
      { id: 'e07', nameAr: 'تمرين البايسبس بالبار الملتوي', nameDe: 'Bizeps-Curls SZ-Stange', sets: 3, reps: '10-12', videoId: 'v24' },
      { id: 'e08', nameAr: 'تمرين البايسبس', nameDe: 'Bizepscurls', sets: 3, reps: '10-12', videoId: 'v02' },
    ],
  },
  {
    id: 'day2',
    dayNumber: 2,
    nameAr: 'اليوم الثاني',
    nameDe: 'Tag 2',
    muscleGroupAr: 'الصدر والترايسبس',
    muscleGroupDe: 'Brust & Trizeps',
    exercises: [
      { id: 'e09', nameAr: 'ضغط الصدر المائل بالبار', nameDe: 'Schrägbankdrücken (Langhantel)', sets: 4, reps: '8-10', videoId: 'v17' },
      { id: 'e10', nameAr: 'ضغط الصدر المائل بالدمبل', nameDe: 'Schrägbankdrücken (Kurzhanteln)', sets: 3, reps: '10-12', videoId: 'v18' },
      { id: 'e11', nameAr: 'تمرين الصدر بالكابل', nameDe: 'Brustübung Kabelzug', sets: 3, reps: '12-15', videoId: 'v19' },
      { id: 'e12', nameAr: 'تمرين الفراشة', nameDe: 'Butterfly', sets: 3, reps: '12-15', videoId: 'v20' },
      { id: 'e13', nameAr: 'تمرين الديبس', nameDe: 'Dips', sets: 3, reps: '10-12', videoId: 'v21' },
      { id: 'e14', nameAr: 'ضغط الترايسبس بالكابل', nameDe: 'Trizepsdrücken Kabelzug', sets: 4, reps: '12-15', videoId: 'v03' },
      { id: 'e15', nameAr: 'ضغط الترايسبس مستلقياً', nameDe: 'Trizepsdrücken liegend', sets: 3, reps: '10-12', videoId: 'v22' },
    ],
  },
  {
    id: 'day3',
    dayNumber: 3,
    nameAr: 'اليوم الثالث',
    nameDe: 'Tag 3',
    muscleGroupAr: 'الأرجل والبطن',
    muscleGroupDe: 'Beine & Bauch',
    exercises: [
      { id: 'e16', nameAr: 'القرفصاء', nameDe: 'Kniebeugen', sets: 4, reps: '8-10', videoId: 'v25' },
      { id: 'e17', nameAr: 'خطوات الانقضاض', nameDe: 'Ausfallschritte', sets: 3, reps: '10-12', videoId: 'v26' },
      { id: 'e18', nameAr: 'ضغط الساق', nameDe: 'Beinpresse', sets: 4, reps: '10-12', videoId: 'v28' },
      { id: 'e19', nameAr: 'مد الساق', nameDe: 'Beinstrecken', sets: 3, reps: '12-15', videoId: 'v27' },
      { id: 'e20', nameAr: 'ثني الركبة جالساً', nameDe: 'Beinbeuger sitzend', sets: 3, reps: '12-15', videoId: 'v01' },
      { id: 'e21', nameAr: 'ثني الركبة مستلقياً', nameDe: 'Beinbeuger liegend', sets: 3, reps: '12-15', videoId: 'v08' },
      { id: 'e22', nameAr: 'رفع الكعب', nameDe: 'Wadenheben', sets: 4, reps: '15-20', videoId: 'v07' },
    ],
  },
  {
    id: 'day4',
    dayNumber: 4,
    nameAr: 'اليوم الرابع',
    nameDe: 'Tag 4',
    muscleGroupAr: 'الكتف والكارديو',
    muscleGroupDe: 'Schultern & Cardio',
    exercises: [
      { id: 'e23', nameAr: 'ضغط الكتف', nameDe: 'Schulterdrücken', sets: 4, reps: '10-12', videoId: 'v13' },
      { id: 'e24', nameAr: 'رفع جانبي للكتف', nameDe: 'Seitheben', sets: 4, reps: '12-15', videoId: 'v05' },
      { id: 'e25', nameAr: 'رفع أمامي', nameDe: 'Frontheben', sets: 3, reps: '12-15', videoId: 'v16' },
      { id: 'e26', nameAr: 'رفع الكتفين', nameDe: 'Shrugs', sets: 3, reps: '12-15', videoId: 'v15' },
    ],
  },
];

// ============================================================
// REZEPTE (24 Rezepte - wöchentliche Rotation)
// ============================================================
export const DEFAULT_RECIPES: Recipe[] = [
  { id: 'rec01', nameAr: 'أسياخ الدجاج', nameDe: 'Hähnchenspieße', calories: 380, protein: 42, carbs: 15, fat: 12, mealType: 'lunch', mealTypeAr: 'غداء', videoId: 'r01', weekDay: 0 },
  { id: 'rec02', nameAr: 'لحم العجل مع الفطر', nameDe: 'Kalbfleisch mit Champignons', calories: 450, protein: 45, carbs: 20, fat: 18, mealType: 'dinner', mealTypeAr: 'عشاء', videoId: 'r02', weekDay: 0 },
  { id: 'rec03', nameAr: 'بيتزا الدجاج', nameDe: 'Hähnchen-Pizza', calories: 420, protein: 50, carbs: 18, fat: 14, mealType: 'lunch', mealTypeAr: 'غداء', videoId: 'r03', weekDay: 1 },
  { id: 'rec04', nameAr: 'سمك السلمون مع الهليون', nameDe: 'Lachs mit Spargel', calories: 390, protein: 38, carbs: 12, fat: 20, mealType: 'dinner', mealTypeAr: 'عشاء', videoId: 'r04', weekDay: 1 },
  { id: 'rec05', nameAr: 'شيك زيادة الوزن', nameDe: 'Weight Gainer Shake', calories: 600, protein: 40, carbs: 80, fat: 10, mealType: 'shake', mealTypeAr: 'شيك', videoId: 'r05', weekDay: 2 },
  { id: 'rec06', nameAr: 'كباب صحي', nameDe: 'Gesunder Kebab', calories: 400, protein: 45, carbs: 22, fat: 12, mealType: 'lunch', mealTypeAr: 'غداء', videoId: 'r06', weekDay: 2 },
  { id: 'rec07', nameAr: 'دجاج مع البطاطس والهليون', nameDe: 'Hähnchen mit Kartoffeln', calories: 480, protein: 42, carbs: 45, fat: 10, mealType: 'dinner', mealTypeAr: 'عشاء', videoId: 'r07', weekDay: 2 },
  { id: 'rec08', nameAr: 'سلطة الفاكهة', nameDe: 'Obstsalat', calories: 180, protein: 3, carbs: 42, fat: 1, mealType: 'snack', mealTypeAr: 'وجبة خفيفة', videoId: 'r08', weekDay: 3 },
  { id: 'rec09', nameAr: 'باستا بالدجاج', nameDe: 'Pasta mit Hähnchen', calories: 520, protein: 40, carbs: 55, fat: 12, mealType: 'lunch', mealTypeAr: 'غداء', videoId: 'r09', weekDay: 3 },
  { id: 'rec10', nameAr: 'شاورما صحية', nameDe: 'Gesundes Shawarma', calories: 430, protein: 38, carbs: 35, fat: 14, mealType: 'dinner', mealTypeAr: 'عشاء', videoId: 'r10', weekDay: 3 },
  { id: 'rec11', nameAr: 'سلطة الدجاج', nameDe: 'Hähnchensalat', calories: 320, protein: 35, carbs: 18, fat: 10, mealType: 'lunch', mealTypeAr: 'غداء', videoId: 'r11', weekDay: 4 },
  { id: 'rec12', nameAr: 'صدر الدجاج مع الخضار والأرز', nameDe: 'Hähnchenbrust mit Gemüse', calories: 460, protein: 48, carbs: 40, fat: 8, mealType: 'dinner', mealTypeAr: 'عشاء', videoId: 'r12', weekDay: 4 },
  { id: 'rec13', nameAr: 'فيليه السمك المقلي', nameDe: 'Gebratenes Fischfilet', calories: 350, protein: 36, carbs: 22, fat: 12, mealType: 'lunch', mealTypeAr: 'غداء', videoId: 'r13', weekDay: 5 },
  { id: 'rec14', nameAr: 'برغر الدجاج', nameDe: 'Hähnchen-Burger', calories: 480, protein: 42, carbs: 38, fat: 16, mealType: 'lunch', mealTypeAr: 'غداء', videoId: 'r17', weekDay: 5 },
  { id: 'rec15', nameAr: 'أوتاد البطاطس', nameDe: 'Kartoffelspalten', calories: 220, protein: 4, carbs: 45, fat: 3, mealType: 'snack', mealTypeAr: 'وجبة خفيفة', videoId: 'r18', weekDay: 5 },
  { id: 'rec16', nameAr: 'ساندويش', nameDe: 'Sandwich', calories: 380, protein: 30, carbs: 35, fat: 12, mealType: 'breakfast', mealTypeAr: 'فطور', videoId: 'r19', weekDay: 6 },
  { id: 'rec17', nameAr: 'فلفل محشي', nameDe: 'Gefüllte Paprika', calories: 420, protein: 35, carbs: 28, fat: 16, mealType: 'dinner', mealTypeAr: 'عشاء', videoId: 'r20', weekDay: 6 },
  { id: 'rec18', nameAr: 'وعاء البروتين', nameDe: 'Protein-Bowl', calories: 450, protein: 38, carbs: 50, fat: 8, mealType: 'breakfast', mealTypeAr: 'فطور', videoId: 'r21', weekDay: 0 },
  { id: 'rec19', nameAr: 'بدائل الإفطار', nameDe: 'Frühstück Alternativen', calories: 280, protein: 15, carbs: 42, fat: 6, mealType: 'breakfast', mealTypeAr: 'فطور', videoId: 'r22', weekDay: 1 },
  { id: 'rec20', nameAr: 'تونة مع الهليون', nameDe: 'Thunfisch mit Spargel', calories: 290, protein: 35, carbs: 10, fat: 12, mealType: 'lunch', mealTypeAr: 'غداء', videoId: 'r23', weekDay: 2 },
  { id: 'rec21', nameAr: 'ساندويش الديك الرومي', nameDe: 'Sandwich (Pute)', calories: 360, protein: 32, carbs: 32, fat: 10, mealType: 'breakfast', mealTypeAr: 'فطور', videoId: 'r24', weekDay: 3 },
  { id: 'rec22', nameAr: 'تحضير أسياخ الدجاج', nameDe: 'Hähnchenspieße (Vorbereitung)', calories: 380, protein: 42, carbs: 15, fat: 12, mealType: 'lunch', mealTypeAr: 'غداء', videoId: 'r14', weekDay: 4 },
  { id: 'rec23', nameAr: 'نصائح غذائية', nameDe: 'Ernährungstipps', calories: 0, protein: 0, carbs: 0, fat: 0, mealType: 'snack', mealTypeAr: 'نصائح', videoId: 'r16', weekDay: 5 },
  { id: 'rec24', nameAr: 'شوي أسياخ الدجاج', nameDe: 'Hähnchenspieße (Braten)', calories: 380, protein: 42, carbs: 15, fat: 12, mealType: 'lunch', mealTypeAr: 'غداء', videoId: 'r15', weekDay: 6 },
];

// ============================================================
// VITAMINE & SUPPLEMENTS
// ============================================================
export const DEFAULT_VITAMINS: Vitamin[] = [
  { id: 'vit01', nameAr: 'كرياتين', nameDe: 'Kreatin', dose: '5g', timeAr: 'بعد التمرين', timeDe: 'Nach dem Training', hour: 12, minute: 0, color: '#FF6B35' },
  { id: 'vit02', nameAr: 'بروتين واي', nameDe: 'Whey Protein', dose: '30g', timeAr: 'بعد التمرين', timeDe: 'Nach dem Training', hour: 12, minute: 30, color: '#004E89' },
  { id: 'vit03', nameAr: 'أوميغا 3', nameDe: 'Omega 3', dose: '2 Kapseln', timeAr: 'مع الغداء', timeDe: 'Zum Mittagessen', hour: 13, minute: 0, color: '#F7B801' },
  { id: 'vit04', nameAr: 'فيتامين D3', nameDe: 'Vitamin D3', dose: '5000 IU', timeAr: 'الصباح', timeDe: 'Morgens', hour: 8, minute: 0, color: '#22C55E' },
  { id: 'vit05', nameAr: 'فيتامين C', nameDe: 'Vitamin C', dose: '1000mg', timeAr: 'الصباح', timeDe: 'Morgens', hour: 8, minute: 30, color: '#EF4444' },
  { id: 'vit06', nameAr: 'زنك', nameDe: 'Zink', dose: '25mg', timeAr: 'المساء', timeDe: 'Abends', hour: 20, minute: 0, color: '#8B5CF6' },
  { id: 'vit07', nameAr: 'ماغنيسيوم', nameDe: 'Magnesium', dose: '400mg', timeAr: 'قبل النوم', timeDe: 'Vor dem Schlafen', hour: 22, minute: 0, color: '#06B6D4' },
];

// ============================================================
// STANDARD TÄGLICHE AUFGABEN
// ============================================================
export const DEFAULT_DAILY_TASKS: DailyTask[] = [
  // صباح (Morgen)
  { id: 'task01', nameAr: 'الاستيقاظ', nameDe: 'Aufwachen', categoryAr: 'صباح', categoryDe: 'Morgen', time: '06:00', order: 1, color: '#F7B801' },
  { id: 'task02', nameAr: 'الاستحمام', nameDe: 'Duschen', categoryAr: 'صباح', categoryDe: 'Morgen', time: '06:15', duration: 20, order: 2, color: '#3B82F6' },
  { id: 'task03', nameAr: 'الإفطار', nameDe: 'Frühstück', categoryAr: 'طعام', categoryDe: 'Essen', time: '06:45', duration: 20, order: 3, color: '#22C55E' },
  { id: 'task04', nameAr: 'شرب الماء', nameDe: 'Wasser trinken', categoryAr: 'صباح', categoryDe: 'Morgen', time: '07:00', order: 4, color: '#3B82F6' },
  { id: 'task05', nameAr: 'الفيتامينات الصباحية', nameDe: 'Vitamine (Morgens)', categoryAr: 'صحة', categoryDe: 'Gesundheit', time: '07:15', order: 5, color: '#F59E0B' },
  
  // تنظيف (Haushalt)
  { id: 'task06', nameAr: 'ترتيب السرير', nameDe: 'Bett machen', categoryAr: 'تنظيف', categoryDe: 'Haushalt', time: '07:30', duration: 10, order: 6, color: '#8B5CF6' },
  { id: 'task07', nameAr: 'تنظيف الغرفة', nameDe: 'Zimmer aufräumen', categoryAr: 'تنظيف', categoryDe: 'Haushalt', time: '07:45', duration: 15, order: 7, color: '#8B5CF6' },
  { id: 'task08', nameAr: 'غسل الأطباق', nameDe: 'Geschirr spülen', categoryAr: 'تنظيف', categoryDe: 'Haushalt', time: '08:00', duration: 15, order: 8, color: '#8B5CF6' },
  
  // غداء (Mittagessen)
  { id: 'task09', nameAr: 'الغداء', nameDe: 'Mittagessen', categoryAr: 'طعام', categoryDe: 'Essen', time: '13:00', duration: 30, order: 9, color: '#22C55E' },
  { id: 'task10', nameAr: 'شرب الماء بعد الغداء', nameDe: 'Wasser nach Mittagessen', categoryAr: 'صحة', categoryDe: 'Gesundheit', time: '13:30', order: 10, color: '#3B82F6' },
  
  // مساء (Abend)
  { id: 'task11', nameAr: 'العشاء', nameDe: 'Abendessen', categoryAr: 'طعام', categoryDe: 'Essen', time: '19:00', duration: 30, order: 11, color: '#22C55E' },
  { id: 'task12', nameAr: 'الفيتامينات المسائية', nameDe: 'Vitamine (Abends)', categoryAr: 'صحة', categoryDe: 'Gesundheit', time: '20:00', order: 12, color: '#F59E0B' },
  { id: 'task13', nameAr: 'شرب الماء قبل النوم', nameDe: 'Wasser vor dem Schlafengehen', categoryAr: 'صحة', categoryDe: 'Gesundheit', time: '22:00', order: 13, color: '#3B82F6' },
  { id: 'task14', nameAr: 'الاستعداد للنوم', nameDe: 'Schlafvorbereitung', categoryAr: 'مساء', categoryDe: 'Abend', time: '22:30', duration: 30, order: 14, color: '#06B6D4' },
  { id: 'task15', nameAr: 'النوم', nameDe: 'Schlafen', categoryAr: 'مساء', categoryDe: 'Abend', time: '23:00', order: 15, color: '#06B6D4' },
];

// ============================================================
// DEFAULT USER SETTINGS
// ============================================================
export const DEFAULT_USER_SETTINGS: UserSettings = {
  trainingDays: [0, 2, 4, 6], // Sonntag, Dienstag, Donnerstag, Samstag
  trainingDayOrder: ['day1', 'day2', 'day3', 'day4'],
  wakeUpTime: '06:00',
  sleepTime: '23:00',
  waterGoal: 3000,
};
