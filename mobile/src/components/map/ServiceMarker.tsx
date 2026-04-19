import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Service, ServiceType } from '../../types';

interface ServiceMarkerProps {
  service: Service;
  isSelected?: boolean;
}

const SERVICE_TYPE_CONFIG: Record<
  ServiceType,
  { icon: string; color: string; label: string }
> = {
  vet: { icon: '🏥', color: '#EF5350', label: 'Vet' },
  pet_store: { icon: '🛒', color: '#42A5F5', label: 'Pet Store' },
  groomer: { icon: '✂️', color: '#AB47BC', label: 'Groomer' },
  pharmacy: { icon: '💊', color: '#26A69A', label: 'Pharmacy' },
  emergency_clinic: { icon: '🚨', color: '#EF5350', label: 'Emergency' },
};

export function ServiceMarker({
  service,
  isSelected = false,
}: ServiceMarkerProps): JSX.Element {
  const config = SERVICE_TYPE_CONFIG[service.type];

  return (
    <View
      style={[
        styles.markerContainer,
        isSelected && styles.markerSelected,
        { borderColor: config.color },
      ]}
    >
      <Text style={styles.markerIcon}>{config.icon}</Text>
      {isSelected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>{config.label}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 8,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  markerSelected: {
    backgroundColor: '#FFF9C4',
    transform: [{ scale: 1.1 }],
  },
  markerIcon: {
    fontSize: 20,
  },
  selectedBadge: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: '#333',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selectedBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '600',
  },
});
