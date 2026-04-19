import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components';
import { COLORS, SPACING } from '../utils/constants';

const FILTERS = ['전체', '식단', '활동', '검진', '약물'];

export function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState('전체');

  const logs = [
    { id: 1, type: 'diet', date: '2024-01-15', title: '아침 사료', summary: '80g' },
    { id: 2, type: 'activity', date: '2024-01-15', title: '산책', summary: '30분' },
    { id: 3, type: 'medical', date: '2024-01-14', title: '건강검진', summary: '没有问题' },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'diet': return '🍖';
      case 'activity': return '🏃';
      case 'medical': return '🏥';
      default: return '📝';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>기록 이력</Text>

      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
            onPress={() => setActiveFilter(f)}>
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.list}>
        {logs.map(log => (
          <Card key={log.id} style={styles.logCard}>
            <View style={styles.logRow}>
              <Text style={styles.logIcon}>{getIcon(log.type)}</Text>
              <View style={styles.logContent}>
                <Text style={styles.logTitle}>{log.title}</Text>
                <Text style={styles.logSummary}>{log.summary}</Text>
              </View>
              <Text style={styles.logDate}>{log.date}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, padding: SPACING.lg },
  filterRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, gap: SPACING.sm },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: COLORS.backgroundSecondary },
  filterBtnActive: { backgroundColor: COLORS.primary },
  filterText: { fontSize: 14, color: COLORS.textSecondary },
  filterTextActive: { color: '#FFF', fontWeight: '600' },
  list: { flex: 1, paddingHorizontal: SPACING.lg },
  logCard: { marginBottom: SPACING.sm },
  logRow: { flexDirection: 'row', alignItems: 'center' },
  logIcon: { fontSize: 24, marginRight: 12 },
  logContent: { flex: 1 },
  logTitle: { fontSize: 16, fontWeight: '500', color: COLORS.text },
  logSummary: { fontSize: 14, color: COLORS.textSecondary },
  logDate: { fontSize: 12, color: COLORS.textLight },
});
