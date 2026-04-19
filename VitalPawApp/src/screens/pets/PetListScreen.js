import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { usePetStore } from '../../store';
import { PetCard, LoadingSpinner, EmptyState } from '../../components';

export default function PetListScreen({ navigation }) {
  const { pets, fetchPets, isLoading } = usePetStore();

  useEffect(() => {
    fetchPets();
  }, []);

  const handleRefresh = () => {
    fetchPets();
  };

  if (isLoading && pets.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onPress={() => navigation.navigate('PetDetail', { petId: item.id })}
          />
        )}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
        contentContainerStyle={pets.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={
          <EmptyState message="No pets yet. Add your first pet!" icon="🐾">
            <TouchableOpacity onPress={() => navigation.navigate('AddPet')}>
              <Text style={styles.addPetText}>+ Add Pet</Text>
            </TouchableOpacity>
          </EmptyState>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddPet')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
  },
  addPetText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },
});