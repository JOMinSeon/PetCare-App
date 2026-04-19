export interface Symptom {
  id: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: string;
  petId: string;
}

export interface CreateSymptomRequest {
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: string;
}

export interface SymptomAnalysis {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  recommendation: string;
  disclaimer: string;
  triggeredPatterns: { type: string; description: string }[];
}

export interface RiskAlertProps {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
  onDismiss?: () => void;
}

// Service types for pet services map
export type ServiceType = 'vet' | 'pet_store' | 'groomer' | 'pharmacy' | 'emergency_clinic';

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  is24Hour: boolean;
  isEmergency: boolean;
  distance?: number;
  openingHours?: {
    [day: string]: { open: string; close: string } | null;
  };
  isOpen?: boolean;
}

export interface ServicesResponse {
  services: Service[];
  cached: boolean;
  count: number;
}

export interface ServiceFilters {
  types: ServiceType[];
  is24HourOnly: boolean;
  emergencyOnly: boolean;
}