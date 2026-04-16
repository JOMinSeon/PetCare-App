export interface Pet {
  id: string;
  name: string;
  species: 'DOG' | 'CAT' | 'BIRD' | 'FISH' | 'REPTILE' | 'OTHER';
  breed: string | null;
  photoUrl: string | null;
}

export interface SymptomAnalysis {
  id: string;
  petId: string;
  photoUrl: string;
  symptoms: string;
  urgencyLevel: 'GREEN' | 'YELLOW' | 'RED';
  recommendation: string;
  createdAt: string;
  disclaimer: string;
}

export interface AnalysisResult extends SymptomAnalysis {
  disclaimer: string;
}

export interface ScheduledCare {
  id: string;
  type: 'vaccination' | 'deworming' | 'checkup' | 'grooming';
  title: string;
  date: string;
  daysUntil: number;
}

export interface PetService {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  isEmergency: boolean;
  phone: string;
}

export interface DietRecommendation {
  id: string;
  name: string;
  brand: string;
  price: string;
  reason: string;
}

export interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  date: string;
  status: 'completed' | 'normal' | 'pending';
}

export interface EmergencyContact {
  label: string;
  name: string;
  phone: string;
}

export type { PetServicePlace, ServiceCategory, MapFilter, MapRegion } from './map.types';