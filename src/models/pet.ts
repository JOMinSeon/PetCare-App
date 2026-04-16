/**
 * Pet Model Types and Interfaces
 * Phase 01-02: Pet Profile Management
 */

export enum PetSpecies {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  FISH = 'FISH',
  REPTILE = 'REPTILE',
  OTHER = 'OTHER',
}

export interface CreatePetInput {
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate?: string; // ISO date string
  photoUrl?: string;
}

export interface UpdatePetInput {
  name?: string;
  species?: PetSpecies;
  breed?: string;
  birthDate?: string;
  photoUrl?: string;
}

export interface PetResponse {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  birthDate: string | null;
  photoUrl: string | null;
  createdAt: string;
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  birthDate: Date | null;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum UrgencyLevel {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED',
}

export interface SymptomAnalysisInput {
  petId: string;
  photoUrl: string;
}

export interface SymptomAnalysisResponse {
  id: string;
  petId: string;
  photoUrl: string;
  symptoms: string;
  urgencyLevel: UrgencyLevel;
  recommendation: string;
  createdAt: Date;
}
