// Mock service data for development
// Used when Google Places API is not configured or for local testing

export interface Service {
  id: string;
  name: string;
  type: 'vet' | 'pet_store' | 'groomer' | 'pharmacy' | 'emergency_clinic';
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  is24Hour: boolean;
  isEmergency: boolean;
  openingHours?: {
    [day: string]: { open: string; close: string } | null;
  };
}

export const MOCK_SERVICES: Service[] = [
  {
    id: 'mock-1',
    name: 'Seoul Pet Medical Center',
    type: 'vet',
    address: '123 Gangnam-daero, Gangnam-gu, Seoul',
    latitude: 37.5665,
    longitude: 126.9780,
    phone: '02-1234-5678',
    rating: 4.8,
    reviewCount: 234,
    is24Hour: true,
    isEmergency: true,
  },
  {
    id: 'mock-2',
    name: 'Happy Paws Pet Store',
    type: 'pet_store',
    address: '456 Apgujeong-ro, Gangnam-gu, Seoul',
    latitude: 37.5285,
    longitude: 127.0275,
    phone: '02-2345-6789',
    rating: 4.5,
    reviewCount: 189,
    is24Hour: false,
    isEmergency: false,
  },
  {
    id: 'mock-3',
    name: 'Fluffy Grooming Salon',
    type: 'groomer',
    address: '789 Yeoksam-ro, Gangnam-gu, Seoul',
    latitude: 37.5455,
    longitude: 127.0365,
    phone: '02-3456-7890',
    rating: 4.2,
    reviewCount: 76,
    is24Hour: false,
    isEmergency: false,
  },
  {
    id: 'mock-4',
    name: 'Animal Pharmacy',
    type: 'pharmacy',
    address: '321 Sadang-ro, Dongjak-gu, Seoul',
    latitude: 37.5085,
    longitude: 126.9635,
    phone: '02-4567-8901',
    rating: 4.0,
    reviewCount: 45,
    is24Hour: true,
    isEmergency: false,
  },
  {
    id: 'mock-5',
    name: '24/7 Emergency Vet Clinic',
    type: 'emergency_clinic',
    address: '555 Olympic-ro, Songpa-gu, Seoul',
    latitude: 37.5185,
    longitude: 127.1055,
    phone: '02-5678-9012',
    rating: 4.9,
    reviewCount: 412,
    is24Hour: true,
    isEmergency: true,
  },
  {
    id: 'mock-6',
    name: 'Gangnam Animal Hospital',
    type: 'vet',
    address: '100-10 Gil, Gangnam-daero, Gangnam-gu, Seoul',
    latitude: 37.5615,
    longitude: 126.9825,
    phone: '02-8765-4321',
    rating: 4.6,
    reviewCount: 156,
    is24Hour: false,
    isEmergency: false,
  },
  {
    id: 'mock-7',
    name: 'Pet Paradise Store',
    type: 'pet_store',
    address: '88-9 Apgujeong-ro, Gangnam-gu, Seoul',
    latitude: 37.5205,
    longitude: 127.0355,
    phone: '02-3456-1234',
    rating: 4.3,
    reviewCount: 98,
    is24Hour: false,
    isEmergency: false,
  },
  {
    id: 'mock-8',
    name: 'Premium Pet Grooming',
    type: 'groomer',
    address: '55 Teoksal-ro, Gangnam-gu, Seoul',
    latitude: 37.5495,
    longitude: 127.0145,
    phone: '02-2345-8765',
    rating: 4.7,
    reviewCount: 112,
    is24Hour: false,
    isEmergency: false,
  },
];

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface ServiceWithDistance extends Service {
  distance: number;
}

export function getServicesWithDistance(
  lat: number,
  lng: number,
  services: Service[]
): ServiceWithDistance[] {
  return services
    .map((service) => ({
      ...service,
      distance: calculateDistance(lat, lng, service.latitude, service.longitude),
    }))
    .sort((a, b) => a.distance - b.distance);
}

export function filterServices(
  services: ServiceWithDistance[],
  filters: {
    types?: string[];
    is24Hour?: boolean;
    isEmergency?: boolean;
    radius?: number; // in km
  }
): ServiceWithDistance[] {
  return services.filter((service) => {
    // Filter by type
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(service.type)) {
        return false;
      }
    }

    // Filter by 24-hour
    if (filters.is24Hour && !service.is24Hour) {
      return false;
    }

    // Filter by emergency
    if (filters.isEmergency && !service.isEmergency) {
      return false;
    }

    // Filter by radius
    if (filters.radius && service.distance > filters.radius / 1000) {
      return false;
    }

    return true;
  });
}
