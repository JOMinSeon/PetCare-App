import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEYS = {
  PETS: '@vitalpaw_pets_cache',
  MEDICAL_RECORDS: '@vitalpaw_medical_records_cache',
  NOTIFICATION_HISTORY: '@vitalpaw_notification_history',
};

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CachedItem<T> {
  data: T;
  timestamp: number;
}

export class OfflineCacheService {
  async cachePets(pets: any[]): Promise<void> {
    const cacheItem: CachedItem<any[]> = {
      data: pets,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEYS.PETS, JSON.stringify(cacheItem));
  }

  async getCachedPets(): Promise<any[] | null> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.PETS);
      if (!cached) return null;

      const cacheItem: CachedItem<any[]> = JSON.parse(cached);
      const isExpired = Date.now() - cacheItem.timestamp > CACHE_EXPIRY;

      return isExpired ? null : cacheItem.data;
    } catch {
      return null;
    }
  }

  async cacheMedicalRecords(records: any[]): Promise<void> {
    const cacheItem: CachedItem<any[]> = {
      data: records,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEYS.MEDICAL_RECORDS, JSON.stringify(cacheItem));
  }

  async getCachedMedicalRecords(): Promise<any[] | null> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.MEDICAL_RECORDS);
      if (!cached) return null;

      const cacheItem: CachedItem<any[]> = JSON.parse(cached);
      const isExpired = Date.now() - cacheItem.timestamp > CACHE_EXPIRY;

      return isExpired ? null : cacheItem.data;
    } catch {
      return null;
    }
  }

  async cacheNotificationHistory(notifications: any[]): Promise<void> {
    await AsyncStorage.setItem(CACHE_KEYS.NOTIFICATION_HISTORY, JSON.stringify(notifications));
  }

  async getCachedNotificationHistory(): Promise<any[]> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.NOTIFICATION_HISTORY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  }

  async clearCache(): Promise<void> {
    await AsyncStorage.multiRemove([
      CACHE_KEYS.PETS,
      CACHE_KEYS.MEDICAL_RECORDS,
    ]);
  }

  async clearNotificationHistory(): Promise<void> {
    await AsyncStorage.removeItem(CACHE_KEYS.NOTIFICATION_HISTORY);
  }
}

export const offlineCacheService = new OfflineCacheService();