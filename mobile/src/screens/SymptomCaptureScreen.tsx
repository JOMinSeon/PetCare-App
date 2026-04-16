import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Pet, AnalysisResult } from '../types';
import { analyzeSymptom } from '../services/api';
import { theme } from '../theme';

interface Props {
  pets: Pet[];
  accessToken: string;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onBack: () => void;
}

export default function SymptomCaptureScreen({
  pets,
  accessToken,
  onAnalysisComplete,
  onBack,
}: Props) {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = useCallback(async () => {
    const ImagePickerModule = await import('expo-image-picker');
    const result = await ImagePickerModule.launchImageLibraryAsync({
      mediaTypes: ImagePickerModule.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const ImagePickerModule = await import('expo-image-picker');
    const { status } = await ImagePickerModule.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePickerModule.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedPet || !photoUri) {
      Alert.alert('입력 필요', '반려동물과 사진을 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeSymptom(selectedPet.id, photoUri, accessToken);
      onAnalysisComplete(result);
    } catch {
      Alert.alert('분석 실패', 'AI 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [selectedPet, photoUri, accessToken, onAnalysisComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>증상 분석</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>반려동물 선택</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petList}>
          {pets.map((pet) => {
            const isSelected = selectedPet?.id === pet.id;
            return (
              <TouchableOpacity
                key={pet.id}
                style={[styles.petItem, isSelected && styles.petItemSelected]}
                onPress={() => setSelectedPet(pet)}
              >
                <View style={[styles.petAvatar, isSelected && styles.petAvatarSelected]}>
                  <Text style={styles.petEmoji}>{pet.species === 'DOG' ? '🐕' : '🐱'}</Text>
                </View>
                <Text style={[styles.petName, isSelected && styles.petNameSelected]}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.breed}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionLabel}>증상 사진</Text>
        <View style={styles.photoSection}>
          {photoUri ? (
            <TouchableOpacity onPress={pickImage} activeOpacity={0.9}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            </TouchableOpacity>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                <Text style={styles.photoButtonIcon}>📷</Text>
                <Text style={styles.photoButtonLabel}>카메라</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                <Text style={styles.photoButtonIcon}>🖼️</Text>
                <Text style={styles.photoButtonLabel}>갤러리</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]}
          onPress={handleAnalyze}
          disabled={loading}
        >
          <Text style={styles.analyzeButtonText}>{loading ? '분석 중...' : '분석하기'}</Text>
        </TouchableOpacity>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            본 분석은 참고용으로, 전문 수의사 진단을 대체할 수 없습니다.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: { padding: theme.spacing.xs },
  backText: { fontSize: 20, color: theme.colors.primary },
  title: { fontSize: 16, fontWeight: '600', color: theme.colors.onBackground },
  headerSpacer: { width: 40 },
  content: { flex: 1, padding: theme.spacing.lg },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.onSurface, marginBottom: theme.spacing.md, marginTop: theme.spacing.md },
  petList: { flexDirection: 'row', marginBottom: theme.spacing.xl },
  petItem: { alignItems: 'center', marginRight: theme.spacing.lg, padding: theme.spacing.md },
  petItemSelected: {},
  petAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  petAvatarSelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  petEmoji: { fontSize: 26 },
  petName: { fontSize: 13, fontWeight: '500', color: theme.colors.onSurface },
  petNameSelected: { color: theme.colors.primary, fontWeight: '600' },
  petBreed: { fontSize: 11, color: theme.colors.onSurfaceLight, marginTop: 2 },
  photoSection: { marginBottom: theme.spacing.xl },
  photoPreview: { width: '100%', height: 240, borderRadius: theme.borderRadius.xl, backgroundColor: theme.colors.surface },
  photoButtons: { flexDirection: 'row', gap: theme.spacing.md },
  photoButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  photoButtonIcon: { fontSize: 28, marginBottom: theme.spacing.sm },
  photoButtonLabel: { fontSize: 13, color: theme.colors.onSurface },
  analyzeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  analyzeButtonDisabled: { backgroundColor: theme.colors.border },
  analyzeButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  disclaimer: { marginTop: theme.spacing.lg, padding: theme.spacing.md, alignItems: 'center' },
  disclaimerText: { color: theme.colors.onSurfaceLight, fontSize: 12, lineHeight: 18, textAlign: 'center' },
});