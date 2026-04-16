import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAnalytics } from '../../../src/contexts/AnalyticsContext';
import { DateRange, getDateRangeLabel, getSeverityColor, getSeverityEmoji } from '../../../src/types/analytics.types';
import { calculateTrend, getTrendPercent } from '../../../src/services/analytics.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_HEIGHT = 200;

const dateRangeOptions: DateRange[] = ['7d', '30d', '90d'];

export default function AnalyticsScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { 
    weightData, 
    activityData, 
    isLoading, 
    error, 
    selectedRange, 
    setSelectedRange, 
    fetchAnalytics 
  } = useAnalytics();

  useEffect(() => {
    if (petId) {
      fetchAnalytics(petId);
    }
  }, [petId, fetchAnalytics]);

  const weightTrend = calculateTrend(weightData);
  const weightTrendPercent = getTrendPercent(weightData);
  const activityTrend = calculateTrend(activityData);
  const activityTrendPercent = getTrendPercent(activityData);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '#34C759';
      case 'down': return '#FF3B30';
      default: return '#666666';
    }
  };

  const renderSimpleChart = (data: { date: string; value: number }[], color: string) => {
    if (data.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyChartText}>데이터 없음</Text>
        </View>
      );
    }

    const values = data.map(d => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;
    
    const chartWidth = SCREEN_WIDTH - 64;
    const chartHeight = CHART_HEIGHT;
    
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * chartWidth;
      const y = chartHeight - ((d.value - minVal) / range) * (chartHeight - 40);
      return { x, y };
    });

    const pathD = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');

    return (
      <View style={styles.chartContainer}>
        <View style={[styles.chart, { height: chartHeight }]}>
          <View style={styles.chartLine}>
            {points.map((point, i) => (
              <View
                key={i}
                style={[
                  styles.chartDot,
                  { left: point.x - 4, top: point.y - 4, backgroundColor: color }
                ]}
              />
            ))}
          </View>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>{minVal.toFixed(1)}</Text>
            <Text style={styles.chartLabel}>{maxVal.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.rangeSelector}>
        {dateRangeOptions.map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.rangeButton,
              selectedRange === range && styles.rangeButtonActive,
            ]}
            onPress={() => setSelectedRange(range)}
          >
            <Text style={[
              styles.rangeButtonText,
              selectedRange === range && styles.rangeButtonTextActive,
            ]}>
              {getDateRangeLabel(range)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚖️ 체중 트렌드</Text>
          <View style={styles.trendBadge}>
            <Text style={[styles.trendText, { color: getTrendColor(weightTrend) }]}>
              {getTrendIcon(weightTrend)} {Math.abs(weightTrendPercent)}%
            </Text>
          </View>
        </View>
        {renderSimpleChart(weightData, '#007AFF')}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>현재</Text>
            <Text style={styles.statValue}>
              {weightData.length > 0 ? `${weightData[weightData.length - 1].weight.toFixed(1)} kg` : '-'}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>평균</Text>
            <Text style={styles.statValue}>
              {weightData.length > 0 ? `${(weightData.reduce((sum, d) => sum + d.weight, 0) / weightData.length).toFixed(1)} kg` : '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏃 활동량 트렌드</Text>
          <View style={styles.trendBadge}>
            <Text style={[styles.trendText, { color: getTrendColor(activityTrend) }]}>
              {getTrendIcon(activityTrend)} {Math.abs(activityTrendPercent)}%
            </Text>
          </View>
        </View>
        {renderSimpleChart(activityData, '#34C759')}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>오늘</Text>
            <Text style={styles.statValue}>
              {activityData.length > 0 ? `${activityData[activityData.length - 1].activityMinutes}분` : '-'}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>평균</Text>
            <Text style={styles.statValue}>
              {activityData.length > 0 ? `${Math.round(activityData.reduce((sum, d) => sum + d.activityMinutes, 0) / activityData.length)}분` : '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 건강 인사이트</Text>
        <View style={styles.insightsList}>
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>ℹ️</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>데이터 수집 중</Text>
              <Text style={styles.insightMessage}>
                더 많은 건강 데이터를 수집하면 개인화된 인사이트를 제공할 수 있습니다.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  rangeButtonActive: {
    backgroundColor: '#007AFF',
  },
  rangeButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  rangeButtonTextActive: {
    color: '#ffffff',
  },
  errorBanner: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#856404',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  trendBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    marginBottom: 16,
  },
  chart: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
  },
  chartLine: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  chartDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartLabels: {
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: '#999999',
  },
  emptyChart: {
    height: CHART_HEIGHT,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    color: '#999999',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  insightsList: {
    marginTop: 8,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  insightEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
});