import { create } from 'zustand';
import api from '../services/api';

export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';
  breed: string | null;
  birthDate: string | null;
  weight: number | null;
  photoUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetInput {
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  weight?: number;
  photoUrl?: string;
}

interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  isLoading: boolean;
  error: string | null;
  fetchPets: () => Promise<void>;
  getPet: (id: string) => Promise<Pet | null>;
  addPet: (pet: PetInput) => Promise<Pet>;
  updatePet: (id: string, pet: Partial<PetInput>) => Promise<Pet>;
  deletePet: (id: string) => Promise<void>;
  selectPet: (pet: Pet | null) => void;
  clearError: () => void;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [],
  selectedPet: null,
  isLoading: false,
  error: null,

  fetchPets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ pets: Pet[] }>('/pets');
      set({ pets: response.pets, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch pets';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getPet: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<{ pet: Pet }>(`/pets/${id}`);
      set({ isLoading: false });
      return response.pet;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch pet';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  addPet: async (petData: PetInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<{ pet: Pet }>('/pets', petData);
      const newPet = response.pet;
      set((state) => ({
        pets: [newPet, ...state.pets],
        isLoading: false,
      }));
      return newPet;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to add pet';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updatePet: async (id: string, petData: Partial<PetInput>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put<{ pet: Pet }>(`/pets/${id}`, petData);
      const updatedPet = response.pet;
      set((state) => ({
        pets: state.pets.map((p) => (p.id === id ? updatedPet : p)),
        selectedPet: state.selectedPet?.id === id ? updatedPet : state.selectedPet,
        isLoading: false,
      }));
      return updatedPet;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update pet';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deletePet: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/pets/${id}`);
      set((state) => ({
        pets: state.pets.filter((p) => p.id !== id),
        selectedPet: state.selectedPet?.id === id ? null : state.selectedPet,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete pet';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  selectPet: (pet) => {
    set({ selectedPet: pet });
  },

  clearError: () => {
    set({ error: null });
  },
}));