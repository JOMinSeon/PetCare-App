import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useDietStore } from '../../stores/dietStore';
import { VictoryBarChart, VictoryTheme } from 'victory-native';

type ParamList = {
  DietChart: { petId: string };
};

export const DietChartScreen: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'DietChart'>>();
  const { petId } = route.params;
  const { dietStats, fetchDietStats, isLoading } = useDietStore();

  useEffect(() => {
    fetchDietStats(petId);
  }, [petId]);

  if (!dietStats) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const chartData = dietStats.weeklyData.map((item, index) => ({
    x: index + 1,
    y: item.calories,
  }));

  const screenWidth = Dimensions.get('window').width - 32;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diet Overview</Text>
      </View>

      <View style={styles.calorieCard}>
        <Text style={styles.calorieLabel}>Today's Progress</Text>
        <Text style={styles.calorieValue}>{dietStats.caloriesConsumed}</Text>
        <Text style={styles.calorieTarget}>of {dietStats.calorieTarget} kcal</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min((dietStats.caloriesConsumed / dietStats.calorieTarget) * 100, 100)}%` }
            ]}
          />
        </View>
        <Text style={styles.remainingText}>
          {dietStats.caloriesRemaining} kcal remaining
        </Text>
      </View>

      <View style={styles.macrosCard}>
        <Text style={styles.sectionTitle}>Macronutrients</Text>
        <View style={styles.macrosGrid}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{dietStats.macros.protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{dietStats.macros.fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{dietStats.macros.carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Weekly Calories</Text>
        <VictoryBarChart
          width={screenWidth}
          height={200}
          theme={VictoryTheme.material}
          data={chartData}
          style={{
            data: { fill: '#00897B' },
          }}
        />
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
  calorieCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calorieLabel: {
    fontSize: 14,
    color: '#666',
  },
  calorieValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#00897B',
  },
  calorieTarget: {
    fontSize: 16,
    color: '#999',
  },
  progressBar: {
    width: '100%',
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
  remainingText: {
    fontSize: 14,
    color: '#666',
  },
  macrosCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
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
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00897B',
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});