import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useHealth } from '../../src/contexts/HealthContext';
import {
  HealthRecord,
  HealthRecordType,
  getRecordTypeLabel,
  getRecordTypeEmoji,
  VaccinationData,
  MedicationData,
  ExaminationData,
  formatFrequency,
} from '../../src/types/health.types';

const filterOptions: { label: string; value: HealthRecordType | null }[] = [
  { label: '전체', value: null },
  { label: '💉 예방접종', value: HealthRecordType.VACCINATION },
  { label: '💊 약물', value: HealthRecordType.MEDICATION },
  { label: '🏥 진료', value: HealthRecordType.EXAMINATION },
];

export default function HealthTimelineScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const router = useRouter();
  const { records, isLoading, error, fetchTimeline, removeRecord } = useHealth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<HealthRecordType | null>(null);

  const loadTimeline = useCallback(async () => {
    if (petId) {
      await fetchTimeline(petId, selectedFilter ? { type: selectedFilter } : undefined);
    }
  }, [petId, selectedFilter, fetchTimeline]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTimeline();
    setRefreshing(false);
  };

  const handleFilterChange = (filter: HealthRecordType | null) => {
    setSelectedFilter(filter);
  };

  const handleDeleteRecord = (record: HealthRecord) => {
    Alert.alert(
      '건강 기록 삭제',
      '이 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeRecord(petId, record.id);
            } catch (err) {
              Alert.alert('오류', '건강 기록 삭제에 실패했습니다');
            }
          },
        },
      ]
    );
  };

  const getRecordSummary = (record: HealthRecord): string => {
    switch (record.type) {
      case HealthRecordType.VACCINATION: {
        const data = record.data as VaccinationData;
        return data.vaccineName;
      }
      case HealthRecordType.MEDICATION: {
        const data = record.data as MedicationData;
        return `${data.medicineName} - ${formatFrequency(data.frequency)}`;
      }
      case HealthRecordType.EXAMINATION: {
        const data = record.data as ExaminationData;
        return data.diagnosis;
      }
      default:
        return '';
    }
  };

  const renderHealthRecordCard = ({ item }: { item: HealthRecord }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/health/${petId}/${item.id}`)}
      onLongPress={() => handleDeleteRecord(item)}
    >
      <View style={styles.cardIcon}>
        <Text style={styles.iconEmoji}>{getRecordTypeEmoji(item.type)}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardType}>{getRecordTypeLabel(item.type)}</Text>
          <Text style={styles.cardDate}>{item.recordDate}</Text>
        </View>
        <Text style={styles.cardTitle}>{getRecordSummary(item)}</Text>
      </View>
      <Text style={styles.cardArrow}>›</Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📋</Text>
      <Text style={styles.emptyTitle}>건강 기록이 없습니다</Text>
      <Text style={styles.emptySubtitle}>
       预防접종, 약물, 진료 기록을 등록하여 반려동물의 건강을 관리하세요
      </Text>
      <Link href={`/health/${petId}/add`} asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 건강 기록 추가</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  const filteredRecords = selectedFilter
    ? records.filter(r => r.type === selectedFilter)
    : records;

  if (isLoading && records.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>건강 기록</Text>
        <Link href={`/health/${petId}/add`} asChild>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>+ 추가</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={filterOptions}
          keyExtractor={(item) => item.label}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === item.value && styles.filterButtonActive,
              ]}
              onPress={() => handleFilterChange(item.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === item.value && styles.filterButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredRecords}
        renderItem={renderHealthRecordCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filteredRecords.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  headerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtonText: {
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
  filterContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
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
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardType: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  cardDate: {
    fontSize: 12,
    color: '#999999',
  },
  cardTitle: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  cardArrow: {
    fontSize: 24,
    color: '#cccccc',
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
});
