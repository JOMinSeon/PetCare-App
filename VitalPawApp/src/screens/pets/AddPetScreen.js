import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { usePetStore } from '../../store';
import { Button, Input, Card } from '../../components';

const SPECIES_OPTIONS = ['dog', 'cat', 'other'];
const GENDER_OPTIONS = ['male', 'female'];

export default function AddPetScreen({ navigation }) {
  const { addPet, isLoading } = usePetStore();
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    birth_date: '',
    gender: '',
    weight: '',
  });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.species) {
      newErrors.species = 'Species is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const petData = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };
      await addPet(petData);
      Alert.alert('Success', 'Pet added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add pet. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card title="Pet Information">
        <Input
          label="Name *"
          value={formData.name}
          onChangeText={(value) => updateField('name', value)}
          placeholder="Enter pet's name"
          error={errors.name}
        />

        <Text style={styles.label}>Species *</Text>
        <View style={styles.optionGroup}>
          {SPECIES_OPTIONS.map((option) => (
            <Button
              key={option}
              title={option.charAt(0).toUpperCase() + option.slice(1)}
              onPress={() => updateField('species', option)}
              variant={formData.species === option ? 'primary' : 'outline'}
              size="small"
              style={styles.optionButton}
            />
          ))}
        </View>

        <Input
          label="Breed"
          value={formData.breed}
          onChangeText={(value) => updateField('breed', value)}
          placeholder="Enter breed"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.optionGroup}>
          {GENDER_OPTIONS.map((option) => (
            <Button
              key={option}
              title={option.charAt(0).toUpperCase() + option.slice(1)}
              onPress={() => updateField('gender', option)}
              variant={formData.gender === option ? 'primary' : 'outline'}
              size="small"
              style={styles.optionButton}
            />
          ))}
        </View>

        <Input
          label="Birth Date"
          value={formData.birth_date}
          onChangeText={(value) => updateField('birth_date', value)}
          placeholder="YYYY-MM-DD"
        />

        <Input
          label="Weight (kg)"
          value={formData.weight}
          onChangeText={(value) => updateField('weight', value)}
          placeholder="Enter weight"
          keyboardType="decimal-pad"
        />
      </Card>

      <View style={styles.actions}>
        <Button
          title="Add Pet"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  optionGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  optionButton: {
    marginRight: 8,
  },
  actions: {
    marginTop: 24,
  },
  submitButton: {
    marginBottom: 12,
  },
});