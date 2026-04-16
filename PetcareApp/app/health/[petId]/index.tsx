import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useHealth } from '../../src/contexts/HealthContext';
import { HealthRecord, getRecordTypeLabel, getRecordTypeEmoji, HealthRecordType, VaccinationData, MedicationData, ExaminationData } from '../../src/types/health.types';

export default function HealthTimelineScreen() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { records, isLoading, error, fetchTimeline } = useHealth();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<HealthRecordType | 'ALL'>('ALL');

  useEffect(() => {
    if (petId) {
      fetchTimeline(petId);
    }
  }, [petId, fetchTimeline]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (petId) {
      const filters = filter !== 'ALL' ? { type: filter as HealthRecordType } : undefined;
      await fetchTimeline(petId, filters);
    }
    setRefreshing(false);
  };

  const handleFilterChange = (newFilter: HealthRecordType | 'ALL') => {
    setFilter(newFilter);
    if (petId) {
      const filters = newFilter !== 'ALL' ? { type: newFilter as HealthRecordType } : undefined;
      fetchTimeline(petId, filters);
    }
  };

  const renderRecordItem = ({ item }: { item: HealthRecord }) => {
    const emoji = getRecordTypeEmoji(item.type);
    const typeLabel = getRecordTypeLabel(item.type);
    
    let summary = '';
    if (item.type === HealthRecordType.VACCINATION) {
      const data = item.data as VaccinationData;
      summary = `${data.vaccineName}`;
    } else if (item.type === HealthRecordType.MEDICATION) {
      const data = item.data as MedicationData;
      summary = `${data.medicineName} - ${data.frequency}`;
    } else if (item.type === HealthRecordType.EXAMINATION) {
      const data = item.data as ExaminationData;
      summary = `${data.clinicName}: ${data.diagnosis}`;
    }

    return (
      <TouchableOpacity
        style={styles.recordCard}
        onPress={() => router.push(`/health/${petId}/${item.id}`)}
      >
        <View style={styles.recordIcon}>
          <Text style={styles.iconEmoji}>{emoji}</Text>
        </View>
        <View style={styles.recordContent}>
          <View style={styles.recordHeader}>
            <Text style={styles.recordType}>{typeLabel}</Text>
            <Text style={styles.recordDate}>{item.recordDate}</Text>
          </View>
          <Text style={styles.recordSummary}>{summary}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📋</Text>
      <Text style={styles.emptyTitle}>건강 기록이 없습니다</Text>
      <Text style={styles.emptySubtitle}>
        예방접종, 약물, 진료 이력을 기록해보세요
      </Text>
      <Link href={`/health/${petId}/add`} asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 기록 추가</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  const filterButtons: Array<{ key: HealthRecordType | 'ALL'; label: string }> = [
    { key: 'ALL', label: '전체' },
    { key: HealthRecordType.VACCINATION, label: '💉 예방접종' },
    { key: HealthRecordType.MEDICATION, label: '💊 약물' },
    { key: HealthRecordType.EXAMINATION, label: '🏥 진료' },
  ];

  if (isLoading && records.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {filterButtons.map((btn) => (
          <TouchableOpacity
            key={btn.key}
            style={[
              styles.filterButton,
              filter === btn.key && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterChange(btn.key)}
          >
            <Text style={[
              styles.filterButtonText,
              filter === btn.key && styles.filterButtonTextActive,
            ]}>
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={records}
        renderItem={renderRecordItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={records.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {records.length > 0 && (
        <Link href={`/health/${petId}/add`} asChild>
          <TouchableOpacity style={styles.fab}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  filterButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#fff3cd',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#856404',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 24,
  },
  recordContent: {
    flex: 1,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  recordType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  recordDate: {
    fontSize: 12,
    color: '#999999',
  },
  recordSummary: {
    fontSize: 14,
    color: '#333333',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});