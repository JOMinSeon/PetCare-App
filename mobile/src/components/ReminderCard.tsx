import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Reminder {
  id: string;
  type: 'vaccination' | 'checkup' | 'medication';
  title: string;
  dueDate: string;
  isOverdue: boolean;
}

interface ReminderCardProps {
  reminder: Reminder;
  onPress?: () => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onPress }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'vaccination': return '💉';
      case 'checkup': return '🏥';
      case 'medication': return '💊';
      default: return '📋';
    }
  };

  return (
    <TouchableOpacity style={[styles.card, reminder.isOverdue && styles.overdueCard]} onPress={onPress}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>{getIcon(reminder.type)}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, reminder.isOverdue && styles.overdueTitle]}>{reminder.title}</Text>
        <Text style={[styles.date, reminder.isOverdue && styles.overdueDate]}>
          {reminder.isOverdue ? 'Overdue: ' : 'Due: '}
          {new Date(reminder.dueDate).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  overdueCard: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  overdueTitle: {
    color: '#D32F2F',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  overdueDate: {
    color: '#F44336',
  },
});