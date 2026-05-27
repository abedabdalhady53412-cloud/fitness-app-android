import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/hooks/use-app-store";
import { useDayPlanner } from "@/hooks/use-day-planner";
import { useAlarms } from "@/hooks/use-alarms";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { DEFAULT_RECIPES, DEFAULT_WORKOUT_PLAN } from "@/lib/data/appData";

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { waterMl, vitaminsDone, vitamins } = useAppStore();
  const { getDayPlan } = useDayPlanner();
  const { getNextAlarm } = useAlarms();

  const now = new Date();
  const dayName = DAYS_AR[now.getDay()];
  const dateStr = `${now.getDate()} ${MONTHS_AR[now.getMonth()]} ${now.getFullYear()}`;
  const todayDate = now.toISOString().split('T')[0];

  const waterGoal = 3000;
  const waterPercent = Math.min((waterMl / waterGoal) * 100, 100);
  const vitaminPercent = vitamins.length > 0 ? (vitaminsDone.length / vitamins.length) * 100 : 0;

  // Heute's Plan
  const dayPlan = getDayPlan(todayDate);
  const completedTasks = dayPlan.tasks.filter((t: any) => t.done).length;
  const taskProgress = dayPlan.tasks.length > 0 ? (completedTasks / dayPlan.tasks.length) * 100 : 0;

  // Heutiges Training
  const workoutDay = dayPlan.workoutDayId ? DEFAULT_WORKOUT_PLAN.find(d => d.id === dayPlan.workoutDayId) : null;

  // Heute's Mahlzeiten
  const todayRecipes = DEFAULT_RECIPES.filter(r => r.weekDay === now.getDay());
  const totalCalories = todayRecipes.reduce((s, r) => s + r.calories, 0);

  // Nächster Alarm
  const nextAlarm = getNextAlarm();

  const handleStartDay = () => {
    Alert.alert(
      'Tag beginnen',
      'Möchten Sie Ihren Tag starten? Die App wird Sie durch alle Schritte führen.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Tag starten',
          onPress: () => {
            // Navigiere zum Tagesplaner
            router.push('/(tabs)/planner');
          },
        },
      ]
    );
  };

  const s = styles(colors);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>مرحباً 💪</Text>
            <Text style={s.dateText}>{dayName}، {dateStr}</Text>
          </View>
          <View style={s.logoCircle}>
            <Text style={{ fontSize: 28 }}>🏋️</Text>
          </View>
        </View>

        <View style={s.content}>
          {/* Start Day Button */}
          <TouchableOpacity style={s.startDayBtn} onPress={handleStartDay}>
            <View style={s.startDayContent}>
              <IconSymbol name="play.fill" size={24} color="#fff" />
              <View style={s.startDayText}>
                <Text style={s.startDayTitle}>ابدأ يومك الآن</Text>
                <Text style={s.startDaySubtitle}>اتبع جميع خطواتك اليومية</Text>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Daily Progress */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>تقدم اليوم 📊</Text>
              <Text style={s.cardPercent}>{taskProgress.toFixed(0)}%</Text>
            </View>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: `${taskProgress}%` as any }]} />
            </View>
            <Text style={s.cardSubtext}>{completedTasks} من {dayPlan.tasks.length} مهام مكتملة</Text>
          </View>

          {/* Training Today */}
          {dayPlan.isTrainingDay && workoutDay && (
            <View style={s.card}>
              <View style={s.cardHeader}>
                <Text style={s.cardTitle}>التمرين اليوم 💪</Text>
              </View>
              <View style={s.trainingInfo}>
                <Text style={s.trainingName}>{workoutDay.muscleGroupAr}</Text>
                <Text style={s.trainingExercises}>{workoutDay.exercises.length} تمارين</Text>
              </View>
              <TouchableOpacity
                style={s.cardBtn}
                onPress={() => router.push('/(tabs)/workout')}
              >
                <Text style={s.cardBtnText}>ابدأ التمرين</Text>
                <IconSymbol name="arrow.right" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Water Tracker */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>الماء 💧</Text>
              <Text style={s.cardPercent}>{waterPercent.toFixed(0)}%</Text>
            </View>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: `${waterPercent}%` as any }]} />
            </View>
            <Text style={s.cardSubtext}>{waterMl} / {waterGoal} مل</Text>
          </View>

          {/* Vitamins */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>الفيتامينات 💊</Text>
              <Text style={s.cardPercent}>{vitaminPercent.toFixed(0)}%</Text>
            </View>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: `${vitaminPercent}%` as any }]} />
            </View>
            <Text style={s.cardSubtext}>{vitaminsDone.length} من {vitamins.length} فيتامينات</Text>
          </View>

          {/* Meals Today */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardTitle}>الوجبات اليوم 🍽️</Text>
              <Text style={s.cardPercent}>{totalCalories} سعرة</Text>
            </View>
            <View style={s.mealsList}>
              {todayRecipes.map((recipe) => (
                <View key={recipe.id} style={s.mealItem}>
                  <Text style={s.mealName}>{recipe.nameAr}</Text>
                  <Text style={s.mealCals}>{recipe.calories} سعرة</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Next Alarm */}
          {nextAlarm && (
            <View style={s.card}>
              <View style={s.cardHeader}>
                <Text style={s.cardTitle}>التنبيه التالي ⏰</Text>
              </View>
              <Text style={s.alarmText}>
                {nextAlarm.nameAr} في {String(nextAlarm.hour).padStart(2, '0')}:{String(nextAlarm.minute).padStart(2, '0')}
              </Text>
            </View>
          )}

          {/* Quick Links */}
          <View style={s.quickLinks}>
            <TouchableOpacity
              style={s.quickLink}
              onPress={() => router.push('/(tabs)/nutrition')}
            >
              <IconSymbol name="fork.knife" size={24} color={colors.primary} />
              <Text style={s.quickLinkText}>الوجبات</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.quickLink}
              onPress={() => router.push('/(tabs)/reminders')}
            >
              <IconSymbol name="bell.fill" size={24} color={colors.primary} />
              <Text style={s.quickLinkText}>التذكيرات</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.quickLink}
              onPress={() => router.push('/(tabs)/planner')}
            >
              <IconSymbol name="calendar" size={24} color={colors.primary} />
              <Text style={s.quickLinkText}>التخطيط</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = (colors: any) => StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 24, fontWeight: '800', color: '#fff' },
  dateText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 16, gap: 12 },
  startDayBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  startDayContent: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  startDayText: { gap: 2 },
  startDayTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  startDaySubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.foreground },
  cardPercent: { fontSize: 16, fontWeight: '900', color: colors.primary },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },
  cardSubtext: { fontSize: 12, color: colors.muted, textAlign: 'right' },
  trainingInfo: { marginBottom: 12 },
  trainingName: { fontSize: 16, fontWeight: '800', color: colors.foreground, marginBottom: 4 },
  trainingExercises: { fontSize: 13, color: colors.muted },
  cardBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  cardBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  mealsList: { gap: 8 },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mealName: { fontSize: 13, fontWeight: '600', color: colors.foreground },
  mealCals: { fontSize: 12, color: colors.muted },
  alarmText: { fontSize: 14, fontWeight: '700', color: colors.primary, textAlign: 'right' },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
    marginTop: 8,
  },
  quickLink: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickLinkText: { fontSize: 11, fontWeight: '700', color: colors.foreground, textAlign: 'center' },
});
