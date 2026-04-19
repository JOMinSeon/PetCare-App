import React, { useCallback } from 'react';
import { View, Text, StyleSheet, useFocusEffect } from 'react-native';
import { useHealthStore } from '../stores/healthStore';
import { getFactorColor, getScoreColor, getScoreLabel } from '../utils/healthCalculator';

interface HealthFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
  rawValue?: string;
}

interface HealthScoreCardProps {
  petId: string;
  petName: string;
  score?: number;
  factors?: HealthFactor[];
  lastUpdated?: string;
}

export function HealthScoreCard({
  petId,
  petName,
  score: propScore,
  factors: propFactors,
  lastUpdated: propLastUpdated,
}: HealthScoreCardProps): JSX.Element {
  const { healthScore, fetchHealthScore, isLoading } = useHealthStore();

  // Auto-refresh health score when screen comes into focus (HLTH-04)
  useFocusEffect(
    useCallback(() => {
      if (petId) {
        fetchHealthScore(petId);
      }
    }, [petId, fetchHealthScore])
  );

  const score = propScore ?? healthScore?.score ?? 0;
  const factors = propFactors ?? healthScore?.factors ?? [];
  const lastUpdated = propLastUpdated ?? healthScore?.lastUpdated;

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const gaugePercentage = Math.min(Math.max(score, 0), 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Score</Text>
        <Text style={styles.petName}>{petName}</Text>
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreNumber, { color: scoreColor }]}>{score}</Text>
          <Text style={styles.scoreLabel}>{scoreLabel}</Text>
        </View>

        {/* Gauge visualization */}
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeBackground}>
            <View
              style={[
                styles.gaugeFill,
                {
                  width: `${gaugePercentage}%`,
                  backgroundColor: scoreColor,
                },
              ]}
            />
          </View>
          <View style={styles.gaugeLabels}>
            <Text style={styles.gaugeLabel}>0</Text>
            <Text style={styles.gaugeLabelMid}>50</Text>
            <Text style={styles.gaugeLabel}>100</Text>
          </View>
        </View>
      </View>

      {/* Factor Breakdown Section (HLTH-03) */}
      {factors.length > 0 && (
        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>Score Breakdown</Text>
          
          {factors.map((factor) => (
            <View key={factor.name} style={styles.factorRow}>
              <View style={styles.factorHeader}>
                <View style={styles.factorNameContainer}>
                  <View
                    style={[
                      styles.factorDot,
                      { backgroundColor: getFactorColor(factor.name) },
                    ]}
                  />
                  <Text style={styles.factorName}>{factor.name}</Text>
                </View>
                <Text style={styles.factorContribution}>
                  +{factor.contribution} pts
                </Text>
              </View>
              
              {/* Factor progress bar */}
              <View style={styles.factorBarContainer}>
                <View
                  style={[
                    styles.factorBarFill,
                    {
                      width: `${factor.value}%`,
                      backgroundColor: getFactorColor(factor.name),
                    },
                  ]}
                />
              </View>
              
              {/* Factor details */}
              <View style={styles.factorDetails}>
                <Text style={styles.factorValue}>{factor.value}/100</Text>
                {factor.rawValue && (
                  <Text style={styles.factorRawValue}>{factor.rawValue}</Text>
                )}
                <Text style={styles.factorWeight}>
                  ({Math.round(factor.weight * 100)}% weight)
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {lastUpdated && (
        <Text style={styles.lastUpdated}>
          Last updated: {new Date(lastUpdated).toLocaleDateString()}
          {isLoading && ' (Refreshing...)'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 4,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#e2e8f0',
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
  },
  gaugeContainer: {
    width: '100%',
    marginTop: 24,
  },
  gaugeBackground: {
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 6,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  gaugeLabel: {
    fontSize: 12,
    color: '#999',
  },
  gaugeLabelMid: {
    fontSize: 12,
    color: '#999',
  },
  breakdownContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  factorRow: {
    marginBottom: 16,
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  factorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  factorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  factorContribution: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
  },
  factorBarContainer: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  factorBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  factorDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  factorValue: {
    fontSize: 12,
    color: '#666',
  },
  factorRawValue: {
    fontSize: 12,
    color: '#999',
    flex: 1,
    marginLeft: 8,
  },
  factorWeight: {
    fontSize: 12,
    color: '#999',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
});
