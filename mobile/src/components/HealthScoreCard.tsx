import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HealthScoreCardProps {
  score: number;
  petName: string;
  lastUpdated?: string;
}

export function HealthScoreCard({ score, petName, lastUpdated }: HealthScoreCardProps): JSX.Element {
  const getScoreColor = (value: number): string => {
    if (value >= 80) return '#22c55e'; // Green
    if (value >= 60) return '#f59e0b'; // Amber
    if (value >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreLabel = (value: number): string => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Fair';
    return 'Needs Attention';
  };

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

      {lastUpdated && (
        <Text style={styles.lastUpdated}>
          Last updated: {new Date(lastUpdated).toLocaleDateString()}
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
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
});