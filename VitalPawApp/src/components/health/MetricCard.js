import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function MetricCard({ metric, onPress }) {
  const typeIcons = {
    weight: '⚖️',
    activity: '🏃',
    temperature: '🌡️',
    heart_rate: '❤️',
  };

  const formatValue = (value, unit) => {
    if (unit === '°C') return `${value}°C`;
    if (unit === 'bpm') return `${value} bpm`;
    return `${value} ${unit}`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.icon}>{typeIcons[metric.metric_type] || '📊'}</Text>
        <Text style={styles.type}>{metric.metric_type.replace('_', ' ')}</Text>
      </View>
      <Text style={styles.value}>{formatValue(metric.value, metric.unit)}</Text>
      <Text style={styles.date}>
        {new Date(metric.recorded_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  type: {
    fontSize: 14,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  date: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
});