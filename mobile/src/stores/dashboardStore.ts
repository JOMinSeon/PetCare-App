import { create } from 'zustand';
import api from '../services/api';
import { usePetStore } from './petStore';

interface HealthFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
}

interface HealthScore {
  petId: string;
  score: number;
  factors: HealthFactor[];
  lastUpdated: string;
}

interface RecentActivity {
  id: string;
  type: 'symptom' | 'activity' | 'diet' | 'checkup';
  description: string;
  timestamp: string;
  petId: string;
  petName: string;
}

interface CareReminder {
  id: string;
  petId: string;
  petName: string;
  type: 'vaccination' | 'medication' | 'checkup' | 'grooming';
  title: string;
  dueDate: string;
  isOverdue: boolean;
}

interface DashboardState {
  healthScore: HealthScore | null;
  recentActivity: RecentActivity[];
  careReminders: CareReminder[];
  isLoading: boolean;
  error: string | null;
  fetchHealthScore: (petId: string) => Promise<void>;
  fetchRecentActivity: () => Promise<void>;
  fetchCareReminders: () => Promise<void>;
  clearDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  healthScore: null,
  recentActivity: [],
  careReminders: [],
  isLoading: false,
  error: null,

  fetchHealthScore: async (petId: string) => {
    set({ isLoading: true, error: null });
    try {
      const healthScore = await api.get<HealthScore>(`/pets/${petId}/health`);
      set({ healthScore, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch health score';
      set({ error: message, isLoading: false });
      // Set a default stub health score for demo purposes
      set({
        healthScore: {
          petId,
          score: 75,
          factors: [
            { name: 'Weight', value: 15, weight: 0.3, contribution: 20 },
            { name: 'Age', value: 3.5, weight: 0.2, contribution: 20 },
            { name: 'Species', value: 1, weight: 0.1, contribution: 10 },
            { name: 'Activity', value: 0, weight: 0.2, contribution: 15 },
            { name: 'Diet', value: 0, weight: 0.2, contribution: 10 },
          ],
          lastUpdated: new Date().toISOString(),
        },
      });
    }
  },

  fetchRecentActivity: async () => {
    try {
      // Stub implementation - will be connected to real data in Phase 3
      // For now, return some placeholder activity
      const pets = usePetStore.getState().pets;

      if (pets.length === 0) {
        set({ recentActivity: [] });
        return;
      }

      // Generate stub activities based on pets
      const activities: RecentActivity[] = pets.slice(0, 3).map((pet, index) => ({
        id: `stub-${index}`,
        type: ['symptom', 'activity', 'diet'][index % 3] as RecentActivity['type'],
        description: getStubActivityDescription(index),
        timestamp: new Date(Date.now() - index * 86400000).toISOString(),
        petId: pet.id,
        petName: pet.name,
      }));

      set({ recentActivity: activities });
    } catch (error: unknown) {
      console.error('Error fetching recent activity:', error);
      set({ recentActivity: [] });
    }
  },

  fetchCareReminders: async () => {
    try {
      // Stub implementation - will be connected to real reminders in Phase 3/5
      const pets = usePetStore.getState().pets;

      if (pets.length === 0) {
        set({ careReminders: [] });
        return;
      }

      // Generate stub reminders based on pets
      const reminders: CareReminder[] = pets.slice(0, 2).map((pet, index) => ({
        id: `stub-reminder-${index}`,
        petId: pet.id,
        petName: pet.name,
        type: ['vaccination', 'checkup'][index % 2] as CareReminder['type'],
        title: index === 0 ? 'Annual Vaccination Due' : 'Dental Checkup',
        dueDate: new Date(Date.now() + (index + 1) * 7 * 86400000).toISOString(),
        isOverdue: false,
      }));

      set({ careReminders: reminders });
    } catch (error: unknown) {
      console.error('Error fetching care reminders:', error);
      set({ careReminders: [] });
    }
  },

  clearDashboard: () => {
    set({
      healthScore: null,
      recentActivity: [],
      careReminders: [],
      error: null,
    });
  },
}));

function getStubActivityDescription(index: number): string {
  const descriptions = [
    'Logged daily walk - 30 minutes',
    'Recorded meal - 150g dry food',
    'No symptoms recorded',
    'Played fetch - 15 minutes',
    'Water intake normal',
  ];
  return descriptions[index % descriptions.length];
}