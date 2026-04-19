import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ServiceType } from '../../types';

interface FilterChipProps {
  type: ServiceType | 'all';
  label: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
}

interface FilterChipsProps {
  selectedTypes: ServiceType[];
  onToggleType: (type: ServiceType) => void;
}

const SERVICE_TYPE_CONFIG: Record<
  ServiceType,
  { icon: string; label: string; color: string }
> = {
  vet: { icon: '🏥', label: 'Vet', color: '#EF5350' },
  pet_store: { icon: '🛒', label: 'Pet Store', color: '#42A5F5' },
  groomer: { icon: '✂️', label: 'Groomer', color: '#AB47BC' },
  pharmacy: { icon: '💊', label: 'Pharmacy', color: '#26A69A' },
  emergency_clinic: { icon: '🚨', label: 'Emergency', color: '#EF5350' },
};

function FilterChip({
  type,
  label,
  icon,
  isSelected,
  onPress,
}: FilterChipProps): JSX.Element {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected && styles.chipSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.chipIcon}>{icon}</Text>
      <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function FilterChips({
  selectedTypes,
  onToggleType,
}: FilterChipsProps): JSX.Element {
  const serviceTypes: ServiceType[] = [
    'vet',
    'pet_store',
    'groomer',
    'pharmacy',
    'emergency_clinic',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter by Type</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {serviceTypes.map((type) => {
          const config = SERVICE_TYPE_CONFIG[type];
          return (
            <FilterChip
              key={type}
              type={type}
              label={config.label}
              icon={config.icon}
              isSelected={selectedTypes.includes(type)}
              onPress={() => onToggleType(type)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipSelected: {
    backgroundColor: '#00897B',
    borderColor: '#00897B',
  },
  chipIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  chipLabelSelected: {
    color: '#FFFFFF',
  },
});

export default FilterChips;
