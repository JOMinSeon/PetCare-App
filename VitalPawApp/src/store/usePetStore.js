import { create } from 'zustand';
import { petService } from '../services';

const usePetStore = create((set, get) => ({
  pets: [],
  selectedPet: null,
  isLoading: false,
  error: null,

  fetchPets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await petService.getAll();
      set({ pets: response.pets || response, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getPetById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await petService.getById(id);
      set({ selectedPet: response.pet || response, isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addPet: async (petData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await petService.create(petData);
      set((state) => ({
        pets: [...state.pets, response.pet || response],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updatePet: async (id, petData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await petService.update(id, petData);
      set((state) => ({
        pets: state.pets.map((pet) => (pet.id === id ? (response.pet || response) : pet)),
        selectedPet: state.selectedPet?.id === id ? (response.pet || response) : state.selectedPet,
        isLoading: false,
      }));
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deletePet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await petService.delete(id);
      set((state) => ({
        pets: state.pets.filter((pet) => pet.id !== id),
        selectedPet: state.selectedPet?.id === id ? null : state.selectedPet,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  selectPet: (pet) => set({ selectedPet: pet }),

  clearError: () => set({ error: null }),
}));

export default usePetStore;