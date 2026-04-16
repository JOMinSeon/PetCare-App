import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder, CreateReminderInput, UpdateReminderInput, DeviceToken } from '../types/notification.types';
import { getAuthHeader } from './auth.service';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const REMINDERS_CACHE_KEY = '@petcare_reminders';

export async function getReminders(petId?: string): Promise<Reminder[]> {
  const headers = await getAuthHeader();
  
  let url = `${API_BASE_URL}/api/notifications/reminders`;
  if (petId) {
    url += `?petId=${petId}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reminders');
  }

  const data = await response.json();
  
  if (data.reminders) {
    await AsyncStorage.setItem(REMINDERS_CACHE_KEY, JSON.stringify(data.reminders));
  }
  
  return data.reminders || [];
}

export async function getReminderById(id: string): Promise<Reminder> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/notifications/reminders/${id}`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reminder');
  }

  return response.json();
}

export async function createReminder(input: CreateReminderInput): Promise<Reminder> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/notifications/reminders`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create reminder');
  }

  const newReminder = await response.json();
  
  const cachedReminders = await AsyncStorage.getItem(REMINDERS_CACHE_KEY);
  if (cachedReminders) {
    const reminders = JSON.parse(cachedReminders);
    reminders.push(newReminder.reminder || newReminder);
    await AsyncStorage.setItem(REMINDERS_CACHE_KEY, JSON.stringify(reminders));
  }
  
  return newReminder.reminder || newReminder;
}

export async function updateReminder(id: string, input: UpdateReminderInput): Promise<Reminder> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/notifications/reminders/${id}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update reminder');
  }

  const updatedReminder = await response.json();
  
  const cachedReminders = await AsyncStorage.getItem(REMINDERS_CACHE_KEY);
  if (cachedReminders) {
    const reminders = JSON.parse(cachedReminders);
    const index = reminders.findIndex((r: Reminder) => r.id === id);
    if (index !== -1) {
      reminders[index] = updatedReminder.reminder || updatedReminder;
      await AsyncStorage.setItem(REMINDERS_CACHE_KEY, JSON.stringify(reminders));
    }
  }
  
  return updatedReminder.reminder || updatedReminder;
}

export async function deleteReminder(id: string): Promise<void> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/notifications/reminders/${id}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete reminder');
  }
  
  const cachedReminders = await AsyncStorage.getItem(REMINDERS_CACHE_KEY);
  if (cachedReminders) {
    const reminders = JSON.parse(cachedReminders);
    const filtered = reminders.filter((r: Reminder) => r.id !== id);
    await AsyncStorage.setItem(REMINDERS_CACHE_KEY, JSON.stringify(filtered));
  }
}

export async function registerDeviceToken(token: string, platform: string): Promise<DeviceToken> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/notifications/devices`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, platform }),
  });

  if (!response.ok) {
    throw new Error('Failed to register device token');
  }

  return response.json();
}

export async function unregisterDeviceToken(token: string): Promise<void> {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/notifications/devices/${token}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to unregister device token');
  }
}

export async function getCachedReminders(): Promise<Reminder[]> {
  const cached = await AsyncStorage.getItem(REMINDERS_CACHE_KEY);
  return cached ? JSON.parse(cached) : [];
}

export async function clearRemindersCache(): Promise<void> {
  await AsyncStorage.removeItem(REMINDERS_CACHE_KEY);
}

export default {
  getReminders,
  getReminderById,
  createReminder,
  updateReminder,
  deleteReminder,
  registerDeviceToken,
  unregisterDeviceToken,
  getCachedReminders,
  clearRemindersCache,
};