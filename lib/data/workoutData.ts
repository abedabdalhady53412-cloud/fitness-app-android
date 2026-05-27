// Trainingsplan und Übungsdaten
export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  sets: number;
  reps: string;
  video_url?: string;
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  day_number: number;
  day_name: string;
  muscle_focus: string;
  exercises: Exercise[];
  cardio?: {
    type: string;
    duration: number; // in minutes
  };
}

export const workoutPlan: WorkoutDay[] = [
  {
    id: 'day1',
    day_number: 1,
    day_name: 'Montag',
    muscle_focus: 'Rücken & Bizeps',
    exercises: [
      {
        id: 'ex1_1',
        name: 'Latziehen',
        muscle_group: 'Rücken',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0002.mp4',
      },
      {
        id: 'ex1_2',
        name: 'Rudern (Kabel)',
        muscle_group: 'Rücken',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0003.mp4',
      },
      {
        id: 'ex1_3',
        name: 'Einarmiges Rudern (Hantel)',
        muscle_group: 'Rücken',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0004.mp4',
      },
      {
        id: 'ex1_4',
        name: 'Langhantel-Rudern',
        muscle_group: 'Rücken',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0005.mp4',
      },
      {
        id: 'ex1_5',
        name: 'Reverse Flys',
        muscle_group: 'Rücken',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0006.mp4',
      },
      {
        id: 'ex1_6',
        name: 'Langhantel-Curls',
        muscle_group: 'Bizeps',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0007.mp4',
      },
      {
        id: 'ex1_7',
        name: 'Hammer-Curls',
        muscle_group: 'Bizeps',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0008.mp4',
      },
      {
        id: 'ex1_8',
        name: 'Konzentrations-Curls',
        muscle_group: 'Bizeps',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0009.mp4',
      },
    ],
    cardio: {
      type: 'Treppensteiger',
      duration: 20,
    },
  },
  {
    id: 'day2',
    day_number: 2,
    day_name: 'Dienstag',
    muscle_focus: 'Brust & Trizeps',
    exercises: [
      {
        id: 'ex2_1',
        name: 'Bankdrücken (Schrägbank)',
        muscle_group: 'Brust',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0010.mp4',
      },
      {
        id: 'ex2_2',
        name: 'Kurzhantel-Drücken',
        muscle_group: 'Brust',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0011.mp4',
      },
      {
        id: 'ex2_3',
        name: 'Fliegende (Hantel)',
        muscle_group: 'Brust',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0012.mp4',
      },
      {
        id: 'ex2_4',
        name: 'Langhantel-Bankdrücken',
        muscle_group: 'Brust',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0013.mp4',
      },
      {
        id: 'ex2_5',
        name: 'Cable Flys',
        muscle_group: 'Brust',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0014.mp4',
      },
      {
        id: 'ex2_6',
        name: 'Dips/Maschine',
        muscle_group: 'Trizeps',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0015.mp4',
      },
      {
        id: 'ex2_7',
        name: 'Butterfly',
        muscle_group: 'Brust',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0016.mp4',
      },
      {
        id: 'ex2_8',
        name: 'Skull Crusher',
        muscle_group: 'Trizeps',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0017.mp4',
      },
      {
        id: 'ex2_9',
        name: 'Trizeps-Drücken (Kabel)',
        muscle_group: 'Trizeps',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0018.mp4',
      },
      {
        id: 'ex2_10',
        name: 'Einarmiges Trizeps-Drücken',
        muscle_group: 'Trizeps',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0019.mp4',
      },
    ],
    cardio: {
      type: 'Laufband',
      duration: 30,
    },
  },
  {
    id: 'day3',
    day_number: 3,
    day_name: 'Mittwoch',
    muscle_focus: 'Beine & Bauch',
    exercises: [
      {
        id: 'ex3_1',
        name: 'Kniebeugen',
        muscle_group: 'Beine',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0020.mp4',
      },
      {
        id: 'ex3_2',
        name: 'Ausfallschritte',
        muscle_group: 'Beine',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0021.mp4',
      },
      {
        id: 'ex3_3',
        name: 'Beinpresse',
        muscle_group: 'Beine',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0022.mp4',
      },
      {
        id: 'ex3_4',
        name: 'Beinstrecker',
        muscle_group: 'Beine',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0023.mp4',
      },
      {
        id: 'ex3_5',
        name: 'Beinbeuger',
        muscle_group: 'Beine',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0024.mp4',
      },
      {
        id: 'ex3_6',
        name: 'Wadenheben',
        muscle_group: 'Beine',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0025.mp4',
      },
      {
        id: 'ex3_7',
        name: 'Beinheben (liegend)',
        muscle_group: 'Bauch',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0026.mp4',
      },
      {
        id: 'ex3_8',
        name: 'Crunches',
        muscle_group: 'Bauch',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0027.mp4',
      },
    ],
  },
  {
    id: 'day4',
    day_number: 4,
    day_name: 'Donnerstag',
    muscle_focus: 'Schultern & Cardio',
    exercises: [
      {
        id: 'ex4_1',
        name: 'Schulterdrücken (Maschine)',
        muscle_group: 'Schultern',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0028.mp4',
      },
      {
        id: 'ex4_2',
        name: 'Schulterdrücken (Hantel)',
        muscle_group: 'Schultern',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0029.mp4',
      },
      {
        id: 'ex4_3',
        name: 'Seitheben',
        muscle_group: 'Schultern',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0030.mp4',
      },
      {
        id: 'ex4_4',
        name: 'Frontheben',
        muscle_group: 'Schultern',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0031.mp4',
      },
      {
        id: 'ex4_5',
        name: 'Aufrechtes Rudern',
        muscle_group: 'Schultern',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0032.mp4',
      },
      {
        id: 'ex4_6',
        name: 'Face Pulls',
        muscle_group: 'Schultern',
        sets: 3,
        reps: '8-10-12',
        video_url: 'VID-20231103-WA0033.mp4',
      },
    ],
    cardio: {
      type: 'Laufband',
      duration: 30,
    },
  },
];
