import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Modal, Alert, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useDayPlanner } from "@/hooks/use-day-planner";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState, useCallback } from "react";
import { DEFAULT_RECIPES, DEFAULT_WORKOUT_PLAN } from "@/lib/data/appData";

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

export default function PlannerScreen() {
  const colors = useColors();
  const { getDayPlan, toggleTaskDone, addTask, deleteTask, updateTask, changeMeal, setTrainingDay, userSettings, updateTrainingDays } = useDayPlanner();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [trainingModalVisible, setTrainingModalVisible] = useState(false);

  const dayPlan = getDayPlan(selectedDate);
  const dateObj = new Date(selectedDate);
  const dayName = DAYS_AR[dateObj.getDay()];
  const dateStr = `${dateObj.getDate()} ${MONTHS_AR[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

  const handlePreviousDay = useCallback(() => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev.toISOString().split('T')[0]);
  }, [selectedDate]);

  const handleNextDay = useCallback(() => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next.toISOString().split('T')[0]);
  }, [selectedDate]);

  const handleAddTask = useCallback(() => {
    if (!newTaskName.trim()) {
      Alert.alert('خطأ', 'أدخل اسم المهمة');
      return;
    }

    const newTask = {
      id: `task_${Date.now()}`,
      nameAr: newTaskName,
      nameDe: newTaskName,
      categoryAr: 'مخصص',
      categoryDe: 'Benutzerdefiniert',
      time: newTaskTime || undefined,
      order: dayPlan.tasks.length + 1,
      color: '#FF6B35',
    };

    addTask(selectedDate, newTask);
    setNewTaskName('');
    setNewTaskTime('');
    setEditModalVisible(false);
  }, [newTaskName, newTaskTime, selectedDate, dayPlan.tasks.length, addTask]);

  const handleDeleteTask = useCallback((taskId: string) => {
    Alert.alert(
      'حذف المهمة',
      'هل تريد حذف هذه المهمة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: () => deleteTask(selectedDate, taskId) },
      ]
    );
  }, [selectedDate, deleteTask]);

  const handleChangeMeal = useCallback((mealType: string, newRecipeId: string) => {
    changeMeal(selectedDate, mealType, newRecipeId);
    setMealModalVisible(false);
  }, [selectedDate, changeMeal]);

  const handleToggleTrainingDay = useCallback((dayOfWeek: number) => {
    const isCurrentlyTraining = userSettings.trainingDays.includes(dayOfWeek);
    let newTrainingDays = userSettings.trainingDays.filter(d => d !== dayOfWeek);
    
    if (!isCurrentlyTraining) {
      newTrainingDays = [...newTrainingDays, dayOfWeek].sort();
    }
    
    updateTrainingDays(newTrainingDays);
  }, [userSettings.trainingDays, updateTrainingDays]);

  const s = styles(colors);
  const completedTasks = dayPlan.tasks.filter((t: any) => t.done).length;
  const taskProgress = dayPlan.tasks.length > 0 ? (completedTasks / dayPlan.tasks.length) * 100 : 0;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>تخطيط يومك 📅</Text>
        </View>

        {/* Date Navigation */}
        <View style={s.dateNav}>
          <TouchableOpacity style={s.navBtn} onPress={handlePreviousDay}>
            <IconSymbol name="chevron.left" size={20} color={colors.primary} />
          </TouchableOpacity>
          <View style={s.dateInfo}>
            <Text style={s.dayName}>{dayName}</Text>
            <Text style={s.dateStr}>{dateStr}</Text>
          </View>
          <TouchableOpacity style={s.navBtn} onPress={handleNextDay}>
            <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={s.content}>
          {/* Progress Bar */}
          <View style={s.progressSection}>
            <View style={s.progressHeader}>
              <Text style={s.progressLabel}>تقدم اليوم</Text>
              <Text style={s.progressPercent}>{taskProgress.toFixed(0)}%</Text>
            </View>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: `${taskProgress}%` as any }]} />
            </View>
            <Text style={s.progressText}>{completedTasks} من {dayPlan.tasks.length} مهمة مكتملة</Text>
          </View>

          {/* Training Day Toggle */}
          <View style={s.trainingSection}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>تمرين اليوم 💪</Text>
              <TouchableOpacity onPress={() => setTrainingModalVisible(true)}>
                <IconSymbol name="pencil" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {dayPlan.isTrainingDay ? (
              <View style={s.trainingCard}>
                <View style={s.trainingBadge}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color="#22C55E" />
                  <Text style={s.trainingBadgeText}>يوم تمرين</Text>
                </View>
                <Text style={s.trainingName}>
                  {DEFAULT_WORKOUT_PLAN.find(d => d.id === dayPlan.workoutDayId)?.muscleGroupAr || 'تمرين'}
                </Text>
              </View>
            ) : (
              <View style={s.noTrainingCard}>
                <Text style={s.noTrainingText}>لا يوجد تمرين اليوم</Text>
              </View>
            )}
          </View>

          {/* Tasks by Category */}
          {dayPlan.tasks.length === 0 ? (
            <View style={s.emptyCard}>
              <Text style={s.emptyText}>لا توجد مهام لهذا اليوم</Text>
            </View>
          ) : (
            dayPlan.tasks.map((task: any) => (
              <View key={task.id} style={[s.taskCard, task.done && s.taskCardDone]}>
                <TouchableOpacity
                  style={s.taskCheckbox}
                  onPress={() => toggleTaskDone(selectedDate, task.id)}
                >
                  <IconSymbol
                    name={task.done ? "checkmark.circle.fill" : "circle"}
                    size={24}
                    color={task.done ? "#22C55E" : colors.border}
                  />
                </TouchableOpacity>
                <View style={s.taskInfo}>
                  <Text style={[s.taskName, task.done && s.taskNameDone]}>{task.nameAr}</Text>
                  {task.time && <Text style={s.taskTime}>{task.time}</Text>}
                  {task.duration && <Text style={s.taskDuration}>{task.duration} دقيقة</Text>}
                </View>
                <View style={s.taskActions}>
                  <TouchableOpacity
                    style={s.taskActionBtn}
                    onPress={() => {
                      setEditingTask(task);
                      setEditModalVisible(true);
                    }}
                  >
                    <IconSymbol name="pencil" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.taskActionBtn}
                    onPress={() => handleDeleteTask(task.id)}
                  >
                    <IconSymbol name="trash.fill" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {/* Add Task Button */}
          <TouchableOpacity
            style={s.addBtn}
            onPress={() => {
              setEditingTask(null);
              setNewTaskName('');
              setNewTaskTime('');
              setEditModalVisible(true);
            }}
          >
            <IconSymbol name="plus" size={20} color="#fff" />
            <Text style={s.addBtnText}>إضافة مهمة</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Task Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <IconSymbol name="xmark" size={24} color={colors.foreground} />
              </TouchableOpacity>
              <Text style={s.modalTitle}>{editingTask ? 'تعديل المهمة' : 'مهمة جديدة'}</Text>
            </View>
            <TextInput
              style={s.input}
              placeholder="اسم المهمة"
              placeholderTextColor={colors.muted}
              value={newTaskName}
              onChangeText={setNewTaskName}
            />
            <TextInput
              style={s.input}
              placeholder="الوقت (مثال: 08:00)"
              placeholderTextColor={colors.muted}
              value={newTaskTime}
              onChangeText={setNewTaskTime}
            />
            <TouchableOpacity style={s.saveBtn} onPress={handleAddTask}>
              <Text style={s.saveBtnText}>حفظ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Training Day Modal */}
      <Modal visible={trainingModalVisible} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={() => setTrainingModalVisible(false)}>
                <IconSymbol name="xmark" size={24} color={colors.foreground} />
              </TouchableOpacity>
              <Text style={s.modalTitle}>أيام التمرين</Text>
            </View>
            <ScrollView style={s.trainingDaysList}>
              {DAYS_AR.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    s.trainingDayItem,
                    userSettings.trainingDays.includes(index) && s.trainingDayItemActive,
                  ]}
                  onPress={() => handleToggleTrainingDay(index)}
                >
                  <IconSymbol
                    name={userSettings.trainingDays.includes(index) ? "checkmark.circle.fill" : "circle"}
                    size={24}
                    color={userSettings.trainingDays.includes(index) ? colors.primary : colors.border}
                  />
                  <Text style={s.trainingDayText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = (colors: any) => StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'right' },
  dateNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  navBtn: { padding: 8 },
  dateInfo: { alignItems: 'center' },
  dayName: { fontSize: 16, fontWeight: '800', color: colors.foreground },
  dateStr: { fontSize: 12, color: colors.muted, marginTop: 2 },
  content: { padding: 16, gap: 14 },
  progressSection: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressLabel: { fontSize: 14, fontWeight: '700', color: colors.foreground },
  progressPercent: { fontSize: 16, fontWeight: '900', color: colors.primary },
  progressBar: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },
  progressText: { fontSize: 12, color: colors.muted, textAlign: 'right' },
  trainingSection: { gap: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.foreground },
  trainingCard: { backgroundColor: '#F0FDF4', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#86EFAC', gap: 8 },
  trainingBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trainingBadgeText: { fontSize: 13, fontWeight: '700', color: '#15803D' },
  trainingName: { fontSize: 15, fontWeight: '700', color: '#15803D', textAlign: 'right' },
  noTrainingCard: { backgroundColor: colors.surface, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.border },
  noTrainingText: { fontSize: 14, color: colors.muted, textAlign: 'center' },
  emptyCard: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  emptyText: { color: colors.muted, fontSize: 14 },
  taskCard: { backgroundColor: colors.surface, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.border },
  taskCardDone: { backgroundColor: '#F0FDF4', borderColor: '#86EFAC', opacity: 0.8 },
  taskCheckbox: { padding: 4 },
  taskInfo: { flex: 1 },
  taskName: { fontSize: 14, fontWeight: '700', color: colors.foreground, textAlign: 'right' },
  taskNameDone: { textDecorationLine: 'line-through', color: colors.muted },
  taskTime: { fontSize: 11, color: colors.muted, textAlign: 'right', marginTop: 2 },
  taskDuration: { fontSize: 11, color: colors.muted, textAlign: 'right' },
  taskActions: { flexDirection: 'row', gap: 8 },
  taskActionBtn: { padding: 6 },
  addBtn: { backgroundColor: colors.primary, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, gap: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.foreground },
  input: { backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, color: colors.foreground, textAlign: 'right' },
  saveBtn: { backgroundColor: colors.primary, borderRadius: 12, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  trainingDaysList: { maxHeight: 300 },
  trainingDayItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  trainingDayItemActive: { backgroundColor: colors.surface },
  trainingDayText: { fontSize: 14, fontWeight: '700', color: colors.foreground, flex: 1, textAlign: 'right' },
});
