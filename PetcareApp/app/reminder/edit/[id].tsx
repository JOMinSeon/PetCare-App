import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReminder } from '../../../src/contexts/ReminderContext';
import { Reminder, ReminderType, RepeatPattern } from '../../../src/types/notification.types';
import * as notificationService from '../../../src/services/notification.service';
import { cancelNotification, scheduleNotification } from '../../../src/utils/scheduler';

const reminderTypeOptions = [
  { value: ReminderType.MEDICATION, label: '💊 약물', color: '#FF9500' },
  { value: ReminderType.VACCINATION, label: '💉 예방접종', color: '#34C759' },
  { value: ReminderType.WALK, label: '🐕 산책', color: '#007AFF' },
  { value: ReminderType.CUSTOM, label: '🔔 사용자 정의', color: '#AF52DE' },
];

const repeatPatternOptions = [
  { value: RepeatPattern.NONE, label: '반복 안함' },
  { value: RepeatPattern.DAILY, label: '매일' },
  { value: RepeatPattern.WEEKLY, label: '매주' },
  { value: RepeatPattern.MONTHLY, label: '매월' },
];

export default function EditReminderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { updateReminder, removeReminder, reminders } = useReminder();

  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [type, setType] = useState<ReminderType | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [triggerDate, setTriggerDate] = useState('');
  const [triggerTime, setTriggerTime] = useState('');
  const [repeatPattern, setRepeatPattern] = useState<RepeatPattern>(RepeatPattern.NONE);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadReminder();
  }, [id]);

  const loadReminder = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      // First try to find in context state
      const contextReminder = reminders.find(r => r.id === id);
      
      if (contextReminder) {
        setReminder(contextReminder);
        populateForm(contextReminder);
      } else {
        // Fetch from service
        const fetched = await notificationService.getReminderById(id);
        setReminder(fetched);
        populateForm(fetched);
      }
    } catch (err) {
      Alert.alert('오류', '리마인더를 불러오는데 실패했습니다');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const populateForm = (reminderData: Reminder) => {
    setType(reminderData.type);
    setTitle(reminderData.title);
    setMessage(reminderData.message || '');
    setTriggerDate(reminderData.triggerDate);
    setTriggerTime(reminderData.triggerTime);
    setRepeatPattern(reminderData.repeatPattern);
    setIsActive(reminderData.isActive);
  };

  const handleTypeSelect = (selectedType: ReminderType) => {
    setType(selectedType);
  };

  const validate = (): boolean => {
    if (!type) {
      Alert.alert('오류', '유형을 선택해주세요');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('오류', '제목을 입력해주세요');
      return false;
    }
    if (!triggerDate) {
      Alert.alert('오류', '날짜를 입력해주세요');
      return false;
    }
    if (!triggerTime) {
      Alert.alert('오류', '시간을 입력해주세요');
      return false;
    }
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(triggerDate)) {
      Alert.alert('오류', '날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)');
      return false;
    }
    // Validate time format
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(triggerTime)) {
      Alert.alert('오류', '시간 형식이 올바르지 않습니다 (HH:MM)');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate() || !reminder) return;

    setIsSaving(true);
    try {
      const updatedReminder = await updateReminder(reminder.id, {
        title: title.trim(),
        message: message.trim() || undefined,
        triggerDate,
        triggerTime,
        repeatPattern,
        isActive,
      });

      // Reschedule notification if active
      if (isActive) {
        await cancelNotification(reminder.id);
        await scheduleNotification(updatedReminder);
      } else {
        await cancelNotification(reminder.id);
      }

      Alert.alert('성공', '리마인더가 수정되었습니다', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('오류', err instanceof Error ? err.message : '리마인더 수정에 실패했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!reminder) return;

    Alert.alert(
      '리마인더 삭제',
      '이 리마인더를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelNotification(reminder.id);
              await removeReminder(reminder.id);
              Alert.alert('성공', '리마인더가 삭제되었습니다', [
                { text: '확인', onPress: () => router.back() },
              ]);
            } catch (err) {
              Alert.alert('오류', '리마인더 삭제에 실패했습니다');
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = (value: boolean) => {
    setIsActive(value);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!reminder) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>리마인더를 찾을 수 없습니다</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>뒤로 가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>유형</Text>
      <View style={styles.typeContainer}>
        {reminderTypeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.typeButton,
              type === option.value && { backgroundColor: option.color },
            ]}
            onPress={() => handleTypeSelect(option.value)}
            disabled
          >
            <Text style={[
              styles.typeButtonText,
              type === option.value && styles.typeButtonTextActive,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.activeRow}>
        <Text style={styles.label}>활성 상태</Text>
        <Switch
          value={isActive}
          onValueChange={handleToggleActive}
          trackColor={{ false: '#e0e0e0', true: '#34C759' }}
        />
      </View>

      <Text style={styles.label}>제목 *</Text>
      <TextInput
        style={styles.input}
        placeholder="리마인더 제목"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>메시지 (선택)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="추가 메시지 (선택)"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <Text style={styles.label}>날짜 *</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={triggerDate}
        onChangeText={setTriggerDate}
      />

      <Text style={styles.label}>시간 *</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM (예: 09:00)"
        value={triggerTime}
        onChangeText={setTriggerTime}
      />

      <Text style={styles.label}>반복</Text>
      <View style={styles.repeatContainer}>
        {repeatPatternOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.repeatButton,
              repeatPattern === option.value && styles.repeatButtonActive,
            ]}
            onPress={() => setRepeatPattern(option.value)}
          >
            <Text style={[
              styles.repeatButtonText,
              repeatPattern === option.value && styles.repeatButtonTextActive,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isSaving && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>저장</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.deleteButtonText}>삭제</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  typeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  activeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  repeatContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  repeatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  repeatButtonActive: {
    backgroundColor: '#007AFF',
  },
  repeatButtonText: {
    fontSize: 14,
    color: '#666',
  },
  repeatButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#99ccff',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
