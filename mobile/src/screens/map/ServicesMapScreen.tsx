import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Switch,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useServicesStore } from '../../stores/servicesStore';
import { useLocation } from '../../hooks/useLocation';
import { getServices } from '../../services/services.service';
import { ServiceMarker } from '../../components/map/ServiceMarker';
import { FilterChips } from '../../components/map/FilterChips';
import { ServiceCard } from '../../components/map/ServiceCard';
import { Service } from '../../types';

// Default to Seoul if no location available
const DEFAULT_LOCATION = {
  latitude: 37.5665,
  longitude: 126.9780,
};

export function ServicesMapScreen(): JSX.Element {
  const {
    services,
    selectedService,
    filters,
    setServices,
    setSelectedService,
    toggleServiceType,
    setUserLocation,
    getFilteredServices,
    setIs24HourOnly,
    setEmergencyOnly,
  } = useServicesStore();

  const { location, error: locationError, isLoading: locationLoading } = useLocation();
  const [mapRef, setMapRef] = useState<MapView | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Set user location in store when available
  useEffect(() => {
    if (location) {
      setUserLocation(location);
    }
  }, [location, setUserLocation]);

  // Fetch services when location changes
  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const lat = location?.latitude ?? DEFAULT_LOCATION.latitude;
        const lng = location?.longitude ?? DEFAULT_LOCATION.longitude;

        const response = await getServices({
          lat,
          lng,
          radius: 10000, // 10km radius
        });

        setServices(response.services);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setIsInitialLoad(false);
      }
    };

    fetchServicesData();
  }, [location, setServices]);

  // Animate to selected service
  const handleMarkerPress = useCallback(
    (service: Service) => {
      setSelectedService(service);
      mapRef?.animateToRegion(
        {
          latitude: service.latitude,
          longitude: service.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    },
    [mapRef, setSelectedService]
  );

  // Handle service card close
  const handleCloseCard = useCallback(() => {
    setSelectedService(null);
    if (location && mapRef) {
      mapRef.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        500
      );
    }
  }, [location, mapRef, setSelectedService]);

  // Get filtered services
  const filteredServices = getFilteredServices();

  // User location to use
  const userLat = location?.latitude ?? DEFAULT_LOCATION.latitude;
  const userLng = location?.longitude ?? DEFAULT_LOCATION.longitude;

  // Loading state
  if (locationLoading || isInitialLoad) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00897B" />
        <Text style={styles.loadingText}>Finding nearby services...</Text>
      </View>
    );
  }

  // Error state
  if (locationError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>📍</Text>
        <Text style={styles.errorTitle}>Location Access Required</Text>
        <Text style={styles.errorText}>{locationError}</Text>
        <Text style={styles.errorSubtext}>
          Please enable location services to find nearby pet services.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={(ref) => setMapRef(ref)}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLat,
          longitude: userLng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        onPress={() => setSelectedService(null)}
      >
        {filteredServices.map((service) => (
          <Marker
            key={service.id}
            coordinate={{
              latitude: service.latitude,
              longitude: service.longitude,
            }}
            onPress={() => handleMarkerPress(service)}
          >
            <ServiceMarker
              service={service}
              isSelected={selectedService?.id === service.id}
            />
          </Marker>
        ))}
      </MapView>

      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        <FilterChips
          selectedTypes={filters.types}
          onToggleType={toggleServiceType}
        />
        <View style={styles.toggleRow}>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>24-Hour</Text>
            <Switch
              value={filters.is24HourOnly}
              onValueChange={setIs24HourOnly}
              trackColor={{ false: '#ddd', true: '#00897B' }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Emergency</Text>
            <Switch
              value={filters.emergencyOnly}
              onValueChange={setEmergencyOnly}
              trackColor={{ false: '#ddd', true: '#EF5350' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* Service Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Service Card (Bottom Sheet) */}
      {selectedService && (
        <View style={styles.cardContainer}>
          <ServiceCard
            service={selectedService}
            userLatitude={userLat}
            userLongitude={userLng}
            onClose={handleCloseCard}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  map: {
    flex: 1,
  },
  filterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 50 : 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 24,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#333',
  },
  countContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 130 : 90,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  cardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
});

export default ServicesMapScreen;
