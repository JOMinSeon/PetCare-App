import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { reminderService } from '../../services';
import { Card, LoadingSpinner, EmptyState, Button } from '../../components';

export default function ReminderScreen({ navigation }) {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setIsLoading(true);
    try {
      const response = await reminderService.getAll();
      setReminders(response.reminders || response);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReminders();
    setRefreshing(false);
  };

  const handleComplete = async (id) => {
    try {
      await reminderService.complete(id);
      fetchReminders();
    } catch (error) {
      Alert.alert('Error', 'Failed to complete reminder');
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      medication: '💊',
      vaccination: '💉',
      checkup: '🏥',
      diet: '🍖',
      exercise: '🏃',
      custom: '🔔',
    };
    return icons[type] || '🔔';
  };

  if (isLoading && reminders.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddReminder')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
              <Text style={styles.icon}>{getTypeIcon(item.reminder_type)}</Text>
              <View style={styles.reminderInfo}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>
                  {new Date(item.scheduled_at).toLocaleString()}
                </Text>
              </View>
              {!item.is_completed && (
                <TouchableOpacity
                  onPress={() => handleComplete(item.id)}
                  style={styles.completeButton}
                >
                  <Text style={styles.completeText}>✓</Text>
                </TouchableOpacity>
              )}
            </View>
            {item.message && <Text style={styles.message}>{item.message}</Text>}
            {item.is_completed && (
              <Text style={styles.completedBadge}>Completed</Text>
            )}
          </Card>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={reminders.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={
          <EmptyState message="No reminders yet" icon="🔔">
            <Button title="Add Reminder" onPress={() => navigation.navigate('AddReminder')} size="small" />
          </EmptyState>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  listContent: { padding: 16 },
  emptyContainer: { flex: 1 },
  reminderCard: { marginBottom: 12 },
  reminderHeader: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 28, marginRight: 12 },
  reminderInfo: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  time: { fontSize: 12, color: '#8E8E93', marginTop: 4 },
  message: { fontSize: 14, color: '#8E8E93', marginTop: 8 },
  completeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  completedBadge: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
    marginTop: 8,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 100,
  },
  fabText: { fontSize: 28, color: '#fff', fontWeight: '300' },
});