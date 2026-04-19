import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { reminderService } from '../../services';
import { Button, Input, Card } from '../../components';

const REMINDER_TYPES = ['medication', 'vaccination', 'checkup', 'diet', 'exercise', 'custom'];
const REPEAT_TYPES = ['once', 'daily', 'weekly', 'monthly', 'yearly'];

export default function AddReminderScreen({ navigation }) {
  const [formData, setFormData] = useState({
    reminder_type: 'medication',
    title: '',
    message: '',
    scheduled_at: new Date().toISOString(),
    repeat_type: 'once',
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    setIsLoading(true);
    try {
      await reminderService.create(formData);
      Alert.alert('Success', 'Reminder created!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create reminder.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card title="Create Reminder">
        <Text style={styles.label}>Reminder Type</Text>
        <View style={styles.optionGroup}>
          {REMINDER_TYPES.map((type) => (
            <Button
              key={type}
              title={type}
              onPress={() => updateField('reminder_type', type)}
              variant={formData.reminder_type === type ? 'primary' : 'outline'}
              size="small"
              style={styles.optionButton}
            />
          ))}
        </View>

        <Input
          label="Title *"
          value={formData.title}
          onChangeText={(value) => updateField('title', value)}
          placeholder="e.g., Give heart medication"
        />

        <Input
          label="Message (optional)"
          value={formData.message}
          onChangeText={(value) => updateField('message', value)}
          placeholder="Additional details..."
          multiline
        />

        <Text style={styles.label}>Repeat</Text>
        <View style={styles.optionGroup}>
          {REPEAT_TYPES.map((type) => (
            <Button
              key={type}
              title={type}
              onPress={() => updateField('repeat_type', type)}
              variant={formData.repeat_type === type ? 'primary' : 'outline'}
              size="small"
              style={styles.optionButton}
            />
          ))}
        </View>
      </Card>

      <View style={styles.actions}>
        <Button title="Create" onPress={handleSubmit} loading={isLoading} style={styles.submitButton} />
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