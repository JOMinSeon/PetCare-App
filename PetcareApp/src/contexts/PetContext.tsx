import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Pet, CreatePetInput, UpdatePetInput } from '../types/pet.types';
import * as petService from '../services/pet.service';

interface PetContextType {
  pets: Pet[];
  selectedPet: Pet | null;
  isLoading: boolean;
  error: string | null;
  fetchPets: () => Promise<void>;
  selectPet: (id: string) => Promise<void>;
  addPet: (input: CreatePetInput) => Promise<Pet>;
  updatePet: (id: string, input: UpdatePetInput) => Promise<Pet>;
  removePet: (id: string) => Promise<void>;
  clearError: () => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await petService.getPets();
      setPets(data);
    } catch (err) {
      const cachedPets = await petService.getCachedPets();
      if (cachedPets.length > 0) {
        setPets(cachedPets);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch pets');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectPet = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const pet = await petService.getPetById(id);
      setSelectedPet(pet);
    } catch (err) {
      const cached = pets.find(p => p.id === id);
      if (cached) {
        setSelectedPet(cached);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch pet');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pets]);

  const addPet = useCallback(async (input: CreatePetInput): Promise<Pet> => {
    setError(null);
    const newPet = await petService.createPet(input);
    setPets(prev => [...prev, newPet]);
    return newPet;
  }, []);

  const updatePet = useCallback(async (id: string, input: UpdatePetInput): Promise<Pet> => {
    setError(null);
    const updatedPet = await petService.updatePet(id, input);
    setPets(prev => prev.map(p => p.id === id ? updatedPet : p));
    if (selectedPet?.id === id) {
      setSelectedPet(updatedPet);
    }
    return updatedPet;
  }, [selectedPet]);

  const removePet = useCallback(async (id: string) => {
    setError(null);
    await petService.deletePet(id);
    setPets(prev => prev.filter(p => p.id !== id));
    if (selectedPet?.id === id) {
      setSelectedPet(null);
    }
  }, [selectedPet]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPet,
        isLoading,
        error,
        fetchPets,
        selectPet,
        addPet,
        updatePet,
        removePet,
        clearError,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

export function usePet(): PetContextType {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within PetProvider');
  }
  return context;
}

export default PetContext;