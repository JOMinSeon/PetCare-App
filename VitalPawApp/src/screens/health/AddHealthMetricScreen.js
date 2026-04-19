import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useHealthStore } from '../../store';
import { Button, Input, Card } from '../../components';

const METRIC_TYPES = ['weight', 'activity', 'temperature', 'heart_rate'];

export default function AddHealthMetricScreen({ navigation }) {
  const { addHealthMetric, isLoading } = useHealthStore();
  const [formData, setFormData] = useState({
    metric_type: 'weight',
    value: '',
    unit: 'kg',
    recorded_at: new Date().toISOString(),
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'metric_type') {
        const units = {
          weight: 'kg',
          activity: 'steps',
          temperature: '°C',
          heart_rate: 'bpm',
        };
        updated.unit = units[value] || '';
      }
      return updated;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.value.trim()) newErrors.value = 'Value is required';
    if (!formData.metric_type) newErrors.metric_type = 'Type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await addHealthMetric({
        ...formData,
        value: parseFloat(formData.value),
      });
      Alert.alert('Success', 'Health metric recorded!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to record metric.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card title="Record Health Metric">
        <Text style={styles.label}>Metric Type</Text>
        <View style={styles.optionGroup}>
          {METRIC_TYPES.map((type) => (
            <Button
              key={type}
              title={type.replace('_', ' ')}
              onPress={() => updateField('metric_type', type)}
              variant={formData.metric_type === type ? 'primary' : 'outline'}
              size="small"
              style={styles.optionButton}
            />
          ))}
        </View>

        <Input
          label={`Value (${formData.unit})`}
          value={formData.value}
          onChangeText={(value) => updateField('value', value)}
          placeholder={`Enter ${formData.metric_type}`}
          keyboardType="decimal-pad"
          error={errors.value}
        />

        <Input
          label="Notes (optional)"
          value={formData.notes}
          onChangeText={(value) => updateField('notes', value)}
          placeholder="Add any notes..."
          multiline
          numberOfLines={3}
        />
      </Card>

      <View style={styles.actions}>
        <Button
          title="Save Metric"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />
        <Button title="Cancel" onPress={() => navigation.goBack()} variant="secondary" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 16, paddingBottom: 32 },
  label: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 },
  optionGroup: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  optionButton: { marginRight: 8, marginBottom: 8 },
  actions: { marginTop: 24 },
  submitButton: { marginBottom: 12 },
});