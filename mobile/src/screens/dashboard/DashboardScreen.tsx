import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDashboardStore } from '../../stores/dashboardStore';
import { usePetStore, Pet } from '../../stores/petStore';
import { HealthScoreCard } from '../../components/HealthScoreCard';
import { QuickActionButton } from '../../components/QuickActionButton';

export function DashboardScreen(): JSX.Element {
  const navigation = useNavigation<any>();
  const {
    healthScore,
    recentActivity,
    careReminders,
    isLoading,
    fetchHealthScore,
    fetchRecentActivity,
    fetchCareReminders,
  } = useDashboardStore();

  const { pets, selectedPet, fetchPets, selectPet } = usePetStore();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Fetch pets if not loaded
    if (pets.length === 0) {
      await fetchPets();
    }

    // Select first pet if none selected
    const currentPets = usePetStore.getState().pets;
    if (currentPets.length > 0 && !selectedPet) {
      selectPet(currentPets[0]);
    }

    // Fetch dashboard data for selected pet
    if (selectedPet) {
      await Promise.all([
        fetchHealthScore(selectedPet.id),
        fetchRecentActivity(),
        fetchCareReminders(),
      ]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleQuickAction = (action: string) => {
    if (!selectedPet) return;

    switch (action) {
      case 'symptom':
        navigation.navigate('SymptomLog', { petId: selectedPet.id });
        break;
      case 'activity':
        navigation.navigate('ActivityLog', { petId: selectedPet.id });
        break;
      case 'diet':
        navigation.navigate('DietLog', { petId: selectedPet.id });
        break;
      case 'emergency':
        // Show emergency contact or dial
        console.log('Emergency action');
        break;
    }
  };

  const handlePetSelect = (pet: Pet) => {
    selectPet(pet);
    fetchHealthScore(pet.id);
  };

  const displayPet = selectedPet || pets[0];
  const displayScore = healthScore?.score ?? 75;
  const displayName = displayPet?.name ?? 'Your Pet';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00897B']} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🐾</Text>
        <Text style={styles.title}>VitalPaw</Text>
      </View>

      {/* Pet Selector (if multiple pets) */}
      {pets.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.petSelector}
          contentContainerStyle={styles.petSelectorContent}
        >
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[
                styles.petChip,
                selectedPet?.id === pet.id && styles.petChipSelected,
              ]}
              onPress={() => handlePetSelect(pet)}
            >
              <Text style={styles.petChipText}>{pet.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Health Score Card */}
      <HealthScoreCard
        score={displayScore}
        petName={displayName}
        lastUpdated={healthScore?.lastUpdated}
      />

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <QuickActionButton
            icon="🩺"
            label="Symptom Log"
            onPress={() => handleQuickAction('symptom')}
            color="#00897B"
            style={styles.quickActionButton}
          />
          <QuickActionButton
            icon="🏃"
            label="Activity"
            onPress={() => handleQuickAction('activity')}
            color="#3b82f6"
            style={styles.quickActionButton}
          />
          <QuickActionButton
            icon="🍽️"
            label="Diet"
            onPress={() => handleQuickAction('diet')}
            color="#f59e0b"
            style={styles.quickActionButton}
          />
          <QuickActionButton
            icon="🚨"
            label="Emergency"
            onPress={() => handleQuickAction('emergency')}
            color="#ef4444"
            style={styles.quickActionButton}
          />
        </View>
      </View>

      {/* Care Reminders */}
      {careReminders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
          {careReminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderIcon}>
                <Text>
                  {reminder.type === 'vaccination'
                    ? '💉'
                    : reminder.type === 'checkup'
                    ? '🩺'
                    : reminder.type === 'medication'
                    ? '💊'
                    : '✂️'}
                </Text>
              </View>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={styles.reminderPet}>{reminder.petName}</Text>
                <Text style={styles.reminderDate}>
                  {new Date(reminder.dueDate).toLocaleDateString()}
                </Text>
              </View>
              {reminder.isOverdue && (
                <View style={styles.overdueBadge}>
                  <Text style={styles.overdueText}>Overdue</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Text>
                  {activity.type === 'symptom'
                    ? '🩺'
                    : activity.type === 'activity'
                    ? '🏃'
                    : activity.type === 'diet'
                    ? '🍽️'
                    : '📋'}
                </Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.activityMeta}>
                  {activity.petName} • {formatRelativeTime(activity.timestamp)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {pets.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🐾</Text>
          <Text style={styles.emptyTitle}>Welcome to VitalPaw!</Text>
          <Text style={styles.emptyText}>
            Add your first pet to start tracking their health.
          </Text>
          <TouchableOpacity
            style={styles.addPetButton}
            onPress={() => navigation.navigate('AddPet')}
          >
            <Text style={styles.addPetButtonText}>Add Pet</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const time = new Date(timestamp).getTime();
  const diff = now - time;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#00897B',
  },
  logo: {
    fontSize: 28,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  petSelector: {
    maxHeight: 50,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  petSelectorContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  petChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    marginRight: 8,
  },
  petChipSelected: {
    backgroundColor: '#00897B',
  },
  petChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  reminderPet: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  reminderDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  overdueBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  overdueText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ef4444',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  activityMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  addPetButton: {
    backgroundColor: '#00897B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  addPetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});