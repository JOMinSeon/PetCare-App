import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme';

interface Props {
  onBack: () => void;
}

const NUTRIENTS = [
  { name: '단백질', current: 65, target: 80, unit: 'g' },
  { name: '지방', current: 25, target: 35, unit: 'g' },
  { name: '탄수화물', current: 120, target: 150, unit: 'g' },
];

const RECOMMENDED_FOODS = [
  { id: '1', name: '관절 건강 사료', brand: '皇家', price: '₩45,000', reason: '관절 건강에 도움을 줌' },
  { id: '2', name: '피부/모질 영양제', brand: '네이처드', price: '₩28,000', reason: '모질 개선에 도움을 줌' },
];

export default React.memo(function DietPlannerScreen({ onBack }: Props) {
  const [selectedTab, setSelectedTab] = useState<'tracker' | 'foods'>('tracker');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>식단 플래너</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'tracker' && styles.tabSelected]}
          onPress={() => setSelectedTab('tracker')}
        >
          <Text style={[styles.tabText, selectedTab === 'tracker' && styles.tabTextSelected]}>
            영양 트래커
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'foods' && styles.tabSelected]}
          onPress={() => setSelectedTab('foods')}
        >
          <Text style={[styles.tabText, selectedTab === 'foods' && styles.tabTextSelected]}>
            추천 식단
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'tracker' ? (
          <>
            <View style={styles.calorieCard}>
              <Text style={styles.calorieLabel}>일일 칼로리 섭취량</Text>
              <View style={styles.calorieProgress}>
                <Text style={styles.calorieValue}>1,450</Text>
                <Text style={styles.calorieUnit}>/ 1,800 kcal</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '80%' }]} />
              </View>
              <Text style={styles.caloriePercent}>80% 달성</Text>
            </View>

            <View style={styles.nutrientCard}>
              <Text style={styles.sectionTitle}>영양소</Text>
              {NUTRIENTS.map((nutrient) => {
                const pct = Math.round((nutrient.current / nutrient.target) * 100);
                return (
                  <View key={nutrient.name} style={styles.nutrientItem}>
                    <View style={styles.nutrientHeader}>
                      <Text style={styles.nutrientName}>{nutrient.name}</Text>
                      <Text style={styles.nutrientValue}>
                        {nutrient.current}/{nutrient.target}{nutrient.unit}
                      </Text>
                    </View>
                    <View style={styles.nutrientBar}>
                      <View style={[styles.nutrientFill, { width: `${pct}%` }]} />
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.issueCard}>
              <Text style={styles.sectionTitle}>건강 맞춤 식단</Text>
              <View style={styles.issueItem}>
                <Text style={styles.issueIcon}>🦴</Text>
                <View style={styles.issueInfo}>
                  <Text style={styles.issueTitle}>관절 건강</Text>
                  <Text style={styles.issueDesc}>관절 건강에 도움을 주는 영양소</Text>
                </View>
              </View>
              <View style={styles.issueItem}>
                <Text style={styles.issueIcon}>🧴</Text>
                <View style={styles.issueInfo}>
                  <Text style={styles.issueTitle}>피부/모질</Text>
                  <Text style={styles.issueDesc}>모질 건강 개선에 도움을 줌</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>전문가 추천</Text>
            {RECOMMENDED_FOODS.map((food) => (
              <View key={food.id} style={styles.foodCard}>
                <View style={styles.foodHeader}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodPrice}>{food.price}</Text>
                </View>
                <Text style={styles.foodBrand}>{food.brand}</Text>
                <Text style={styles.foodReason}>{food.reason}</Text>
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>구매하기</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: { padding: theme.spacing.xs },
  backText: { fontSize: 20, color: theme.colors.primary },
  title: { fontSize: 16, fontWeight: '600', color: theme.colors.onBackground },
  headerSpacer: { width: 40 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
  },
  tab: { flex: 1, paddingVertical: theme.spacing.md, alignItems: 'center' },
  tabSelected: { borderBottomWidth: 2, borderBottomColor: theme.colors.primary },
  tabText: { fontSize: 14, color: theme.colors.onSurfaceLight },
  tabTextSelected: { fontWeight: '600', color: theme.colors.primary },
  content: { flex: 1, padding: theme.spacing.lg },
  calorieCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  calorieLabel: { fontSize: 13, color: theme.colors.onSurfaceLight, marginBottom: theme.spacing.sm },
  calorieProgress: { flexDirection: 'row', alignItems: 'baseline', marginBottom: theme.spacing.md },
  calorieValue: { fontSize: 36, fontWeight: '700', color: theme.colors.primary },
  calorieUnit: { fontSize: 14, color: theme.colors.onSurfaceLight, marginLeft: theme.spacing.xs },
  progressBar: { height: 8, backgroundColor: theme.colors.borderLight, borderRadius: theme.borderRadius.full, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.full },
  caloriePercent: { fontSize: 12, color: theme.colors.success, textAlign: 'right', marginTop: theme.spacing.sm },
  nutrientCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.onSurface, marginBottom: theme.spacing.md },
  nutrientItem: { marginBottom: theme.spacing.md },
  nutrientHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xs },
  nutrientName: { fontSize: 13, color: theme.colors.onSurface },
  nutrientValue: { fontSize: 12, color: theme.colors.onSurfaceLight },
  nutrientBar: { height: 6, backgroundColor: theme.colors.borderLight, borderRadius: theme.borderRadius.full, overflow: 'hidden' },
  nutrientFill: { height: '100%', backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.full },
  issueCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  issueItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  issueIcon: { fontSize: 22, marginRight: theme.spacing.md },
  issueInfo: { flex: 1 },
  issueTitle: { fontSize: 14, fontWeight: '500', color: theme.colors.onSurface },
  issueDesc: { fontSize: 12, color: theme.colors.onSurfaceLight, marginTop: 2 },
  foodCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.soft,
  },
  foodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xs },
  foodName: { fontSize: 15, fontWeight: '600', color: theme.colors.onSurface },
  foodPrice: { fontSize: 14, fontWeight: '600', color: theme.colors.primary },
  foodBrand: { fontSize: 12, color: theme.colors.onSurfaceLight, marginBottom: theme.spacing.sm },
  foodReason: { fontSize: 13, color: theme.colors.onSurface, marginBottom: theme.spacing.md },
  buyButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  buyButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
});