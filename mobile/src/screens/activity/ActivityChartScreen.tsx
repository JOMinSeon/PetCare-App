import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useActivityStore } from '../../stores/activityStore';
import { ActivityLineChart } from '../../components/charts/ActivityLineChart';

type ParamList = {
  ActivityChart: { petId: string };
};

export const ActivityChartScreen: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'ActivityChart'>>();
  const { petId } = route.params;
  const { activityStats, fetchActivityStats, isLoading } = useActivityStore();

  useEffect(() => {
    fetchActivityStats(petId);
  }, [petId]);

  if (!activityStats) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity Overview</Text>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressLabel}>Daily Goal Progress</Text>
        <Text style={styles.progressValue}>{activityStats.goalProgress}%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(activityStats.goalProgress, 100)}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {activityStats.averageDaily} / {activityStats.goalMinutes} min average
        </Text>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>7-Day Activity</Text>
        <ActivityLineChart
          data={activityStats.chartData}
          goalMinutes={activityStats.goalMinutes}
          height={220}
        />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activityStats.totalMinutes}</Text>
          <Text style={styles.statLabel}>Total Minutes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activityStats.totalSteps}</Text>
          <Text style={styles.statLabel}>Total Steps</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activityStats.averageDaily}</Text>
          <Text style={styles.statLabel}>Daily Average</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activityStats.goalMinutes}</Text>
          <Text style={styles.statLabel}>Goal (min)</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#00897B',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  progressCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#00897B',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00897B',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  chartSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    width: '50%',
    padding: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});