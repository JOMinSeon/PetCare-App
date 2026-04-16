import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { usePet } from '../../src/contexts/PetContext';
import { PetSpecies, getSpeciesLabel } from '../../src/types/pet.types';
import * as ImagePicker from 'expo-image-picker';

const speciesOptions = [
  { value: PetSpecies.DOG, label: '🐕 개' },
  { value: PetSpecies.CAT, label: '🐱 고양이' },
  { value: PetSpecies.BIRD, label: '🐦 새' },
  { value: PetSpecies.FISH, label: '🐟 물고기' },
  { value: PetSpecies.REPTILE, label: '🦎 파충류' },
  { value: PetSpecies.OTHER, label: '🐾 기타' },
];

export default function AddPetScreen() {
  const router = useRouter();
  const { addPet, isLoading } = usePet();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies | null>(null);
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{name?: string; species?: string}>({});
  const [showSpeciesPicker, setShowSpeciesPicker] = useState(false);

  const validate = (): boolean => {
    const newErrors: {name?: string; species?: string} = {};
    
    if (!name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    
    if (!species) {
      newErrors.species = '종을 선택해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '사진을 선택하려면相册 권한이 필요합니다');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const newPet = await addPet({
        name: name.trim(),
        species: species!,
        breed: breed.trim() || undefined,
        birthDate: birthDate || undefined,
        photoUrl: photoUrl || undefined,
      });

      Alert.alert('성공', '반려동물 정보가 등록되었습니다', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert(
        '오류',
        err instanceof Error ? err.message : '반려동물 등록에 실패했습니다'
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.photoSection}>
        <TouchableOpacity style={styles.photoButton} onPress={handleSelectPhoto}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>📷</Text>
              <Text style={styles.photoPlaceholderLabel}>사진 선택</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>이름 *</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="반려동물 이름"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>종 *</Text>
        <TouchableOpacity
          style={[styles.picker, errors.species && styles.inputError]}
          onPress={() => setShowSpeciesPicker(!showSpeciesPicker)}
        >
          <Text style={species ? styles.pickerText : styles.pickerPlaceholder}>
            {species ? getSpeciesLabel(species) : '종을 선택하세요'}
          </Text>
        </TouchableOpacity>
        {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}

        {showSpeciesPicker && (
          <View style={styles.speciesList}>
            {speciesOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.speciesItem,
                  species === option.value && styles.speciesItemSelected,
                ]}
                onPress={() => {
                  setSpecies(option.value);
                  setShowSpeciesPicker(false);
                  if (errors.species) setErrors((prev) => ({ ...prev, species: undefined }));
                }}
              >
                <Text style={styles.speciesItemText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>품종</Text>
        <TextInput
          style={styles.input}
          placeholder="품종 (선택)"
          value={breed}
          onChangeText={setBreed}
        />

        <Text style={styles.label}>생년월일</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD (선택)"
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>등록</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 24,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 75,
  },
  photoPlaceholderText: {
    fontSize: 32,
    marginBottom: 8,
  },
  photoPlaceholderLabel: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  speciesList: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  speciesItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  speciesItemSelected: {
    backgroundColor: '#e6f4fe',
  },
  speciesItemText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#99ccff',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});