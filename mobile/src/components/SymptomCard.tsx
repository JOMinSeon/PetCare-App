import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Symptom } from '../types';

interface SymptomCardProps {
  symptom: Symptom;
  onPress: () => void;
}

export const SymptomCard: React.FC<SymptomCardProps> = ({ symptom, onPress }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return '#4CAF50';
      case 'moderate': return '#FFC107';
      case 'severe': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.description} numberOfLines={2}>{symptom.description}</Text>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(symptom.severity) }]}>
            <Text style={styles.severityText}>{symptom.severity.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.date}>{new Date(symptom.date).toLocaleDateString()}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  description: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginRight: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  severityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});