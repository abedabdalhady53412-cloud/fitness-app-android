import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/hooks/use-app-store";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { VideoView, useVideoPlayer } from "expo-video";
import { useState, useCallback } from "react";
import { Alert } from "react-native";
import type { Recipe } from "@/lib/data/appData";
import { getApiBaseUrl } from "@/constants/oauth";

const MEAL_ICONS: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
  shake: '🥤',
};

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function NutritionScreen() {
  const colors = useColors();
  const { recipes, getVideoById } = useAppStore();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentRecipeName, setCurrentRecipeName] = useState('');

  const dayRecipes = recipes.filter(r => r.weekDay === selectedDay);
  const totalCalories = dayRecipes.reduce((sum, r) => sum + r.calories, 0);
  const totalProtein = dayRecipes.reduce((sum, r) => sum + r.protein, 0);

  const handleVideoPress = useCallback((recipe: Recipe) => {
    const video = getVideoById(recipe.videoId);
    if (video) {
      const url = `${getApiBaseUrl()}${video.storagePath}`;
      setCurrentVideoUrl(url);
      setCurrentRecipeName(recipe.nameAr);
      setVideoModalVisible(true);
    }
  }, [getVideoById]);

  const s = styles(colors);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.headerTitle}>خطة التغذية 🥗</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.daySelector} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {DAYS_AR.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[s.dayTab, selectedDay === index && s.dayTabActive]}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={[s.dayTabText, selectedDay === index && s.dayTabTextActive]}>{day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={s.content}>
          {dayRecipes.length > 0 && (
            <View style={s.summaryCard}>
              <View style={s.summaryItem}>
                <Text style={s.summaryValue}>{totalCalories}</Text>
                <Text style={s.summaryLabel}>سعرة حرارية</Text>
              </View>
              <View style={s.summaryDivider} />
              <View style={s.summaryItem}>
                <Text style={s.summaryValue}>{totalProtein}g</Text>
                <Text style={s.summaryLabel}>بروتين</Text>
              </View>
              <View style={s.summaryDivider} />
              <View style={s.summaryItem}>
                <Text style={s.summaryValue}>{dayRecipes.length}</Text>
                <Text style={s.summaryLabel}>وجبات</Text>
              </View>
            </View>
          )}

          {dayRecipes.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyIcon}>🍽️</Text>
              <Text style={s.emptyText}>لا توجد وجبات لهذا اليوم</Text>
              <Text style={s.emptySubText}>يمكنك إضافة وجبات من قسم الإدارة</Text>
            </View>
          ) : (
            dayRecipes.map((recipe) => {
              const video = getVideoById(recipe.videoId);
              return (
                <View key={recipe.id} style={s.recipeCard}>
                  <View style={s.recipeHeader}>
                    <View style={s.mealTypeBadge}>
                      <Text style={s.mealTypeIcon}>{MEAL_ICONS[recipe.mealType] || '🍽️'}</Text>
                      <Text style={s.mealTypeText}>{recipe.mealTypeAr}</Text>
                    </View>
                    {video && (
                      <TouchableOpacity style={s.videoBtn} onPress={() => handleVideoPress(recipe)}>
                        <IconSymbol name="play.fill" size={14} color="#fff" />
                        <Text style={s.videoBtnText}>شاهد الوصفة</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={s.recipeName}>{recipe.nameAr}</Text>
                  <Text style={s.recipeNameDe}>{recipe.nameDe}</Text>
                  <View style={s.nutritionRow}>
                    <View style={s.nutritionItem}>
                      <Text style={s.nutritionValue}>{recipe.calories}</Text>
                      <Text style={s.nutritionLabel}>سعرة</Text>
                    </View>
                    <View style={s.nutritionItem}>
                      <Text style={[s.nutritionValue, { color: '#3B82F6' }]}>{recipe.protein}g</Text>
                      <Text style={s.nutritionLabel}>بروتين</Text>
                    </View>
                    <View style={s.nutritionItem}>
                      <Text style={[s.nutritionValue, { color: '#F59E0B' }]}>{recipe.carbs}g</Text>
                      <Text style={s.nutritionLabel}>كارب</Text>
                    </View>
                    <View style={s.nutritionItem}>
                      <Text style={[s.nutritionValue, { color: '#EF4444' }]}>{recipe.fat}g</Text>
                      <Text style={s.nutritionLabel}>دهون</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <Modal visible={videoModalVisible} animationType="slide" presentationStyle="fullScreen">
        <View style={s.videoModal}>
          <View style={s.videoModalHeader}>
            <TouchableOpacity style={s.videoCloseBtn} onPress={() => setVideoModalVisible(false)}>
              <IconSymbol name="xmark" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={s.videoModalTitle}>{currentRecipeName}</Text>
          </View>
          {currentVideoUrl ? <VideoPlayerComponent url={currentVideoUrl} /> : null}
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function VideoPlayerComponent({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => { p.loop = false; p.play(); });
  return (
    <VideoView player={player} style={{ flex: 1, width: '100%' }} allowsFullscreen contentFit="contain" />
  );
}

const styles = (colors: any) => StyleSheet.create({
  header: { backgroundColor: colors.primary, padding: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'right' },
  daySelector: { backgroundColor: colors.surface, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  dayTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  dayTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayTabText: { fontSize: 13, fontWeight: '600', color: colors.foreground },
  dayTabTextActive: { color: '#fff' },
  content: { padding: 16, gap: 14 },
  summaryCard: { backgroundColor: colors.secondary ?? '#004E89', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: 22, fontWeight: '800', color: '#fff' },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  summaryDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 6 },
  emptySubText: { fontSize: 13, color: colors.muted },
  recipeCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  recipeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  mealTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.background, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: colors.border },
  mealTypeIcon: { fontSize: 14 },
  mealTypeText: { fontSize: 12, fontWeight: '600', color: colors.muted },
  videoBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  videoBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  recipeName: { fontSize: 18, fontWeight: '800', color: colors.foreground, textAlign: 'right', marginBottom: 2 },
  recipeNameDe: { fontSize: 12, color: colors.muted, textAlign: 'right', marginBottom: 12 },
  nutritionRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.background, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: colors.border },
  nutritionItem: { alignItems: 'center' },
  nutritionValue: { fontSize: 16, fontWeight: '800', color: colors.foreground },
  nutritionLabel: { fontSize: 10, color: colors.muted, marginTop: 2 },
  videoModal: { flex: 1, backgroundColor: '#000' },
  videoModalHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 50, gap: 12 },
  videoCloseBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 8 },
  videoModalTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'right' },
});
