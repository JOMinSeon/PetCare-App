import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Switch,
  Alert,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useReminder } from '../../src/contexts/ReminderContext';
import { Reminder, getReminderTypeLabel, getReminderTypeEmoji, getRepeatPatternLabel, ReminderType } from '../../src/types/notification.types';

export default function RemindersScreen() {
  const router = useRouter();
  const { reminders, isLoading, error, fetchReminders, toggleReminder, removeReminder } = useReminder();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<ReminderType | 'ALL'>('ALL');

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReminders();
    setRefreshing(false);
  };

  const handleFilterChange = (newFilter: ReminderType | 'ALL') => {
    setFilter(newFilter);
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleReminder(id);
    } catch (err) {
      Alert.alert('오류', '리마인더 상태 변경에 실패했습니다');
    }
  };

  const handleDelete = (reminder: Reminder) => {
    Alert.alert(
      '리마인더 삭제',
      `${reminder.title}을(를) 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeReminder(reminder.id);
            } catch (err) {
              Alert.alert('오류', '리마인더 삭제에 실패했습니다');
            }
          },
        },
      ]
    );
  };

  const filteredReminders = filter === 'ALL'
    ? reminders
    : reminders.filter(r => r.type === filter);

  const renderReminderItem = ({ item }: { item: Reminder }) => {
    const emoji = getReminderTypeEmoji(item.type);
    const typeLabel = getReminderTypeLabel(item.type);
    const repeatLabel = getRepeatPatternLabel(item.repeatPattern);

    return (
      <TouchableOpacity
        style={styles.reminderCard}
        onPress={() => router.push(`/reminder/edit/${item.id}`)}
        onLongPress={() => handleDelete(item)}
      >
        <View style={styles.reminderIcon}>
          <Text style={styles.iconEmoji}>{emoji}</Text>
        </View>
        <View style={styles.reminderContent}>
          <View style={styles.reminderHeader}>
            <Text style={styles.reminderTitle}>{item.title}</Text>
            <Switch
              value={item.isActive}
              onValueChange={() => handleToggle(item.id)}
              trackColor={{ false: '#e0e0e0', true: '#34C759' }}
            />
          </View>
          <Text style={styles.reminderType}>{typeLabel}</Text>
          <Text style={styles.reminderTime}>
            {item.triggerDate} {item.triggerTime}
          </Text>
          {item.repeatPattern !== 'NONE' && (
            <Text style={styles.reminderRepeat}>🔄 {repeatLabel}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🔔</Text>
      <Text style={styles.emptyTitle}>리마인더가 없습니다</Text>
      <Text style={styles.emptySubtitle}>
        중요하게的时刻을 기억하세요
      </Text>
      <Link href="/reminder/add" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ 리마인더 추가</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  const filterButtons: Array<{ key: ReminderType | 'ALL'; label: string }> = [
    { key: 'ALL', label: '전체' },
    { key: ReminderType.MEDICATION, label: '💊 약물' },
    { key: ReminderType.VACCINATION, label: '💉 예방접종' },
    { key: ReminderType.WALK, label: '🐕 산책' },
    { key: ReminderType.CUSTOM, label: '🔔 사용자 정의' },
  ];

  if (isLoading && reminders.length === 0) {
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
        data={filteredReminders}
        renderItem={renderReminderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filteredReminders.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {filteredReminders.length > 0 && (
        <Link href="/reminder/add" asChild>
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
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
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
  reminderCard: {
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
  reminderIcon: {
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
  reminderContent: {
    flex: 1,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  reminderType: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  reminderTime: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  reminderRepeat: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
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