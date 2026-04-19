import React from 'react';
import { View, Text, StyleSheet, Linking, Platform } from 'react-native';
import { Pet } from '../stores/petStore';

interface QRCodeCardProps {
  pet: Pet;
  emergencyPhone?: string;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ pet, emergencyPhone }) => {
  const qrData = JSON.stringify({
    petId: pet.id,
    petName: pet.name,
    species: pet.species,
    emergencyPhone: emergencyPhone || '',
  });

  const handleEmergencyCall = () => {
    if (emergencyPhone) {
      Linking.openURL(`tel:${emergencyPhone.replace(/[^0-9]/g, '')}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.qrPlaceholder}>
        <Text style={styles.qrIcon}>📱</Text>
        <Text style={styles.qrText}>QR Code</Text>
        <Text style={styles.qrSubtext}>{pet.name}'s Digital ID</Text>
      </View>
      <View style={styles.qrData}>
        <Text style={styles.qrDataLabel}>Encoded Data:</Text>
        <Text style={styles.qrDataText} numberOfLines={3}>{qrData}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#00897B',
    borderStyle: 'dashed',
  },
  qrIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  qrText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  qrSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  qrData: {
    width: '100%',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  qrDataLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  qrDataText: {
    fontSize: 11,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});