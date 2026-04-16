/**
 * Local Notification Scheduling Utility
 * 
 * Handles local notification scheduling using expo-notifications.
 * Note: Full background push notifications are handled server-side (NOTI-01, NOTI-02).
 * Local notifications work for NOTI-03 (walks) and NOTI-04 (custom reminders).
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Reminder, ReminderType } from '../types/notification.types';

// Configure notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Schedule a local notification for a reminder
 */
export async function scheduleNotification(reminder: Reminder): Promise<string | null> {
  if (!reminder.isActive) {
    return null;
  }

  try {
    // Parse the trigger date and time
    const [year, month, day] = reminder.triggerDate.split('-').map(Number);
    const [hour, minute] = reminder.triggerTime.split(':').map(Number);

    if (!year || !month || !day || isNaN(hour) || isNaN(minute)) {
      console.warn('Invalid date/time format for reminder:', reminder.id);
      return null;
    }

    // Create trigger date
    const triggerDate = new Date(year, month - 1, day, hour, minute);
    
    // If the date is in the past, don't schedule
    if (triggerDate <= new Date()) {
      console.log('Reminder date is in the past, skipping:', reminder.id);
      return null;
    }

    // Build notification content
    const content: Notifications.NotificationContentInput = {
      title: reminder.title,
      body: reminder.message || getDefaultMessage(reminder.type),
      data: { reminderId: reminder.id, type: reminder.type },
      sound: true,
    };

    // Build trigger based on repeat pattern
    const trigger: Notifications.DateableTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    };

    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });

    console.log('Notification scheduled:', notificationId, 'for reminder:', reminder.id);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

/**
 * Cancel a specific notification by reminder ID
 */
export async function cancelNotification(reminderId: string): Promise<void> {
  try {
    // Get all scheduled notifications
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    // Find and cancel notifications with matching reminder ID in data
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.reminderId === reminderId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        console.log('Cancelled notification:', notification.identifier);
      }
    }
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
}

/**
 * Reschedule all active reminders as notifications
 */
export async function rescheduleAllNotifications(reminders: Reminder[]): Promise<void> {
  // Cancel all existing notifications first
  await cancelAllNotifications();

  // Schedule notifications for all active reminders
  for (const reminder of reminders) {
    if (reminder.isActive) {
      await scheduleNotification(reminder);
    }
  }
}

/**
 * Check for upcoming vaccinations (called from background)
 * Note: In a real app, this would be called by a background task
 */
export async function checkUpcomingVaccinations(): Promise<void> {
  // This would be called by a background task or server webhook
  // For now, we just log that it would check vaccinations
  console.log('Checking upcoming vaccinations...');
  
  // In a real implementation:
  // 1. Call health service to get upcoming vaccinations
  // 2. Schedule notifications for each upcoming vaccination
}

/**
 * Check for active medications (called from background)
 * Note: In a real app, this would be called by a background task
 */
export async function checkActiveMedications(): Promise<void> {
  // This would be called by a background task or server webhook
  // For now, we just log that it would check medications
  console.log('Checking active medications...');
  
  // In a real implementation:
  // 1. Call health service to get active medications
  // 2. Schedule notifications for medication reminders
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // Set up Android notification channel for Android 8.0+
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Petcare Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#007AFF',
        sound: 'default',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Get default notification message based on reminder type
 */
function getDefaultMessage(type: ReminderType): string {
  switch (type) {
    case ReminderType.MEDICATION:
      return '약물을 복용할 시간입니다';
    case ReminderType.VACCINATION:
      return '预防접종 예정일이 다가옵니다';
    case ReminderType.WALK:
      return '산책 시간입니다!';
    case ReminderType.CUSTOM:
      return '리마인더 알림';
    default:
      return '리마인더 알림';
  }
}

/**
 * Add notification response listener
 */
export function addNotificationResponseListener(
  handler: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedResponse(handler);
}

/**
 * Add notification received listener (for foreground notifications)
 */
export function addNotificationReceivedListener(
  handler: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceived(handler);
}

export default {
  scheduleNotification,
  cancelNotification,
  cancelAllNotifications,
  rescheduleAllNotifications,
  checkUpcomingVaccinations,
  checkActiveMedications,
  requestNotificationPermissions,
  addNotificationResponseListener,
  addNotificationReceivedListener,
};
