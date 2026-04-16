import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { usePet } from '../../src/contexts/PetContext';
import { Pet, getSpeciesLabel, getSpeciesEmoji } from '../../src/types/pet.types';

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { selectedPet, isLoading, error, selectPet, removePet, fetchPets } = usePet();
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    if (id) {
      selectPet(id);
    }
  }, [id, selectPet]);

  useEffect(() => {
    if (selectedPet && selectedPet.id === id) {
      setPet(selectedPet);
    }
  }, [selectedPet, id]);

  const handleDelete = () => {
    if (!pet) return;
    
    Alert.alert(
      '반려동물 삭제',
      `${pet.name}을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await removePet(pet.id);
              await fetchPets();
              router.back();
            } catch (err) {
              Alert.alert('오류', '반려동물 삭제에 실패했습니다');
            }
          },
        },
      ]
    );
  };

  if (isLoading && !pet) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error && !pet) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>반려동물 정보를 찾을 수 없습니다</Text>
      </View>
    );
  }

  const calculateAge = (birthDate?: string): string => {
    if (!birthDate) return '알 수 없음';
    
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years < 0) return '알 수 없음';
    if (years === 0) {
      if (months < 0) return '알 수 없음';
      return `${months}개월`;
    }
    if (months < 0) return `${years - 1}년`;
    return `${years}년`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>반려동물 상세</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.photoSection}>
        {pet.photoUrl ? (
          <Image source={{ uri: pet.photoUrl }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.emoji}>{getSpeciesEmoji(pet.species)}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.nameSection}>
          <Text style={styles.name}>{pet.name}</Text>
          <View style={styles.speciesBadge}>
            <Text style={styles.speciesBadgeText}>
              {getSpeciesEmoji(pet.species)} {getSpeciesLabel(pet.species)}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>품종</Text>
            <Text style={styles.infoValue}>{pet.breed || '미등록'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>생년월일</Text>
            <Text style={styles.infoValue}>{pet.birthDate || '미등록'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>나이</Text>
            <Text style={styles.infoValue}>{calculateAge(pet.birthDate)}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Link href={`/health/${pet.id}`} asChild>
            <TouchableOpacity style={styles.healthButton}>
              <Text style={styles.healthButtonText}>📋 건강 기록</Text>
            </TouchableOpacity>
          </Link>

          <Link href={`/pet/edit/${pet.id}`} asChild>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>✏️ 수정</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>🗑️ 삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  headerSpacer: {
    width: 60,
  },
  photoSection: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 32,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  photoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e6f4fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
  },
  content: {
    padding: 16,
  },
  nameSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  speciesBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  speciesBadgeText: {
    fontSize: 16,
    color: '#666666',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  actionButtons: {
    gap: 12,
  },
  healthButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  healthButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    padding: 16,
  },
});
