import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Reminder, CreateReminderInput, UpdateReminderInput } from '../types/notification.types';
import * as notificationService from '../services/notification.service';

interface ReminderContextType {
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;
  fetchReminders: (petId?: string) => Promise<void>;
  addReminder: (input: CreateReminderInput) => Promise<Reminder>;
  updateReminder: (id: string, input: UpdateReminderInput) => Promise<Reminder>;
  removeReminder: (id: string) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
  clearError: () => void;
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export function ReminderProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async (petId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationService.getReminders(petId);
      setReminders(data);
    } catch (err) {
      const cachedReminders = await notificationService.getCachedReminders();
      if (cachedReminders.length > 0) {
        setReminders(cachedReminders);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch reminders');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addReminder = useCallback(async (input: CreateReminderInput): Promise<Reminder> => {
    setError(null);
    const newReminder = await notificationService.createReminder(input);
    setReminders(prev => [...prev, newReminder]);
    return newReminder;
  }, []);

  const updateReminder = useCallback(async (id: string, input: UpdateReminderInput): Promise<Reminder> => {
    setError(null);
    const updatedReminder = await notificationService.updateReminder(id, input);
    setReminders(prev => prev.map(r => r.id === id ? updatedReminder : r));
    return updatedReminder;
  }, []);

  const removeReminder = useCallback(async (id: string) => {
    setError(null);
    await notificationService.deleteReminder(id);
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const toggleReminder = useCallback(async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      await updateReminder(id, { isActive: !reminder.isActive });
    }
  }, [reminders, updateReminder]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        isLoading,
        error,
        fetchReminders,
        addReminder,
        updateReminder,
        removeReminder,
        toggleReminder,
        clearError,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminder(): ReminderContextType {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminder must be used within ReminderProvider');
  }
  return context;
}

export default ReminderContext;