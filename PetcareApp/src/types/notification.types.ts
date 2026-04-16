export enum ReminderType {
  MEDICATION = 'MEDICATION',
  VACCINATION = 'VACCINATION',
  WALK = 'WALK',
  CUSTOM = 'CUSTOM',
}

export enum RepeatPattern {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export interface Reminder {
  id: string;
  petId?: string;
  userId: string;
  type: ReminderType;
  title: string;
  message?: string;
  triggerDate: string;
  triggerTime: string;
  repeatPattern: RepeatPattern;
  isActive: boolean;
  createdAt: string;
}

export interface CreateReminderInput {
  petId?: string;
  type: ReminderType;
  title: string;
  message?: string;
  triggerDate: string;
  triggerTime: string;
  repeatPattern?: RepeatPattern;
}

export interface UpdateReminderInput {
  title?: string;
  message?: string;
  triggerDate?: string;
  triggerTime?: string;
  repeatPattern?: RepeatPattern;
  isActive?: boolean;
}

export interface DeviceToken {
  id: string;
  token: string;
  platform: 'ios' | 'android';
  createdAt: string;
}

export const getReminderTypeLabel = (type: ReminderType): string => {
  const labels: Record<ReminderType, string> = {
    [ReminderType.MEDICATION]: '약물',
    [ReminderType.VACCINATION]: '预防접종',
    [ReminderType.WALK]: '산책',
    [ReminderType.CUSTOM]: '사용자 정의',
  };
  return labels[type];
};

export const getReminderTypeEmoji = (type: ReminderType): string => {
  const emojis: Record<ReminderType, string> = {
    [ReminderType.MEDICATION]: '💊',
    [ReminderType.VACCINATION]: '💉',
    [ReminderType.WALK]: '🐕',
    [ReminderType.CUSTOM]: '🔔',
  };
  return emojis[type];
};

export const getRepeatPatternLabel = (pattern: RepeatPattern): string => {
  const labels: Record<RepeatPattern, string> = {
    [RepeatPattern.NONE]: '반복 안함',
    [RepeatPattern.DAILY]: '매일',
    [RepeatPattern.WEEKLY]: '매주',
    [RepeatPattern.MONTHLY]: '매월',
  };
  return labels[pattern];
};