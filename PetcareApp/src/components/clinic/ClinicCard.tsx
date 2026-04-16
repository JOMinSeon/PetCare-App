/**
 * ClinicCard Component
 * Phase 03-01: Clinic Search & Map
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clinic } from '../../types/clinic.types';

interface ClinicCardProps {
  clinic: Clinic;
  onPress: (clinic: Clinic) => void;
}

export function ClinicCard({ clinic, onPress }: ClinicCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(clinic)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{clinic.name}</Text>
        {clinic.rating !== undefined && (
          <View style={styles.rating}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.ratingText}>{clinic.rating.toFixed(1)}</Text>
            {clinic.reviewCount !== undefined && (
              <Text style={styles.reviewCount}>({clinic.reviewCount})</Text>
            )}
          </View>
        )}
      </View>
      <Text style={styles.address} numberOfLines={2}>{clinic.roadAddress}</Text>
      <Text style={styles.phone}>{clinic.phone}</Text>
      <Text style={styles.hours} numberOfLines={1}>{clinic.operatingHours}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#FFD700',
    fontSize: 14,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginLeft: 2,
  },
  reviewCount: {
    fontSize: 12,
    color: '#888888',
    marginLeft: 2,
  },
  address: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    lineHeight: 20,
  },
  phone: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  hours: {
    fontSize: 12,
    color: '#888888',
  },
});

export default ClinicCard;
