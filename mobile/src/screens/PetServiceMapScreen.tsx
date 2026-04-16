import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import * as Location from 'expo-location';
import { theme } from '../theme';
import { PetServicePlace, ServiceCategory } from '../types/map.types';
import { MapService } from '../services/kakaoMap.service';
import { MAP_FILTERS, DEFAULT_REGION } from '../constants/map.constants';
import KakaoMapView from '../components/map/KakaoMapView';

interface Props {
  onBack: () => void;
}

export default function PetServiceMapScreen({ onBack }: Props) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number; lng: number} | null>(null);
  const [places, setPlaces] = useState<PetServicePlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PetServicePlace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한',
            message: '주변 서비스를 검색하려면 위치 권한이 필요합니다.',
            buttonPositive: '확인',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setCurrentLocation({ lat: DEFAULT_REGION.latitude, lng: DEFAULT_REGION.longitude });
          setIsLoading(false);
          return;
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const loc = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      setCurrentLocation(loc);
      searchNearbyServices(loc);
    } catch {
      setCurrentLocation({ lat: DEFAULT_REGION.latitude, lng: DEFAULT_REGION.longitude });
      setIsLoading(false);
    }
  };

  const searchNearbyServices = async (location: {lat: number; lng: number}) => {
    setIsSearching(true);
    try {
      const results = await MapService.searchNearbyServices(location.lat, location.lng, 5000);
      setPlaces(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  const toggleFilter = useCallback((id: string) => {
    setSelectedFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }, []);

  const getFilteredPlaces = useCallback(() => {
    if (selectedFilters.length === 0) return places;
    const selectedCategories = selectedFilters
      .flatMap(id => MAP_FILTERS.find(f => f.id === id)?.categories || [])
      .filter((v, i, a) => a.indexOf(v) === i);
    return places.filter(p => selectedCategories.includes(p.category));
  }, [places, selectedFilters]);

  const handleCall = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('오류', '전화 연결에 실패했습니다.')
    );
  }, []);

  const handleNavigation = useCallback((place: PetServicePlace) => {
    const url = `https://map.kakao.com/link/map/${place.name},${place.y},${place.x}`;
    Linking.openURL(url).catch(() => {
      const webUrl = `https://map.kakao.com/?q=${encodeURIComponent(place.name)}`;
      Linking.openURL(webUrl);
    });
  }, []);

  const handleMarkerClick = useCallback((place: PetServicePlace) => {
    setSelectedPlace(place);
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  const filteredPlaces = getFilteredPlaces();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>주변 서비스</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>위치를 찾는 중...</Text>
        </View>
      ) : currentLocation ? (
        <View style={styles.mapContainer}>
          <KakaoMapView
            latitude={currentLocation.lat}
            longitude={currentLocation.lng}
            places={filteredPlaces}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
          />
        </View>
      ) : null}

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MAP_FILTERS.map(filter => {
            const isSelected = selectedFilters.includes(filter.id);
            return (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => toggleFilter(filter.id)}
              >
                <Text style={styles.filterIcon}>{filter.icon}</Text>
                <Text style={[styles.filterLabel, isSelected && styles.filterLabelSelected]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>
          {filteredPlaces.length}개 서비스
        </Text>
        {isSearching && <ActivityIndicator size="small" color={theme.colors.primary} />}
      </View>

      <FlatList
        data={filteredPlaces}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.serviceList}
        renderItem={({ item: service }) => (
          <TouchableOpacity
            style={[styles.serviceCard, selectedPlace?.id === service.id && styles.serviceCardSelected]}
            onPress={() => setSelectedPlace(service)}
          >
            <View style={styles.serviceHeader}>
              <View style={styles.serviceTitleRow}>
                <Text style={styles.serviceName}>{service.name}</Text>
                {service.isEmergency && (
                  <View style={styles.emergencyBadge}>
                    <Text style={styles.emergencyBadgeText}>응급</Text>
                  </View>
                )}
              </View>
              <Text style={styles.serviceType}>{getCategoryLabel(service.category)}</Text>
            </View>

            <View style={styles.serviceMeta}>
              <Text style={styles.address} numberOfLines={1}>{service.address}</Text>
            </View>

            <View style={styles.serviceActions}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall(service.phone)}
              >
                <Text style={styles.callButtonText}>전화하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => handleNavigation(service)}
              >
                <Text style={styles.navButtonText}>길찾기</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>주변에 서비스가 없습니다</Text>
          </View>
        }
        initialNumToRender={4}
      />
    </View>
  );
}

function getCategoryLabel(category: ServiceCategory): string {
  const labels: Record<ServiceCategory, string> = {
    VET: '동물병원',
    PET_SHOP: '펫숍',
    GROOMING: '미용/욕조',
    EMERGENCY: '응급실',
    PET_HOTEL: '호텔',
    TRAINING: '훈련',
  };
  return labels[category] || category;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 50 : theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: { padding: theme.spacing.xs },
  backText: { fontSize: 20, color: theme.colors.primary },
  title: { fontSize: 16, fontWeight: '600', color: theme.colors.onBackground },
  headerSpacer: { width: 40 },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  loadingText: { marginTop: theme.spacing.md, fontSize: 14, color: theme.colors.onSurfaceLight },
  mapContainer: { height: 200 },
  filterBar: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  filterChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterIcon: { fontSize: 12, marginRight: theme.spacing.xs },
  filterLabel: { fontSize: 12, color: theme.colors.onSurface },
  filterLabelSelected: { color: '#FFFFFF' },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  resultCount: { fontSize: 13, color: theme.colors.onSurfaceLight },
  serviceList: { padding: theme.spacing.lg, paddingTop: theme.spacing.sm },
  serviceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  serviceCardSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  serviceHeader: { marginBottom: theme.spacing.sm },
  serviceTitleRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  serviceName: { fontSize: 15, fontWeight: '600', color: theme.colors.onSurface },
  emergencyBadge: {
    backgroundColor: theme.colors.danger,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
  },
  emergencyBadgeText: { fontSize: 10, fontWeight: '600', color: '#FFFFFF' },
  serviceType: { fontSize: 12, color: theme.colors.onSurfaceLight, marginTop: 2 },
  serviceMeta: { marginBottom: theme.spacing.md },
  address: { fontSize: 12, color: theme.colors.onSurfaceLight },
  serviceActions: { flexDirection: 'row', gap: theme.spacing.sm },
  callButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  callButtonText: { fontSize: 13, color: '#FFFFFF', fontWeight: '500' },
  navButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  navButtonText: { fontSize: 13, color: theme.colors.onSurface },
  emptyContainer: { padding: theme.spacing.xl, alignItems: 'center' },
  emptyText: { fontSize: 14, color: theme.colors.onSurfaceLight },
});
