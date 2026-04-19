import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { usePetStore, Pet } from '../../stores/petStore';

const SPECIES_OPTIONS = [
  { value: 'dog', label: '🐕 Dog' },
  { value: 'cat', label: '🐈 Cat' },
  { value: 'bird', label: '🐦 Bird' },
  { value: 'rabbit', label: '🐰 Rabbit' },
  { value: 'fish', label: '🐟 Fish' },
  { value: 'other', label: '🐾 Other' },
] as const;

interface EditPetScreenProps {
  navigation: any;
  route: any;
}

export function EditPetScreen({ navigation, route }: EditPetScreenProps) {
  const { petId } = route.params;
  const { getPet, updatePet, deletePet, isLoading } = usePetStore();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<string>('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [originalPet, setOriginalPet] = useState<Pet | null>(null);

  useEffect(() => {
    loadPet();
  }, [petId]);

  const loadPet = async () => {
    try {
      const pet = await getPet(petId);
      if (pet) {
        setOriginalPet(pet);
        setName(pet.name);
        setSpecies(pet.species);
        setBreed(pet.breed || '');
        setBirthDate(pet.birthDate ? pet.birthDate.split('T')[0] : '');
        setWeight(pet.weight?.toString() || '');
        setPhotoUri(pet.photoUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load pet details');
      navigation.goBack();
    }
  };

  const handleSelectPhoto = async () => {
    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to select image');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri || null);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open image picker');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your pet\'s name');
      return;
    }

    if (!species) {
      Alert.alert('Validation Error', 'Please select a species');
      return;
    }

    try {
      const updateData: {
        name: string;
        species: string;
        breed?: string;
        birthDate?: string;
        weight?: number;
        photoUrl?: string;
      } = {
        name: name.trim(),
        species,
      };

      if (breed.trim()) updateData.breed = breed.trim();
      if (birthDate) updateData.birthDate = birthDate;
      if (weight) updateData.weight = parseFloat(weight);
      if (photoUri !== originalPet?.photoUrl) updateData.photoUrl = photoUri || undefined;

      await updatePet(petId, updateData);
      Alert.alert('Success', `${name} has been updated!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update pet';
      Alert.alert('Error', message);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePet(petId);
              navigation.navigate('PetList');
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to delete pet';
              Alert.alert('Error', message);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Edit Pet</Text>

      <TouchableOpacity style={styles.photoButton} onPress={handleSelectPhoto}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photoPreview} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>📷</Text>
            <Text style={styles.photoPlaceholderLabel}>Change Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter pet name"
            placeholderTextColor="#9E9E9E"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Species *</Text>
          <View style={styles.speciesGrid}>
            {SPECIES_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.speciesButton,
                  species === option.value && styles.speciesButtonSelected,
                ]}
                onPress={() => setSpecies(option.value)}
              >
                <Text
                  style={[
                    styles.speciesButtonText,
                    species === option.value && styles.speciesButtonTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Breed</Text>
          <TextInput
            style={styles.input}
            value={breed}
            onChangeText={setBreed}
            placeholder="Enter breed (optional)"
            placeholderTextColor="#9E9E9E"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Birth Date</Text>
          <TextInput
            style={styles.input}
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="YYYY-MM-DD (optional)"
            placeholderTextColor="#9E9E9E"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Enter weight (optional)"
            placeholderTextColor="#9E9E9E"
            keyboardType="decimal-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Pet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00897B',
    marginBottom: 24,
  },
  photoButton: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00897B',
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    fontSize: 32,
    marginBottom: 4,
  },
  photoPlaceholderLabel: {
    fontSize: 12,
    color: '#00897B',
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  speciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  speciesButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  speciesButtonSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#00897B',
  },
  speciesButtonText: {
    fontSize: 14,
    color: '#757575',
  },
  speciesButtonTextSelected: {
    color: '#00897B',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#00897B',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#C62828',
    fontSize: 16,
    fontWeight: '600',
  },
});