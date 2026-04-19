import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { usePetStore, Pet } from '../../stores/petStore';
import { PetCard } from '../../components/PetCard';

interface PetListScreenProps {
  navigation: any;
}

export function PetListScreen({ navigation }: PetListScreenProps) {
  const { pets, fetchPets, deletePet, isLoading, error } = usePetStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      await fetchPets();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load pets';
      Alert.alert('Error', message);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };

  const handlePetPress = (pet: Pet) => {
    navigation.navigate('PetDetail', { petId: pet.id });
  };

  const renderPetCard = ({ item }: { item: Pet }) => (
    <PetCard pet={item} onPress={handlePetPress} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🐾</Text>
      <Text style={styles.emptyTitle}>No Pets Yet</Text>
      <Text style={styles.emptyText}>
        Add your first pet to start tracking their health!
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPet')}
      >
        <Text style={styles.addButtonText}>Add Your First Pet</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pets</Text>
        <TouchableOpacity
          style={styles.addIconButton}
          onPress={() => navigation.navigate('AddPet')}
        >
          <Text style={styles.addIconText}>+</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={renderPetCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#00897B']}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00897B',
  },
  addIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00897B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  addButton: {
    backgroundColor: '#00897B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});