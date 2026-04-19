import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSymptomStore } from '../../stores/symptomStore';
import { SymptomCard } from '../../components/SymptomCard';

type ParamList = {
  SymptomHistory: { petId: string };
};

export const SymptomHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'SymptomHistory'>>();
  const { petId } = route.params;
  const { symptoms, fetchSymptoms, isLoading } = useSymptomStore();

  useEffect(() => {
    fetchSymptoms(petId);
  }, [petId]);

  const groupedSymptoms = symptoms.reduce((groups, symptom) => {
    const date = symptom.date.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(symptom);
    return groups;
  }, {} as Record<string, typeof symptoms>);

  const sections = Object.entries(groupedSymptoms)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, data: items }));

  const renderSection = ({ item }: { item: typeof sections[0] }) => (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>{item.date}</Text>
      {item.data.map((symptom) => (
        <SymptomCard
          key={symptom.id}
          symptom={symptom}
          onPress={() => navigation.navigate('SymptomDetail' as never, { petId, symptomId: symptom.id } as never)}
        />
      ))}
    </View>
  );

  if (symptoms.length === 0 && !isLoading) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No symptoms logged</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('SymptomLog' as never, { petId } as never)}
        >
          <Text style={styles.addButtonText}>Log Symptom</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={sections}
      renderItem={renderSection}
      keyExtractor={(item) => item.date}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={() => fetchSymptoms(petId)} />
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#00897B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});