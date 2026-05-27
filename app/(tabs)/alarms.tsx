import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Modal, Alert, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAlarms } from "@/hooks/use-alarms";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState } from "react";

export default function AlarmsScreen() {
  const colors = useColors();
  const { alarms, addAlarm, deleteAlarm, toggleAlarm } = useAlarms();

  const [modalVisible, setModalVisible] = useState(false);
  const [newAlarmName, setNewAlarmName] = useState('');
  const [newAlarmHour, setNewAlarmHour] = useState('06');
  const [newAlarmMinute, setNewAlarmMinute] = useState('00');

  const handleAddAlarm = () => {
    if (!newAlarmName.trim()) {
      Alert.alert('خطأ', 'أدخل اسم التنبيه');
      return;
    }

    const hour = parseInt(newAlarmHour) || 0;
    const minute = parseInt(newAlarmMinute) || 0;

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      Alert.alert('خطأ', 'الساعة يجب أن تكون من 0-23 والدقائق من 0-59');
      return;
    }

    addAlarm(newAlarmName, newAlarmName, hour, minute);
    setNewAlarmName('');
    setNewAlarmHour('06');
    setNewAlarmMinute('00');
    setModalVisible(false);
  };

  const handleDeleteAlarm = (id: string) => {
    Alert.alert(
      'حذف التنبيه',
      'هل تريد حذف هذا التنبيه؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: () => deleteAlarm(id) },
      ]
    );
  };

  const s = styles(colors);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>التنبيهات والأجراس ⏰</Text>
        </View>

        <View style={s.content}>
          {alarms.length === 0 ? (
            <View style={s.emptyCard}>
              <Text style={s.emptyText}>لا توجد تنبيهات</Text>
              <Text style={s.emptySubtext}>أضف تنبيهاً لتذكرك بمهامك اليومية</Text>
            </View>
          ) : (
            alarms.map((alarm) => (
              <View key={alarm.id} style={[s.alarmCard, !alarm.enabled && s.alarmCardDisabled]}>
                <View style={s.alarmInfo}>
                  <View style={s.alarmTime}>
                    <Text style={s.alarmHour}>{String(alarm.hour).padStart(2, '0')}</Text>
                    <Text style={s.alarmColon}>:</Text>
                    <Text style={s.alarmMinute}>{String(alarm.minute).padStart(2, '0')}</Text>
                  </View>
                  <View style={s.alarmDetails}>
                    <Text style={s.alarmName}>{alarm.nameAr}</Text>
                    <View style={s.alarmFeatures}>
                      {alarm.sound && (
                        <View style={s.featureBadge}>
                          <IconSymbol name="speaker.wave.2.fill" size={12} color={colors.primary} />
                          <Text style={s.featureText}>صوت</Text>
                        </View>
                      )}
                      {alarm.vibration && (
                        <View style={s.featureBadge}>
                          <IconSymbol name="iphone.radiowaves.left.and.right" size={12} color={colors.primary} />
                          <Text style={s.featureText}>اهتزاز</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <View style={s.alarmActions}>
                  <TouchableOpacity
                    style={s.toggleBtn}
                    onPress={() => toggleAlarm(alarm.id)}
                  >
                    <IconSymbol
                      name={alarm.enabled ? "checkmark.circle.fill" : "circle"}
                      size={28}
                      color={alarm.enabled ? colors.primary : colors.border}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.deleteBtn}
                    onPress={() => handleDeleteAlarm(alarm.id)}
                  >
                    <IconSymbol name="trash.fill" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {/* Add Alarm Button */}
          <TouchableOpacity
            style={s.addBtn}
            onPress={() => setModalVisible(true)}
          >
            <IconSymbol name="plus" size={20} color="#fff" />
            <Text style={s.addBtnText}>إضافة تنبيه جديد</Text>
          </TouchableOpacity>

          {/* Info */}
          <View style={s.infoCard}>
            <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
            <Text style={s.infoText}>التنبيهات ستعمل حتى لو كان الهاتف في وضع الصمت</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Alarm Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <IconSymbol name="xmark" size={24} color={colors.foreground} />
              </TouchableOpacity>
              <Text style={s.modalTitle}>تنبيه جديد</Text>
            </View>

            <Text style={s.label}>اسم التنبيه</Text>
            <TextInput
              style={s.input}
              placeholder="مثال: تمرين، وجبة، فيتامينات"
              placeholderTextColor={colors.muted}
              value={newAlarmName}
              onChangeText={setNewAlarmName}
            />

            <Text style={s.label}>الوقت</Text>
            <View style={s.timeInputs}>
              <View style={s.timeInput}>
                <Text style={s.timeLabel}>الساعة</Text>
                <TextInput
                  style={s.timeValue}
                  placeholder="00"
                  placeholderTextColor={colors.muted}
                  value={newAlarmHour}
                  onChangeText={setNewAlarmHour}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <Text style={s.timeSeparator}>:</Text>
              <View style={s.timeInput}>
                <Text style={s.timeLabel}>الدقيقة</Text>
                <TextInput
                  style={s.timeValue}
                  placeholder="00"
                  placeholderTextColor={colors.muted}
                  value={newAlarmMinute}
                  onChangeText={setNewAlarmMinute}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            </View>

            <TouchableOpacity style={s.saveBtn} onPress={handleAddAlarm}>
              <Text style={s.saveBtnText}>حفظ التنبيه</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = (colors: any) => StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'right' },
  content: { padding: 16, gap: 12 },
  emptyCard: { backgroundColor: colors.surface, borderRadius: 14, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.border, marginTop: 20 },
  emptyText: { fontSize: 16, fontWeight: '800', color: colors.foreground, marginBottom: 4 },
  emptySubtext: { fontSize: 13, color: colors.muted, textAlign: 'center' },
  alarmCard: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  alarmCardDisabled: { opacity: 0.6 },
  alarmInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  alarmTime: { flexDirection: 'row', alignItems: 'flex-start', gap: 2 },
  alarmHour: { fontSize: 32, fontWeight: '900', color: colors.primary },
  alarmColon: { fontSize: 24, fontWeight: '800', color: colors.muted, marginTop: 2 },
  alarmMinute: { fontSize: 32, fontWeight: '900', color: colors.primary },
  alarmDetails: { gap: 4, flex: 1 },
  alarmName: { fontSize: 14, fontWeight: '700', color: colors.foreground, textAlign: 'right' },
  alarmFeatures: { flexDirection: 'row', gap: 6 },
  featureBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.background, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  featureText: { fontSize: 10, fontWeight: '600', color: colors.primary },
  alarmActions: { flexDirection: 'row', gap: 8 },
  toggleBtn: { padding: 4 },
  deleteBtn: { padding: 8 },
  addBtn: { backgroundColor: colors.primary, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  infoCard: { backgroundColor: colors.surface, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.border, marginTop: 8 },
  infoText: { fontSize: 12, color: colors.foreground, flex: 1, textAlign: 'right' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, gap: 14 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.foreground },
  label: { fontSize: 13, fontWeight: '700', color: colors.foreground, textAlign: 'right' },
  input: { backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, color: colors.foreground, textAlign: 'right' },
  timeInputs: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 12, marginBottom: 8 },
  timeInput: { alignItems: 'center', gap: 6 },
  timeLabel: { fontSize: 11, fontWeight: '600', color: colors.muted },
  timeValue: { backgroundColor: colors.surface, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: colors.border, color: colors.foreground, textAlign: 'center', fontSize: 20, fontWeight: '800', width: 60 },
  timeSeparator: { fontSize: 24, fontWeight: '800', color: colors.foreground, marginBottom: 4 },
  saveBtn: { backgroundColor: colors.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
