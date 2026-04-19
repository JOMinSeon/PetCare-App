/**
 * Health Service
 * 
 * API service for fetching health score and related data.
 */

import apiService from './api';

export interface HealthFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
}

export interface HealthScoreBreakdown {
  activityScore: number;
  activityMinutes: number;
  activityGoal: number;
  dietScore: number;
  caloriesConsumed: number;
  caloriesTarget: number;
  ageScore: number;
  ageYears: number;
  weightScore: number;
  weightKg: number;
  symptomScore: number;
  symptomPenalty: number;
}

export interface HealthScoreResponse {
  petId: string;
  score: number;
  factors: HealthFactor[];
  breakdown: HealthScoreBreakdown;
  lastUpdated: string;
}

export interface ActivityStats {
  petId: string;
  days: number;
  totalMinutes: number;
  totalSteps: number;
  averageDailyMinutes: number;
  goalMinutes: number;
  percentOfGoal: number;
}

export interface DietStats {
  petId: string;
  days: number;
  totalCalories: number;
  averageDailyCalories: number;
  goalCalories: number;
  percentOfGoal: number;
}

class HealthService {
  /**
   * Get health score with full factor breakdown for a pet
   */
  async getHealthScore(petId: string): Promise<HealthScoreResponse> {
    return apiService.get<HealthScoreResponse>(`/pets/${petId}/health`);
  }

  /**
   * Get activity statistics for a pet
   */
  async getActivityStats(petId: string, days: number = 7): Promise<ActivityStats> {
    return apiService.get<ActivityStats>(`/pets/${petId}/activities/stats?days=${days}`);
  }

  /**
   * Get diet statistics for a pet
   */
  async getDietStats(petId: string, days: number = 7): Promise<DietStats> {
    return apiService.get<DietStats>(`/pets/${petId}/diets/stats?days=${days}`);
  }
}

export const healthService = new HealthService();
export default healthService;
