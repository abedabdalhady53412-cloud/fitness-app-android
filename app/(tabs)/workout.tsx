import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/hooks/use-app-store";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { VideoView, useVideoPlayer } from "expo-video";
import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import type { Exercise, WorkoutDay } from "@/lib/data/appData";
import { getApiBaseUrl } from "@/constants/oauth";

export default function WorkoutScreen() {
  const colors = useColors();
  const { workoutPlan, workoutProgress, startWorkout, toggleExerciseDone, completeDay, getVideoById } = useAppStore();
  const [selectedDay, setSelectedDay] = useState<WorkoutDay>(workoutPlan[0]);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentExerciseName, setCurrentExerciseName] = useState('');

  useKeepAwake();

  const isActiveDay = workoutProgress?.dayId === selectedDay?.id;
  const completedExercises = isActiveDay ? workoutProgress?.completedExercises ?? [] : [];
  const isDayCompleted = isActiveDay && workoutProgress?.dayCompleted;

  const handleStartDay = useCallback(async () => {
    await startWorkout(selectedDay.id);
  }, [selectedDay, startWorkout]);

  const handleExerciseTap = useCallback((exercise: Exercise) => {
    const video = getVideoById(exercise.videoId);
    if (video) {
      // Verwende den Dateinamen direkt als URL-Pfad
      const url = `${getApiBaseUrl()}${video.storagePath}`;
      setCurrentVideoUrl(url);
      setCurrentExerciseName(exercise.nameAr);
      setVideoModalVisible(true);
    } else {
      Alert.alert('لا يوجد فيديو', 'لم يتم تعيين فيديو لهذا التمرين بعد');
    }
  }, [getVideoById]);

  const handleToggleDone = useCallback(async (exerciseId: string) => {
    if (!isActiveDay) {
      Alert.alert('ابدأ التمرين أولاً', 'اضغط على "ابدأ التمرين" لبدء تتبع تقدمك');
      return;
    }
    await toggleExerciseDone(exerciseId);
  }, [isActiveDay, toggleExerciseDone]);

  const handleCompleteDay = useCallback(async () => {
    const total = selectedDay.exercises.length;
    const done = completedExercises.length;
    if (done < total) {
      Alert.alert(
        'إنهاء التمرين',
        `أتممت ${done} من ${total} تمرين. هل تريد إنهاء اليوم؟`,
        [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'نعم، إنهاء', onPress: async () => { await completeDay(); } },
        ]
      );
    } else {
      await completeDay();
    }
  }, [selectedDay, completedExercises, completeDay]);

  const s = styles(colors);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>خطة التمرين 🏋️</Text>
        </View>

        {/* اختيار اليوم */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.daySelector} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
          {workoutPlan.map((day) => {
            const isSelected = selectedDay?.id === day.id;
            const isActive = workoutProgress?.dayId === day.id;
            return (
              <TouchableOpacity
                key={day.id}
                style={[s.dayTab, isSelected && s.dayTabActive]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[s.dayTabText, isSelected && s.dayTabTextActive]}>{day.nameAr}</Text>
                <Text style={[s.dayTabSub, isSelected && s.dayTabSubActive]}>{day.muscleGroupAr}</Text>
                {isActive && !workoutProgress?.dayCompleted && <View style={s.activeDot} />}
                {workoutProgress?.dayId === day.id && workoutProgress?.dayCompleted && (
                  <View style={s.completedDot}><Text style={{ fontSize: 8, color: '#fff' }}>✓</Text></View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {selectedDay && (
          <View style={s.content}>
            {/* معلومات اليوم */}
            <View style={s.dayInfo}>
              <Text style={s.dayInfoTitle}>{selectedDay.muscleGroupAr}</Text>
              <Text style={s.dayInfoSub}>{selectedDay.exercises.length} تمرين</Text>
            </View>

            {/* زر البدء / الإنهاء */}
            {!isActiveDay ? (
              <TouchableOpacity style={s.startBtn} onPress={handleStartDay}>
                <IconSymbol name="play.fill" size={20} color="#fff" />
                <Text style={s.startBtnText}>ابدأ التمرين</Text>
              </TouchableOpacity>
            ) : isDayCompleted ? (
              <View style={s.completedBanner}>
                <IconSymbol name="trophy.fill" size={24} color="#F7B801" />
                <Text style={s.completedBannerText}>أحسنت! أتممت تمرين اليوم 🎉</Text>
              </View>
            ) : (
              <View style={s.activeRow}>
                <View style={s.activeIndicator}>
                  <View style={s.activePulse} />
                  <Text style={s.activeText}>التمرين جارٍ...</Text>
                </View>
                <TouchableOpacity style={s.finishBtn} onPress={handleCompleteDay}>
                  <Text style={s.finishBtnText}>إنهاء اليوم</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* قائمة التمارين */}
            <View style={s.exerciseList}>
              {selectedDay.exercises.map((exercise, index) => {
                const isDone = completedExercises.includes(exercise.id);
                const hasVideo = !!exercise.videoId;
                return (
                  <View key={exercise.id} style={[s.exerciseCard, isDone && s.exerciseCardDone]}>
                    <View style={s.exerciseLeft}>
                      <Text style={[s.exerciseNum, isDone && s.exerciseNumDone]}>{index + 1}</Text>
                    </View>
                    <View style={s.exerciseMiddle}>
                      <Text style={[s.exerciseName, isDone && s.exerciseNameDone]}>{exercise.nameAr}</Text>
                      <Text style={s.exerciseSub}>{exercise.nameDe}</Text>
                      <View style={s.exerciseMeta}>
                        <View style={s.metaChip}>
                          <Text style={s.metaChipText}>{exercise.sets} سيت</Text>
                        </View>
                        <View style={s.metaChip}>
                          <Text style={s.metaChipText}>{exercise.reps} تكرار</Text>
                        </View>
                        {exercise.weight && (
                          <View style={s.metaChip}>
                            <Text style={s.metaChipText}>{exercise.weight}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={s.exerciseRight}>
                      {hasVideo && (
                        <TouchableOpacity style={s.videoBtn} onPress={() => handleExerciseTap(exercise)}>
                          <IconSymbol name="play.fill" size={16} color="#fff" />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={[s.checkBtn, isDone && s.checkBtnDone]}
                        onPress={() => handleToggleDone(exercise.id)}
                      >
                        <IconSymbol name={isDone ? "checkmark.circle.fill" : "checkmark"} size={22} color={isDone ? '#22C55E' : colors.muted} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Video Modal */}
      <Modal visible={videoModalVisible} animationType="slide" presentationStyle="fullScreen">
        <View style={s.videoModal}>
          <View style={s.videoModalHeader}>
            <TouchableOpacity style={s.videoCloseBtn} onPress={() => setVideoModalVisible(false)}>
              <IconSymbol name="xmark" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={s.videoModalTitle}>{currentExerciseName}</Text>
          </View>
          {currentVideoUrl ? (
            <VideoPlayerComponent url={currentVideoUrl} />
          ) : null}
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function VideoPlayerComponent({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={{ flex: 1, width: '100%' }}
      allowsFullscreen
      allowsPictureInPicture
      contentFit="contain"
    />
  );
}

const styles = (colors: any) => StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'right' },
  daySelector: { backgroundColor: colors.surface, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  dayTab: { alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, minWidth: 90, position: 'relative' },
  dayTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayTabText: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  dayTabTextActive: { color: '#fff' },
  dayTabSub: { fontSize: 10, color: colors.muted, marginTop: 2, textAlign: 'center' },
  dayTabSubActive: { color: 'rgba(255,255,255,0.8)' },
  activeDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#F7B801' },
  completedDot: { position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 14 },
  dayInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayInfoTitle: { fontSize: 20, fontWeight: '800', color: colors.foreground },
  dayInfoSub: { fontSize: 14, color: colors.muted },
  startBtn: { backgroundColor: colors.primary, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  completedBanner: { backgroundColor: '#F0FDF4', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#86EFAC' },
  completedBannerText: { fontSize: 16, fontWeight: '700', color: '#15803D', flex: 1, textAlign: 'right' },
  activeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  activeIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activePulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E' },
  activeText: { fontSize: 14, color: '#22C55E', fontWeight: '600' },
  finishBtn: { backgroundColor: '#22C55E', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  finishBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  exerciseList: { gap: 10 },
  exerciseCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.border, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  exerciseCardDone: { backgroundColor: '#F0FDF4', borderColor: '#86EFAC', opacity: 0.85 },
  exerciseLeft: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  exerciseNum: { color: '#fff', fontWeight: '800', fontSize: 14 },
  exerciseNumDone: { backgroundColor: '#22C55E' },
  exerciseMiddle: { flex: 1 },
  exerciseName: { fontSize: 15, fontWeight: '700', color: colors.foreground, textAlign: 'right' },
  exerciseNameDone: { textDecorationLine: 'line-through', color: colors.muted },
  exerciseSub: { fontSize: 11, color: colors.muted, textAlign: 'right', marginTop: 2 },
  exerciseMeta: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap', justifyContent: 'flex-end' },
  metaChip: { backgroundColor: colors.background, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.border },
  metaChipText: { fontSize: 11, color: colors.muted, fontWeight: '600' },
  exerciseRight: { flexDirection: 'column', alignItems: 'center', gap: 8 },
  videoBtn: { backgroundColor: colors.primary, borderRadius: 10, padding: 8 },
  checkBtn: { padding: 4 },
  checkBtnDone: {},
  videoModal: { flex: 1, backgroundColor: '#000' },
  videoModalHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 50, gap: 12 },
  videoCloseBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 8 },
  videoModalTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'right' },
});
