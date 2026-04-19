import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useDietStore } from '../../stores/dietStore';

type ParamList = {
  DietLog: { petId: string };
};

export const DietLogScreen: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'DietLog'>>();
  const { petId } = route.params;
  const { diets, createDiet, fetchDietStats, dietStats, isLoading } = useDietStore();

  const [foodName, setFoodName] = useState('');
  const [amountGrams, setAmountGrams] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDietStats(petId);
  }, [petId]);

  const handleSubmit = async () => {
    if (!foodName || !amountGrams || !calories) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await createDiet(petId, {
        foodName,
        amountGrams: parseInt(amountGrams),
        calories: parseInt(calories),
        date: new Date(date).toISOString(),
      });
      setFoodName('');
      setAmountGrams('');
      setCalories('');
      Alert.alert('Success', 'Meal logged successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to log meal');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {dietStats && (
        <View style={styles.calorieCard}>
          <Text style={styles.calorieLabel}>Today's Calories</Text>
          <Text style={styles.calorieValue}>{dietStats.caloriesConsumed}</Text>
          <Text style={styles.calorieTarget}>/ {dietStats.calorieTarget} kcal</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min((dietStats.caloriesConsumed / dietStats.calorieTarget) * 100, 100)}%` }
              ]}
            />
          </View>
          {dietStats.macros && (
            <View style={styles.macrosRow}>
              <Text style={styles.macroText}>P: {dietStats.macros.protein}g</Text>
              <Text style={styles.macroText}>F: {dietStats.macros.fat}g</Text>
              <Text style={styles.macroText}>C: {dietStats.macros.carbs}g</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.form}>
        <Text style={styles.label}>Food Name</Text>
        <TextInput
          style={styles.input}
          value={foodName}
          onChangeText={setFoodName}
          placeholder="Enter food name"
        />

        <Text style={styles.label}>Amount (grams)</Text>
        <TextInput
          style={styles.input}
          value={amountGrams}
          onChangeText={setAmountGrams}
          placeholder="Enter amount in grams"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Calories</Text>
        <TextInput
          style={styles.input}
          value={calories}
          onChangeText={setCalories}
          placeholder="Enter calories"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          <Text style={styles.submitButtonText}>Log Meal</Text>
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
  calorieCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calorieLabel: {
    fontSize: 14,
    color: '#666',
  },
  calorieValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#00897B',
  },
  calorieTarget: {
    fontSize: 16,
    color: '#999',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00897B',
    borderRadius: 4,
  },
  macrosRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  macroText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 12,
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#00897B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});