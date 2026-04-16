/**
 * Clinic Context
 * Phase 03-01: Clinic Search & Map
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Clinic, Booking } from '../types/clinic.types';
import * as clinicService from '../services/clinic.service';

interface ClinicContextType {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  loading: boolean;
  error: string | null;
  bookings: Booking[];
  loadingBookings: boolean;
  searchClinicsNearby: (lat: number, lng: number, keyword?: string) => Promise<void>;
  selectClinic: (clinic: Clinic) => void;
  clearError: () => void;
  fetchBookings: () => Promise<void>;
  createBooking: (clinicId: string, petId: string, dateTime: Date) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const searchClinicsNearby = useCallback(async (lat: number, lng: number, keyword?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await clinicService.searchClinics({
        latitude: lat,
        longitude: lng,
        keyword,
      });
      if (result.success && result.data) {
        setClinics(result.data);
      } else {
        setError(result.error ?? 'Failed to search clinics');
        const cached = await clinicService.getCachedClinics();
        if (cached.length > 0) {
          setClinics(cached);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      const cached = await clinicService.getCachedClinics();
      if (cached.length > 0) {
        setClinics(cached);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const selectClinic = useCallback((clinic: Clinic) => {
    setSelectedClinic(clinic);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const result = await clinicService.getBookings();
      if (result.success && result.data) {
        setBookings(result.data);
      }
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  const createBooking = useCallback(async (clinicId: string, petId: string, dateTime: Date): Promise<boolean> => {
    try {
      const result = await clinicService.createBooking({ clinicId, petId, dateTime: dateTime.toISOString() });
      if (result.success) {
        await fetchBookings(); // Refresh list
        return true;
      }
    } catch {}
    return false;
  }, [fetchBookings]);

  const cancelBooking = useCallback(async (bookingId: string): Promise<boolean> => {
    try {
      const result = await clinicService.cancelBooking(bookingId);
      if (result.success) {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        return true;
      }
    } catch {}
    return false;
  }, []);

  return (
    <ClinicContext.Provider
      value={{
        clinics,
        selectedClinic,
        loading,
        error,
        bookings,
        loadingBookings,
        searchClinicsNearby,
        selectClinic,
        clearError,
        fetchBookings,
        createBooking,
        cancelBooking,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic(): ClinicContextType {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within ClinicProvider');
  }
  return context;
}

export default ClinicContext;
