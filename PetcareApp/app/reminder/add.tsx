import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useReminder } from '../../src/contexts/ReminderContext';
import { ReminderType, RepeatPattern } from '../../src/types/notification.types';

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

export default function AddReminderScreen() {
  const router = useRouter();
  const { addReminder, isLoading } = useReminder();
  
  const [type, setType] = useState<ReminderType | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [triggerDate, setTriggerDate] = useState('');
  const [triggerTime, setTriggerTime] = useState('');
  const [repeatPattern, setRepeatPattern] = useState<RepeatPattern>(RepeatPattern.NONE);

  const getDefaultTitle = (): string => {
    switch (type) {
      case ReminderType.MEDICATION:
        return '약물 복용 시간';
      case ReminderType.VACCINATION:
        return '预防접종 알림';
      case ReminderType.WALK:
        return '산책 시간';
      default:
        return '';
    }
  };

  const handleTypeSelect = (selectedType: ReminderType) => {
    setType(selectedType);
    if (!title || getDefaultTitle() === title) {
      setTitle(getDefaultTitle());
    }
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
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await addReminder({
        type: type!,
        title: title.trim(),
        message: message.trim() || undefined,
        triggerDate,
        triggerTime,
        repeatPattern,
      });

      Alert.alert('성공', '리마인더가 등록되었습니다', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('오류', err instanceof Error ? err.message : '리마인더 등록에 실패했습니다');
    }
  };

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
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>저장</Text>
        )}
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
});