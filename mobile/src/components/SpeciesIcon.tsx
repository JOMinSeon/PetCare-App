import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';

const SPECIES_EMOJI: Record<Species, string> = {
  dog: '🐕',
  cat: '🐈',
  bird: '🐦',
  rabbit: '🐰',
  fish: '🐟',
  other: '🐾',
};

interface SpeciesIconProps {
  species: string;
  size?: number;
}

export function SpeciesIcon({ species, size = 24 }: SpeciesIconProps) {
  const validSpecies = (['dog', 'cat', 'bird', 'rabbit', 'fish', 'other'] as Species[]).includes(species as Species)
    ? (species as Species)
    : 'other';
  const emoji = SPECIES_EMOJI[validSpecies];

  return (
    <View style={styles.container}>
      <Text style={[styles.icon, { fontSize: size }]}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});