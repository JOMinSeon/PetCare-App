import { create } from 'zustand';
import { offlineCacheService } from '../services/offlineCache.service';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'vaccination_reminder' | 'health_alert' | 'general';
  read: boolean;
  data?: any;
}

interface NotificationState {
  notifications: NotificationItem[];
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  markAsRead: (id: string) => void;
  clearAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const cached = await offlineCacheService.getCachedNotificationHistory();
      set({ notifications: cached, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addNotification: async (notification) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updated = [newNotification, ...get().notifications];
    set({ notifications: updated });
    await offlineCacheService.cacheNotificationHistory(updated);
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  clearAll: async () => {
    set({ notifications: [] });
    await offlineCacheService.clearNotificationHistory();
  },
}));