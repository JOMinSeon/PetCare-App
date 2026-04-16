import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { WeightDataPoint, ActivityDataPoint, HealthInsight, DateRange } from '../types/analytics.types';
import * as analyticsService from '../services/analytics.service';

interface AnalyticsContextType {
  weightData: WeightDataPoint[];
  activityData: ActivityDataPoint[];
  insights: HealthInsight[];
  isLoading: boolean;
  error: string | null;
  selectedRange: DateRange;
  setSelectedRange: (range: DateRange) => void;
  fetchAnalytics: (petId: string) => Promise<void>;
  clearError: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [weightData, setWeightData] = useState<WeightDataPoint[]>([]);
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<DateRange>('30d');

  const fetchAnalytics = useCallback(async (petId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [weight, activity, insightList] = await Promise.all([
        analyticsService.getWeightTrend(petId, selectedRange),
        analyticsService.getActivityTrend(petId, selectedRange),
        analyticsService.getHealthInsights(petId),
      ]);
      setWeightData(weight);
      setActivityData(activity);
      setInsights(insightList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, [selectedRange]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        weightData,
        activityData,
        insights,
        isLoading,
        error,
        selectedRange,
        setSelectedRange,
        fetchAnalytics,
        clearError,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
}

export default AnalyticsContext;