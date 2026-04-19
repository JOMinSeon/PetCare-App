import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { usePetStore } from '../../store';
import { Button, Card, LoadingSpinner } from '../../components';

export default function PetDetailScreen({ route, navigation }) {
  const { petId } = route.params;
  const { getPetById, deletePet, selectedPet, isLoading } = usePetStore();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    loadPet();
  }, [petId]);

  const loadPet = async () => {
    const response = await getPetById(petId);
    setPet(response.pet || response);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Pet',
      'Are you sure you want to delete this pet? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePet(petId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (isLoading && !pet) {
    return <LoadingSpinner />;
  }

  const speciesEmoji = {
    dog: '🐕',
    cat: '🐈',
    other: '🐾',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.emoji}>{speciesEmoji[pet?.species] || '🐾'}</Text>
        </View>
        <Text style={styles.name}>{pet?.name}</Text>
        <Text style={styles.breed}>{pet?.breed || pet?.species}</Text>
      </View>

      <View style={styles.content}>
        <Card title="Basic Information">
          <InfoRow label="Species" value={pet?.species} />
          <InfoRow label="Breed" value={pet?.breed || '-'} />
          <InfoRow label="Gender" value={pet?.gender || '-'} />
          <InfoRow label="Birth Date" value={pet?.birth_date || '-'} />
          <InfoRow label="Weight" value={pet?.weight ? `${pet.weight} kg` : '-'} />
        </Card>

        <Card title="Health Summary">
          <Text style={styles.placeholder}>Health metrics will be displayed here</Text>
        </Card>

        <Card title="Recent Activity">
          <Text style={styles.placeholder}>Recent activities will be displayed here</Text>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Edit Pet"
            onPress={() => navigation.navigate('EditPet', { petId })}
            style={styles.editButton}
          />
          <Button
            title="Delete Pet"
            onPress={handleDelete}
            variant="danger"
          />
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 48,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  breed: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  infoValue: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  placeholder: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  actions: {
    marginTop: 24,
    paddingBottom: 32,
  },
  editButton: {
    marginBottom: 12,
  },
});