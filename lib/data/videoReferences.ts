// Video-Referenzen und Metadaten
// Die Videos werden von einem externen Server geladen

export interface VideoReference {
  id: string;
  filename: string;
  exercise?: string;
  recipe?: string;
  duration?: number;
  size?: number;
}

export const videoReferences: VideoReference[] = [
  { id: 'vid_1', filename: 'VID-20231103-WA0002.mp4', exercise: 'Latziehen' },
  { id: 'vid_2', filename: 'VID-20231103-WA0003.mp4', exercise: 'Rudern' },
  { id: 'vid_3', filename: 'VID-20231103-WA0004.mp4', exercise: 'Einarmiges Rudern' },
  { id: 'vid_4', filename: 'VID-20231103-WA0005.mp4', exercise: 'Langhantel-Rudern' },
  { id: 'vid_5', filename: 'VID-20231103-WA0006.mp4', exercise: 'Reverse Flys' },
  { id: 'vid_6', filename: 'VID-20231103-WA0007.mp4', exercise: 'Langhantel-Curls' },
  { id: 'vid_7', filename: 'VID-20231103-WA0008.mp4', exercise: 'Hammer-Curls' },
  { id: 'vid_8', filename: 'VID-20231103-WA0009.mp4', exercise: 'Konzentrations-Curls' },
  { id: 'vid_9', filename: 'VID-20231103-WA0010.mp4', exercise: 'Bankdrücken' },
  { id: 'vid_10', filename: 'VID-20231103-WA0011.mp4', exercise: 'Kurzhantel-Drücken' },
  { id: 'vid_11', filename: 'VID-20231103-WA0012.mp4', exercise: 'Fliegende' },
  { id: 'vid_12', filename: 'VID-20231103-WA0013.mp4', exercise: 'Langhantel-Bankdrücken' },
  { id: 'vid_13', filename: 'VID-20231103-WA0014.mp4', exercise: 'Cable Flys' },
  { id: 'vid_14', filename: 'VID-20231103-WA0015.mp4', exercise: 'Dips' },
  { id: 'vid_15', filename: 'VID-20231103-WA0016.mp4', exercise: 'Butterfly' },
  { id: 'vid_16', filename: 'VID-20231103-WA0017.mp4', exercise: 'Skull Crusher' },
  { id: 'vid_17', filename: 'VID-20231103-WA0018.mp4', exercise: 'Trizeps-Drücken' },
  { id: 'vid_18', filename: 'VID-20231103-WA0019.mp4', exercise: 'Einarmiges Trizeps-Drücken' },
  { id: 'vid_19', filename: 'VID-20231103-WA0020.mp4', exercise: 'Kniebeugen' },
  { id: 'vid_20', filename: 'VID-20231103-WA0021.mp4', exercise: 'Ausfallschritte' },
  { id: 'vid_21', filename: 'VID-20231103-WA0022.mp4', exercise: 'Beinpresse' },
  { id: 'vid_22', filename: 'VID-20231103-WA0023.mp4', exercise: 'Beinstrecker' },
  { id: 'vid_23', filename: 'VID-20231103-WA0024.mp4', exercise: 'Beinbeuger' },
  { id: 'vid_24', filename: 'VID-20231103-WA0025.mp4', exercise: 'Wadenheben' },
  { id: 'vid_25', filename: 'VID-20231103-WA0026.mp4', exercise: 'Beinheben' },
  { id: 'vid_26', filename: 'VID-20231103-WA0027.mp4', exercise: 'Crunches' },
  { id: 'vid_27', filename: 'VID-20231103-WA0028.mp4', exercise: 'Schulterdrücken' },
  { id: 'vid_28', filename: 'VID-20231103-WA0029.mp4', exercise: 'Schulterdrücken Hantel' },
  { id: 'vid_29', filename: 'VID-20231103-WA0030.mp4', exercise: 'Seitheben' },
  { id: 'vid_30', filename: 'VID-20231103-WA0031.mp4', exercise: 'Frontheben' },
  { id: 'vid_31', filename: 'VID-20231103-WA0032.mp4', exercise: 'Aufrechtes Rudern' },
  { id: 'vid_32', filename: 'VID-20231103-WA0033.mp4', exercise: 'Face Pulls' },
  // Rezept-Videos (ab hier)
  { id: 'vid_33', filename: 'VID-20231103-WA0034.mp4', recipe: 'Rezept 1' },
  { id: 'vid_34', filename: 'VID-20231103-WA0035.mp4', recipe: 'Rezept 2' },
  { id: 'vid_35', filename: 'VID-20231103-WA0036.mp4', recipe: 'Rezept 3' },
  { id: 'vid_36', filename: 'VID-20231103-WA0037.mp4', recipe: 'Rezept 4' },
  { id: 'vid_37', filename: 'VID-20231103-WA0038.mp4', recipe: 'Rezept 5' },
  { id: 'vid_38', filename: 'VID-20231103-WA0039.mp4', recipe: 'Rezept 6' },
  { id: 'vid_39', filename: 'VID-20231103-WA0040.mp4', recipe: 'Rezept 7' },
  { id: 'vid_40', filename: 'VID-20231103-WA0042.mp4', recipe: 'Rezept 8' },
  { id: 'vid_41', filename: 'VID-20231103-WA0043.mp4', recipe: 'Rezept 9' },
  { id: 'vid_42', filename: 'VID-20231103-WA0044.mp4', recipe: 'Rezept 10' },
  { id: 'vid_43', filename: 'VID-20231103-WA0045.mp4', recipe: 'Rezept 11' },
  { id: 'vid_44', filename: 'VID-20231103-WA0046.mp4', recipe: 'Rezept 12' },
  { id: 'vid_45', filename: 'VID-20231103-WA0047.mp4', recipe: 'Rezept 13' },
  { id: 'vid_46', filename: 'VID-20231103-WA0048.mp4', recipe: 'Rezept 14' },
  { id: 'vid_47', filename: 'VID-20231103-WA0049.mp4', recipe: 'Rezept 15' },
  { id: 'vid_48', filename: 'VID-20231103-WA0051.mp4', recipe: 'Rezept 16' },
  { id: 'vid_49', filename: 'VID-20231103-WA0052.mp4', recipe: 'Rezept 17' },
  { id: 'vid_50', filename: 'VID-20231103-WA0053.mp4', recipe: 'Rezept 18' },
  { id: 'vid_51', filename: 'VID-20231103-WA0054.mp4', recipe: 'Rezept 19' },
  { id: 'vid_52', filename: 'VID-20231103-WA0056.mp4', recipe: 'Rezept 20' },
];

// Hole Video-Referenz nach Dateiname
export function getVideoByFilename(filename: string): VideoReference | undefined {
  return videoReferences.find(v => v.filename === filename);
}

// Hole Video-Referenzen für eine Übung
export function getVideosForExercise(exerciseName: string): VideoReference[] {
  return videoReferences.filter(v => 
    v.exercise && v.exercise.toLowerCase().includes(exerciseName.toLowerCase())
  );
}

// Hole Video-Referenzen für ein Rezept
export function getVideosForRecipe(recipeName: string): VideoReference[] {
  return videoReferences.filter(v => 
    v.recipe && v.recipe.toLowerCase().includes(recipeName.toLowerCase())
  );
}
