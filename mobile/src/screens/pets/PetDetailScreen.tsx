import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { usePetStore, Pet } from '../../stores/petStore';
import { SpeciesIcon } from '../../components/SpeciesIcon';

interface PetDetailScreenProps {
  navigation: any;
  route: any;
}

export function PetDetailScreen({ navigation, route }: PetDetailScreenProps) {
  const { petId } = route.params;
  const { getPet, deletePet, isLoading } = usePetStore();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPet();
  }, [petId]);

  const loadPet = async () => {
    try {
      const fetchedPet = await getPet(petId);
      setPet(fetchedPet);
    } catch (error) {
      Alert.alert('Error', 'Failed to load pet details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAge = (birthDate: string | null): string => {
    if (!birthDate) return 'Unknown';
    const birth = new Date(birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    const totalMonths = years * 12 + months;
    if (totalMonths < 1) return 'Newborn';
    if (totalMonths < 12) return `${totalMonths} month${totalMonths > 1 ? 's' : ''}`;
    const y = Math.floor(totalMonths / 12);
    return `${y} year${y > 1 ? 's' : ''}`;
  };

  const handleDelete = () => {
    if (!pet) return;

    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${pet.name}? This action cannot be undone.`,
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00897B" />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Pet not found</Text>
      </View>
    );
  }

  const speciesLabel = pet.species.charAt(0).toUpperCase() + pet.species.slice(1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {pet.photoUrl ? (
          <Image source={{ uri: pet.photoUrl }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <SpeciesIcon species={pet.species} size={64} />
          </View>
        )}
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{pet.name}</Text>
            <SpeciesIcon species={pet.species} size={24} />
          </View>
          <Text style={styles.species}>{speciesLabel}</Text>
          {pet.breed && <Text style={styles.breed}>{pet.breed}</Text>}
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Age</Text>
          <Text style={styles.detailValue}>{formatAge(pet.birthDate)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Birth Date</Text>
          <Text style={styles.detailValue}>{formatDate(pet.birthDate)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Weight</Text>
          <Text style={styles.detailValue}>
            {pet.weight ? `${pet.weight} kg` : 'Not set'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Added</Text>
          <Text style={styles.detailValue}>{formatDate(pet.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditPet', { petId })}
        >
          <Text style={styles.editButtonText}>✏️ Edit Pet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>🗑️ Delete Pet</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.placeholderSection}>
        <Text style={styles.placeholderIcon}>📊</Text>
        <Text style={styles.placeholderTitle}>Health Tracking</Text>
        <Text style={styles.placeholderText}>
          Health scores, symptoms, activity, and diet tracking coming in Phase 3.
        </Text>
      </View>

      <View style={styles.placeholderSection}>
        <Text style={styles.placeholderIcon}>🏥</Text>
        <Text style={styles.placeholderTitle}>Medical Records</Text>
        <Text style={styles.placeholderText}>
          Vaccinations and checkup records coming in Phase 5.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  errorText: {
    fontSize: 16,
    color: '#757575',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerInfo: {
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginRight: 8,
  },
  species: {
    fontSize: 16,
    color: '#00897B',
    fontWeight: '600',
  },
  breed: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  detailLabel: {
    fontSize: 14,
    color: '#757575',
  },
  detailValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#00897B',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#C62828',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    lineHeight: 20,
  },
});