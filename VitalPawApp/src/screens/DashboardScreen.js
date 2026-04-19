import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, MetricDisplay, Button } from '../components';
import { COLORS, SPACING } from '../utils/constants';

export function DashboardScreen({ navigation }) {
  const pets = [{ name: '댕댕이', species: 'dog', weight: 8.5 }];
  const alerts = [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>안녕하세요!</Text>
          <Text style={styles.title}>오늘의 반려동물 상태</Text>
        </View>

        {alerts.length > 0 && (
          <Card style={styles.alertCard}>
            <Text style={styles.alertText}>⚠️ {alerts[0]?.message}</Text>
          </Card>
        )}

        <Text style={styles.sectionTitle}>핵심 지표</Text>
        <View style={styles.metricsRow}>
          <Card style={styles.metricCard}><MetricDisplay value="8.5" unit="kg" label="체중" /></Card>
          <Card style={styles.metricCard}><MetricDisplay value="85" unit="점" label="활동점수" /></Card>
          <Card style={styles.metricCard}><MetricDisplay value="2" unit="끼" label="오늘의 식사" /></Card>
        </View>

        <Text style={styles.sectionTitle}>빠른 실행</Text>
        <View style={styles.actionsRow}>
          <Button title="체중 기록" variant="primary" onPress={() => navigation.navigate('Monitoring')} />
          <Button title="식단 추가" variant="secondary" onPress={() => {}} />
        </View>
        <Button title="병원 예약" variant="accent" onPress={() => navigation.navigate('Services')} style={styles.actionBtn} />

        <Text style={styles.sectionTitle}>최근 활동</Text>
        <Card><Text style={styles.emptyText}>최근 활동이 없습니다.</Text></Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg },
  greeting: { fontSize: 16, color: COLORS.textSecondary },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  alertCard: { backgroundColor: '#FFF3E0', marginHorizontal: SPACING.lg },
  alertText: { color: COLORS.accentDark, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginHorizontal: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  metricsRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  metricCard: { flex: 1, padding: SPACING.sm },
  actionsRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  actionBtn: { marginHorizontal: SPACING.lg, marginTop: SPACING.sm },
  emptyText: { textAlign: 'center', color: COLORS.textLight, padding: SPACING.lg },
});
