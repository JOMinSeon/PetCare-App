import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useMedicalRecordStore } from '../../stores/medicalRecordStore';
import { MedicalRecordCard } from '../../components/MedicalRecordCard';
import { MedicalRecordType } from '../../services/medicalRecord.service';

type ParamList = {
  MedicalRecordList: { petId: string };
};

export const MedicalRecordListScreen: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'MedicalRecordList'>>();
  const navigation = useNavigation();
  const { petId } = route.params;
  const { records, fetchRecords, deleteRecord, isLoading } = useMedicalRecordStore();
  const [filter, setFilter] = useState<MedicalRecordType | 'all'>('all');

  useEffect(() => {
    fetchRecords(petId);
  }, [petId]);

  const filteredRecords = filter === 'all'
    ? records
    : records.filter(r => r.type === filter);

  const groupedRecords = filteredRecords.reduce((groups, record) => {
    const key = record.type;
    if (!groups[key]) groups[key] = [];
    groups[key].push(record);
    return groups;
  }, {} as Record<string, typeof records>);

  const sections = Object.entries(groupedRecords).map(([type, data]) => ({
    title: type === 'vaccination' ? '💉 Vaccinations' : '🏥 Checkups',
    data,
  }));

  const renderSection = ({ item }: { item: typeof sections[0] }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{item.title}</Text>
      {item.data.map((record) => (
        <MedicalRecordCard
          key={record.id}
          record={record}
          onPress={() => navigation.navigate('MedicalRecordDetail' as never, { petId, recordId: record.id } as never)}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {(['all', 'vaccination', 'checkup'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterChip, filter === type && styles.filterChipSelected]}
            onPress={() => setFilter(type)}
          >
            <Text style={[styles.filterText, filter === type && styles.filterTextSelected]}>
              {type === 'all' ? 'All' : type === 'vaccination' ? '💉 Vaccinations' : '🏥 Checkups'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddMedicalRecord' as never, { petId } as never)}
      >
        <Text style={styles.addButtonText}>+ Add Record</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipSelected: {
    backgroundColor: '#00897B',
    borderColor: '#00897B',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#00897B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});