import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/hooks/use-app-store";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState, useCallback } from "react";
import type { Video, Exercise, Recipe, Vitamin, WorkoutDay } from "@/lib/data/appData";

type ManageSection = 'main' | 'videos' | 'workout' | 'recipes' | 'vitamins';

export default function ManageScreen() {
  const colors = useColors();
  const store = useAppStore();
  const [section, setSection] = useState<ManageSection>('main');
  const [editModal, setEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [editType, setEditType] = useState<'video' | 'exercise' | 'recipe' | 'vitamin' | 'day'>('video');
  const [selectedDayId, setSelectedDayId] = useState<string>('day1');

  const s = styles(colors);

  // ---- رئيسية ----
  if (section === 'main') {
    return (
      <ScreenContainer containerClassName="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={s.header}>
            <Text style={s.headerTitle}>الإدارة ⚙️</Text>
            <Text style={s.headerSub}>تحكم كامل في كل شيء</Text>
          </View>
          <View style={s.content}>
            {[
              { key: 'videos', icon: 'video.fill', title: 'إدارة الفيديوهات', sub: `${store.videos.length} فيديو`, color: '#8B5CF6' },
              { key: 'workout', icon: 'dumbbell.fill', title: 'إدارة خطة التمرين', sub: `${store.workoutPlan.length} أيام`, color: '#FF6B35' },
              { key: 'recipes', icon: 'fork.knife', title: 'إدارة الوصفات', sub: `${store.recipes.length} وصفة`, color: '#22C55E' },
              { key: 'vitamins', icon: 'pills.fill', title: 'إدارة الفيتامينات', sub: `${store.vitamins.length} مكمل`, color: '#F59E0B' },
            ].map((item) => (
              <TouchableOpacity key={item.key} style={s.menuCard} onPress={() => setSection(item.key as ManageSection)}>
                <View style={[s.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <IconSymbol name={item.icon as any} size={26} color={item.color} />
                </View>
                <View style={s.menuInfo}>
                  <Text style={s.menuTitle}>{item.title}</Text>
                  <Text style={s.menuSub}>{item.sub}</Text>
                </View>
                <IconSymbol name="chevron.right" size={18} color={colors.muted} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={s.resetCard} onPress={() => {
              Alert.alert('إعادة الضبط', 'هل تريد إعادة ضبط جميع البيانات للإعدادات الافتراضية؟', [
                { text: 'إلغاء', style: 'cancel' },
                { text: 'نعم، إعادة الضبط', style: 'destructive', onPress: store.resetToDefaults },
              ]);
            }}>
              <IconSymbol name="arrow.left" size={18} color="#EF4444" />
              <Text style={s.resetCardText}>إعادة ضبط جميع البيانات</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ---- إدارة الفيديوهات ----
  if (section === 'videos') {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={s.subHeader}>
          <TouchableOpacity style={s.backBtn} onPress={() => setSection('main')}>
            <IconSymbol name="arrow.left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={s.subHeaderTitle}>إدارة الفيديوهات</Text>
        </View>
        <FlatList
          data={store.videos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <View style={s.listCard}>
              <View style={[s.listIcon, { backgroundColor: item.type === 'exercise' ? '#FF6B35' + '20' : '#22C55E' + '20' }]}>
                <IconSymbol name={item.type === 'exercise' ? 'dumbbell.fill' : 'fork.knife'} size={18} color={item.type === 'exercise' ? '#FF6B35' : '#22C55E'} />
              </View>
              <View style={s.listInfo}>
                <Text style={s.listTitle}>{item.titleAr}</Text>
                <Text style={s.listSub}>{item.filename} • {item.duration}s</Text>
                <Text style={[s.listBadge, { color: item.type === 'exercise' ? '#FF6B35' : '#22C55E' }]}>
                  {item.type === 'exercise' ? 'تمرين' : 'وصفة'}
                </Text>
              </View>
              <View style={s.listActions}>
                <TouchableOpacity style={s.editBtn} onPress={() => {
                  setEditTarget({ ...item });
                  setEditType('video');
                  setEditModal(true);
                }}>
                  <IconSymbol name="pencil" size={16} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={s.deleteBtn} onPress={() => {
                  Alert.alert('حذف', `هل تريد حذف "${item.titleAr}"؟`, [
                    { text: 'إلغاء', style: 'cancel' },
                    { text: 'حذف', style: 'destructive', onPress: () => store.deleteVideo(item.id) },
                  ]);
                }}>
                  <IconSymbol name="trash.fill" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        {editModal && editType === 'video' && editTarget && (
          <VideoEditModal
            video={editTarget}
            colors={colors}
            onSave={async (data) => {
              await store.updateVideo(editTarget.id, data);
              setEditModal(false);
            }}
            onClose={() => setEditModal(false)}
          />
        )}
      </ScreenContainer>
    );
  }

  // ---- إدارة خطة التمرين ----
  if (section === 'workout') {
    const currentDay = store.workoutPlan.find(d => d.id === selectedDayId) ?? store.workoutPlan[0];
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={s.subHeader}>
          <TouchableOpacity style={s.backBtn} onPress={() => setSection('main')}>
            <IconSymbol name="arrow.left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={s.subHeaderTitle}>إدارة خطة التمرين</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.daySelector} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {store.workoutPlan.map((day) => (
            <TouchableOpacity
              key={day.id}
              style={[s.dayTab, selectedDayId === day.id && s.dayTabActive]}
              onPress={() => setSelectedDayId(day.id)}
            >
              <Text style={[s.dayTabText, selectedDayId === day.id && s.dayTabTextActive]}>{day.nameAr}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <FlatList
          data={currentDay?.exercises ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          ListHeaderComponent={
            <View style={{ marginBottom: 10 }}>
              <Text style={s.dayGroupTitle}>{currentDay?.muscleGroupAr}</Text>
              <TouchableOpacity style={s.addBtn} onPress={() => {
                const newId = `e_${Date.now()}`;
                store.addExercise(selectedDayId, {
                  id: newId, nameAr: 'تمرين جديد', nameDe: 'Neue Übung', sets: 3, reps: '10-12',
                });
              }}>
                <IconSymbol name="plus" size={16} color="#fff" />
                <Text style={s.addBtnText}>إضافة تمرين</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item, index }) => {
            const video = store.getVideoById(item.videoId);
            return (
              <View style={s.listCard}>
                <View style={[s.listIcon, { backgroundColor: '#FF6B35' + '20' }]}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#FF6B35' }}>{index + 1}</Text>
                </View>
                <View style={s.listInfo}>
                  <Text style={s.listTitle}>{item.nameAr}</Text>
                  <Text style={s.listSub}>{item.sets} سيت × {item.reps} تكرار</Text>
                  <Text style={[s.listSub, { color: video ? '#22C55E' : '#EF4444' }]}>
                    {video ? `📹 ${video.titleAr}` : '⚠️ لا يوجد فيديو'}
                  </Text>
                </View>
                <View style={s.listActions}>
                  <TouchableOpacity style={s.editBtn} onPress={() => {
                    setEditTarget({ ...item, dayId: selectedDayId });
                    setEditType('exercise');
                    setEditModal(true);
                  }}>
                    <IconSymbol name="pencil" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.deleteBtn} onPress={() => {
                    Alert.alert('حذف', `هل تريد حذف "${item.nameAr}"؟`, [
                      { text: 'إلغاء', style: 'cancel' },
                      { text: 'حذف', style: 'destructive', onPress: () => store.deleteExercise(selectedDayId, item.id) },
                    ]);
                  }}>
                    <IconSymbol name="trash.fill" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
        {editModal && editType === 'exercise' && editTarget && (
          <ExerciseEditModal
            exercise={editTarget}
            videos={store.videos.filter(v => v.type === 'exercise')}
            colors={colors}
            onSave={async (data) => {
              await store.updateExercise(editTarget.dayId, editTarget.id, data);
              setEditModal(false);
            }}
            onClose={() => setEditModal(false)}
          />
        )}
      </ScreenContainer>
    );
  }

  // ---- إدارة الوصفات ----
  if (section === 'recipes') {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={s.subHeader}>
          <TouchableOpacity style={s.backBtn} onPress={() => setSection('main')}>
            <IconSymbol name="arrow.left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={s.subHeaderTitle}>إدارة الوصفات</Text>
        </View>
        <FlatList
          data={store.recipes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          ListHeaderComponent={
            <TouchableOpacity style={[s.addBtn, { marginBottom: 10 }]} onPress={() => {
              const newId = `rec_${Date.now()}`;
              store.addRecipe({
                id: newId, nameAr: 'وصفة جديدة', nameDe: 'Neues Rezept',
                calories: 400, protein: 30, carbs: 40, fat: 10,
                mealType: 'lunch', mealTypeAr: 'غداء', weekDay: 0,
              });
            }}>
              <IconSymbol name="plus" size={16} color="#fff" />
              <Text style={s.addBtnText}>إضافة وصفة</Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => {
            const video = store.getVideoById(item.videoId);
            const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
            return (
              <View style={s.listCard}>
                <View style={[s.listIcon, { backgroundColor: '#22C55E' + '20' }]}>
                  <IconSymbol name="fork.knife" size={18} color="#22C55E" />
                </View>
                <View style={s.listInfo}>
                  <Text style={s.listTitle}>{item.nameAr}</Text>
                  <Text style={s.listSub}>{item.mealTypeAr} • {DAYS_AR[item.weekDay ?? 0]}</Text>
                  <Text style={[s.listSub, { color: video ? '#22C55E' : '#EF4444' }]}>
                    {video ? `📹 ${video.titleAr}` : '⚠️ لا يوجد فيديو'}
                  </Text>
                </View>
                <View style={s.listActions}>
                  <TouchableOpacity style={s.editBtn} onPress={() => {
                    setEditTarget({ ...item });
                    setEditType('recipe');
                    setEditModal(true);
                  }}>
                    <IconSymbol name="pencil" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.deleteBtn} onPress={() => {
                    Alert.alert('حذف', `هل تريد حذف "${item.nameAr}"؟`, [
                      { text: 'إلغاء', style: 'cancel' },
                      { text: 'حذف', style: 'destructive', onPress: () => store.deleteRecipe(item.id) },
                    ]);
                  }}>
                    <IconSymbol name="trash.fill" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
        {editModal && editType === 'recipe' && editTarget && (
          <RecipeEditModal
            recipe={editTarget}
            videos={store.videos.filter(v => v.type === 'recipe')}
            colors={colors}
            onSave={async (data) => {
              await store.updateRecipe(editTarget.id, data);
              setEditModal(false);
            }}
            onClose={() => setEditModal(false)}
          />
        )}
      </ScreenContainer>
    );
  }

  // ---- إدارة الفيتامينات ----
  if (section === 'vitamins') {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={s.subHeader}>
          <TouchableOpacity style={s.backBtn} onPress={() => setSection('main')}>
            <IconSymbol name="arrow.left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={s.subHeaderTitle}>إدارة الفيتامينات</Text>
        </View>
        <FlatList
          data={store.vitamins}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <View style={s.listCard}>
              <View style={[s.vitaminDot, { backgroundColor: item.color }]} />
              <View style={s.listInfo}>
                <Text style={s.listTitle}>{item.nameAr}</Text>
                <Text style={s.listSub}>{item.dose} • {item.timeAr}</Text>
                <Text style={s.listSub}>{`${item.hour.toString().padStart(2, '0')}:${item.minute.toString().padStart(2, '0')}`}</Text>
              </View>
              <View style={s.listActions}>
                <TouchableOpacity style={s.editBtn} onPress={() => {
                  setEditTarget({ ...item });
                  setEditType('vitamin');
                  setEditModal(true);
                }}>
                  <IconSymbol name="pencil" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        {editModal && editType === 'vitamin' && editTarget && (
          <VitaminEditModal
            vitamin={editTarget}
            colors={colors}
            onSave={async (data) => {
              const updated = store.vitamins.map(v => v.id === editTarget.id ? { ...v, ...data } : v);
              await store.saveVitamins(updated);
              setEditModal(false);
            }}
            onClose={() => setEditModal(false)}
          />
        )}
      </ScreenContainer>
    );
  }

  return null;
}

// ---- مودال تعديل الفيديو ----
function VideoEditModal({ video, colors, onSave, onClose }: { video: Video; colors: any; onSave: (d: Partial<Video>) => void; onClose: () => void }) {
  const [titleAr, setTitleAr] = useState(video.titleAr);
  const [type, setType] = useState(video.type);
  const s = modalStyles(colors);
  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <View style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={onClose}><Text style={s.cancelText}>إلغاء</Text></TouchableOpacity>
          <Text style={s.title}>تعديل الفيديو</Text>
          <TouchableOpacity onPress={() => onSave({ titleAr, type })}><Text style={s.saveText}>حفظ</Text></TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.label}>الاسم بالعربي</Text>
          <TextInput style={s.input} value={titleAr} onChangeText={setTitleAr} textAlign="right" />
          <Text style={s.label}>النوع</Text>
          <View style={s.typeRow}>
            {(['exercise', 'recipe'] as const).map((t) => (
              <TouchableOpacity key={t} style={[s.typeBtn, type === t && s.typeBtnActive]} onPress={() => setType(t)}>
                <Text style={[s.typeBtnText, type === t && s.typeBtnTextActive]}>{t === 'exercise' ? 'تمرين' : 'وصفة'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ---- مودال تعديل التمرين ----
function ExerciseEditModal({ exercise, videos, colors, onSave, onClose }: { exercise: Exercise & { dayId: string }; videos: Video[]; colors: any; onSave: (d: Partial<Exercise>) => void; onClose: () => void }) {
  const [nameAr, setNameAr] = useState(exercise.nameAr);
  const [nameDe, setNameDe] = useState(exercise.nameDe);
  const [sets, setSets] = useState(String(exercise.sets));
  const [reps, setReps] = useState(exercise.reps);
  const [weight, setWeight] = useState(exercise.weight ?? '');
  const [videoId, setVideoId] = useState(exercise.videoId ?? '');
  const s = modalStyles(colors);
  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <View style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={onClose}><Text style={s.cancelText}>إلغاء</Text></TouchableOpacity>
          <Text style={s.title}>تعديل التمرين</Text>
          <TouchableOpacity onPress={() => onSave({ nameAr, nameDe, sets: parseInt(sets) || 3, reps, weight: weight || undefined, videoId: videoId || undefined })}>
            <Text style={s.saveText}>حفظ</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.label}>الاسم بالعربي</Text>
          <TextInput style={s.input} value={nameAr} onChangeText={setNameAr} textAlign="right" />
          <Text style={s.label}>الاسم بالألماني</Text>
          <TextInput style={s.input} value={nameDe} onChangeText={setNameDe} />
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>عدد السيتات</Text>
              <TextInput style={s.input} value={sets} onChangeText={setSets} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>التكرارات</Text>
              <TextInput style={s.input} value={reps} onChangeText={setReps} />
            </View>
          </View>
          <Text style={s.label}>الوزن (اختياري)</Text>
          <TextInput style={s.input} value={weight} onChangeText={setWeight} placeholder="مثال: 20kg" />
          <Text style={s.label}>الفيديو</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
            <TouchableOpacity style={[s.videoChip, !videoId && s.videoChipActive]} onPress={() => setVideoId('')}>
              <Text style={[s.videoChipText, !videoId && s.videoChipTextActive]}>بدون فيديو</Text>
            </TouchableOpacity>
            {videos.map((v) => (
              <TouchableOpacity key={v.id} style={[s.videoChip, videoId === v.id && s.videoChipActive]} onPress={() => setVideoId(v.id)}>
                <Text style={[s.videoChipText, videoId === v.id && s.videoChipTextActive]}>{v.titleAr}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ---- مودال تعديل الوصفة ----
function RecipeEditModal({ recipe, videos, colors, onSave, onClose }: { recipe: Recipe; videos: Video[]; colors: any; onSave: (d: Partial<Recipe>) => void; onClose: () => void }) {
  const [nameAr, setNameAr] = useState(recipe.nameAr);
  const [calories, setCalories] = useState(String(recipe.calories));
  const [protein, setProtein] = useState(String(recipe.protein));
  const [carbs, setCarbs] = useState(String(recipe.carbs));
  const [fat, setFat] = useState(String(recipe.fat));
  const [weekDay, setWeekDay] = useState(recipe.weekDay ?? 0);
  const [videoId, setVideoId] = useState(recipe.videoId ?? '');
  const [mealType, setMealType] = useState(recipe.mealType);
  const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const MEAL_TYPES = [{ key: 'breakfast', ar: 'فطور' }, { key: 'lunch', ar: 'غداء' }, { key: 'dinner', ar: 'عشاء' }, { key: 'snack', ar: 'خفيف' }, { key: 'shake', ar: 'شيك' }];
  const s = modalStyles(colors);
  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <View style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={onClose}><Text style={s.cancelText}>إلغاء</Text></TouchableOpacity>
          <Text style={s.title}>تعديل الوصفة</Text>
          <TouchableOpacity onPress={() => onSave({ nameAr, calories: parseInt(calories) || 0, protein: parseInt(protein) || 0, carbs: parseInt(carbs) || 0, fat: parseInt(fat) || 0, weekDay, videoId: videoId || undefined, mealType, mealTypeAr: MEAL_TYPES.find(m => m.key === mealType)?.ar ?? 'غداء' })}>
            <Text style={s.saveText}>حفظ</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.label}>اسم الوصفة</Text>
          <TextInput style={s.input} value={nameAr} onChangeText={setNameAr} textAlign="right" />
          <Text style={s.label}>نوع الوجبة</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
            {MEAL_TYPES.map((m) => (
              <TouchableOpacity key={m.key} style={[s.videoChip, mealType === m.key && s.videoChipActive]} onPress={() => setMealType(m.key as any)}>
                <Text style={[s.videoChipText, mealType === m.key && s.videoChipTextActive]}>{m.ar}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={s.label}>يوم الأسبوع</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
            {DAYS_AR.map((day, i) => (
              <TouchableOpacity key={i} style={[s.videoChip, weekDay === i && s.videoChipActive]} onPress={() => setWeekDay(i)}>
                <Text style={[s.videoChipText, weekDay === i && s.videoChipTextActive]}>{day}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>سعرات</Text>
              <TextInput style={s.input} value={calories} onChangeText={setCalories} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>بروتين (g)</Text>
              <TextInput style={s.input} value={protein} onChangeText={setProtein} keyboardType="numeric" />
            </View>
          </View>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>كارب (g)</Text>
              <TextInput style={s.input} value={carbs} onChangeText={setCarbs} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>دهون (g)</Text>
              <TextInput style={s.input} value={fat} onChangeText={setFat} keyboardType="numeric" />
            </View>
          </View>
          <Text style={s.label}>الفيديو</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
            <TouchableOpacity style={[s.videoChip, !videoId && s.videoChipActive]} onPress={() => setVideoId('')}>
              <Text style={[s.videoChipText, !videoId && s.videoChipTextActive]}>بدون فيديو</Text>
            </TouchableOpacity>
            {videos.map((v) => (
              <TouchableOpacity key={v.id} style={[s.videoChip, videoId === v.id && s.videoChipActive]} onPress={() => setVideoId(v.id)}>
                <Text style={[s.videoChipText, videoId === v.id && s.videoChipTextActive]}>{v.titleAr}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ---- مودال تعديل الفيتامين ----
function VitaminEditModal({ vitamin, colors, onSave, onClose }: { vitamin: Vitamin; colors: any; onSave: (d: Partial<Vitamin>) => void; onClose: () => void }) {
  const [nameAr, setNameAr] = useState(vitamin.nameAr);
  const [dose, setDose] = useState(vitamin.dose);
  const [timeAr, setTimeAr] = useState(vitamin.timeAr);
  const [hour, setHour] = useState(String(vitamin.hour));
  const [minute, setMinute] = useState(String(vitamin.minute));
  const s = modalStyles(colors);
  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <View style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={onClose}><Text style={s.cancelText}>إلغاء</Text></TouchableOpacity>
          <Text style={s.title}>تعديل الفيتامين</Text>
          <TouchableOpacity onPress={() => onSave({ nameAr, dose, timeAr, hour: parseInt(hour) || 8, minute: parseInt(minute) || 0 })}>
            <Text style={s.saveText}>حفظ</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.label}>الاسم بالعربي</Text>
          <TextInput style={s.input} value={nameAr} onChangeText={setNameAr} textAlign="right" />
          <Text style={s.label}>الجرعة</Text>
          <TextInput style={s.input} value={dose} onChangeText={setDose} />
          <Text style={s.label}>وقت التناول</Text>
          <TextInput style={s.input} value={timeAr} onChangeText={setTimeAr} textAlign="right" />
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>الساعة (0-23)</Text>
              <TextInput style={s.input} value={hour} onChangeText={setHour} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>الدقيقة (0-59)</Text>
              <TextInput style={s.input} value={minute} onChangeText={setMinute} keyboardType="numeric" />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = (colors: any) => StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'right' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'right', marginTop: 4 },
  content: { padding: 16, gap: 12 },
  menuCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: colors.border, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  menuIcon: { borderRadius: 14, padding: 12 },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '700', color: colors.foreground, textAlign: 'right' },
  menuSub: { fontSize: 12, color: colors.muted, textAlign: 'right', marginTop: 2 },
  resetCard: { backgroundColor: '#FEF2F2', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#FECACA', marginTop: 8 },
  resetCardText: { fontSize: 15, fontWeight: '700', color: '#EF4444', flex: 1, textAlign: 'right' },
  subHeader: { backgroundColor: colors.primary, padding: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 8 },
  subHeaderTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#fff', textAlign: 'right' },
  daySelector: { backgroundColor: colors.surface, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  dayTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  dayTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayTabText: { fontSize: 13, fontWeight: '600', color: colors.foreground },
  dayTabTextActive: { color: '#fff' },
  dayGroupTitle: { fontSize: 18, fontWeight: '800', color: colors.foreground, textAlign: 'right', marginBottom: 8 },
  addBtn: { backgroundColor: colors.primary, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  listCard: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.border },
  listIcon: { borderRadius: 12, padding: 10 },
  listInfo: { flex: 1 },
  listTitle: { fontSize: 15, fontWeight: '700', color: colors.foreground, textAlign: 'right' },
  listSub: { fontSize: 11, color: colors.muted, textAlign: 'right', marginTop: 2 },
  listBadge: { fontSize: 11, fontWeight: '700', textAlign: 'right', marginTop: 4 },
  listActions: { flexDirection: 'column', gap: 8 },
  editBtn: { backgroundColor: colors.primary + '20', borderRadius: 8, padding: 8 },
  deleteBtn: { backgroundColor: '#FEF2F2', borderRadius: 8, padding: 8 },
  vitaminDot: { width: 16, height: 16, borderRadius: 8 },
});

const modalStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, paddingTop: 50 },
  title: { fontSize: 17, fontWeight: '700', color: colors.foreground },
  cancelText: { fontSize: 16, color: colors.muted },
  saveText: { fontSize: 16, color: colors.primary, fontWeight: '700' },
  content: { padding: 16, gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: colors.muted, textAlign: 'right', marginBottom: 4 },
  input: { backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, fontSize: 15, color: colors.foreground, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  typeBtn: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  typeBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeBtnText: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  typeBtnTextActive: { color: '#fff' },
  videoChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 8, backgroundColor: colors.surface },
  videoChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  videoChipText: { fontSize: 13, color: colors.foreground },
  videoChipTextActive: { color: '#fff', fontWeight: '700' },
});
