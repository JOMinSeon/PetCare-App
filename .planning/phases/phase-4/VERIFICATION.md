---
phase: 4-services-map
verified: 2026-04-19T00:00:00Z
status: gaps_found
score: 4/7 criteria fully verified
overrides_applied: 0
gaps:
  - truth: "User can filter to show only 24-hour availability services"
    status: failed
    reason: "Filter logic exists in servicesStore (is24HourOnly) but no UI control exists to toggle this filter"
    artifacts:
      - path: "mobile/src/screens/map/ServicesMapScreen.tsx"
        issue: "Only FilterChips is rendered (line 173-176), no is24HourOnly toggle UI"
      - path: "mobile/src/stores/servicesStore.ts"
        issue: "Filter logic exists (line 88-90) but setFilters is never called with is24HourOnly from UI"
    missing:
      - "Add is24HourOnly toggle (e.g., Switch or Checkbox) in filter UI"
      - "Connect toggle to servicesStore.setFilters({ is24HourOnly: true/false })"
  - truth: "User can filter to show only emergency service providers"
    status: failed
    reason: "Filter logic exists in servicesStore (emergencyOnly) but no UI control exists to toggle this filter"
    artifacts:
      - path: "mobile/src/screens/map/ServicesMapScreen.tsx"
        issue: "Only FilterChips is rendered (line 173-176), no emergencyOnly toggle UI"
      - path: "mobile/src/stores/servicesStore.ts"
        issue: "Filter logic exists (line 92-95) but setFilters is never called with emergencyOnly from UI"
    missing:
      - "Add emergencyOnly toggle (e.g., Switch or Checkbox) in filter UI"
      - "Connect toggle to servicesStore.setFilters({ emergencyOnly: true/false })"
  - truth: "Service cards display distance from user, rating, and open/closed status"
    status: partial
    reason: "Distance and rating are displayed, but open/closed status is not computed or shown"
    artifacts:
      - path: "mobile/src/components/map/ServiceCard.tsx"
        issue: "Card displays distance (line 109-113) and rating (line 96-104), but no open/closed status"
      - path: "mobile/src/types/index.ts"
        issue: "Service interface has openingHours (line 47-49) but no isOpen computed field"
    missing:
      - "Add function to compute isOpen from openingHours based on current time"
      - "Display 'Open' or 'Closed' status in ServiceCard status row"
---

# Phase 4: Services Map Verification Report

**Phase Goal:** Users can find nearby pet services with filtering and direct contact
**Verified:** 2026-04-19
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Success Criteria Verification

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Map displays nearby pet services within search radius | ✅ PASS | `ServicesMapScreen.tsx:58` - radius: 10000 (10km), markers rendered at lines 154-168 |
| 2 | User can filter map results by service type | ✅ PASS | `FilterChips.tsx:79-91` - type filter chips, `servicesStore.ts:57-69` - toggleServiceType |
| 3 | User can filter to show only 24-hour availability | ❌ FAIL | Store has logic (`servicesStore.ts:88-90`) but **no UI toggle exists** |
| 4 | User can filter to show only emergency providers | ❌ FAIL | Store has logic (`servicesStore.ts:92-95`) but **no UI toggle exists** |
| 5 | Service cards display distance, rating, open/closed | ⚠️ PARTIAL | Distance ✅ `ServiceCard.tsx:109-113`, Rating ✅ `ServiceCard.tsx:96-104`, **Open/Closed ❌** |
| 6 | User can tap to call service directly from card | ✅ PASS | `ServiceCard.tsx:61-66` - handleCall uses Linking.openURL(`tel:${phoneNumber}`) |
| 7 | User can tap to open navigation to service | ✅ PASS | `ServiceCard.tsx:68-80` - handleNavigate opens maps app via geo:/maps: URL |

**Score:** 4/7 criteria fully verified

---

## Gaps Summary

### Gap 1: Missing 24-Hour Filter Toggle

**Root Cause:** The filter state `is24HourOnly` exists in `servicesStore.ts` and filtering logic works (lines 88-90), but no UI component exposes this toggle to users.

**Current State:**
- `ServicesMapScreen.tsx` only renders `FilterChips` component (lines 171-177)
- `FilterChips` only handles service type filtering via `onToggleType`
- No component renders an is24HourOnly toggle

**Required Fix:**
1. Add is24HourOnly toggle UI (Switch or Checkbox) to filter area
2. Wire toggle to `servicesStore.setFilters({ is24HourOnly: true/false })`

**Suggested Location:** Below or near FilterChips in `ServicesMapScreen.tsx`

---

### Gap 2: Missing Emergency Filter Toggle

**Root Cause:** Same as Gap 1 - `emergencyOnly` exists in store but no UI control.

**Required Fix:**
1. Add emergencyOnly toggle UI (Switch or Checkbox) to filter area
2. Wire toggle to `servicesStore.setFilters({ emergencyOnly: true/false })`

---

### Gap 3: Missing Open/Closed Status Display

**Root Cause:** `ServiceCard` displays `is24Hour` and `isEmergency` tags but does not compute or display whether the service is currently open based on `openingHours`.

**Current State:**
- `Service` type has `openingHours?: { [day: string]: { open: string; close: string } | null }`
- Mock data (`mockServices.ts`) does not include `openingHours` data
- `ServiceCard.tsx` lines 116-127 show tags for 24hr and emergency, but no "Open Now" / "Closed" status

**Required Fix:**
1. Add `isOpen` computation based on current day/time and `openingHours`
2. Display "Open until X" or "Closed" status in ServiceCard
3. Color-code: green for Open, red for Closed

---

## Passed Criteria Details

### Criterion 1: Map Display ✅

**Evidence:**
- `ServicesMapScreen.tsx:58` - Fetches services with 10km radius
- `ServicesMapScreen.tsx:154-168` - Renders Marker components for filteredServices
- `ServiceMarker.tsx` - Custom marker icons by service type

### Criterion 2: Service Type Filtering ✅

**Evidence:**
- `FilterChips.tsx:63-91` - Renders horizontal scrollable chips for all 5 service types
- `servicesStore.ts:57-69` - toggleServiceType adds/removes types from filter
- `servicesStore.ts:83-85` - getFilteredServices filters by selected types

### Criterion 6: Call Action ✅

**Evidence:**
- `ServiceCard.tsx:61-66`:
```typescript
const handleCall = () => {
  if (service.phone) {
    const phoneNumber = service.phone.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  }
};
```

### Criterion 7: Navigation Action ✅

**Evidence:**
- `ServiceCard.tsx:68-80`:
```typescript
const handleNavigate = () => {
  if (Platform.OS === 'ios') {
    url = `maps:0,0?q=${label}@${latitude},${longitude}`;
  } else {
    url = `geo:0,0?q=${latitude},${longitude}(${label})`;
  }
  Linking.openURL(url);
};
```

---

## Files Verified

| File | Path | Status |
|------|------|--------|
| ServicesMapScreen | `mobile/src/screens/map/ServicesMapScreen.tsx` | ✅ Core map screen |
| ServiceCard | `mobile/src/components/map/ServiceCard.tsx` | ⚠️ Missing open/closed |
| FilterChips | `mobile/src/components/map/FilterChips.tsx` | ✅ Type filters only |
| servicesStore | `mobile/src/stores/servicesStore.ts` | ✅ Filter logic complete |
| service.controller | `server/src/controllers/service.controller.ts` | ✅ API complete |
| mockServices | `server/src/data/mockServices.ts` | ✅ 8 mock services |

---

## Recommendations

1. **Create FilterBar component** combining FilterChips + 24-hour toggle + emergency toggle
2. **Add Switch components** for is24HourOnly and emergencyOnly in FilterBar
3. **Add isOpen computation** utility function to ServiceCard
4. **Add openingHours to mock data** for proper open/closed display

---

_Verified: 2026-04-19_
_Verifier: gsd-verifier_
