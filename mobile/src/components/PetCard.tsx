import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SpeciesIcon } from './SpeciesIcon';

interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';
  breed: string | null;
  birthDate: string | null;
  weight: number | null;
  photoUrl: string | null;
}

interface PetCardProps {
  pet: Pet;
  onPress: (pet: Pet) => void;
}

export function PetCard({ pet, onPress }: PetCardProps) {
  const formatWeight = (weight: number | null): string => {
    if (weight === null) return '';
    return `${weight} kg`;
  };

  const formatAge = (birthDate: string | null): string => {
    if (!birthDate) return '';
    const birth = new Date(birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    const totalMonths = years * 12 + months;
    if (totalMonths < 1) return 'Newborn';
    if (totalMonths < 12) return `${totalMonths} mo`;
    const y = Math.floor(totalMonths / 12);
    return `${y} yr${y > 1 ? 's' : ''}`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(pet)} activeOpacity={0.7}>
      <View style={styles.photoContainer}>
        {pet.photoUrl ? (
          <Image source={{ uri: pet.photoUrl }} style={styles.photo} />
        ) : (
          <View style={styles.placeholderPhoto}>
            <SpeciesIcon species={pet.species} size={32} />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{pet.name}</Text>
          <SpeciesIcon species={pet.species} size={18} />
        </View>
        {pet.breed && <Text style={styles.breed}>{pet.breed}</Text>}
        <View style={styles.detailsRow}>
          {pet.birthDate && <Text style={styles.detail}>{formatAge(pet.birthDate)}</Text>}
          {pet.weight && <Text style={styles.detail}>{formatWeight(pet.weight)}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoContainer: {
    marginRight: 12,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  placeholderPhoto: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginRight: 8,
  },
  breed: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detail: {
    fontSize: 12,
    color: '#9E9E9E',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});