export enum HealthRecordType {
  VACCINATION = 'VACCINATION',
  MEDICATION = 'MEDICATION',
  EXAMINATION = 'EXAMINATION',
}

export interface VaccinationData {
  vaccineName: string;
  dateAdministered: string;
  nextDueDate?: string;
}

export interface MedicationData {
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

export interface ExaminationData {
  clinicName: string;
  diagnosis: string;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  petId: string;
  type: HealthRecordType;
  recordDate: string;
  data: VaccinationData | MedicationData | ExaminationData;
  createdAt: string;
}

export interface CreateHealthRecordInput {
  type: HealthRecordType;
  recordDate: string;
  data: VaccinationData | MedicationData | ExaminationData;
}

export const getRecordTypeLabel = (type: HealthRecordType): string => {
  const labels: Record<HealthRecordType, string> = {
    [HealthRecordType.VACCINATION]: '预防接종',
    [HealthRecordType.MEDICATION]: '약물',
    [HealthRecordType.EXAMINATION]: '진료',
  };
  return labels[type];
};

export const getRecordTypeEmoji = (type: HealthRecordType): string => {
  const emojis: Record<HealthRecordType, string> = {
    [HealthRecordType.VACCINATION]: '💉',
    [HealthRecordType.MEDICATION]: '💊',
    [HealthRecordType.EXAMINATION]: '🏥',
  };
  return emojis[type];
};

export const formatFrequency = (frequency: string): string => {
  const frequencyMap: Record<string, string> = {
    'DAILY': '매일',
    'WEEKLY_ONCE': '주 1회',
    'WEEKLY_TWICE': '주 2회',
    'MONTHLY_ONCE': '월 1회',
  };
  return frequencyMap[frequency] || frequency;
};