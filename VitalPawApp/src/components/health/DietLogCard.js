import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function DietLogCard({ log, onPress }) {
  const typeColors = {
    main: '#007AFF',
    snack: '#FF9500',
    supplement: '#34C759',
    medicine: '#FF3B30',
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.badge, { backgroundColor: typeColors[log.food_type] || '#8E8E93' }]}>
        <Text style={styles.badgeText}>{log.food_type}</Text>
      </View>
      <Text style={styles.foodName}>{log.food_name}</Text>
      {log.amount && (
        <Text style={styles.amount}>
          {log.amount} {log.unit}
        </Text>
      )}
      {log.calories && <Text style={styles.calories}>{log.calories} kcal</Text>}
      <Text style={styles.time}>{new Date(log.fed_at).toLocaleTimeString()}</Text>
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
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  amount: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  calories: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#C7C7CC',
    marginTop: 8,
  },
});