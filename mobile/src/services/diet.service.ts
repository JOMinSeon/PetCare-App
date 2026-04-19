import { apiService } from './api';

export interface Diet {
  id: string;
  foodName: string;
  amountGrams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  date: string;
  petId: string;
}

export interface DietStats {
  petId: string;
  dailyCalories: number;
  calorieTarget: number;
  caloriesConsumed: number;
  caloriesRemaining: number;
  macros: { protein: number; fat: number; carbs: number };
  weeklyData: { date: string; calories: number; protein: number; fat: number; carbs: number }[];
}

export interface CreateDietRequest {
  foodName: string;
  amountGrams: number;
  calories: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  date: string;
}

export class DietService {
  async getDiets(petId: string, days: number = 30): Promise<Diet[]> {
    const response = await apiService.get<{ diets: Diet[] }>(`/api/pets/${petId}/diets?days=${days}`);
    return response.diets;
  }

  async createDiet(petId: string, data: CreateDietRequest): Promise<Diet> {
    return apiService.post<Diet>(`/api/pets/${petId}/diets`, data);
  }

  async updateDiet(petId: string, dietId: string, data: Partial<CreateDietRequest>): Promise<Diet> {
    return apiService.put<Diet>(`/api/pets/${petId}/diets/${dietId}`, data);
  }

  async deleteDiet(petId: string, dietId: string): Promise<void> {
    return apiService.delete(`/api/pets/${petId}/diets/${dietId}`);
  }

  async getDietStats(petId: string): Promise<DietStats> {
    return apiService.get<DietStats>(`/api/pets/${petId}/diets/stats`);
  }
}

export const dietService = new DietService();