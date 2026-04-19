import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, Input } from '../components';
import { COLORS, SPACING } from '../utils/constants';

const { width } = Dimensions.get('window');

export function MonitoringScreen() {
  const [period, setPeriod] = useState('7일');
  const periods = ['7일', '30일', '90일', '1년'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>데이터 모니터링</Text>

        <View style={styles.periodSelector}>
          {periods.map(p => (
            <TouchableOpacity key={p} style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}>
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card title="체중 변화">
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>📊 체중 그래프</Text>
            <Text style={styles.chartSubtext}>7일 평균: 8.3kg</Text>
          </View>
          <View style={styles.targetLine}>
            <Text style={styles.targetText}>목표: 8.0kg</Text>
          </View>
        </Card>

        <Card title="활동량 추이">
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>📊 활동량 그래프</Text>
            <Text style={styles.chartSubtext}>일 평균: 12,500 스텝</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>데이터 입력</Text>
        <Card>
          <Input label="체중 (kg)" placeholder="8.5" keyboardType="numeric" />
          <Input label="활동량 (스텝)" placeholder="10000" keyboardType="numeric" />
          <Button title="기록하기" onPress={() => {}} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, padding: SPACING.lg },
  periodSelector: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, gap: SPACING.sm },
  periodBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: COLORS.backgroundSecondary },
  periodBtnActive: { backgroundColor: COLORS.primary },
  periodText: { fontSize: 14, color: COLORS.textSecondary },
  periodTextActive: { color: '#FFF', fontWeight: '600' },
  chartPlaceholder: { height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.backgroundSecondary, borderRadius: 12 },
  chartText: { fontSize: 16, color: COLORS.textSecondary },
  chartSubtext: { fontSize: 12, color: COLORS.textLight, marginTop: 8 },
  targetLine: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  targetText: { fontSize: 12, color: COLORS.success, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginHorizontal: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.sm },
});
