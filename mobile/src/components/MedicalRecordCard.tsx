import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MedicalRecord } from '../services/medicalRecord.service';

interface MedicalRecordCardProps {
  record: MedicalRecord;
  onPress?: () => void;
}

export const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({ record, onPress }) => {
  const isVaccination = record.type === 'vaccination';
  const isDue = record.nextDueDate && new Date(record.nextDueDate) <= new Date();

  return (
    <TouchableOpacity style={[styles.card, isDue && styles.dueCard]} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{isVaccination ? '💉' : '🏥'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{record.name}</Text>
        <Text style={styles.date}>{new Date(record.date).toLocaleDateString()}</Text>
        {record.hospital && <Text style={styles.hospital}>{record.hospital}</Text>}
        {record.nextDueDate && (
          <View style={styles.dueContainer}>
            <Text style={[styles.dueText, isDue && styles.dueOverdue]}>
              {isDue ? '⚠️ Due: ' : 'Next: '}
              {new Date(record.nextDueDate).toLocaleDateString()}
            </Text>
          </View>
        )}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  hospital: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  dueContainer: {
    marginTop: 6,
  },
  dueText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  dueOverdue: {
    color: '#DC2626',
  },
});