import { create } from 'zustand';
import { dietService, Diet, DietStats, CreateDietRequest } from '../services/diet.service';

interface DietState {
  diets: Diet[];
  dietStats: DietStats | null;
  isLoading: boolean;
  error: string | null;
  fetchDiets: (petId: string, days?: number) => Promise<void>;
  fetchDietStats: (petId: string) => Promise<void>;
  createDiet: (petId: string, data: CreateDietRequest) => Promise<void>;
  clearDiets: () => void;
}

export const useDietStore = create<DietState>((set) => ({
  diets: [],
  dietStats: null,
  isLoading: false,
  error: null,

  fetchDiets: async (petId: string, days?: number) => {
    set({ isLoading: true, error: null });
    try {
      const diets = await dietService.getDiets(petId, days);
      set({ diets, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchDietStats: async (petId: string) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await dietService.getDietStats(petId);
      set({ dietStats: stats, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createDiet: async (petId: string, data: CreateDietRequest) => {
    set({ isLoading: true, error: null });
    try {
      const diet = await dietService.createDiet(petId, data);
      set((state) => ({
        diets: [diet, ...state.diets],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  clearDiets: () => set({ diets: [], dietStats: null }),
}));