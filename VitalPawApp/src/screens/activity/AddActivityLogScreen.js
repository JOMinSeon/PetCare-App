import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useHealthStore } from '../../store';
import { Button, Input, Card } from '../../components';

const ACTIVITY_TYPES = ['walk', 'play', 'training', 'grooming', 'other'];
const INTENSITY_LEVELS = ['low', 'medium', 'high'];

export default function AddActivityLogScreen({ navigation }) {
  const { addActivityLog, isLoading } = useHealthStore();
  const [formData, setFormData] = useState({
    activity_type: 'walk',
    title: '',
    duration: '',
    intensity: 'medium',
    calories_burned: '',
    location: '',
    occurred_at: new Date().toISOString(),
    notes: '',
  });

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    try {
      await addActivityLog({
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null,
        calories_burned: formData.calories_burned ? parseInt(formData.calories_burned) : null,
      });
      Alert.alert('Success', 'Activity logged!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to log activity.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card title="Log Activity">
        <Text style={styles.label}>Activity Type</Text>
        <View style={styles.optionGroup}>
          {ACTIVITY_TYPES.map((type) => (
            <Button
              key={type}
              title={type}
              onPress={() => updateField('activity_type', type)}
              variant={formData.activity_type === type ? 'primary' : 'outline'}
              size="small"
              style={styles.optionButton}
            />
          ))}
        </View>

        <Input
          label="Title *"
          value={formData.title}
          onChangeText={(value) => updateField('title', value)}
          placeholder="e.g., Morning walk in the park"
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input
              label="Duration (min)"
              value={formData.duration}
              onChangeText={(value) => updateField('duration', value)}
              placeholder="Minutes"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label="Calories Burned"
              value={formData.calories_burned}
              onChangeText={(value) => updateField('calories_burned', value)}
              placeholder="kcal"
              keyboardType="number-pad"
            />
          </View>
        </View>

        <Text style={styles.label}>Intensity</Text>
        <View style={styles.optionGroup}>
          {INTENSITY_LEVELS.map((level) => (
            <Button
              key={level}
              title={level}
              onPress={() => updateField('intensity', level)}
              variant={formData.intensity === level ? 'primary' : 'outline'}
              size="small"
              style={styles.optionButton}
            />
          ))}
        </View>

        <Input
          label="Location (optional)"
          value={formData.location}
          onChangeText={(value) => updateField('location', value)}
          placeholder="Where did the activity happen?"
        />

        <Input
          label="Notes (optional)"
          value={formData.notes}
          onChangeText={(value) => updateField('notes', value)}
          placeholder="Add notes..."
          multiline
        />
      </Card>

      <View style={styles.actions}>
        <Button title="Save" onPress={handleSubmit} loading={isLoading} style={styles.submitButton} />
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
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  actions: { marginTop: 24 },
  submitButton: { marginBottom: 12 },
});