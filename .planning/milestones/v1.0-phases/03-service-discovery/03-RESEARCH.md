# Phase 3: Service Discovery - Research

**Researched:** 2026-04-15
**Phase:** 03 - Service Discovery
**Goal:** Users can find nearby veterinary clinics, book appointments, and leave reviews

---

## Domain Analysis

### Core Features
1. **Clinic Search** — Location-based search using Kakao Maps API
2. **Clinic Details** — Display address, phone, operating hours
3. **Appointment Booking** — In-app date/time selection
4. **Reviews** — Star rating (1-5) + text review

### Technology Decisions from Context

| Decision | Value | Rationale |
|----------|-------|-----------|
| D-01 | Kakao Maps API | Korean market dominant maps service |
| D-02 | Map + List Hybrid | Best UX for location search |
| D-03 | In-app Booking | No external links, direct reservation |
| D-04 | Star + Text Reviews | Standard review pattern |
| D-05 | Context + Service Pattern | Existing architecture |
| D-06 | REST API | Existing backend approach |

---

## Kakao Maps Integration

### Options for React Native

| Option | Pros | Cons |
|--------|------|------|
| react-native-kakao-maps | Native module, well-supported | Requires native setup |
| WebView with Kakao Maps JS SDK | Easy integration | Performance, no native feel |
| @react-native-mapbox/gl + custom overlay | Full control | Not Kakao-specific |

**Recommendation:** `react-native-kakao-maps` is the standard choice for Korean apps. However, for Expo SDK 54, WebView approach may be simpler if native module setup is complex.

### Kakao Maps REST API (for clinic search)

**Endpoint:** `https://dapi.kakao.com/v2/local/search/keyword.json`

**Request:**
```
Headers: Authorization: KakaoAK {REST_API_KEY}
Query: category_group_code=PM9 (pet hospital/veterinary)
```

**Response parsing:**
```typescript
interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  x: number; // longitude
  y: number; // latitude
  category_group_code: string;
  category_name: string;
}
```

### Implementation Approach

1. Use Kakao Maps JavaScript SDK in WebView for map display
2. Use Kakao REST API for keyword search (no API key needed for JS SDK)
3. Or use `@react-native-kakao/maps` native module if available

---

## Booking System Design

### Data Model

```typescript
interface Clinic {
  id: string;
  kakaoPlaceId: string;
  name: string;
  address: string;
  roadAddress: string;
  phone: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
}

interface Booking {
  id: string;
  clinicId: string;
  userId: string;
  petId: string;
  dateTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

interface Review {
  id: string;
  clinicId: string;
  userId: string;
  petId?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: Date;
}
```

### Booking Flow

1. User selects clinic from list or map
2. User taps "예약하기" (Book)
3. DateTimePicker shows (date + time slots)
4. Confirm booking → stored in backend
5. Booking confirmation shown

### DateTimePicker Options

| Library | Pros | Cons |
|---------|------|------|
| @react-native-community/datetimepicker | Native, well-supported | Limited customization |
| react-native-paper (TimePicker) | Material Design | May not fit app style |
| Custom modal with FlatList | Full control | More development |

**Recommendation:** `@react-native-community/datetimepicker` for simplicity.

---

## Review System Design

### UI Components

1. **Star Rating Input** — 5 tappable star icons (★/☆)
2. **Text Input** — Multi-line TextInput for review text
3. **Submit Button** — Saves review to backend

### Rating Display

```typescript
// Star rendering
const renderStars = (rating: number, size: number = 20) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Text key={i} style={{ color: i < rating ? '#FFD700' : '#DDD' }}>
      {i < rating ? '★' : '☆'}
    </Text>
  ));
};
```

---

## Architecture Pattern

### New Files Structure

```
src/
├── contexts/
│   └── ClinicContext.tsx      # Clinic and booking state
├── services/
│   └── clinic.service.ts      # API calls for clinics, bookings, reviews
├── types/
│   └── clinic.types.ts        # Clinic, Booking, Review interfaces
├── screens/
│   └── clinic/
│       ├── ClinicSearchScreen.tsx   # Main search screen
│       ├── ClinicDetailScreen.tsx   # Clinic details + booking
│       └── ReviewWriteScreen.tsx    # Write review
└── components/
    └── clinic/
        ├── ClinicCard.tsx           # List item component
        ├── ClinicMap.tsx            # Map with markers
        ├── StarRating.tsx          # Star rating input/display
        └── BookingModal.tsx        # Date/time selection
```

### API Endpoints (Backend)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/clinics/search` | Search clinics by keyword/location |
| GET | `/api/clinics/:id` | Get clinic details |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Get user's bookings |
| DELETE | `/api/bookings/:id` | Cancel booking |
| GET | `/api/clinics/:id/reviews` | Get clinic reviews |
| POST | `/api/clinics/:id/reviews` | Submit review |

---

## Validation Architecture

### Phase 3 Validation

**Dimension 8 (Nyquist):** For a maps/booking feature, validation should include:
- Manual testing of map rendering
- Manual testing of booking flow
- Review submission verification

**Verification approach:** Human-executed walkthrough of clinic search → view details → book appointment → write review

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Kakao Maps API key setup complexity | Medium | Use JS SDK WebView approach |
| DateTimePicker locale issues | Low | Use native picker with locale support |
| Booking conflict (double-booking) | Low | Backend handles with status/validation |
| No clinics in area | Medium | Show empty state with message |

---

## Recommendations for Planning

1. **Split into 2-3 plans:** Clinic search/map UI, Booking flow, Reviews
2. **Use existing patterns:** Follow PostContext/PostService pattern from Phase 2
3. **Expo-compatible:** Prefer JS-only solutions over native modules where possible
4. **Backend API:** Plan assumes REST API endpoints exist; note as assumption

