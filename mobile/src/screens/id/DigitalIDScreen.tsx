import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { usePetStore, Pet } from '../../stores/petStore';
import { QRCodeCard } from '../../components/QRCodeCard';

type ParamList = {
  DigitalID: { petId: string };
};

export const DigitalIDScreen: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'DigitalID'>>();
  const { petId } = route.params;
  const { pets } = usePetStore();
  const pet = pets.find(p => p.id === petId);

  const [emergencyPhone] = useState('010-1234-5678');

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Pet not found</Text>
      </View>
    );
  }

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return 'Unknown';
    const birth = new Date(birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    if (months < 0) return `${years - 1} years`;
    if (years === 0) return `${months} months`;
    return `${years} years ${months} months`;
  };

  const handleEmergencyCall = () => {
    Linking.openURL(`tel:${emergencyPhone.replace(/[^0-9]/g, '')}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>🐾</Text>
        </View>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petSpecies}>{pet.species}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Digital Pet ID</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{pet.name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Species</Text>
            <Text style={styles.infoValue}>{pet.species}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Breed</Text>
            <Text style={styles.infoValue}>{pet.breed || 'Unknown'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{pet.weight ? `${pet.weight} kg` : 'Unknown'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{calculateAge(pet.birthDate)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.qrSection}>
        <QRCodeCard pet={pet} emergencyPhone={emergencyPhone} />
      </View>

      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
        <Text style={styles.emergencyIcon}>📞</Text>
        <Text style={styles.emergencyText}>Call Emergency Contact</Text>
        <Text style={styles.emergencyPhone}>{emergencyPhone}</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        This QR code contains pet ID and emergency contact information.
        Shelters and veterinarians can scan this code to access essential pet information in case of emergency.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#00897B',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
  },
  petName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  petSpecies: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 2,
  },
  qrSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#EF5350',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  emergencyIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emergencyPhone: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
    paddingBottom: 32,
    lineHeight: 18,
  },
});