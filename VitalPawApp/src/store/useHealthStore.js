import { create } from 'zustand';
import { healthMetricService, dietLogService, activityLogService } from '../services';

const useHealthStore = create((set, get) => ({
  healthMetrics: [],
  dietLogs: [],
  activityLogs: [],
  isLoading: false,
  error: null,

  fetchHealthMetrics: async (petId, options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await healthMetricService.getByPetId(petId, options);
      set({ healthMetrics: response.metrics || response, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchDietLogs: async (petId, options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await dietLogService.getByPetId(petId, options);
      set({ dietLogs: response.dietLogs || response, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchActivityLogs: async (petId, options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await activityLogService.getByPetId(petId, options);
      set({ activityLogs: response.activityLogs || response, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addHealthMetric: async (metricData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await healthMetricService.create(metricData);
      set((state) => ({
        healthMetrics: [response.metric || response, ...state.healthMetrics],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addDietLog: async (dietData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await dietLogService.create(dietData);
      set((state) => ({
        dietLogs: [response.dietLog || response, ...state.dietLogs],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addActivityLog: async (activityData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await activityLogService.create(activityData);
      set((state) => ({
        activityLogs: [response.activityLog || response, ...state.activityLogs],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearHealthData: () => set({ healthMetrics: [], dietLogs: [], activityLogs: [] }),

  clearError: () => set({ error: null }),
}));

export default useHealthStore;