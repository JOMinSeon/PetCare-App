import { create } from 'zustand';
import { activityService, Activity, ActivityStats, CreateActivityRequest } from '../services/activity.service';

interface ActivityState {
  activities: Activity[];
  activityStats: ActivityStats | null;
  isLoading: boolean;
  error: string | null;
  fetchActivities: (petId: string, days?: number) => Promise<void>;
  fetchActivityStats: (petId: string) => Promise<void>;
  createActivity: (petId: string, data: CreateActivityRequest) => Promise<void>;
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  activityStats: null,
  isLoading: false,
  error: null,

  fetchActivities: async (petId: string, days?: number) => {
    set({ isLoading: true, error: null });
    try {
      const activities = await activityService.getActivities(petId, days);
      set({ activities, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchActivityStats: async (petId: string) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await activityService.getActivityStats(petId);
      set({ activityStats: stats, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createActivity: async (petId: string, data: CreateActivityRequest) => {
    set({ isLoading: true, error: null });
    try {
      const activity = await activityService.createActivity(petId, data);
      set((state) => ({
        activities: [activity, ...state.activities],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  clearActivities: () => set({ activities: [], activityStats: null }),
}));