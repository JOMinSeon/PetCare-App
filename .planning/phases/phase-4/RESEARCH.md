# Phase 4: Services Map - Research

**Researched:** 2026-04-19
**Domain:** React Native Maps, Google Places API, Location Services, Service Discovery UI/UX
**Confidence:** HIGH

## Summary

Phase 4 implements a pet services map feature allowing users to discover nearby pet services (veterinaries, pet stores, groomers) with filtering capabilities and direct contact integration. The map uses react-native-maps with Google Maps provider on Android and Apple Maps on iOS. Service data is fetched via a server-side proxy to Google Places API with in-memory caching to handle rate limits. The UI follows a bottom-sheet pattern with service cards displaying distance, rating, open/closed status, and action buttons for calling and navigation.

**Primary recommendation:** Use react-native-maps with Google Maps provider, server-side caching for Places API, and a bottom-sheet card design for service details.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native-maps | 1.27.2 | Map component | Industry standard RN maps library, supports both Google and Apple maps |
| @react-native-community/geolocation | 3.4.0 | GPS location | Official community package, handles permissions properly |
| node-cache | 5.1.2 | Server-side caching | Simple in-memory cache for API rate limit mitigation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-native-maps-directions | 1.9.0 | Turn-by-turn navigation | When user taps navigate button |
| geolib | 3.3.27 | Distance calculations | Alternative to manual Haversine implementation |

### Version Verification
| Package | Verified Version | npm Registry Date |
|---------|-----------------|------------------|
| react-native-maps | 1.27.2 | 2026-03-11 |
| @react-native-community/geolocation | 3.4.0 | Current |
| react-native-maps-directions | 1.9.0 | Current |
| node-cache | 5.1.2 | Current |
| geolib | 3.3.27 | Current |

**Installation:**
```bash
# Mobile
cd mobile
npm install react-native-maps @react-native-community/geolocation react-native-maps-directions

# Server
cd server
npm install node-cache
```

## Architecture Patterns

### Recommended Project Structure

```
mobile/src/
├── screens/
│   └── services/
│       └── ServicesMapScreen.tsx    # Main map screen
├── components/
│   ├── ServiceCard.tsx               # Service info card with actions
│   ├── ServiceMarker.tsx             # Custom map marker view
│   ├── FilterChips.tsx              # Service type filter chips
│   └── FilterBar.tsx                # Combined filter controls
├── stores/
│   └── servicesStore.ts              # Service list, filters, selected service
├── services/
│   └── services.service.ts           # API calls to backend
├── hooks/
│   └── useLocation.ts               # User location hook
└── utils/
    └── distance.ts                   # Haversine distance calculation

server/src/
├── controllers/
│   └── services.controller.ts        # Service search logic
├── services/
│   ├── googlePlaces.service.ts       # Google Places API proxy
│   └── cache.service.ts              # In-memory cache wrapper
├── routes/
│   └── services.routes.ts            # GET /api/services
└── data/
    └── mockServices.ts               # Development mock data
```

### Pattern 1: MapView with Markers

**What:** Display map with service location markers.

**When to use:** Core MAP-01 requirement - showing nearby services.

**Example:**
```typescript
// Source: react-native-maps documentation
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Service } from '../types';

interface ServicesMapProps {
  services: Service[];
  userLocation: { latitude: number; longitude: number };
  onMarkerPress: (service: Service) => void;
  selectedService?: Service;
}

const ServicesMap: React.FC<ServicesMapProps> = ({
  services,
  userLocation,
  onMarkerPress,
  selectedService,
}) => {
  const [region, setRegion] = useState({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={region}
      onRegionChangeComplete={setRegion}
      showsUserLocation
      showsMyLocationButton
    >
      {services.map((service) => (
        <Marker
          key={service.id}
          coordinate={{
            latitude: service.latitude,
            longitude: service.longitude,
          }}
          title={service.name}
          description={service.address}
          onPress={() => onMarkerPress(service)}
        >
          <View style={styles.markerContainer}>
            <Text style={styles.markerIcon}>
              {service.type === 'vet' ? '🏥' : '🛒'}
            </Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
};
```

### Pattern 2: Service Card with Actions

**What:** Bottom sheet card showing service details with call/navigate buttons.

**When to use:** MAP-05, MAP-06, MAP-07 - displaying service info and actions.

**Example:**
```typescript
// Source: Industry-standard mobile service discovery UX
import { Linking, Platform } from 'react-native';

interface ServiceCardProps {
  service: Service;
  distance: number; // in km
  isOpen: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, distance, isOpen }) => {
  const handleCall = () => {
    const phoneNumber = service.phone?.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleNavigate = () => {
    const { latitude, longitude } = service;
    const label = encodeURIComponent(service.name);
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.rating}>{service.rating?.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.distance}>{distance.toFixed(1)} km away</Text>
        <Text style={styles.status} color={isOpen ? '#66BB6A' : '#EF5350'}>
          {isOpen ? 'Open' : 'Closed'}
        </Text>
      </View>
      <View style={styles.tags}>
        <ServiceTypeTag type={service.type} />
        {service.is24Hour && <Tag icon="⏰">24hr</Tag>}
        {service.isEmergency && <Tag icon="🚨">Emergency</Tag>}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callButtonText}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
          <Text style={styles.navigateButtonText}>🧭 Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

### Pattern 3: Filter Chips UI

**What:** Horizontal scrolling chips for multi-select filtering.

**When to use:** MAP-02 - filtering by service type.

**Example:**
```typescript
// Source: Material Design filter chips pattern
const SERVICE_TYPES = [
  { id: 'vet', label: 'Vet', icon: '🏥' },
  { id: 'pet_store', label: 'Pet Store', icon: '🛒' },
  { id: 'groomer', label: 'Groomer', icon: '✂️' },
  { id: 'pharmacy', label: 'Pharmacy', icon: '💊' },
  { id: 'emergency_clinic', label: 'Emergency', icon: '🚨' },
];

interface FilterChipsProps {
  selectedTypes: string[];
  onToggle: (typeId: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ selectedTypes, onToggle }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
      {SERVICE_TYPES.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[styles.chip, selectedTypes.includes(type.id) && styles.chipSelected]}
          onPress={() => onToggle(type.id)}
        >
          <Text style={styles.chipIcon}>{type.icon}</Text>
          <Text style={[styles.chipLabel, selectedTypes.includes(type.id) && styles.chipLabelSelected]}>
            {type.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
```

### Pattern 4: Server-Side Caching

**What:** Proxy Google Places API through backend with in-memory caching.

**When to use:** MAP-01 - handling API rate limits per ROADMAP research flag.

**Example:**
```typescript
// Source: Backend API caching best practices
import NodeCache from 'node-cache';

class CacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 300) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: 60,
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl);
  }

  invalidate(key: string): number {
    return this.cache.del(key);
  }

  generateKey(lat: number, lng: number, filters: object): string {
    return `services:${lat.toFixed(4)}:${lng.toFixed(4)}:${JSON.stringify(filters)}`;
  }
}

export const cacheService = new CacheService(300); // 5 min TTL

// In services.controller.ts
export async function getServices(req: Request, res: Response) {
  const { lat, lng, radius = 5000, types, is24Hour, isEmergency } = req.query;
  const filters = { types, is24Hour, isEmergency };
  const cacheKey = cacheService.generateKey(Number(lat), Number(lng), filters);

  // Check cache first
  const cached = cacheService.get<ServicesResponse>(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  // Query Google Places API
  const services = await googlePlacesService.searchNearby(lat, lng, radius, filters);

  const response = {
    services,
    cached: false,
    cacheExpiry: new Date(Date.now() + 300000).toISOString(), // 5 min
  };

  // Store in cache
  cacheService.set(cacheKey, response);

  return res.json(response);
}
```

### Pattern 5: Distance Calculation (Haversine)

**What:** Calculate distance between two coordinates using Haversine formula.

**When to use:** MAP-05 - displaying distance from user to service.

**Example:**
```typescript
// Source: Geographic distance calculation
const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

// Usage: Sort services by distance
services.sort((a, b) => {
  const distA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
  const distB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
  return distA - distB;
});
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Map rendering | Custom map view using WebView | react-native-maps | Handles native performance, gesture handling, marker clustering |
| Location permission handling | Custom permission flow | @react-native-community/geolocation | Handles all platform-specific permission dialogs |
| Distance calculation | Custom Haversine implementation | geolib library | Tested, handles edge cases (antipodal points, poles) |
| API rate limiting | Direct client-side Google API calls | Server-side proxy with caching | Protects API keys, reduces quota usage |
| Navigation intent | Custom URL schemes | Linking.openURL | Works across both iOS and Android |

**Key insight:** Google Places API has strict quotas (Basic: 28,000 requests/month free, 28,000-1,000,000 at $0.032/1000). Server-side caching with 5-minute TTL dramatically reduces API calls while providing fresh enough data for pet services.

## Common Pitfalls

### Pitfall 1: Map Shows Blank/Gray Screen
**What goes wrong:** Map fails to render, showing gray or blank area.
**Why it happens:** Missing Google Maps API key, API key restrictions wrong, or play-services-maps not installed.
**How to avoid:** Verify API key has Maps SDK enabled, check AndroidManifest meta-data, ensure play-services-maps:18.2.0 in build.gradle.
**Warning signs:** Logs show "Google Maps API error: INVALID_REQUEST" or blank map on first load.

### Pitfall 2: Location Permission Denied Causes Crash
**What goes wrong:** App crashes when location permission denied.
**Why it happens:** Not handling permission denial gracefully.
**How to avoid:** Check permission status before accessing location, show explanation UI, fallback to manual location entry.
**Warning signs:** "Location permission denied" logs, app closes immediately after map load.

### Pitfall 3: Too Many Markers Causes Performance Issues
**What goes wrong:** Map becomes sluggish with 100+ service markers.
**Why it happens:** Each marker is a native view, too many overwhelms the rendering thread.
**How to avoid:** Implement marker clustering for dense areas, limit initial fetch to 50 results, paginate on zoom.
**Warning signs:** Map scrolls at <30fps, marker taps have 500ms+ delay.

### Pitfall 4: Cache Stampede on TTL Expiry
**What goes wrong:** Multiple requests simultaneously hit expired cache, overwhelming Google API.
**Why it happens:** All cached items expire at same time, burst of requests.
**How to avoid:** Add jitter to TTL (e.g., actual TTL = configuredTTL + random(0, 60)), use staggered cache invalidation.
**Warning signs:** High latency spike every 5 minutes (cache TTL), API quota warnings.

### Pitfall 5: Distance Calculation Inaccurate for Short Distances
**What goes wrong:** "0.0 km away" shown for services that are actually 100m away.
**Why it happens:** Truncation/rounding issues in distance display.
**How to avoid:** Format distances appropriately (meters for <1km, km for >=1km), use sufficient decimal precision.
**Warning signs:** User complaints "service is closer than shown".

## Code Examples

### Services Map Screen (MAP-01)

```typescript
// Source: Phase 4 implementation pattern
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useServicesStore } from '../stores/servicesStore';
import { useLocation } from '../hooks/useLocation';
import { ServiceCard } from '../components/ServiceCard';
import { FilterBar } from '../components/FilterBar';

export function ServicesMapScreen(): JSX.Element {
  const { location, error: locationError } = useLocation();
  const { services, selectedService, setSelectedService, filters } = useServicesStore();

  const handleMarkerPress = (service: Service) => {
    setSelectedService(service);
  };

  if (locationError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Location access required</Text>
        <Text style={styles.errorSubtext}>{locationError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude ?? 37.5665,
          longitude: location?.longitude ?? 126.9780,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {services.map((service) => (
          <Marker
            key={service.id}
            coordinate={{ latitude: service.latitude, longitude: service.longitude }}
            onPress={() => handleMarkerPress(service)}
          >
            <ServiceMarker service={service} isSelected={selectedService?.id === service.id} />
          </Marker>
        ))}
      </MapView>

      <FilterBar />

      {selectedService && (
        <View style={styles.cardContainer}>
          <ServiceCard service={selectedService} />
        </View>
      )}
    </View>
  );
}
```

### Google Places API Response Structure

```typescript
// Source: Google Places API documentation
interface GooglePlacesResponse {
  results: {
    place_id: string;
    name: string;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    formatted_phone_number?: string;
    rating?: number;
    user_ratings_total?: number;
    opening_hours?: {
      open_now: boolean;
      periods?: {
        open: { day: number; time: string };
        close: { day: number; time: string };
      }[];
    };
    types: string[]; // e.g., ['veterinary_care', 'pet_store', 'store']
  }[];
  status: string;
}

// Map Google types to our types
const TYPE_MAPPING: Record<string, Service['type']> = {
  veterinary_care: 'vet',
  pet_store: 'pet_store',
  pet_grooming: 'groomer',
  pharmacy: 'pharmacy',
  hospital: 'emergency_clinic',
};

function mapGooglePlaceToService(place: GooglePlaceResult): Service {
  return {
    id: place.place_id,
    name: place.name,
    type: mapServiceType(place.types),
    address: place.formatted_address,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    phone: place.formatted_phone_number,
    rating: place.rating,
    reviewCount: place.user_ratings_total,
    is24Hour: checkIf24Hour(place.opening_hours),
    isEmergency: place.types.includes('hospital'),
  };
}
```

### Mock Services Data

```typescript
// Source: Development mock data for Phase 4
import { Service } from '../types';

export const MOCK_SERVICES: Service[] = [
  {
    id: 'mock-1',
    name: 'Seoul Pet Medical Center',
    type: 'vet',
    address: '123 Gangnam-daero, Gangnam-gu, Seoul',
    latitude: 37.5665,
    longitude: 126.9780,
    phone: '02-1234-5678',
    rating: 4.8,
    reviewCount: 234,
    is24Hour: true,
    isEmergency: true,
  },
  {
    id: 'mock-2',
    name: 'Happy Paws Pet Store',
    type: 'pet_store',
    address: '456 Apgujeong-ro, Gangnam-gu, Seoul',
    latitude: 37.5285,
    longitude: 127.0275,
    phone: '02-2345-6789',
    rating: 4.5,
    reviewCount: 189,
    is24Hour: false,
    isEmergency: false,
  },
  {
    id: 'mock-3',
    name: 'Fluffy Grooming Salon',
    type: 'groomer',
    address: '789 Yeoksam-ro, Gangnam-gu, Seoul',
    latitude: 37.5455,
    longitude: 127.0365,
    phone: '02-3456-7890',
    rating: 4.2,
    reviewCount: 76,
    is24Hour: false,
    isEmergency: false,
  },
  {
    id: 'mock-4',
    name: 'Animal Pharmacy',
    type: 'pharmacy',
    address: '321 Sadang-ro, Dongjak-gu, Seoul',
    latitude: 37.5085,
    longitude: 126.9635,
    phone: '02-4567-8901',
    rating: 4.0,
    reviewCount: 45,
    is24Hour: true,
    isEmergency: false,
  },
  {
    id: 'mock-5',
    name: '24/7 Emergency Vet Clinic',
    type: 'emergency_clinic',
    address: '555 Olympic-ro, Songpa-gu, Seoul',
    latitude: 37.5185,
    longitude: 127.1055,
    phone: '02-5678-9012',
    rating: 4.9,
    reviewCount: 412,
    is24Hour: true,
    isEmergency: true,
  },
];
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|-------------------|--------------|--------|
| Client-side Google API | Server-side proxy with caching | 2020+ | Protects API keys, reduces quota usage |
| Native WebView maps | react-native-maps | 2016+ | Better performance, native gestures |
| Single filter dropdown | Multi-select chip UI | 2020+ | Faster filtering, visual feedback |
| Distance in miles | Smart formatting (m/km) | 2019+ | Better UX for international users |
| Hardcoded service list | Google Places API | 2018+ | Real-time data, reviews, hours |

**Deprecated/outdated:**
- Google Places API key in mobile client (security risk)
- Static map images (use interactive MapView)
- Distance as crow flies only (use actual road routing)
- Manual refresh for updated hours (cache invalidation)

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Server | ✓ | v24.13.1 | — |
| npm | Package installation | ✓ | 10.9.0 | — |
| react-native-maps | Map component | Need to install | 1.27.2 | — |
| Google Maps API | Map provider | Requires API key | — | Use mock data |
| PostgreSQL | Database | ? | — | — |

**Missing dependencies with no fallback:**
- Google Maps API Key — Required for map to show tiles, must obtain from Google Cloud Console

**Missing dependencies with fallback:**
- react-native-maps — Install via npm
- node-cache — Install via npm

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (bundled with React Native 0.76) |
| Config file | mobile/jest.config.js |
| Quick run command | `npm test -- --testPathPattern="services" --passWithNoTests` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MAP-01 | Map displays nearby services | Integration | Manual test | ❌ |
| MAP-02 | Filter by service type | Unit | `jest servicesStore.test.ts` | ❌ |
| MAP-03 | Filter by 24-hour | Unit | `jest servicesStore.test.ts` | ❌ |
| MAP-04 | Filter by emergency | Unit | `jest servicesStore.test.ts` | ❌ |
| MAP-05 | Service cards show info | Integration | Manual test | ❌ |
| MAP-06 | Call service from card | Manual | Manual test | ❌ |
| MAP-07 | Navigate to service | Manual | Manual test | ❌ |

### Wave 0 Gaps
- [ ] `mobile/src/services/__tests__/services.service.test.ts` — API calls
- [ ] `mobile/src/stores/__tests__/servicesStore.test.ts` — MAP-02, MAP-03, MAP-04
- [ ] `server/src/__tests__/services.controller.test.ts` — Caching, filtering
- [ ] `server/src/__tests__/cache.service.test.ts` — TTL, invalidation

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | Firebase Auth (existing) |
| V3 Session Management | Yes | JWT from Phase 2 |
| V4 Access Control | Yes | Users can only see public service data |
| V5 Input Validation | Yes | Validate lat/lng ranges, sanitize filter inputs |
| V6 Cryptography | Yes | HTTPS for all API calls |

### Known Threat Patterns for Maps Feature

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| API key extraction | Information Disclosure | Server-side proxy, never expose key to client |
| Location spoofing | Tampering | Validate lat/lng ranges (-90 to 90, -180 to 180) |
| Cache poisoning | Tampering | Validate cached data structure before use |
| Excessive API calls | Denial of Service | Rate limit per user, cache aggressively |

## Sources

### Primary (HIGH confidence)
- [react-native-maps npm](https://www.npmjs.com/package/react-native-maps) - Map library
- [react-native-maps GitHub](https://github.com/react-native-maps/react-native-maps) - Installation docs
- [Google Places API docs](https://developers.google.com/maps/documentation/places/web-service/overview) - API structure
- [@react-native-community/geolocation npm](https://www.npmjs.com/package/@react-native-community/geolocation) - Location package

### Secondary (MEDIUM confidence)
- [Google Maps API quotas](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing) - Rate limit info
- [Material Design filter chips](https://material.io/components/chips) - UI patterns

### Tertiary (LOW confidence)
- [Haversine formula accuracy](https://en.wikipedia.org/wiki/Haversine_formula) - Distance calculation

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | react-native-maps 1.27.2 works with RN 0.76.9 | Standard Stack | May need version adjustment |
| A2 | Google Places API covers Korean pet services adequately | Service Data | May need supplement with local data |
| A3 | 5-minute cache TTL is appropriate for service discovery | Caching | May need longer TTL if API quotas tight |
| A4 | Users prefer chip filters over dropdown | UI/UX | May need to offer both options |
| A5 | Haversine distance is sufficient for display | Distance | May need road-distance for accuracy |

## Open Questions

1. **Should we use Google Places API or a Korean-specific pet service directory?**
   - What we know: Google Places has vet, pet_store types
   - What's unclear: Coverage in rural Korea, specialized pet services
   - Recommendation: Start with Google Places, add Korean directory if coverage poor

2. **Should we implement marker clustering ourselves or rely on native?**
   - What we know: react-native-maps has built-in clustering support
   - What's unclear: Performance characteristics with 100+ markers
   - Recommendation: Use built-in clustering first, optimize if needed

3. **How should we handle the "Open Now" status?**
   - What we know: Google Places provides opening_hours.open_now
   - What's unclear: Accuracy for 24-hour services, timezone handling
   - Recommendation: Use Google data but show "Hours may vary" disclaimer

4. **Should we cache on mobile client too?**
   - What we know: Server-side cache protects API quota
   - What's unclear: Stale data risk vs bandwidth saving
   - Recommendation: Add 1-minute local cache for same-location requests

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All packages verified via npm registry
- Architecture: HIGH — Based on established React Native + Express patterns
- Pitfalls: MEDIUM — Based on general mobile development experience

**Research date:** 2026-04-19
**Valid until:** 2026-05-19 (30 days for stable stack)
