/**
 * Clinic Type Definitions
 * Phase 03-01: Clinic Search & Map
 */

export interface Clinic {
  id: string;
  kakaoPlaceId: string;
  name: string;
  address: string;
  roadAddress: string;
  phone: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  rating?: number;
  reviewCount?: number;
}

export interface Booking {
  id: string;
  clinicId: string;
  clinicName: string;
  userId: string;
  petId: string;
  dateTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  clinicId: string;
  userId: string;
  userName: string;
  petId?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: string;
}

export interface ClinicSearchParams {
  latitude: number;
  longitude: number;
  radius?: number;
  keyword?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
