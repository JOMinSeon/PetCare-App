import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useHealthStore, usePetStore } from '../../store';
import { MetricCard, LoadingSpinner, EmptyState, Button } from '../../components';

export default function HealthMetricsScreen({ navigation }) {
  const { healthMetrics, fetchHealthMetrics, isLoading } = useHealthStore();
  const { selectedPet, pets } = usePetStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (selectedPet) {
      fetchHealthMetrics(selectedPet.id);
    } else if (pets.length > 0) {
      fetchHealthMetrics(pets[0].id);
    }
  }, [selectedPet]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedPet) {
      await fetchHealthMetrics(selectedPet.id);
    }
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Metrics</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddHealthMetric')}>
          <Text style={styles.addButton}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {healthMetrics.length === 0 ? (
        <EmptyState message="No health metrics recorded yet" icon="📊">
          <Button
            title="Record Metric"
            onPress={() => navigation.navigate('AddHealthMetric')}
            size="small"
          />
        </EmptyState>
      ) : (
        <FlatList
          data={healthMetrics}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MetricCard metric={item} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  addButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
});