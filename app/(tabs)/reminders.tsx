import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/hooks/use-app-store";
import { IconSymbol } from "@/components/ui/icon-symbol";

const WATER_AMOUNTS = [250, 500, 750];

export default function RemindersScreen() {
  const colors = useColors();
  const { waterMl, addWater, resetWater, vitamins, vitaminsDone, toggleVitaminDone } = useAppStore();

  const waterGoal = 3000;
  const waterPercent = Math.min((waterMl / waterGoal) * 100, 100);
  const waterLiters = (waterMl / 1000).toFixed(2);
  const s = styles(colors);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.headerTitle}>التذكيرات 🔔</Text>
        </View>

        <View style={s.content}>
          {/* بطاقة الماء */}
          <View style={s.waterCard}>
            <View style={s.waterHeader}>
              <View style={s.waterIconBg}>
                <IconSymbol name="drop.fill" size={24} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.waterTitle}>شرب الماء 💧</Text>
                <Text style={s.waterGoalText}>الهدف اليومي: 3 لتر</Text>
              </View>
              <TouchableOpacity style={s.resetBtn} onPress={() => {
                Alert.alert('إعادة تعيين', 'هل تريد إعادة تعيين عداد الماء؟', [
                  { text: 'إلغاء', style: 'cancel' },
                  { text: 'نعم', onPress: resetWater },
                ]);
              }}>
                <Text style={s.resetBtnText}>إعادة</Text>
              </TouchableOpacity>
            </View>

            <View style={s.waterAmountRow}>
              <Text style={s.waterAmount}>{waterLiters}</Text>
              <Text style={s.waterUnit}>لتر</Text>
            </View>

            <View style={s.waterProgressBg}>
              <View style={[s.waterProgressFill, { width: `${waterPercent}%` as any }]} />
            </View>
            <Text style={s.waterPercentText}>{waterPercent.toFixed(0)}% من الهدف</Text>

            <View style={s.waterBtns}>
              {WATER_AMOUNTS.map((ml) => (
                <TouchableOpacity key={ml} style={s.waterAddBtn} onPress={() => addWater(ml)}>
                  <IconSymbol name="plus" size={14} color="#fff" />
                  <Text style={s.waterAddBtnText}>{ml}ml</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.cupsRow}>
              {Array.from({ length: 12 }).map((_, i) => {
                const filled = waterMl >= (i + 1) * 250;
                return (
                  <TouchableOpacity key={i} onPress={() => addWater(250)}>
                    <Text style={s.cupEmoji}>{filled ? '🥤' : '⬜'}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* الفيتامينات */}
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>الفيتامينات والمكملات 💊</Text>
            <Text style={s.sectionSub}>{vitaminsDone.length}/{vitamins.length} مكتمل</Text>
          </View>

          {vitamins.map((vitamin) => {
            const isDone = vitaminsDone.includes(vitamin.id);
            const timeStr = `${vitamin.hour.toString().padStart(2, '0')}:${vitamin.minute.toString().padStart(2, '0')}`;
            return (
              <TouchableOpacity
                key={vitamin.id}
                style={[s.vitaminCard, isDone && s.vitaminCardDone]}
                onPress={() => toggleVitaminDone(vitamin.id)}
              >
                <View style={[s.vitaminColorDot, { backgroundColor: vitamin.color }]} />
                <View style={s.vitaminInfo}>
                  <Text style={[s.vitaminName, isDone && s.vitaminNameDone]}>{vitamin.nameAr}</Text>
                  <Text style={s.vitaminNameDe}>{vitamin.nameDe}</Text>
                  <View style={s.vitaminMeta}>
                    <View style={s.vitaminMetaChip}>
                      <IconSymbol name="clock.fill" size={11} color={colors.muted} />
                      <Text style={s.vitaminMetaText}>{timeStr}</Text>
                    </View>
                    <View style={s.vitaminMetaChip}>
                      <Text style={s.vitaminMetaText}>{vitamin.dose}</Text>
                    </View>
                    <View style={s.vitaminMetaChip}>
                      <Text style={s.vitaminMetaText}>{vitamin.timeAr}</Text>
                    </View>
                  </View>
                </View>
                <View style={[s.vitaminCheck, isDone && s.vitaminCheckDone]}>
                  {isDone && <IconSymbol name="checkmark" size={16} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = (colors: any) => StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'right' },
  content: { padding: 16, gap: 14 },
  waterCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
  waterHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  waterIconBg: { backgroundColor: '#EFF6FF', borderRadius: 14, padding: 10 },
  waterTitle: { fontSize: 18, fontWeight: '800', color: colors.foreground },
  waterGoalText: { fontSize: 12, color: colors.muted, marginTop: 2 },
  resetBtn: { backgroundColor: colors.background, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.border },
  resetBtnText: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  waterAmountRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 6, marginBottom: 12 },
  waterAmount: { fontSize: 56, fontWeight: '900', color: '#3B82F6' },
  waterUnit: { fontSize: 18, color: colors.muted, marginBottom: 10 },
  waterProgressBg: { height: 12, backgroundColor: colors.border, borderRadius: 6, marginBottom: 6 },
  waterProgressFill: { height: 12, backgroundColor: '#3B82F6', borderRadius: 6 },
  waterPercentText: { fontSize: 12, color: colors.muted, textAlign: 'center', marginBottom: 16 },
  waterBtns: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  waterAddBtn: { flex: 1, backgroundColor: '#3B82F6', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  waterAddBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  cupsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  cupEmoji: { fontSize: 22 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.foreground },
  sectionSub: { fontSize: 13, color: colors.muted },
  vitaminCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.border, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  vitaminCardDone: { backgroundColor: '#F0FDF4', borderColor: '#86EFAC', opacity: 0.85 },
  vitaminColorDot: { width: 14, height: 14, borderRadius: 7 },
  vitaminInfo: { flex: 1 },
  vitaminName: { fontSize: 16, fontWeight: '700', color: colors.foreground, textAlign: 'right' },
  vitaminNameDone: { textDecorationLine: 'line-through', color: colors.muted },
  vitaminNameDe: { fontSize: 11, color: colors.muted, textAlign: 'right', marginTop: 2 },
  vitaminMeta: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap', justifyContent: 'flex-end' },
  vitaminMetaChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.background, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.border },
  vitaminMetaText: { fontSize: 11, color: colors.muted, fontWeight: '600' },
  vitaminCheck: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  vitaminCheckDone: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
});
