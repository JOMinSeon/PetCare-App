import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SymptomAnalysis } from '../types';
import { theme } from '../theme';

interface Props {
  analyses: SymptomAnalysis[];
  onBack: () => void;
  petId?: string;
  accessToken?: string;
  onLoadHistory?: (petId: string) => void;
}

const URGENCY_CONFIG = {
  GREEN: { color: '#22c55e', label: '낮은 긴급성' },
  YELLOW: { color: '#eab308', label: '중간 긴급성' },
  RED: { color: '#ef4444', label: '높은 긴급성' },
};

interface HistoryCardProps {
  item: SymptomAnalysis;
}

const HistoryCard = React.memo(function HistoryCard({ item }: HistoryCardProps) {
  const urgency = URGENCY_CONFIG[item.urgencyLevel];
  const date = new Date(item.createdAt);
  const formattedDate = date.toLocaleDateString('ko-KR');

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={[styles.badge, { backgroundColor: urgency.color }]}>
            <Text style={styles.badgeText}>{urgency.label}</Text>
          </View>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
      <Text style={styles.symptoms} numberOfLines={2}>{item.symptoms}</Text>
    </View>
  );
});

export default function SymptomHistoryScreen({
  analyses,
  onBack,
  petId,
  onLoadHistory,
}: Props) {
  useEffect(() => {
    if (petId && onLoadHistory) {
      onLoadHistory(petId);
    }
  }, [petId, onLoadHistory]);

  const renderItem = ({ item }: { item: SymptomAnalysis }) => (
    <HistoryCard item={item} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>분석 기록</Text>
        <View style={styles.headerSpacer} />
      </View>

      {analyses.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>아직 분석 기록이 없습니다</Text>
          <Text style={styles.emptySubtext}>반려동물의 증상을 분석해보세요</Text>
        </View>
      ) : (
        <FlatList
          data={analyses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          initialNumToRender={8}
          maxToRenderPerBatch={5}
          windowSize={10}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: { padding: theme.spacing.xs },
  backText: { fontSize: 15, color: theme.colors.primary },
  title: { fontSize: 16, fontWeight: '600', color: theme.colors.onBackground },
  headerSpacer: { width: 50 },
  list: { padding: theme.spacing.lg },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  cardHeader: { flexDirection: 'row' },
  cardInfo: { flex: 1 },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeText: { color: theme.colors.background, fontSize: 11, fontWeight: '600' },
  date: { fontSize: 12, color: theme.colors.onSurfaceLight, marginTop: 6 },
  symptoms: { marginTop: theme.spacing.sm, fontSize: 14, color: theme.colors.onSurface, lineHeight: 20 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: { fontSize: 16, color: theme.colors.onSurface, fontWeight: '500' },
  emptySubtext: { fontSize: 13, color: theme.colors.onSurfaceLight, marginTop: theme.spacing.sm },
});