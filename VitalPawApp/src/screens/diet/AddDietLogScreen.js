import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useHealthStore } from '../../store';
import { Button, Input, Card } from '../../components';

const FOOD_TYPES = ['main', 'snack', 'supplement', 'medicine'];

export default function AddDietLogScreen({ navigation }) {
  const { addDietLog, isLoading } = useHealthStore();
  const [formData, setFormData] = useState({
    food_name: '',
    food_type: 'main',
    amount: '',
    unit: 'g',
    calories: '',
    fed_at: new Date().toISOString(),
    notes: '',
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.food_name.trim()) {
      Alert.alert('Error', 'Food name is required');
      return;
    }
    try {
      await addDietLog({
        ...formData,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        calories: formData.calories ? parseInt(formData.calories) : null,
      });
      Alert.alert('Success', 'Diet log added!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add diet log.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card title="Log Diet">
        <Input
          label="Food Name *"
          value={formData.food_name}
          onChangeText={(value) => updateField('food_name', value)}
          placeholder="e.g., Dry kibble, Treats"
        />

        <Text style={styles.label}>Food Type</Text>
        <View style={styles.optionGroup}>
          {FOOD_TYPES.map((type) => (
            <Button
              key={type}
              title={type}
              onPress={() => updateField('food_type', type)}
              variant={formData.food_type === type ? 'primary' : 'outline'}
              size="small"
              style={styles.optionButton}
            />
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input
              label="Amount"
              value={formData.amount}
              onChangeText={(value) => updateField('amount', value)}
              placeholder="Amount"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label="Unit"
              value={formData.unit}
              onChangeText={(value) => updateField('unit', value)}
              placeholder="g, ml, 개"
            />
          </View>
        </View>

        <Input
          label="Calories (optional)"
          value={formData.calories}
          onChangeText={(value) => updateField('calories', value)}
          placeholder="kcal"
          keyboardType="number-pad"
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