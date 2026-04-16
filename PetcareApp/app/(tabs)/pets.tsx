import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { usePet } from '../../src/contexts/PetContext';
import { Pet, getSpeciesEmoji } from '../../src/types/pet.types';

export default function PetsScreen() {
  const router = useRouter();
  const { pets, isLoading, error, fetchPets, removePet } = usePet();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPets();
    setRefreshing(false);
  };

  const handleDeletePet = (pet: Pet) => {
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
            } catch (err) {
              Alert.alert('오류', '반려동물 삭제에 실패했습니다');
            }
          },
        },
      ]
    );
  };

  const renderPetCard = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/pet/${item.id}`)}
      onLongPress={() => handleDeletePet(item)}
    >
      <View style={styles.cardImage}>
        {item.photoUrl ? (
          <Image source={{ uri: item.photoUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.emoji}>{getSpeciesEmoji(item.species)}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petInfo}>
          {item.species} {item.breed && `· ${item.breed}`}
        </Text>
        {item.birthDate && (
          <Text style={styles.petBirth}>생일: {item.birthDate}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🐾</Text>
      <Text style={styles.emptyTitle}>반려동물을 등록해주세요</Text>
      <Text style={styles.emptySubtitle}>
        귀여운 반려동물의 정보를 입력하여 건강하게 관리하세요
      </Text>
      <Link href="/pet/add" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>반려동물 등록</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  if (isLoading && pets.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>반려동물</Text>
        <Link href="/pet/add" asChild>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>+ 추가</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={pets}
        renderItem={renderPetCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={pets.length === 0 ? styles.emptyContainer : styles.listContainer}
        columnWrapperStyle={pets.length > 0 ? styles.row : undefined}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#fff3cd',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#856404',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 4,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f4fe',
  },
  emoji: {
    fontSize: 48,
  },
  cardContent: {
    padding: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  petInfo: {
    fontSize: 14,
    color: '#666666',
  },
  petBirth: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});