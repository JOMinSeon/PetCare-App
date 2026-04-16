/**
 * Clinic Service Layer
 * Phase 03-01: Clinic Search & Map
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Clinic, ClinicSearchParams, ApiResponse, Review, Booking } from '../types/clinic.types';
import { getAuthHeader } from './auth.service';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const CLINICS_CACHE_KEY = '@petcare_clinics';

export async function searchClinics(params: ClinicSearchParams): Promise<ApiResponse<Clinic[]>> {
  const headers = await getAuthHeader();

  const queryParams = new URLSearchParams({
    lat: String(params.latitude),
    lng: String(params.longitude),
    radius: String(params.radius ?? 5000),
  });

  if (params.keyword) {
    queryParams.append('keyword', params.keyword);
  }

  const response = await fetch(`${API_BASE_URL}/api/clinics/search?${queryParams}`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to search clinics' }));
    return { success: false, error: error.error || 'Failed to search clinics' };
  }

  const data = await response.json();

  if (data.success && data.clinics) {
    await AsyncStorage.setItem(CLINICS_CACHE_KEY, JSON.stringify(data.clinics));
    return { success: true, data: data.clinics };
  }

  return { success: false, error: 'Invalid response format' };
}

export async function getClinicDetails(clinicId: string): Promise<ApiResponse<Clinic>> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/clinics/${clinicId}`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch clinic details' }));
    return { success: false, error: error.error || 'Failed to fetch clinic details' };
  }

  const data = await response.json();

  if (data.clinic) {
    return { success: true, data: data.clinic };
  }

  return { success: false, error: 'Invalid response format' };
}

export async function submitReview(clinicId: string, review: {
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  petId?: string;
}): Promise<ApiResponse<Review>> {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}/api/clinics/${clinicId}/reviews`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(review),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data.error || 'Failed to submit review' };
  }

  return { success: true, data: data.review };
}

export async function getClinicReviews(clinicId: string): Promise<ApiResponse<Review[]>> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/clinics/${clinicId}/reviews`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch reviews' }));
    return { success: false, error: error.error || 'Failed to fetch reviews' };
  }

  const data = await response.json();

  if (data.reviews) {
    return { success: true, data: data.reviews };
  }

  return { success: false, error: 'Invalid response format' };
}

export async function getCachedClinics(): Promise<Clinic[]> {
  const cached = await AsyncStorage.getItem(CLINICS_CACHE_KEY);
  return cached ? JSON.parse(cached) : [];
}

export async function clearClinicsCache(): Promise<void> {
  await AsyncStorage.removeItem(CLINICS_CACHE_KEY);
}

// Booking functions (Phase 03-02)
export async function createBooking(booking: {
  clinicId: string;
  petId: string;
  dateTime: string;
}): Promise<ApiResponse<Booking>> {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(booking),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data.error || 'Failed to create booking' };
  }

  return { success: true, data: data.booking };
}

export async function getBookings(): Promise<ApiResponse<Booking[]>> {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data.error || 'Failed to fetch bookings' };
  }

  return { success: true, data: data.bookings };
}

export async function cancelBooking(bookingId: string): Promise<ApiResponse<void>> {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Failed to cancel booking' }));
    return { success: false, error: data.error || 'Failed to cancel booking' };
  }

  return { success: true };
}

export default {
  searchClinics,
  getClinicDetails,
  getClinicReviews,
  submitReview,
  getCachedClinics,
  clearClinicsCache,
  createBooking,
  getBookings,
  cancelBooking,
};
