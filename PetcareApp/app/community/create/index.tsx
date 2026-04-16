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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { usePost } from '../../src/contexts/PostContext';
import { usePet } from '../../src/contexts/PetContext';
import * as ImagePicker from 'expo-image-picker';

export default function CreatePostScreen() {
  const router = useRouter();
  const { createPost, isLoading } = usePost();
  const { pets } = usePet();
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [showPetPicker, setShowPetPicker] = useState(false);

  const handleSelectPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '사진을 선택하려면相册 권한이 필요합니다');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!imageUrl) {
      Alert.alert('오류', '사진을 선택해주세요');
      return;
    }
    
    if (!caption.trim()) {
      Alert.alert('오류', ' caption을 입력해주세요');
      return;
    }
    
    if (caption.length > 500) {
      Alert.alert('오류', ' caption은 500자 이내로 입력해주세요');
      return;
    }

    try {
      await createPost({
        imageUrl,
        caption: caption.trim(),
        petId: selectedPetId || undefined,
      });
      
      Alert.alert('성공', '게시물이 작성되었습니다', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('오류', err instanceof Error ? err.message : '게시물 작성에 실패했습니다');
    }
  };

  const selectedPet = pets.find(p => p.id === selectedPetId);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imageSection} onPress={handleSelectPhoto}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderEmoji}>📷</Text>
              <Text style={styles.imagePlaceholderText}>사진 선택</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}> caption (500자 이내)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="반려동물의 순간을 공유해주세요..."
          value={caption}
          onChangeText={setCaption}
          multiline
          maxLength={500}
        />
        <Text style={styles.charCount}>{caption.length}/500</Text>

        <Text style={styles.label}>반려동물 연결 (선택)</Text>
        <TouchableOpacity
          style={styles.petSelector}
          onPress={() => setShowPetPicker(!showPetPicker)}
        >
          <Text style={selectedPet ? styles.petSelectorText : styles.petSelectorPlaceholder}>
            {selectedPet ? `🐾 ${selectedPet.name}` : '반려동물 선택 (선택)'}
          </Text>
        </TouchableOpacity>

        {showPetPicker && (
          <View style={styles.petList}>
            <TouchableOpacity
              style={styles.petOption}
              onPress={() => {
                setSelectedPetId(null);
                setShowPetPicker(false);
              }}
            >
              <Text style={styles.petOptionText}>선택 안함</Text>
            </TouchableOpacity>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={[styles.petOption, selectedPetId === pet.id && styles.petOptionSelected]}
                onPress={() => {
                  setSelectedPetId(pet.id);
                  setShowPetPicker(false);
                }}
              >
                <Text style={[
                  styles.petOptionText,
                  selectedPetId === pet.id && styles.petOptionTextSelected,
                ]}>
                  {pet.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>게시</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  imageSection: {
    width: '100%',
    aspectRatio: 4 / 3,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  imagePlaceholderEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#666',
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
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: -8,
    marginBottom: 16,
  },
  petSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  petSelectorText: {
    fontSize: 16,
    color: '#333',
  },
  petSelectorPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  petList: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  petOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  petOptionSelected: {
    backgroundColor: '#e6f4fe',
  },
  petOptionText: {
    fontSize: 16,
    color: '#333',
  },
  petOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
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