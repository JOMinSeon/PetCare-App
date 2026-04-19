import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RiskAlertProps {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
  onDismiss?: () => void;
}

export const RiskAlert: React.FC<RiskAlertProps> = ({
  riskScore,
  riskLevel,
  recommendation,
  onDismiss,
}) => {
  const getBackgroundColor = () => {
    switch (riskLevel) {
      case 'high': return '#F44336';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>Risk Assessment</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{riskScore}%</Text>
        </View>
      </View>
      <Text style={styles.recommendation}>{recommendation}</Text>
      <Text style={styles.disclaimer}>
        This is probability-based assessment, not a diagnosis. Please consult a veterinarian.
      </Text>
      {onDismiss && (
        <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
          <Text style={styles.dismissText}>Dismiss</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  scoreBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  recommendation: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  disclaimer: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
  dismissButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  dismissText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});