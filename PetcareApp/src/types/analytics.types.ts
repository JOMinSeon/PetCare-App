export interface WeightDataPoint {
  date: string;
  weight: number;
}

export interface ActivityDataPoint {
  date: string;
  activityMinutes: number;
}

export type InsightSeverity = 'info' | 'warning' | 'alert';

export interface HealthInsight {
  id: string;
  type: 'weight' | 'activity' | 'medication' | 'vaccination';
  title: string;
  message: string;
  severity: InsightSeverity;
  createdAt: string;
}

export interface AnalyticsSummary {
  petId: string;
  currentWeight?: number;
  weightTrend: 'up' | 'down' | 'stable';
  weightTrendPercent?: number;
  averageWeight?: number;
  minWeight?: number;
  maxWeight?: number;
  currentActivityMinutes?: number;
  activityTrend: 'up' | 'down' | 'stable';
  activityTrendPercent?: number;
  averageActivity?: number;
  insights: HealthInsight[];
}

export type DateRange = '7d' | '30d' | '90d';

export const getDateRangeLabel = (range: DateRange): string => {
  const labels: Record<DateRange, string> = {
    '7d': '7일',
    '30d': '30일',
    '90d': '90일',
  };
  return labels[range];
};

export const getSeverityColor = (severity: InsightSeverity): string => {
  const colors: Record<InsightSeverity, string> = {
    info: '#007AFF',
    warning: '#FF9500',
    alert: '#FF3B30',
  };
  return colors[severity];
};

export const getSeverityEmoji = (severity: InsightSeverity): string => {
  const emojis: Record<InsightSeverity, string> = {
    info: 'ℹ️',
    warning: '⚠️',
    alert: '🚨',
  };
  return emojis[severity];
};