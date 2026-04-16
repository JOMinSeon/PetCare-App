import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, CreatePetInput, UpdatePetInput } from '../types/pet.types';
import { getAuthHeader } from './auth.service';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const PETS_CACHE_KEY = '@petcare_pets';

export async function getPets(): Promise<Pet[]> {
  const headers = await getAuthHeader();
  
  const response = await fetch(`${API_BASE_URL}/api/pets`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pets');
  }

  const data = await response.json();
  
  if (data.pets) {
    await AsyncStorage.setItem(PETS_CACHE_KEY, JSON.stringify(data.pets));
  }
  
  return data.pets || [];
}

export async function getPetById(id: string): Promise<Pet> {
  const headers = await getAuthHeader();
  
  const response = await fetch(`${API_BASE_URL}/api/pets/${id}`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pet');
  }

  return response.json();
}

export async function createPet(input: CreatePetInput): Promise<Pet> {
  const headers = await getAuthHeader();
  
  const response = await fetch(`${API_BASE_URL}/api/pets`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create pet');
  }

  const newPet = await response.json();
  
  const cachedPets = await AsyncStorage.getItem(PETS_CACHE_KEY);
  if (cachedPets) {
    const pets = JSON.parse(cachedPets);
    pets.push(newPet.pet || newPet);
    await AsyncStorage.setItem(PETS_CACHE_KEY, JSON.stringify(pets));
  }
  
  return newPet.pet || newPet;
}

export async function updatePet(id: string, input: UpdatePetInput): Promise<Pet> {
  const headers = await getAuthHeader();
  
  const response = await fetch(`${API_BASE_URL}/api/pets/${id}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update pet');
  }

  const updatedPet = await response.json();
  
  const cachedPets = await AsyncStorage.getItem(PETS_CACHE_KEY);
  if (cachedPets) {
    const pets = JSON.parse(cachedPets);
    const index = pets.findIndex((p: Pet) => p.id === id);
    if (index !== -1) {
      pets[index] = updatedPet.pet || updatedPet;
      await AsyncStorage.setItem(PETS_CACHE_KEY, JSON.stringify(pets));
    }
  }
  
  return updatedPet.pet || updatedPet;
}

export async function deletePet(id: string): Promise<void> {
  const headers = await getAuthHeader();
  
  const response = await fetch(`${API_BASE_URL}/api/pets/${id}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete pet');
  }
  
  const cachedPets = await AsyncStorage.getItem(PETS_CACHE_KEY);
  if (cachedPets) {
    const pets = JSON.parse(cachedPets);
    const filtered = pets.filter((p: Pet) => p.id !== id);
    await AsyncStorage.setItem(PETS_CACHE_KEY, JSON.stringify(filtered));
  }
}

export async function getCachedPets(): Promise<Pet[]> {
  const cached = await AsyncStorage.getItem(PETS_CACHE_KEY);
  return cached ? JSON.parse(cached) : [];
}

export async function clearPetsCache(): Promise<void> {
  await AsyncStorage.removeItem(PETS_CACHE_KEY);
}

export default {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getCachedPets,
  clearPetsCache,
};