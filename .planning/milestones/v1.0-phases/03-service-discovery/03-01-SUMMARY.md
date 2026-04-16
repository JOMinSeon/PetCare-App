---
phase: 03-service-discovery
plan: '01'
subsystem: clinic-search
tags: [clinic, map, search, kakao-maps]
dependency_graph:
  requires: []
  provides:
    - ClinicContext
    - clinic.service.ts
    - ClinicSearchScreen
    - ClinicDetailScreen
  affects:
    - PetcareApp
tech_stack:
  added:
    - react-native-webview (for Kakao Maps)
    - expo-location
  patterns:
    - Context + Service architecture (following existing AuthContext, PetContext)
    - StyleSheet for styling (shadow/rounded cards)
    - expo-router file-based routing
key_files:
  created:
    - src/types/clinic.types.ts
    - src/services/clinic.service.ts
    - src/contexts/ClinicContext.tsx
    - src/components/clinic/ClinicCard.tsx
    - src/components/clinic/ClinicMap.tsx
    - app/clinic/index.tsx
    - app/clinic/[id].tsx
decisions:
  - id: D-01
    desc: Kakao Maps API used for map display via WebView
  - id: D-02
    desc: Map + List hybrid UI (map at top, FlatList below)
  - id: D-05
    desc: Context + Service pattern followed (ClinicContext + clinic.service.ts)
  - id: D-06
    desc: REST API architecture for clinic endpoints
metrics:
  duration: ~5 minutes
  completed: 2026-04-15T13:32:00Z
  tasks_completed: 4/4
---

# Phase 03 Plan 01: Clinic Search & Map Summary

**One-liner:** Kakao Maps integration with WebView showing clinic markers and FlatList hybrid UI for nearby veterinary clinic search and detail viewing.

## Completed Tasks

| Task | Name | Files | Status |
|------|------|-------|--------|
| 1 | Clinic Type Definitions | src/types/clinic.types.ts | ✅ Complete |
| 2 | ClinicContext & clinic.service.ts | src/contexts/ClinicContext.tsx, src/services/clinic.service.ts | ✅ Complete |
| 3 | ClinicCard & ClinicMap Components | src/components/clinic/ClinicCard.tsx, src/components/clinic/ClinicMap.tsx | ✅ Complete |
| 4 | ClinicSearchScreen & ClinicDetailScreen | app/clinic/index.tsx, app/clinic/[id].tsx | ✅ Complete |

## What Was Built

### Type Definitions (`src/types/clinic.types.ts`)
- `Clinic` interface with id, kakaoPlaceId, name, address, roadAddress, phone, latitude, longitude, operatingHours, rating, reviewCount
- `Booking` interface for appointment reservations
- `Review` interface for clinic reviews
- `ClinicSearchParams` interface for search parameters
- `ApiResponse<T>` generic interface for API responses

### Clinic Service (`src/services/clinic.service.ts`)
- `searchClinics()` - GET /api/clinics/search with lat/lng/radius/keyword params
- `getClinicDetails()` - GET /api/clinics/:id
- `getClinicReviews()` - GET /api/clinics/:id/reviews
- Caching support with AsyncStorage
- Auth header integration via getAuthHeader()

### Clinic Context (`src/contexts/ClinicContext.tsx`)
- State: clinics[], selectedClinic, loading, error
- Methods: searchClinicsNearby(), selectClinic(), clearError()
- Fallback to cached clinics on network error
- Follows existing PostContext/AuthContext patterns

### Components

**ClinicCard** (`src/components/clinic/ClinicCard.tsx`)
- Shadow/rounded card style (borderRadius: 12, shadowOpacity: 0.1)
- Displays: name, rating (★), reviewCount, address, phone, hours
- TouchableOpacity with onPress callback

**ClinicMap** (`src/components/clinic/ClinicMap.tsx`)
- Kakao Maps JS SDK via react-native-webview
- Dynamic marker creation for each clinic
- InfoWindow on marker click with clinic name
- WebView postMessage for marker press events
- Environment variable: EXPO_PUBLIC_KAKAO_MAP_KEY

### Screens

**ClinicSearchScreen** (`app/clinic/index.tsx`)
- expo-location for user location
- Map at top (300px height), FlatList below
- Pull-to-refresh support
- Loading state with ActivityIndicator
- Empty state with Korean text "주변 병원을 찾아보세요"
- Auto-searches on permission grant

**ClinicDetailScreen** (`app/clinic/[id].tsx`)
- Clinic info: name, rating, address, phone, hours
- Actions: 전화 걸기 (tel: link), 예약하기, 리뷰 작성 (navigation stubs)
- 지도 보기 link to Kakao Maps
- Error handling for missing clinic

## Deviations from Plan

None - plan executed exactly as written.

## Threat Surface Scan

| Flag | File | Description |
|------|------|-------------|
| None | - | No new security surface introduced |

## Verification

- ✅ All 7 files created
- ✅ Types export Clinic, Booking, Review, ClinicSearchParams, ApiResponse
- ✅ ClinicContext provides clinics, selectedClinic, searchClinicsNearby
- ✅ clinic.service.ts has searchClinics, getClinicDetails, getClinicReviews
- ✅ ClinicCard uses shadow/rounded style (borderRadius: 12, elevation: 3)
- ✅ ClinicMap uses WebView with Kakao Maps SDK
- ✅ ClinicSearchScreen shows map + FlatList hybrid
- ✅ ClinicDetailScreen shows address, phone, hours with action buttons

## Self-Check: PASSED

All files exist on disk. No verification failures.

## Notes

- Kakao Maps requires `EXPO_PUBLIC_KAKAO_MAP_KEY` environment variable
- react-native-webview must be installed for map display
- expo-location is used for user location permissions
- Booking and review screens are stubs (路由已创建但功能待实现)
