import { apiService } from './api';

export type MedicalRecordType = 'vaccination' | 'checkup';

export interface MedicalRecord {
  id: string;
  type: MedicalRecordType;
  name: string;
  date: string;
  nextDueDate?: string;
  hospital?: string;
  summary?: string;
  petId: string;
}

export interface CreateMedicalRecordRequest {
  type: MedicalRecordType;
  name: string;
  date: string;
  nextDueDate?: string;
  hospital?: string;
  summary?: string;
}

export interface UpdateMedicalRecordRequest {
  name?: string;
  date?: string;
  nextDueDate?: string;
  hospital?: string;
  summary?: string;
}

export class MedicalRecordService {
  async getRecords(petId: string, type?: MedicalRecordType): Promise<MedicalRecord[]> {
    const params = type ? `?type=${type}` : '';
    const response = await apiService.get<{ records: MedicalRecord[] }>(`/api/pets/${petId}/medical-records${params}`);
    return response.records;
  }

  async getRecord(petId: string, recordId: string): Promise<MedicalRecord> {
    return apiService.get<MedicalRecord>(`/api/pets/${petId}/medical-records/${recordId}`);
  }

  async createRecord(petId: string, data: CreateMedicalRecordRequest): Promise<MedicalRecord> {
    return apiService.post<MedicalRecord>(`/api/pets/${petId}/medical-records`, data);
  }

  async updateRecord(petId: string, recordId: string, data: UpdateMedicalRecordRequest): Promise<MedicalRecord> {
    return apiService.put<MedicalRecord>(`/api/pets/${petId}/medical-records/${recordId}`, data);
  }

  async deleteRecord(petId: string, recordId: string): Promise<void> {
    return apiService.delete(`/api/pets/${petId}/medical-records/${recordId}`);
  }

  async getUpcoming(petId: string): Promise<MedicalRecord[]> {
    const response = await apiService.get<{ records: MedicalRecord[] }>(`/api/pets/${petId}/medical-records/upcoming`);
    return response.records;
  }
}

export const medicalRecordService = new MedicalRecordService();