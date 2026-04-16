import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHealth } from '../../src/contexts/HealthContext';
import {
  HealthRecordType,
  CreateHealthRecordInput,
  VaccinationData,
  MedicationData,
  ExaminationData,
} from '../../src/types/health.types';

const recordTypes = [
  { type: HealthRecordType.VACCINATION, label: '💉 예방접종', description: '预防接종 기록' },
  { type: HealthRecordType.MEDICATION, label: '💊 약물', description: '약물 치료 기록' },
  { type: HealthRecordType.EXAMINATION, label: '🏥 진료', description: '진료 및 진단 기록' },
];

const frequencyOptions = [
  { value: 'DAILY', label: '매일' },
  { value: 'WEEKLY_ONCE', label: '주 1회' },
  { value: 'WEEKLY_TWICE', label: '주 2회' },
  { value: 'MONTHLY_ONCE', label: '월 1회' },
];

export default function AddHealthRecordScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const router = useRouter();
  const { addRecord } = useHealth();

  const [selectedType, setSelectedType] = useState<HealthRecordType | null>(null);
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vaccination fields
  const [vaccineName, setVaccineName] = useState('');
  const [dateAdministered, setDateAdministered] = useState(new Date().toISOString().split('T')[0]);
  const [nextDueDate, setNextDueDate] = useState('');

  // Medication fields
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('DAILY');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  // Examination fields
  const [clinicName, setClinicName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('오류', '기록 유형을 선택해주세요');
      return;
    }

    if (!petId) {
      Alert.alert('오류', '반려동물을 찾을 수 없습니다');
      return;
    }

    let data: VaccinationData | MedicationData | ExaminationData;
    let input: CreateHealthRecordInput;

    switch (selectedType) {
      case HealthRecordType.VACCINATION:
        if (!vaccineName.trim()) {
          Alert.alert('오류', '백신 이름을 입력해주세요');
          return;
        }
        data = {
          vaccineName: vaccineName.trim(),
          dateAdministered,
          nextDueDate: nextDueDate || undefined,
        };
        input = { type: selectedType, recordDate, data };
        break;

      case HealthRecordType.MEDICATION:
        if (!medicineName.trim()) {
          Alert.alert('오류', '약물 이름을 입력해주세요');
          return;
        }
        if (!dosage.trim()) {
          Alert.alert('오류', '용량을 입력해주세요');
          return;
        }
        data = {
          medicineName: medicineName.trim(),
          dosage: dosage.trim(),
          frequency,
          startDate,
          endDate: endDate || undefined,
        };
        input = { type: selectedType, recordDate, data };
        break;

      case HealthRecordType.EXAMINATION:
        if (!clinicName.trim()) {
          Alert.alert('오류', '병원 이름을 입력해주세요');
          return;
        }
        if (!diagnosis.trim()) {
          Alert.alert('오류', '진단 내용을 입력해주세요');
          return;
        }
        data = {
          clinicName: clinicName.trim(),
          diagnosis: diagnosis.trim(),
          notes: notes.trim() || undefined,
        };
        input = { type: selectedType, recordDate, data };
        break;

      default:
        return;
    }

    setIsSubmitting(true);
    try {
      await addRecord(petId, input);
      Alert.alert('성공', '건강 기록이 추가되었습니다', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('오류', '건강 기록 추가에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderVaccinationForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>💉 예방접종 정보</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>백신 이름 *</Text>
        <TextInput
          style={styles.input}
          value={vaccineName}
          onChangeText={setVaccineName}
          placeholder="예: 광견병疫苗, 복합백신"
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>접종 날짜 *</Text>
        <TextInput
          style={styles.input}
          value={dateAdministered}
          onChangeText={setDateAdministered}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>다음 만료일 (선택)</Text>
        <TextInput
          style={styles.input}
          value={nextDueDate}
          onChangeText={setNextDueDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999999"
        />
      </View>
    </View>
  );

  const renderMedicationForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>💊 약물 정보</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>약물 이름 *</Text>
        <TextInput
          style={styles.input}
          value={medicineName}
          onChangeText={setMedicineName}
          placeholder="약물 이름을 입력하세요"
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>용량 *</Text>
        <TextInput
          style={styles.input}
          value={dosage}
          onChangeText={setDosage}
          placeholder="예: 10mg, 1정"
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>투여 빈도 *</Text>
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
              <Text
                style={[
                  styles.frequencyButtonText,
                  frequency === option.value && styles.frequencyButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>시작 날짜 *</Text>
        <TextInput
          style={styles.input}
          value={startDate}
          onChangeText={setStartDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>종료 날짜 (선택)</Text>
        <TextInput
          style={styles.input}
          value={endDate}
          onChangeText={setEndDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999999"
        />
      </View>
    </View>
  );

  const renderExaminationForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>🏥 진료 정보</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>병원 이름 *</Text>
        <TextInput
          style={styles.input}
          value={clinicName}
          onChangeText={setClinicName}
          placeholder="병원 이름을 입력하세요"
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>진단 내용 *</Text>
        <TextInput
          style={styles.input}
          value={diagnosis}
          onChangeText={setDiagnosis}
          placeholder="진단 내용을 입력하세요"
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>메모 (선택)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="추가 메모가 있으면 입력하세요"
          placeholderTextColor="#999999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← 취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>건강 기록 추가</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {!selectedType ? (
          <View style={styles.typeSelection}>
            <Text style={styles.typeSelectionTitle}>기록 유형 선택</Text>
            <View style={styles.typeOptions}>
              {recordTypes.map((item) => (
                <TouchableOpacity
                  key={item.type}
                  style={styles.typeOption}
                  onPress={() => setSelectedType(item.type)}
                >
                  <Text style={styles.typeOptionEmoji}>
                    {item.type === HealthRecordType.VACCINATION ? '💉' : 
                     item.type === HealthRecordType.MEDICATION ? '💊' : '🏥'}
                  </Text>
                  <Text style={styles.typeOptionLabel}>{item.label}</Text>
                  <Text style={styles.typeOptionDescription}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.changeTypeButton} onPress={() => setSelectedType(null)}>
              <Text style={styles.changeTypeButtonText}>↩️ 유형 변경</Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>기록 날짜</Text>
              <TextInput
                style={styles.input}
                value={recordDate}
                onChangeText={setRecordDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999999"
              />
            </View>

            {selectedType === HealthRecordType.VACCINATION && renderVaccinationForm()}
            {selectedType === HealthRecordType.MEDICATION && renderMedicationForm()}
            {selectedType === HealthRecordType.EXAMINATION && renderExaminationForm()}

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? '저장 중...' : '💾 저장'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  typeSelection: {
    alignItems: 'center',
  },
  typeSelectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 24,
  },
  typeOptions: {
    width: '100%',
    gap: 12,
  },
  typeOption: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  typeOptionEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  typeOptionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  typeOptionDescription: {
    fontSize: 14,
    color: '#666666',
  },
  changeTypeButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 16,
  },
  changeTypeButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  formSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  frequencyButtonActive: {
    backgroundColor: '#007AFF',
  },
  frequencyButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  frequencyButtonTextActive: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
