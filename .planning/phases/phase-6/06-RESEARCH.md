# Phase 6: Notifications & Launch Prep - Research

**Researched:** 2026-04-19
**Domain:** Push Notifications, Offline Caching, Error Boundaries, EAS Build
**Confidence:** MEDIUM

## Summary

Phase 6 implements the final production readiness features: push notifications via Firebase Cloud Messaging (FCM), offline data caching, error boundaries, and EAS build configuration. The project already has Firebase Auth established, so `@react-native-firebase/messaging@24.0.0` is the natural choice for push notifications. AsyncStorage is already installed for offline caching. EAS Build can work with React Native CLI projects via the "bare workflow."

**Primary recommendation:** Use `@react-native-firebase/messaging@24.0.0` for push notifications, implement a cache-first strategy with AsyncStorage for pet profiles and medical records, use React error boundaries with a fallback UI, and configure EAS Build for both platforms.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Push Notification Service: Firebase Cloud Messaging (FCM) via `@react-native-firebase/messaging`
- Offline Storage: AsyncStorage (already installed)
- React Native Version: 0.76.9
- Tech Stack: React Native CLI (not Expo)

### Phase Requirements
- **NOTE-01:** App sends reminder for upcoming vaccinations
- **NOTE-03:** User can view notification history

### Deferred Ideas
- Medication reminders, video consultations, social features, marketplace — all v2

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|--------|---------|--------------|
| @react-native-firebase/messaging | 24.0.0 | Push notifications (FCM) | Native FCM integration, works with existing Firebase setup |
| @react-native-firebase/app | 24.0.0 | Firebase core | Required peer dependency for messaging |
| @react-native-async-storage/async-storage | 2.2.0 | Offline key-value storage | Already installed, simple API, reliable |
| eas-cli | 18.7.0 | Build automation | Official Expo tool, works with RN CLI projects |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|--------|---------|-------------|
| expo-build-properties | 55.0.13 | Manage native versions | If Expo modules needed for FCM |
| react-native-safe-modules | latest | Safe native module loading | For mixing Expo modules in RN CLI |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @react-native-firebase/messaging | Expo Notifications (expo-notifications) | Expo Notifications requires Expo modules; @react-native-firebase/messaging is native and lighter for CLI projects |
| AsyncStorage | WatermelonDB / SQLite | AsyncStorage is simpler for key-value caching; WatermelonDB better for complex offline-first apps |
| EAS Build | GitHub Actions + fastlane | EAS is easier to configure but ties to Expo/EAS infrastructure |

**Installation:**
```bash
cd mobile
npm install @react-native-firebase/messaging@24.0.0
npm install @react-native-async-storage/async-storage@2.2.0
npm install -g eas-cli
```

**Version verification:**
```bash
npm view @react-native-firebase/messaging version   # 24.0.0
npm view eas-cli version                             # 18.7.0
```

---

## Architecture Patterns

### Recommended Project Structure
```
mobile/src/
├── services/
│   ├── notificationService.ts    # FCM push handling
│   ├── cacheService.ts           # Offline data caching
│   └── syncService.ts            # Data synchronization
├── stores/
│   ├── notificationStore.ts      # Notification history
│   └── cacheStore.ts             # Cache metadata
├── hooks/
│   ├── useNotifications.ts       # Notification permissions/handling
│   └── useOfflineSync.ts         # Offline data sync
├── components/
│   ├── ErrorBoundary.tsx         # Global error boundary
│   └── OfflineBanner.tsx         # Offline status indicator
├── screens/
│   ├── notifications/
│   │   └── NotificationHistoryScreen.tsx
│   └── settings/
│       └── NotificationSettingsScreen.tsx
└── App.tsx                       # Error boundary wrapper
```

### Pattern 1: Firebase Cloud Messaging (FCM) Setup
**What:** Native push notification integration with FCM
**When to use:** For vaccination reminders and in-app alerts
**Example:**
```typescript
// Source: @react-native-firebase/messaging documentation
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                  authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

// Handle foreground messages
messaging().onMessage(async remoteMessage => {
  // Show in-app notification
});

// Handle background/quit state messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Handle background notification
});
```

### Pattern 2: Offline Cache Strategy
**What:** Cache-first data fetching with AsyncStorage
**When to use:** For pet profiles, medical records, health data
**Example:**
```typescript
// Source: React Native AsyncStorage best practices
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

async function getCachedData<T>(key: string): Promise<T | null> {
  const cached = await AsyncStorage.getItem(key);
  if (!cached) return null;

  const entry: CacheEntry<T> = JSON.parse(cached);
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    await AsyncStorage.removeItem(key);
    return null;
  }
  return entry.data;
}

async function setCachedData<T>(key: string, data: T): Promise<void> {
  const entry: CacheEntry<T> = { data, timestamp: Date.now() };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
}
```

### Pattern 3: Error Boundary with Fallback UI
**What:** React error boundary catching crashes with user-friendly message
**When to use:** Global app wrapper, critical screens
**Example:**
```typescript
// Source: React Native error boundary pattern
import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View style={styles.container}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry for the inconvenience. Please try again.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  message: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  button: {
    backgroundColor: '#008B8B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
```

### Pattern 4: EAS Build Configuration
**What:** Expo Application Services for building iOS and Android
**When to use:** Production builds for both platforms
**Example:**
```json
// Source: EAS Build documentation (eas.json)
{
  "cli": {
    "version": ">= 18.7.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./path/to/api-xxx-xxx.json",
        "track": "production"
      },
      "ios": {
        "appleId": "your-apple-id@example.com"
      }
    }
  }
}
```

### Anti-Patterns to Avoid

- **Don't use `notifee` for FCM:** It's a separate service, not needed since @react-native-firebase/messaging handles FCM natively
- **Don't cache sensitive data unencrypted:** Medical records are sensitive — avoid storing raw sensitive data in AsyncStorage
- **Don't skip error boundaries:** React Native crashes are silent in production without boundaries
- **Don't build locally for production:** Use EAS Build for consistent, reproducible builds

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Push notifications | Custom notification service | @react-native-firebase/messaging | Handles FCM, APNs, permissions, tokens automatically |
| Key-value caching | Custom file-based cache | AsyncStorage | Built-in, fast, handles serialization |
| Error handling | Try-catch everywhere | Error boundaries | Catches rendering errors, shows fallback UI |
| Production builds | Local Xcode/Android Studio | EAS Build | Reproducible, CI-friendly, handles signing |

**Key insight:** Push notification infrastructure is complex (device tokens, topics, background handling). The Firebase SDK handles all of this. Building custom would require maintaining FCM/APNs protocols.

---

## Common Pitfalls

### Pitfall 1: FCM Permission on iOS
**What goes wrong:** Notifications don't appear on iOS even after setup
**Why it happens:** iOS requires explicit permission request and APNs configuration in Firebase Console
**How to avoid:** Call `messaging().requestPermission()` on app start, configure APNs in Firebase Console with auth keys
**Warning signs:** iOS simulator shows notifications but real device doesn't, or vice versa

### Pitfall 2: Cache Invalidation Issues
**What goes wrong:** Users see stale data after updates
**Why it happens:** Cache TTL too long or no invalidation on server-side changes
**How to avoid:** Use shorter TTL for frequently changing data (24h), implement pull-to-refresh, clear cache on logout
**Warning signs:** Health scores don't update, reminders show wrong dates

### Pitfall 3: EAS Build Missing Credentials
**What goes wrong:** EAS Build fails with credential errors
**Why it happens:** iOS distribution证书/描述文件未配置，Android keystore未设置
**How to avoid:** Run `eas credentials` before first build, store credentials in EAS servers
**Warning signs:** "No credentials found for iOS" or "Android keystore not found"

### Pitfall 4: Notification Payload Size
**What goes wrong:** Large notification payloads fail to deliver
**Why it happens:** FCM payload limit is 4KB for notification + data combined
**How to avoid:** Send minimal data in push, fetch full content in-app when user taps notification
**Warning signs:** Some notifications arrive, others don't (especially with attachments)

---

## Code Examples

### Notification Service (Vaccination Reminders)
```typescript
// Source: @react-native-firebase/messaging pattern
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationRecord {
  id: string;
  type: 'vaccination' | 'checkup' | 'system';
  title: string;
  body: string;
  data: Record<string, string>;
  timestamp: string;
  read: boolean;
}

const NOTIFICATION_HISTORY_KEY = '@notifications_history';

export const notificationService = {
  async requestPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
           authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  },

  async getFcmToken(): Promise<string | null> {
    return messaging().getToken();
  },

  async saveNotificationToHistory(notification: NotificationRecord): Promise<void> {
    const history = await this.getNotificationHistory();
    history.unshift(notification);
    // Keep only last 100 notifications
    const trimmed = history.slice(0, 100);
    await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(trimmed));
  },

  async getNotificationHistory(): Promise<NotificationRecord[]> {
    const stored = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async markAsRead(notificationId: string): Promise<void> {
    const history = await this.getNotificationHistory();
    const updated = history.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(updated));
  },
};
```

### Cache Service for Pet Profiles
```typescript
// Source: AsyncStorage best practices
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../stores/petStore';
import { MedicalRecord } from '../services/medicalRecord.service';

const CACHE_KEYS = {
  PETS: '@cache:pets',
  MEDICAL_RECORDS: (petId: string) => `@cache:medical:${petId}`,
  LAST_SYNC: '@cache:lastSync',
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const cacheService = {
  async getPets(): Promise<Pet[] | null> {
    return this.get<Pet[]>(CACHE_KEYS.PETS);
  },

  async setPets(pets: Pet[]): Promise<void> {
    return this.set(CACHE_KEYS.PETS, pets);
  },

  async getMedicalRecords(petId: string): Promise<MedicalRecord[] | null> {
    return this.get<MedicalRecord[]>(CACHE_KEYS.MEDICAL_RECORDS(petId));
  },

  async setMedicalRecords(petId: string, records: MedicalRecord[]): Promise<void> {
    return this.set(CACHE_KEYS.MEDICAL_RECORDS(petId), records);
  },

  async get<T>(key: string): Promise<T | null> {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    try {
      const entry: CacheEntry<T> = JSON.parse(cached);
      const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;

      if (isExpired) {
        await AsyncStorage.removeItem(key);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, data: T): Promise<void> {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  },

  async clearAll(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith('@cache:'));
    await AsyncStorage.multiRemove(cacheKeys);
  },

  async clearPetCache(petId: string): Promise<void> {
    await AsyncStorage.removeItem(CACHE_KEYS.PETS);
    await AsyncStorage.removeItem(CACHE_KEYS.MEDICAL_RECORDS(petId));
  },
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Local notifications only | FCM push + local | 2020+ | Works when app is closed, cross-device |
| Manual credential management | EAS managed credentials | 2022+ | Simpler iOS/Android builds |
| Try-catch error handling | React Error Boundaries | 2016 (React) | Graceful crash recovery |

**Deprecated/outdated:**
- `react-native-push-notification` — deprecated, use @react-native-firebase/messaging
- `react-native-background-fetch` — FCM handles background messages natively
- Manual iOS provisioning — EAS handles automatically now

---

## Assumptions Log

> List all claims tagged `[ASSUMED]` in this research. The planner and discuss-phase use this section to identify decisions that need user confirmation before execution.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | @react-native-firebase/messaging@24.0.0 works with RN 0.76.9 | Standard Stack | Package compatibility issue — would need version adjustment |
| A2 | EAS Build can build RN CLI projects without Expo modules | Architecture | May need expo-build-properties or additional setup |
| A3 | AsyncStorage is sufficient for offline caching needs | Offline Strategy | May need WatermelonDB if data is too complex |
| A4 | FCM handles vaccination reminder scheduling server-side | Push Notifications | May need to implement client-side scheduling if not |

---

## Open Questions

1. **Should notification history be stored on the server or locally?**
   - What we know: AsyncStorage is available locally; server has API infrastructure
   - What's unclear: Should users see notifications across devices? Is offline-first acceptable?
   - Recommendation: Start with local-only (AsyncStorage), sync to server later if needed

2. **How should EAS credentials be managed?**
   - What we know: EAS can store credentials on its servers
   - What's unclear: Who has access, what's the backup plan if EAS is down?
   - Recommendation: Use EAS credential storage for simplicity, export backup copies

3. **What's the notification payload structure for vaccination reminders?**
   - What we know: Reminders come from medical records with `nextDueDate`
   - What's unclear: Should reminders be scheduled locally or sent via FCM topic?
   - Recommendation: Use FCM scheduled messages with topic subscription per pet

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | EAS CLI, mobile builds | ✓ | >=18 | — |
| npm | Package installation | ✓ |bundled | — |
| Java (JDK) | Android builds | ? | — | Install if missing |
| Xcode | iOS builds (macOS only) | ? | — | EAS for cloud build |
| EAS CLI | Production builds | ✗ | — | Install via npm |
| Firebase Console | FCM setup | web access | — | Required |

**Missing dependencies with no fallback:**
- EAS CLI (`npm install -g eas-cli`) — required for builds
- Firebase Console configuration (google-services.json, GoogleService-Info.plist) — required for FCM

**Missing dependencies with fallback:**
- Xcode (macOS only) — EAS provides cloud iOS builds if local Xcode unavailable

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (already in project) |
| Config file | `jest.config.js` (if exists) or `package.json` jest section |
| Quick run command | `npm test -- --testPathPattern="notification\|cache\|error" --passWithNoTests` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| NOTE-01 | Push notification sent for vaccination reminder | unit | `npm test -- --testPathPattern="notificationService" --passWithNoTests` | ❌ Wave 0 |
| NOTE-03 | Notification history viewable in app | unit | `npm test -- --testPathPattern="NotificationHistoryScreen" --passWithNoTests` | ❌ Wave 0 |
| — | Offline cache for pet profiles | unit | `npm test -- --testPathPattern="cacheService" --passWithNoTests` | ❌ Wave 0 |
| — | Error boundary catches render errors | unit | `npm test -- --testPathPattern="ErrorBoundary" --passWithNoTests` | ❌ Wave 0 |
| — | EAS build configuration valid | smoke | `eas build:list` or config validation | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test -- --testPathPattern="notification|notification" --passWithNoTests`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/notificationService.test.ts` — covers NOTE-01, NOTE-03
- [ ] `tests/cacheService.test.ts` — covers offline caching
- [ ] `tests/ErrorBoundary.test.tsx` — covers error handling
- [ ] `tests/setup.ts` — Jest configuration and mocks
- Framework install: `npm install --save-dev jest @testing-library/react-native` — if not detected

*(Note: Phase 6 has no existing test infrastructure — Wave 0 must create test files from scratch)*

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Firebase Auth already handles this |
| V3 Session Management | no | Firebase handles token lifecycle |
| V4 Access Control | yes | Notifications should only show for own pets |
| V5 Input Validation | yes | Notification payload validation |
| V6 Cryptography | partial | Cache encryption for medical records |

### Known Threat Patterns for Push Notifications

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Fake notifications impersonating app | Spoofing | FCM only sends from authenticated servers |
| Notification payload injection | Tampering | Validate payload structure before rendering |
| Cached medical data exposure | Information Disclosure | Don't cache sensitive data unencrypted |
| Notification history tampering | Tampering | Store hash of notification content for integrity |

---

## Sources

### Primary (HIGH confidence)
- @react-native-firebase/messaging npm page — version, peer deps, API
- React Native AsyncStorage documentation — caching patterns
- EAS Build documentation (docs.expo.dev) — build configuration

### Secondary (MEDIUM confidence)
- React Native error boundary patterns — community best practices
- FCM documentation — payload limits, background handling

### Tertiary (LOW confidence)
- Specific EAS CLI bare workflow steps — may need verification

---

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - library versions verified via npm, but some patterns assumed from training data
- Architecture: MEDIUM - patterns are standard React/React Native, but specific implementation details need verification
- Pitfalls: MEDIUM - common issues identified, but may be incomplete

**Research date:** 2026-04-19
**Valid until:** 2026-05-19 (30 days for stable domains)
