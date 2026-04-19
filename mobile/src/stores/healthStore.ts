/**
 * Health Store
 * 
 * Zustand store for health score and related health data.
 */

import { create } from 'zustand';
import healthService, {
  HealthScoreResponse,
  ActivityStats,
  DietStats,
} from '../services/health.service';

interface HealthState {
  healthScore: HealthScoreResponse | null;
  activityStats: ActivityStats | null;
  dietStats: DietStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchHealthScore: (petId: string) => Promise<void>;
  fetchActivityStats: (petId: string, days?: number) => Promise<void>;
  fetchDietStats: (petId: string, days?: number) => Promise<void>;
  clearHealthData: () => void;
}

export const useHealthStore = create<HealthState>((set) => ({
  healthScore: null,
  activityStats: null,
  dietStats: null,
  isLoading: false,
  error: null,

  fetchHealthScore: async (petId: string) => {
    set({ isLoading: true, error: null });
    try {
      const healthScore = await healthService.getHealthScore(petId);
      set({ healthScore, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch health score';
      set({ error: message, isLoading: false });
      console.error('Error fetching health score:', error);
    }
  },

  fetchActivityStats: async (petId: string, days: number = 7) => {
    try {
      const activityStats = await healthService.getActivityStats(petId, days);
      set({ activityStats });
    } catch (error) {
      console.error('Error fetching activity stats:', error);
    }
  },

  fetchDietStats: async (petId: string, days: number = 7) => {
    try {
      const dietStats = await healthService.getDietStats(petId, days);
      set({ dietStats });
    } catch (error) {
      console.error('Error fetching diet stats:', error);
    }
  },

  clearHealthData: () => {
    set({
      healthScore: null,
      activityStats: null,
      dietStats: null,
      error: null,
    });
  },
}));

export default useHealthStore;
