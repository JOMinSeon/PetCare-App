import React, { useEffect, useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHealth } from '../../../src/contexts/HealthContext';
import {
  HealthRecord,
  HealthRecordType,
  CreateHealthRecordInput,
  VaccinationData,
  MedicationData,
  ExaminationData,
  formatFrequency,
  getRecordTypeEmoji,
} from '../../../src/types/health.types';

const frequencyOptions = [
  { value: 'DAILY', label: '매일' },
  { value: 'WEEKLY_ONCE', label: '주 1회' },
  { value: 'WEEKLY_TWICE', label: '주 2회' },
  { value: 'MONTHLY_ONCE', label: '월 1회' },
];

export default function HealthRecordDetailScreen() {
  const { petId, recordId } = useLocalSearchParams<{ petId: string; recordId: string }>();
  const router = useRouter();
  const { records, updateRecord, removeRecord } = useHealth();

  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common fields
  const [recordDate, setRecordDate] = useState('');

  // Vaccination fields
  const [vaccineName, setVaccineName] = useState('');
  const [dateAdministered, setDateAdministered] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');

  // Medication fields
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('DAILY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Examination fields
  const [clinicName, setClinicName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const foundRecord = records.find(r => r.id === recordId);
    if (foundRecord) {
      setRecord(foundRecord);
      initializeFormData(foundRecord);
    }
  }, [recordId, records]);

  const initializeFormData = (rec: HealthRecord) => {
    setRecordDate(rec.recordDate);

    switch (rec.type) {
      case HealthRecordType.VACCINATION: {
        const data = rec.data as VaccinationData;
        setVaccineName(data.vaccineName);
        setDateAdministered(data.dateAdministered);
        setNextDueDate(data.nextDueDate || '');
        break;
      }
      case HealthRecordType.MEDICATION: {
        const data = rec.data as MedicationData;
        setMedicineName(data.medicineName);
        setDosage(data.dosage);
        setFrequency(data.frequency);
        setStartDate(data.startDate);
        setEndDate(data.endDate || '');
        break;
      }
      case HealthRecordType.EXAMINATION: {
        const data = rec.data as ExaminationData;
        setClinicName(data.clinicName);
        setDiagnosis(data.diagnosis);
        setNotes(data.notes || '');
        break;
      }
    }
  };

  const handleDelete = () => {
    if (!record) return;

    Alert.alert(
      '건강 기록 삭제',
      '이 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeRecord(petId, record.id);
              router.back();
            } catch (err) {
              Alert.alert('오류', '건강 기록 삭제에 실패했습니다');
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!record || !petId) return;

    let data: VaccinationData | MedicationData | ExaminationData;
    let input: CreateHealthRecordInput;

    switch (record.type) {
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
        input = { type: record.type, recordDate, data };
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
        input = { type: record.type, recordDate, data };
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
        input = { type: record.type, recordDate, data };
        break;

      default:
        return;
    }

    setIsSubmitting(true);
    try {
      await updateRecord(petId, record.id, input);
      setIsEditing(false);
      Alert.alert('성공', '건강 기록이 수정되었습니다');
    } catch (err) {
      Alert.alert('오류', '건강 기록 수정에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRecordTypeLabel = (type: HealthRecordType): string => {
    const labels: Record<HealthRecordType, string> = {
      [HealthRecordType.VACCINATION]: '预防接종',
      [HealthRecordType.MEDICATION]: '약물',
      [HealthRecordType.EXAMINATION]: '진료',
    };
    return labels[type];
  };

  const renderViewMode = () => {
    if (!record) return null;

    switch (record.type) {
      case HealthRecordType.VACCINATION: {
        const data = record.data as VaccinationData;
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>💉 예방접종 정보</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>백신 이름</Text>
              <Text style={styles.infoValue}>{data.vaccineName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>접종 날짜</Text>
              <Text style={styles.infoValue}>{data.dateAdministered}</Text>
            </View>
            {data.nextDueDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>다음 만료일</Text>
                <Text style={styles.infoValue}>{data.nextDueDate}</Text>
              </View>
            )}
          </View>
        );
      }
      case HealthRecordType.MEDICATION: {
        const data = record.data as MedicationData;
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>💊 약물 정보</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>약물 이름</Text>
              <Text style={styles.infoValue}>{data.medicineName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>용량</Text>
              <Text style={styles.infoValue}>{data.dosage}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>투여 빈도</Text>
              <Text style={styles.infoValue}>{formatFrequency(data.frequency)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>시작 날짜</Text>
              <Text style={styles.infoValue}>{data.startDate}</Text>
            </View>
            {data.endDate && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>종료 날짜</Text>
                <Text style={styles.infoValue}>{data.endDate}</Text>
              </View>
            )}
          </View>
        );
      }
      case HealthRecordType.EXAMINATION: {
        const data = record.data as ExaminationData;
        return (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>🏥 진료 정보</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>병원 이름</Text>
              <Text style={styles.infoValue}>{data.clinicName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>진단 내용</Text>
              <Text style={styles.infoValue}>{data.diagnosis}</Text>
            </View>
            {data.notes && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>메모</Text>
                <Text style={styles.infoValue}>{data.notes}</Text>
              </View>
            )}
          </View>
        );
      }
      default:
        return null;
    }
  };

  const renderEditMode = () => {
    if (!record) return null;

    return (
      <>
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

        {record.type === HealthRecordType.VACCINATION && (
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
        )}

        {record.type === HealthRecordType.MEDICATION && (
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
        )}

        {record.type === HealthRecordType.EXAMINATION && (
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
        )}
      </>
    );
  };

  if (!record) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>건강 기록 상세</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>{isEditing ? '취소' : '✏️ 수정'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.typeHeader}>
          <Text style={styles.typeEmoji}>{getRecordTypeEmoji(record.type)}</Text>
          <Text style={styles.typeLabel}>{getRecordTypeLabel(record.type)}</Text>
        </View>

        <View style={styles.dateHeader}>
          <Text style={styles.dateLabel}>기록 날짜</Text>
          <Text style={styles.dateValue}>{record.recordDate}</Text>
        </View>

        {isEditing ? renderEditMode() : renderViewMode()}

        {isEditing ? (
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '저장 중...' : '💾 저장'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>🗑️ 삭제</Text>
          </TouchableOpacity>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  typeEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  typeLabel: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666666',
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
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
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
