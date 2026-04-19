import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function PetCard({ pet, onPress }) {
  const speciesEmoji = {
    dog: '🐕',
    cat: '🐈',
    other: '🐾',
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.emoji}>{speciesEmoji[pet.species] || '🐾'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.breed}>{pet.breed || pet.species}</Text>
        {pet.weight && <Text style={styles.weight}>{pet.weight} kg</Text>}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  breed: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  weight: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  chevron: {
    fontSize: 24,
    color: '#C7C7CC',
  },
});