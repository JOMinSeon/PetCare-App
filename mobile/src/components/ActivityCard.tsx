import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Activity } from '../services/activity.service';

interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>🏃</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.duration}>{activity.durationMinutes} min</Text>
        {activity.steps && <Text style={styles.steps}>{activity.steps} steps</Text>}
        <Text style={styles.date}>{new Date(activity.date).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  duration: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  steps: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});