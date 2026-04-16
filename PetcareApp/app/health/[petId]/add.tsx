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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHealth } from '../../src/contexts/HealthContext';
import { HealthRecordType, CreateHealthRecordInput, VaccinationData, MedicationData, ExaminationData } from '../../src/types/health.types';

type Frequency = 'DAILY' | 'WEEKLY_ONCE' | 'WEEKLY_TWICE' | 'MONTHLY_ONCE';

const frequencyOptions: Array<{ value: Frequency; label: string }> = [
  { value: 'DAILY', label: '매일' },
  { value: 'WEEKLY_ONCE', label: '주 1회' },
  { value: 'WEEKLY_TWICE', label: '주 2회' },
  { value: 'MONTHLY_ONCE', label: '월 1회' },
];

export default function AddHealthRecordScreen() {
  const router = useRouter();
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { addRecord, isLoading } = useHealth();
  
  const [recordType, setRecordType] = useState<HealthRecordType | null>(null);
  const [recordDate, setRecordDate] = useState('');
  
  const [vaccineName, setVaccineName] = useState('');
  const [dateAdministered, setDateAdministered] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('DAILY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [clinicName, setClinicName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const validate = (): boolean => {
    if (!recordType) {
      Alert.alert('오류', '기록 유형을 선택해주세요');
      return false;
    }
    if (!recordDate) {
      Alert.alert('오류', '날짜를 입력해주세요');
      return false;
    }
    
    if (recordType === HealthRecordType.VACCINATION && !vaccineName) {
      Alert.alert('오류', '백신 이름을 입력해주세요');
      return false;
    }
    if (recordType === HealthRecordType.MEDICATION && !medicineName) {
      Alert.alert('오류', '약물 이름을 입력해주세요');
      return false;
    }
    if (recordType === HealthRecordType.EXAMINATION && (!clinicName || !diagnosis)) {
      Alert.alert('오류', '병원명과 진단 내용을 입력해주세요');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validate() || !petId) return;

    try {
      let data: VaccinationData | MedicationData | ExaminationData;
      
      switch (recordType) {
        case HealthRecordType.VACCINATION:
          data = {
            vaccineName,
            dateAdministered: dateAdministered || recordDate,
            nextDueDate: nextDueDate || undefined,
          };
          break;
        case HealthRecordType.MEDICATION:
          data = {
            medicineName,
            dosage,
            frequency,
            startDate: startDate || recordDate,
            endDate: endDate || undefined,
          };
          break;
        case HealthRecordType.EXAMINATION:
          data = {
            clinicName,
            diagnosis,
            notes: notes || undefined,
          };
          break;
      }

      const input: CreateHealthRecordInput = {
        type: recordType!,
        recordDate,
        data,
      };

      await addRecord(petId, input);
      Alert.alert('성공', '건강 기록이 저장되었습니다', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('오류', err instanceof Error ? err.message : '건강 기록 저장에 실패했습니다');
    }
  };

  const recordTypeButtons = [
    { type: HealthRecordType.VACCINATION, label: '💉 예방접종', color: '#34C759' },
    { type: HealthRecordType.MEDICATION, label: '💊 약물', color: '#FF9500' },
    { type: HealthRecordType.EXAMINATION, label: '🏥 진료', color: '#007AFF' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>기록 유형</Text>
      <View style={styles.typeContainer}>
        {recordTypeButtons.map((btn) => (
          <TouchableOpacity
            key={btn.type}
            style={[
              styles.typeButton,
              recordType === btn.type && { backgroundColor: btn.color },
            ]}
            onPress={() => setRecordType(btn.type)}
          >
            <Text style={[
              styles.typeButtonText,
              recordType === btn.type && styles.typeButtonTextActive,
            ]}>
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>날짜 *</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={recordDate}
        onChangeText={setRecordDate}
      />

      {recordType === HealthRecordType.VACCINATION && (
        <>
          <Text style={styles.label}>백신 이름 *</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 종합백신, 광견병疫苗"
            value={vaccineName}
            onChangeText={setVaccineName}
          />

          <Text style={styles.label}>접종 날짜</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={dateAdministered}
            onChangeText={setDateAdministered}
          />

          <Text style={styles.label}>다음 만료일</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD (선택)"
            value={nextDueDate}
            onChangeText={setNextDueDate}
          />
        </>
      )}

      {recordType === HealthRecordType.MEDICATION && (
        <>
          <Text style={styles.label}>약물 이름 *</Text>
          <TextInput
            style={styles.input}
            placeholder="약물 이름"
            value={medicineName}
            onChangeText={setMedicineName}
          />

          <Text style={styles.label}>용량</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 1알, 5ml"
            value={dosage}
            onChangeText={setDosage}
          />

          <Text style={styles.label}>투여 빈도</Text>
          <View style={styles.frequencyContainer}>
            {frequencyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.frequencyButton,
                  frequency === option.value && styles.frequencyButtonActive,
                ]}
                onPress={() => setFrequency(option.value)}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  frequency === option.value && styles.frequencyButtonTextActive,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>시작 날짜</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={startDate}
            onChangeText={setStartDate}
          />

          <Text style={styles.label}>종료 날짜 (선택)</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={endDate}
            onChangeText={setEndDate}
          />
        </>
      )}

      {recordType === HealthRecordType.EXAMINATION && (
        <>
          <Text style={styles.label}>병원명 *</Text>
          <TextInput
            style={styles.input}
            placeholder="동물병원 이름"
            value={clinicName}
            onChangeText={setClinicName}
          />

          <Text style={styles.label}>진단 내용 *</Text>
          <TextInput
            style={styles.input}
            placeholder="진단 내용"
            value={diagnosis}
            onChangeText={setDiagnosis}
          />

          <Text style={styles.label}>메모 (선택)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="추가 메모"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </>
      )}

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
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
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
    height: 100,
    textAlignVertical: 'top',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  frequencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  frequencyButtonActive: {
    backgroundColor: '#007AFF',
  },
  frequencyButtonText: {
    fontSize: 14,
    color: '#666',
  },
  frequencyButtonTextActive: {
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