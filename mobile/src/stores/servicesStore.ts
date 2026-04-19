import { create } from 'zustand';
import { Service, ServiceFilters, ServiceType } from '../types';

interface ServicesState {
  // Service list
  services: Service[];
  selectedService: Service | null;

  // Filters
  filters: ServiceFilters;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // User location
  userLocation: { latitude: number; longitude: number } | null;

  // Actions
  setServices: (services: Service[]) => void;
  setSelectedService: (service: Service | null) => void;
  setFilters: (filters: Partial<ServiceFilters>) => void;
  toggleServiceType: (type: ServiceType) => void;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Filtered services
  getFilteredServices: () => Service[];
}

const DEFAULT_FILTERS: ServiceFilters = {
  types: [],
  is24HourOnly: false,
  emergencyOnly: false,
};

export const useServicesStore = create<ServicesState>((set, get) => ({
  // Initial state
  services: [],
  selectedService: null,
  filters: DEFAULT_FILTERS,
  isLoading: false,
  error: null,
  userLocation: null,

  // Actions
  setServices: (services) => set({ services }),

  setSelectedService: (service) => set({ selectedService: service }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  toggleServiceType: (type) =>
    set((state) => {
      const currentTypes = state.filters.types;
      const isSelected = currentTypes.includes(type);
      return {
        filters: {
          ...state.filters,
          types: isSelected
            ? currentTypes.filter((t) => t !== type)
            : [...currentTypes, type],
        },
      };
    }),

  setUserLocation: (location) => set({ userLocation: location }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // Computed: get filtered services
  getFilteredServices: () => {
    const { services, filters } = get();

    return services.filter((service) => {
      // Filter by service type
      if (filters.types.length > 0 && !filters.types.includes(service.type)) {
        return false;
      }

      // Filter by 24-hour
      if (filters.is24HourOnly && !service.is24Hour) {
        return false;
      }

      // Filter by emergency
      if (filters.emergencyOnly && !service.isEmergency) {
        return false;
      }

      return true;
    });
  },
}));
