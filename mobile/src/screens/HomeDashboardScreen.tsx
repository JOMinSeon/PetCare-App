import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Pet } from '../types';
import { theme } from '../theme';

interface Props {
  pets: Pet[];
  onNavigate: (screen: string) => void;
}

const ACTIVITY_VALUES = [60, 75, 45, 80, 55, 90, 70];
const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

const SCHEDULE_ITEMS = [
  { icon: '💉', title: '예방접종', date: '4.20', dDay: 'D-5' },
  { icon: '🛡️', title: '구충제 투약', date: '4.25', dDay: 'D-10' },
];

export default React.memo(function HomeDashboardScreen({ pets, onNavigate }: Props) {
  const navigateDiet = useCallback(() => onNavigate('diet'), [onNavigate]);
  const navigateSymptom = useCallback(() => onNavigate('symptom'), [onNavigate]);
  const navigateMap = useCallback(() => onNavigate('map'), [onNavigate]);
  const navigatePetId = useCallback(() => onNavigate('petid'), [onNavigate]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.greetingSection}>
        <Text style={styles.greeting}>Good Morning!</Text>
        <Text style={styles.subGreeting}>뽀야님의 건강을 확인해보세요</Text>
      </View>

      <View style={styles.healthScoreCard}>
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreLabel}>오늘의 건강 점수</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>우수</Text>
          </View>
        </View>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>85</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <View style={styles.petInfo}>
          <Text style={styles.petAvatar}>🐕</Text>
          <View>
            <Text style={styles.petName}>뽀야</Text>
            <Text style={styles.petBreed}>말티즈 • 3세</Text>
          </View>
        </View>
      </View>

      <View style={styles.activityCard}>
        <Text style={styles.sectionTitle}>활동량</Text>
        <View style={styles.activityChart}>
          {ACTIVITY_VALUES.map((value, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={[styles.bar, { height: value * 1.2 }]} />
              <Text style={styles.barLabel}>{WEEKDAY_LABELS[index]}</Text>
            </View>
          ))}
        </View>
        <View style={styles.activitySummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>6,800</Text>
            <Text style={styles.summaryLabel}>걸음 수</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>85%</Text>
            <Text style={styles.summaryLabel}>목표 달성</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>45m</Text>
            <Text style={styles.summaryLabel}>산책 시간</Text>
          </View>
        </View>
      </View>

      <View style={styles.scheduleCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>다가오는 일정</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>전체 보기</Text>
          </TouchableOpacity>
        </View>
        {SCHEDULE_ITEMS.map((item) => (
          <View key={item.title} style={styles.scheduleItem}>
            <View style={styles.scheduleIcon}>
              <Text style={styles.scheduleIconText}>{item.icon}</Text>
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTitle}>{item.title}</Text>
              <Text style={styles.scheduleDate}>{item.date}</Text>
            </View>
            <View style={styles.scheduleBadge}>
              <Text style={styles.scheduleBadgeText}>{item.dDay}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>빠른 실행</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionItem} onPress={navigateDiet}>
            <View style={[styles.actionIconBg, { backgroundColor: '#E8F4EF' }]}>
              <Text style={styles.actionIcon}>🍽️</Text>
            </View>
            <Text style={styles.actionText}>식단 관리</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={navigateSymptom}>
            <View style={[styles.actionIconBg, { backgroundColor: '#FEF3E8' }]}>
              <Text style={styles.actionIcon}>🩺</Text>
            </View>
            <Text style={styles.actionText}>증상 분석</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={navigateMap}>
            <View style={[styles.actionIconBg, { backgroundColor: '#E8F0FE' }]}>
              <Text style={styles.actionIcon}>📍</Text>
            </View>
            <Text style={styles.actionText}>주변 서비스</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={navigatePetId}>
            <View style={[styles.actionIconBg, { backgroundColor: '#F3E8FE' }]}>
              <Text style={styles.actionIcon}>🏷️</Text>
            </View>
            <Text style={styles.actionText}>펫 ID</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.emergencyButton}>
        <Text style={styles.emergencyIcon}>🚨</Text>
        <Text style={styles.emergencyText}>응급 상황 알림</Text>
      </TouchableOpacity>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  greetingSection: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.onBackground,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 14,
    color: theme.colors.onSurfaceLight,
    marginTop: 4,
  },
  healthScoreCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  scoreBadge: {
    backgroundColor: '#E8F4EF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.full,
  },
  scoreBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.success,
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  scoreValue: {
    fontSize: 52,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  scoreMax: {
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.onSurfaceLight,
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  petAvatar: {
    fontSize: 32,
  },
  petName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  petBreed: {
    fontSize: 12,
    color: theme.colors.onSurfaceLight,
  },
  activityCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  seeAll: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  activityChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: theme.spacing.md,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  barLabel: {
    fontSize: 10,
    color: theme.colors.onSurfaceLight,
  },
  activitySummary: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  summaryLabel: {
    fontSize: 11,
    color: theme.colors.onSurfaceLight,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
  },
  scheduleCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  scheduleIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  scheduleIconText: {
    fontSize: 20,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  scheduleDate: {
    fontSize: 12,
    color: theme.colors.onSurfaceLight,
    marginTop: 2,
  },
  scheduleBadge: {
    backgroundColor: '#FEF3E8',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.full,
  },
  scheduleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.warning,
  },
  quickActions: {
    margin: theme.spacing.lg,
    marginTop: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  actionItem: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionIcon: {
    fontSize: 22,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.lg,
    marginTop: 0,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.danger,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.soft,
  },
  emergencyIcon: {
    fontSize: 18,
    marginRight: theme.spacing.sm,
  },
  emergencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});