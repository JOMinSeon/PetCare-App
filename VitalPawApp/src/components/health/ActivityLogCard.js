import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function ActivityLogCard({ log, onPress }) {
  const typeIcons = {
    walk: '🚶',
    play: '🎾',
    training: '🎯',
    grooming: '✂️',
    other: '🏃',
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.icon}>{typeIcons[log.activity_type] || '🏃'}</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{log.title}</Text>
          <Text style={styles.type}>{log.activity_type}</Text>
        </View>
      </View>
      {log.duration && <Text style={styles.duration}>{log.duration} min</Text>}
      {log.calories_burned && (
        <Text style={styles.calories}>{log.calories_burned} kcal burned</Text>
      )}
      <Text style={styles.time}>{new Date(log.occurred_at).toLocaleDateString()}</Text>
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
    fontSize: 28,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  type: {
    fontSize: 12,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  duration: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  calories: {
    fontSize: 12,
    color: '#34C759',
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: '#C7C7CC',
    marginTop: 8,
  },
});