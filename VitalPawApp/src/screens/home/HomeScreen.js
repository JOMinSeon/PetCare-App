import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { usePetStore, useHealthStore } from '../../store';
import { Card, LoadingSpinner, EmptyState, PetCard } from '../../components';

export default function HomeScreen({ navigation }) {
  const { pets, fetchPets, selectedPet, isLoading: petLoading } = usePetStore();
  const { healthMetrics, dietLogs, fetchHealthMetrics, fetchDietLogs } = useHealthStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchPets();
  };

  if (petLoading && pets.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={petLoading} onRefresh={loadData} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back! 👋</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Pets</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Pets')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {pets.length === 0 ? (
          <EmptyState
            message="No pets yet. Add your first pet!"
            icon="🐾"
          >
            <TouchableOpacity onPress={() => navigation.navigate('AddPet')}>
              <Text style={styles.addPetText}>+ Add Pet</Text>
            </TouchableOpacity>
          </EmptyState>
        ) : (
          pets.slice(0, 3).map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onPress={() => navigation.navigate('PetDetail', { petId: pet.id })}
            />
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AddHealthMetric')}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Log Health</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AddDiet')}
          >
            <Text style={styles.actionIcon}>🍖</Text>
            <Text style={styles.actionText}>Log Diet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AddActivity')}
          >
            <Text style={styles.actionIcon}>🏃</Text>
            <Text style={styles.actionText}>Log Activity</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Health Metrics</Text>
        {healthMetrics.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>No health metrics recorded yet</Text>
          </Card>
        ) : (
          healthMetrics.slice(0, 3).map((metric) => (
            <Card key={metric.id}>
              <Text style={styles.metricType}>{metric.metric_type}</Text>
              <Text style={styles.metricValue}>{metric.value} {metric.unit}</Text>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  date: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
  },
  addPetText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  emptyText: {
    color: '#8E8E93',
    textAlign: 'center',
  },
  metricType: {
    fontSize: 14,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 4,
  },
});