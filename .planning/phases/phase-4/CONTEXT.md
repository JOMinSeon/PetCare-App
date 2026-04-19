# Phase 4: Services Map - Context

**Phase:** 4
**Name:** Services Map
**Goal:** Users can find nearby pet services with filtering and direct contact
**Status:** Planning

---

## User Constraints (from CONTEXT.md)

### Locked Decisions
- React Native CLI (not Expo) — native modules required for maps/GPS/QR code
- Separate backend vs BaaS — full control over business logic
- Firebase Auth vs custom auth — faster implementation, proven security
- Node.js/Express with Prisma ORM backend
- PostgreSQL 16 database
- Zustand for React Native state management
- Teal primary color palette
- Google Maps API for location services (per ROADMAP.md)
- Server-side caching for Google Maps API rate limits (per ROADMAP.md research flag)

### the agent's Discretion
- Map UI/UX design approach (full-screen vs bottom sheet)
- Filter UI implementation (chips, dropdown, modal)
- Distance calculation library choice (Haversine formula vs geolib)
- Service card layout design
- Mock data structure for development

### Deferred Ideas (OUT OF SCOPE)
- Real-time chat with veterinarians — defer to future (requires 24/7 staffing)
- Video consultations — infrastructure cost too high for v1
- Pet social community — not core to health management value
- Marketplace/e-commerce for pet supplies — can integrate later, not differentiator

---

## Phase 4 Requirements

| ID | Description |
|----|-------------|
| MAP-01 | Map displays nearby pet services (veterinaries, pet stores) |
| MAP-02 | User can filter by service type |
| MAP-03 | User can filter by "24-hour" availability |
| MAP-04 | User can filter by "emergency service" availability |
| MAP-05 | Service cards show distance, rating, open/closed status |
| MAP-06 | User can call service directly from card |
| MAP-07 | User can open navigation to service location |

---

## Implementation Approach

### 1. Google Maps Setup (MAP-01)

#### API Keys Required
- **Google Maps API Key** with:
  - Maps SDK for Android
  - Maps SDK for iOS
  - Places API (for service search)

#### Android Configuration
1. Add to `android/app/build.gradle`:
   ```groovy
   implementation 'com.google.android.gms:play-services-maps:18.2.0'
   implementation 'com.google.android.gms:play-services-location:21.1.0'
   ```

2. Add to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
   ```

#### iOS Configuration
1. Add to `ios/Podfile`:
   ```ruby
   pod 'GoogleMaps'
   pod 'GooglePlaces'
   ```

2. Add to `ios/.../Info.plist`:
   ```xml
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>VitalPaw needs your location to find nearby pet services</string>
   <key>NSLocationAlwaysUsageDescription</key>
   <string>VitalPaw needs your location to find nearby pet services</string>
   <key>GoogleMapsAPIKey</key>
   <string>YOUR_IOS_GOOGLE_MAPS_API_KEY</string>
   ```

### 2. Service Data Model

```typescript
interface Service {
  id: string;
  name: string;
  type: 'vet' | 'pet_store' | 'groomer' | 'pharmacy' | 'emergency_clinic';
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  rating?: number;       // 0-5 stars
  reviewCount?: number;
  is24Hour: boolean;
  isEmergency: boolean;
  openingHours?: {
    [day: string]: { open: string; close: string } | null;
  };
  distance?: number;      // Calculated in km
}
```

### 3. Filter System (MAP-02, MAP-03, MAP-04)

#### Filter Types
| Filter | Type | Options |
|--------|------|---------|
| Service Type | Multi-select chips | Vet, Pet Store, Groomer, Pharmacy, Emergency Clinic |
| Availability | Single toggle | 24-hour only |
| Emergency | Single toggle | Emergency services only |

#### Filter UI
- Use horizontal scrolling chip set for service types
- Toggle switches for 24-hour and emergency filters
- Filter state managed in Zustand store

### 4. Service Cards (MAP-05, MAP-06, MAP-07)

#### Card Layout
```
┌─────────────────────────────────────────┐
│ [Icon] Service Name              [★4.5] │
│ 123m away • Open until 8:00 PM         │
│ [icon] Vet • [icon] 24hr               │
├─────────────────────────────────────────┤
│ [📞 Call]              [🧭 Navigate]    │
└─────────────────────────────────────────┘
```

#### Actions
- **Call:** Opens phone dialer with service phone number
- **Navigate:** Opens Google Maps or Apple Maps with directions

### 5. Distance Calculation

Use Haversine formula or geolib library:
```typescript
function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  // Returns distance in kilometers
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

### 6. Server-Side Caching Strategy

Per ROADMAP.md research flag: "Map API rate limits - implement server-side caching"

#### Caching Strategy
| Layer | TTL | Purpose |
|-------|-----|---------|
| In-memory cache | 5 minutes | Reduce Places API calls |
| Redis (optional) | 15 minutes | Distributed cache for multi-instance |
| Database cache | 1 hour | Persist service data |

#### Implementation
- Proxy Google Places API through backend
- Cache responses in memory using node-cache
- Return cached data if within TTL
- Invalidate cache on filter changes

### 7. Mock Data for Development

Create mock service data for local development:
```typescript
const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Seoul Pet Hospital',
    type: 'vet',
    address: '123 Gangnam-ro, Gangnam-gu, Seoul',
    latitude: 37.5665,
    longitude: 126.9780,
    phone: '02-1234-5678',
    rating: 4.8,
    reviewCount: 234,
    is24Hour: true,
    isEmergency: true,
  },
  // ... more mock services
];
```

---

## Data Flow Diagrams

### Service Discovery Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ User        │     │ Mobile      │     │ Backend     │
│ Location    │     │ App         │     │ Server      │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                  │
       │ Watch position    │                  │
       │──────────────────>│                  │
       │                   │                  │
       │                   │ GET /api/services│
       │                   │  ?lat=&lng=&filters
       │                   │─────────────────>│
       │                   │                  │
       │                   │                  │ Check cache
       │                   │                  │ ───────────
       │                   │                  │  HIT → Return cached
       │                   │                  │  MISS → Query Places API
       │                   │                  │           │
       │                   │                  │<──────────
       │                   │                  │
       │                   │ { services[] }   │
       │                   │<─────────────────│
       │                   │                  │
       │  Render map with  │                  │
       │  service markers  │                  │
       │<──────────────────│                  │
```

### Filter Update Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ User        │     │ Filter      │     │ Zustand     │
│ taps filter │     │ Store       │     │ Store       │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                  │
       │ Toggle filter     │                  │
       │──────────────────>│                  │
       │                   │ Update state     │
       │                   │────────────────>│
       │                   │                  │
       │                   │ Fetch filtered   │
       │                   │ services         │
       │                   │─────────────────>│
       │                   │                  │
       │  Re-render map    │                  │
       │<──────────────────│                  │
```

---

## File Structure

### Mobile (mobile/src)
```
├── screens/
│   └── services/
│       └── ServicesMapScreen.tsx    # Main map screen
├── components/
│   ├── ServiceCard.tsx              # Service list item with actions
│   ├── ServiceMarker.tsx            # Custom map marker
│   ├── FilterChips.tsx             # Service type filter chips
│   └── FilterBar.tsx               # Combined filter UI
├── stores/
│   └── servicesStore.ts             # Service list, filters, selection
├── services/
│   └── services.service.ts          # API calls to backend
├── hooks/
│   └── useLocation.ts               # User location hook
└── utils/
    └── distance.ts                  # Haversine distance calculation
```

### Server (server/src)
```
├── controllers/
│   └── services.controller.ts       # Service search + caching
├── services/
│   ├── googlePlaces.service.ts      # Google Places API proxy
│   └── cache.service.ts             # In-memory cache implementation
├── routes/
│   └── services.routes.ts           # Service endpoints
└── data/
    └── mockServices.ts               # Development mock data
```

---

## API Endpoints

### Service Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/services | List services with filters |
| GET | /api/services/:id | Get single service detail |

### Query Parameters
```
GET /api/services?lat=37.5665&lng=126.9780&radius=5000&types=vet,pet_store&is24Hour=true&isEmergency=true
```

### Response Format
```typescript
interface ServicesResponse {
  services: Service[];
  cached: boolean;
  cacheExpiry?: string;
}
```

---

## Dependencies

### Mobile
- react-native-maps ^1.27.2 — Map component
- @react-native-community/geolocation ^3.4.0 — GPS location
- react-native-maps-directions ^1.9.0 — Turn-by-turn directions

### Server
- node-cache ^5.1.2 — In-memory caching

### Existing (already installed)
- @react-native-async-storage/async-storage
- axios
- zustand

---

## Verification Steps

### Map Display
1. Map loads and shows user location
2. Service markers appear within visible region
3. Markers clustered when zoomed out

### Filtering
1. Tapping "Vet" chip filters to show only vet markers
2. Enabling "24-hour" toggle filters to 24-hour services
3. Enabling "Emergency" toggle shows emergency clinics
4. Filters can be combined

### Service Cards
1. Tapping marker shows service card
2. Card displays: name, distance, rating, open/closed
3. "Call" button opens phone dialer
4. "Navigate" button opens maps app with directions

### Distance
1. Distance shown in km (e.g., "1.2 km away")
2. Services sorted by distance from user
3. Distance updates as user moves

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Google Maps API quota exceeded | Medium | High | Server-side caching with 5-min TTL |
| Location permission denied | Medium | Medium | Graceful fallback to manual location entry |
| Poor map performance with many markers | Low | Low | Use marker clustering |
| Mock data diverges from real API | Medium | Low | Document real API response structure |

---

## Out of Scope for Phase 4

- Push notifications for service updates
- Service reviews and ratings submission
- Service favorites/saved places
- User-submitted service information
- Integration with appointment booking
- Real-time service availability (open/closed)

---

## Environment Variables

### Mobile (.env)
```
GOOGLE_MAPS_API_KEY_ANDROID=xxx
GOOGLE_MAPS_API_KEY_IOS=xxx
```

### Server (.env)
```
GOOGLE_PLACES_API_KEY=xxx
CACHE_TTL_SECONDS=300
```
