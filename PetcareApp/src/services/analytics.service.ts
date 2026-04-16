import { WeightDataPoint, ActivityDataPoint, HealthInsight, AnalyticsSummary, DateRange } from '../types/analytics.types';
import { getAuthHeader } from './auth.service';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export async function getWeightTrend(
  petId: string,
  range: DateRange = '30d'
): Promise<WeightDataPoint[]> {
  const headers = await getAuthHeader();

  const response = await fetch(
    `${API_BASE_URL}/api/pets/${petId}/analytics/weight?range=${range}`,
    {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weight trend');
  }

  return response.json();
}

export async function getActivityTrend(
  petId: string,
  range: DateRange = '30d'
): Promise<ActivityDataPoint[]> {
  const headers = await getAuthHeader();

  const response = await fetch(
    `${API_BASE_URL}/api/pets/${petId}/analytics/activity?range=${range}`,
    {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch activity trend');
  }

  return response.json();
}

export async function getHealthInsights(petId: string): Promise<HealthInsight[]> {
  const headers = await getAuthHeader();

  const response = await fetch(
    `${API_BASE_URL}/api/pets/${petId}/analytics/insights`,
    {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch health insights');
  }

  return response.json();
}

export async function getAnalyticsSummary(petId: string): Promise<AnalyticsSummary> {
  const headers = await getAuthHeader();

  const response = await fetch(
    `${API_BASE_URL}/api/pets/${petId}/analytics/summary`,
    {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch analytics summary');
  }

  return response.json();
}

export function calculateTrend(data: { date: string; value: number }[]): 'up' | 'down' | 'stable' {
  if (data.length < 2) return 'stable';
  
  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length;
  
  const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (changePercent > 5) return 'up';
  if (changePercent < -5) return 'down';
  return 'stable';
}

export function getTrendPercent(data: { date: string; value: number }[]): number {
  if (data.length < 2) return 0;
  
  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const first = sorted[0].value;
  const last = sorted[sorted.length - 1].value;
  
  return Math.round(((last - first) / first) * 100);
}

export default {
  getWeightTrend,
  getActivityTrend,
  getHealthInsights,
  getAnalyticsSummary,
  calculateTrend,
  getTrendPercent,
};