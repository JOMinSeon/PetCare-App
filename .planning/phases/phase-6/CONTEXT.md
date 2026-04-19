# Phase 6: Notifications & Launch Prep - Context

**Phase:** 6
**Goal:** App is ready for production with push notifications and offline support
**Status:** Research started

---

## User Constraints (from ROADMAP.md)

### Locked Decisions

- **Push Notification Service:** Firebase Cloud Messaging (FCM) via `@react-native-firebase/messaging` — consistent with existing Firebase stack (`@react-native-firebase/auth@24.0.0` already installed)
- **Offline Storage:** AsyncStorage (already installed as `@react-native-async-storage/async-storage@2.2.0`)
- **React Native Version:** 0.76.9
- **Tech Stack:** React Native CLI (not Expo) — native modules needed for maps/GPS/QR code

### Phase Requirements (NOTE-01, NOTE-03)

| ID | Description |
|----|-------------|
| **NOTE-01** | App sends reminder for upcoming vaccinations |
| **NOTE-03** | User can view notification history |

### Success Criteria

1. App sends push notifications for upcoming vaccination reminders
2. User can view notification history within the app
3. App caches critical data (pet profiles, medical records) for offline viewing
4. Error boundaries handle crashes gracefully with user-friendly messages
5. EAS build completes successfully for both iOS and Android

---

## Deferred Ideas (OUT OF SCOPE)

- Real-time chat with veterinarians — defer to future
- Video consultations — infrastructure cost too high for v1
- Pet social community — not core to health management value
- Marketplace/e-commerce for pet supplies — can integrate later
- Medication reminders (ADV-01) — v2 feature
- Push notifications for medication reminders — v2 feature

---

## Implementation Notes from Previous Phases

1. **Firebase Setup Complete:** Phase 2 established Firebase Auth with `@react-native-firebase/auth@24.0.0`
2. **API Service Uses AsyncStorage:** JWT token stored in AsyncStorage (api.ts)
3. **Existing Stores:** petStore, medicalRecordStore, dashboardStore need offline caching
4. **Teal Primary Color:** `#008B8B` (teal) for UI elements
5. **ReminderCard Component:** Already exists in `src/components/ReminderCard.tsx`
6. **Medical Records:** Include vaccination records with `nextDueDate` field

---

## Technical Constraints

- **iOS:** Requires APNs configuration in Firebase Console
- **Android:** Requires FCM server key configuration
- **Offline:** Must work without network for cached data
- **Build:** EAS Build for both iOS (IPA) and Android (AAB/APK)
