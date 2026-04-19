import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useMedicalRecordStore } from '../../stores/medicalRecordStore';
import { MedicalRecordType } from '../../services/medicalRecord.service';

type ParamList = {
  AddMedicalRecord: { petId: string };
};

export const AddMedicalRecordScreen: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'AddMedicalRecord'>>();
  const { petId } = route.params;
  const { createRecord, isLoading } = useMedicalRecordStore();

  const [type, setType] = useState<MedicalRecordType>('vaccination');
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextDueDate, setNextDueDate] = useState('');
  const [hospital, setHospital] = useState('');
  const [summary, setSummary] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for this record');
      return;
    }

    try {
      await createRecord(petId, {
        type,
        name: name.trim(),
        date: new Date(date).toISOString(),
        ...(nextDueDate && { nextDueDate: new Date(nextDueDate).toISOString() }),
        ...(hospital && { hospital: hospital.trim() }),
        ...(summary && { summary: summary.trim() }),
      });
      Alert.alert('Success', 'Medical record added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add medical record');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'vaccination' && styles.typeButtonSelected]}
            onPress={() => setType('vaccination')}
          >
            <Text style={styles.typeIcon}>💉</Text>
            <Text style={[styles.typeText, type === 'vaccination' && styles.typeTextSelected]}>Vaccination</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'checkup' && styles.typeButtonSelected]}
            onPress={() => setType('checkup')}
          >
            <Text style={styles.typeIcon}>🏥</Text>
            <Text style={[styles.typeText, type === 'checkup' && styles.typeTextSelected]}>Checkup</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={type === 'vaccination' ? 'e.g., Rabies Vaccine' : 'e.g., Annual Checkup'}
        />

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />

        {type === 'vaccination' && (
          <>
            <Text style={styles.label}>Next Due Date</Text>
            <TextInput
              style={styles.input}
              value={nextDueDate}
              onChangeText={setNextDueDate}
              placeholder="YYYY-MM-DD"
            />
          </>
        )}

        <Text style={styles.label}>Hospital</Text>
        <TextInput
          style={styles.input}
          value={hospital}
          onChangeText={setHospital}
          placeholder="Hospital or clinic name"
        />

        <Text style={styles.label}>Summary</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={summary}
          onChangeText={setSummary}
          placeholder="Notes or summary"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          <Text style={styles.submitButtonText}>Add Record</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  typeButtonSelected: {
    borderColor: '#00897B',
    backgroundColor: '#E0F2F1',
  },
  typeIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 14,
    color: '#666',
  },
  typeTextSelected: {
    color: '#00897B',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#00897B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});