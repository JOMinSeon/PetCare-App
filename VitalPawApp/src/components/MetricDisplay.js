import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export function MetricDisplay({ value, unit, label, trend }) {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.unit}>{unit}</Text>
      <Text style={styles.label}>{label}</Text>
      {trend && <Text style={[styles.trend, { color: trend > 0 ? COLORS.success : COLORS.error }]}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 16 },
  value: { fontSize: 32, fontWeight: '700', color: COLORS.primary },
  unit: { fontSize: 14, color: COLORS.textSecondary },
  label: { fontSize: 12, color: COLORS.textLight, marginTop: 4 },
  trend: { fontSize: 12, marginTop: 4 },
});
