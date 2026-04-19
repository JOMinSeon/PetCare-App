import { apiService } from './api';

export interface Activity {
  id: string;
  steps: number | null;
  durationMinutes: number;
  date: string;
  petId: string;
}

export interface ActivityStats {
  petId: string;
  totalMinutes: number;
  totalSteps: number;
  averageDaily: number;
  goalMinutes: number;
  goalProgress: number;
  chartData: { date: string; minutes: number; steps: number }[];
}

export interface CreateActivityRequest {
  steps?: number;
  durationMinutes: number;
  date: string;
}

export class ActivityService {
  async getActivities(petId: string, days: number = 30): Promise<Activity[]> {
    const response = await apiService.get<{ activities: Activity[] }>(`/api/pets/${petId}/activities?days=${days}`);
    return response.activities;
  }

  async createActivity(petId: string, data: CreateActivityRequest): Promise<Activity> {
    return apiService.post<Activity>(`/api/pets/${petId}/activities`, data);
  }

  async updateActivity(petId: string, activityId: string, data: Partial<CreateActivityRequest>): Promise<Activity> {
    return apiService.put<Activity>(`/api/pets/${petId}/activities/${activityId}`, data);
  }

  async deleteActivity(petId: string, activityId: string): Promise<void> {
    return apiService.delete(`/api/pets/${petId}/activities/${activityId}`);
  }

  async getActivityStats(petId: string): Promise<ActivityStats> {
    return apiService.get<ActivityStats>(`/api/pets/${petId}/activities/stats`);
  }
}

export const activityService = new ActivityService();