import { apiService } from './api';
import { CreateSymptomRequest, Symptom, SymptomAnalysisResponse } from '../types';

export class SymptomService {
  async getSymptoms(petId: string): Promise<Symptom[]> {
    const response = await apiService.get<{ symptoms: Symptom[] }>(`/api/pets/${petId}/symptoms`);
    return response.symptoms;
  }

  async getSymptom(petId: string, symptomId: string): Promise<Symptom> {
    return apiService.get<Symptom>(`/api/pets/${petId}/symptoms/${symptomId}`);
  }

  async createSymptom(petId: string, data: CreateSymptomRequest): Promise<SymptomAnalysisResponse> {
    return apiService.post<SymptomAnalysisResponse>(`/api/pets/${petId}/symptoms`, data);
  }

  async updateSymptom(petId: string, symptomId: string, data: Partial<CreateSymptomRequest>): Promise<Symptom> {
    return apiService.put<Symptom>(`/api/pets/${petId}/symptoms/${symptomId}`, data);
  }

  async deleteSymptom(petId: string, symptomId: string): Promise<void> {
    return apiService.delete(`/api/pets/${petId}/symptoms/${symptomId}`);
  }

  async getRiskAssessment(petId: string): Promise<any> {
    return apiService.get(`/api/pets/${petId}/symptoms/analysis`);
  }
}

export const symptomService = new SymptomService();