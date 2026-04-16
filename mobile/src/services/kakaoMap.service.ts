import {
  PetServicePlace,
  ServiceCategory,
} from '../types/map.types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const MapService = {
  async searchByKeyword(
    keyword: string,
    latitude: number,
    longitude: number,
    radius: number = 3000
  ): Promise<PetServicePlace[]> {
    const response = await fetch(
      `${BASE_URL}/api/map/search?keyword=${encodeURIComponent(keyword)}&latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    );
    if (!response.ok) {
      throw new Error('Search failed');
    }
    return response.json();
  },

  async searchByCategory(
    category: ServiceCategory,
    latitude: number,
    longitude: number,
    radius: number = 3000
  ): Promise<PetServicePlace[]> {
    const response = await fetch(
      `${BASE_URL}/api/map/search?category=${category}&latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    );
    if (!response.ok) {
      throw new Error('Search failed');
    }
    return response.json();
  },

  async searchNearbyServices(
    latitude: number,
    longitude: number,
    radius: number = 3000
  ): Promise<PetServicePlace[]> {
    const categories: ServiceCategory[] = ['VET', 'PET_SHOP', 'GROOMING', 'EMERGENCY'];
    const results = await Promise.all(
      categories.map(cat => this.searchByCategory(cat, latitude, longitude, radius))
    );
    return results.flat();
  },

  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<string> {
    const response = await fetch(
      `${BASE_URL}/api/map/reverse-geocode?latitude=${latitude}&longitude=${longitude}`
    );
    const data = await response.json();
    return data.address || '';
  },

  inferCategory(categoryName: string): ServiceCategory {
    if (categoryName.includes('동물') || categoryName.includes('수의')) return 'VET';
    if (categoryName.includes('애완') || categoryName.includes('펫숍')) return 'PET_SHOP';
    if (categoryName.includes('미용') || categoryName.includes('욕조')) return 'GROOMING';
    if (categoryName.includes('응급')) return 'EMERGENCY';
    if (categoryName.includes('호텔')) return 'PET_HOTEL';
    if (categoryName.includes('훈련')) return 'TRAINING';
    return 'PET_SHOP';
  },
};
