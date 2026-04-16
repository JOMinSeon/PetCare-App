/**
 * ClinicSearchScreen
 * Phase 03-01: Clinic Search & Map
 * app/clinic/index.tsx
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import * as Location from 'expo-location';
import { ClinicCard } from '../../src/components/clinic/ClinicCard';
import { ClinicMap } from '../../src/components/clinic/ClinicMap';
import { useClinic } from '../../src/contexts/ClinicContext';
import { Clinic } from '../../src/types/clinic.types';
import { router } from 'expo-router';

const DEFAULT_LATITUDE = 37.5665;
const DEFAULT_LONGITUDE = 126.9780;

export default function ClinicSearchScreen() {
  const { clinics, loading, error, searchClinicsNearby } = useClinic();
  const [region, setRegion] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    requestLocationAndSearch();
  }, []);

  const requestLocationAndSearch = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPosition({});
        const { latitude, longitude } = location.coords;
        setRegion({ latitude, longitude });
        setLocationError(null);
        await searchClinicsNearby(latitude, longitude);
      } else {
        setLocationError('Location permission denied. Showing default location.');
        await searchClinicsNearby(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
      }
    } catch (err) {
      setLocationError('Failed to get location. Showing default location.');
      await searchClinicsNearby(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await requestLocationAndSearch();
    setRefreshing(false);
  };

  const handleClinicPress = (clinic: Clinic) => {
    router.push(`/clinic/${clinic.id}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🏥</Text>
      <Text style={styles.emptyTitle}>주변 병원을 찾아보세요</Text>
      <Text style={styles.emptySubtitle}>
        현재 위치 기반 동물병원을 검색합니다
      </Text>
    </View>
  );

  if (loading && clinics.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>주변 병원 검색 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>동물병원 검색</Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {locationError && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>{locationError}</Text>
        </View>
      )}

      <ClinicMap
        clinics={clinics}
        selectedClinic={null}
        latitude={region.latitude}
        longitude={region.longitude}
        onMarkerPress={handleClinicPress}
      />

      <FlatList
        data={clinics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClinicCard clinic={item} onPress={handleClinicPress} />
        )}
        contentContainerStyle={clinics.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  errorBanner: {
    backgroundColor: '#fff3cd',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#856404',
    textAlign: 'center',
  },
  warningBanner: {
    backgroundColor: '#e7f3ff',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  warningText: {
    color: '#004085',
    textAlign: 'center',
    fontSize: 14,
  },
  list: {
    paddingBottom: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
