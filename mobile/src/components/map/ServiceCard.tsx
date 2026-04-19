import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { Service, ServiceType } from '../../types';
import { formatDistance } from '../../utils/distance';

interface ServiceCardProps {
  service: Service;
  userLatitude: number;
  userLongitude: number;
  onClose?: () => void;
}

const SERVICE_TYPE_CONFIG: Record<ServiceType, { icon: string; color: string; label: string }> = {
  vet: { icon: '🏥', color: '#EF5350', label: 'Veterinary' },
  pet_store: { icon: '🛒', color: '#42A5F5', label: 'Pet Store' },
  groomer: { icon: '✂️', color: '#AB47BC', label: 'Groomer' },
  pharmacy: { icon: '💊', color: '#26A69A', label: 'Pharmacy' },
  emergency_clinic: { icon: '🚨', color: '#EF5350', label: 'Emergency Clinic' },
};

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function ServiceCard({
  service,
  userLatitude,
  userLongitude,
  onClose,
}: ServiceCardProps): JSX.Element {
  const config = SERVICE_TYPE_CONFIG[service.type];
  const distance = calculateDistance(
    userLatitude,
    userLongitude,
    service.latitude,
    service.longitude
  );

  const handleCall = () => {
    if (service.phone) {
      const phoneNumber = service.phone.replace(/[^0-9]/g, '');
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleNavigate = () => {
    const { latitude, longitude } = service;
    const label = encodeURIComponent(service.name);
    let url: string;

    if (Platform.OS === 'ios') {
      url = `maps:0,0?q=${label}@${latitude},${longitude}`;
    } else {
      url = `geo:0,0?q=${latitude},${longitude}(${label})`;
    }

    Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBadge, { backgroundColor: config.color + '20' }]}>
            <Text style={styles.iconBadgeText}>{config.icon}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.serviceName} numberOfLines={1}>
              {service.name}
            </Text>
            <Text style={styles.serviceType}>{config.label}</Text>
          </View>
          {service.rating !== undefined && (
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.rating}>{service.rating.toFixed(1)}</Text>
              {service.reviewCount !== undefined && (
                <Text style={styles.reviewCount}>({service.reviewCount})</Text>
              )}
            </View>
          )}
        </View>

        {/* Status Row */}
        <View style={styles.statusRow}>
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceIcon}>📍</Text>
            <Text style={styles.distanceText}>
              {formatDistance(distance)} away
            </Text>
          </View>
          <View style={styles.tagsContainer}>
            {service.is24Hour && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>⏰ 24hr</Text>
              </View>
            )}
            {service.isEmergency && (
              <View style={[styles.tag, styles.emergencyTag]}>
                <Text style={[styles.tagText, styles.emergencyTagText]}>
                  🚨 Emergency
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Address */}
        <Text style={styles.address} numberOfLines={2}>
          {service.address}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={handleCall}
          disabled={!service.phone}
        >
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={[styles.actionText, !service.phone && styles.actionTextDisabled]}>
            Call
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.navigateButton]}
          onPress={handleNavigate}
        >
          <Text style={styles.actionIcon}>🧭</Text>
          <Text style={styles.actionText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconBadgeText: {
    fontSize: 22,
  },
  titleContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  serviceType: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  starIcon: {
    fontSize: 14,
    color: '#F59E0B',
    marginRight: 2,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  reviewCount: {
    fontSize: 12,
    color: '#92400E',
    marginLeft: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
  },
  emergencyTag: {
    backgroundColor: '#FEE2E2',
  },
  emergencyTagText: {
    color: '#DC2626',
  },
  address: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  callButton: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  navigateButton: {},
  actionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00897B',
  },
  actionTextDisabled: {
    color: '#9CA3AF',
  },
});

export default ServiceCard;
