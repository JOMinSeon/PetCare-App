# Phase 2: Authentication & Pet Profiles - Research

**Researched:** 2026-04-19
**Domain:** Firebase Authentication + Pet Profile Management + JWT Token Exchange
**Confidence:** HIGH

## Summary

Phase 2 implements user authentication via Firebase Auth and complete pet profile management. The mobile app uses `@react-native-firebase/auth` v24.0.0 for authentication with email/password, exchanging Firebase ID tokens for custom backend JWTs for API access. Pet CRUD operations use the existing Prisma schema with the addition of image upload via `react-native-image-picker`. Session persistence leverages Firebase's native token handling with `onAuthStateChanged` for automatic re-authentication on app restart.

**Primary recommendation:** Use `@react-native-firebase/auth` for client-side auth, `firebase-admin` for server-side token verification, and `jsonwebtoken` for custom JWT generation. Use `react-native-image-picker` for pet photos and AsyncStorage for JWT persistence.

## Standard Stack

### Mobile Authentication
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @react-native-firebase/app | 24.0.0 | Firebase core | Required for all Firebase modules |
| @react-native-firebase/auth | 24.0.0 | Email/password auth | Official React Native Firebase auth |
| @react-native-async-storage/async-storage | 3.0.2 | Token persistence | React Native recommended storage |
| react-native-image-picker | 8.2.1 | Photo selection | Most popular RN image picker |

### Server Authentication
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| firebase-admin | 13.8.0 | Firebase token verification | Official Firebase Admin SDK |
| jsonwebtoken | 9.0.3 | Custom JWT creation | Industry standard JWT library |

### Installation

**Mobile:**
```bash
cd mobile
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-async-storage/async-storage react-native-image-picker
cd ios && pod install
```

**Server:**
```bash
cd server
npm install firebase-admin jsonwebtoken
npm install -D @types/jsonwebtoken
```

### Version Verification
| Package | Verified Version | npm Registry Date |
|---------|-----------------|------------------|
| firebase | 12.12.0 | Current latest |
| @react-native-firebase/app | 24.0.0 | Current for RN 0.76+ |
| @react-native-firebase/auth | 24.0.0 | Current for RN 0.76+ |
| firebase-admin | 13.8.0 | Current latest |
| jsonwebtoken | 9.0.3 | Current latest |
| react-native-image-picker | 8.2.1 | Current latest |
| @react-native-async-storage/async-storage | 3.0.2 | Current latest |

## Architecture Patterns

### Recommended Project Structure

```
mobile/src/
├── services/
│   ├── api.ts              # Axios instance with interceptors
│   ├── auth.service.ts      # Firebase Auth wrapper
│   └── pets.service.ts      # Pet API client
├── store/
│   ├── useAuthStore.ts     # Auth state (Zustand)
│   └── usePetStore.ts      # Pet state (Zustand)
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── SignupScreen.tsx
│   ├── pets/
│   │   ├── PetsListScreen.tsx
│   │   ├── PetDetailScreen.tsx
│   │   ├── PetEditScreen.tsx
│   │   └── AddPetScreen.tsx
│   ├── dashboard/
│   │   └── DashboardScreen.tsx
│   └── settings/
│       └── SettingsScreen.tsx
├── navigation/
│   ├── RootNavigator.tsx   # Entry point, auth state routing
│   ├── AuthNavigator.tsx  # Unauthenticated stack
│   └── MainNavigator.tsx   # Authenticated stack + tabs
└── components/
    ├── PetCard.tsx
    ├── SpeciesIcon.tsx
    └── ConfirmDialog.tsx

server/src/
├── controllers/
│   ├── auth.controller.ts
│   └── pets.controller.ts
├── middleware/
│   ├── auth.middleware.ts  # JWT verification
│   └── error.middleware.ts
├── routes/
│   ├── auth.routes.ts
│   └── pets.routes.ts
├── services/
│   ├── auth.service.ts     # Token exchange logic
│   └── firebase.service.ts # Firebase admin wrapper
└── utils/
    └── jwt.ts              # JWT sign/verify helpers
```

### Pattern 1: Firebase Auth State Management

**What:** Use `onAuthStateChanged` to subscribe to authentication state changes, storing user data in Zustand.

**When to use:** Every screen needs to know if user is authenticated.

**Example:**
```typescript
// mobile/src/store/useAuthStore.ts
import { create } from 'zustand';
import { getAuth, onAuthStateChanged, User } from '@react-native-firebase/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    const auth = getAuth();
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        set({ user, isAuthenticated: !!user, isLoading: false });
        resolve();
        unsubscribe();
      });
    });
  },

  logout: async () => {
    await signOut(getAuth());
    set({ user: null, isAuthenticated: false });
  },
}));
```

**Source:** [Firebase React Native Auth Usage](https://rnfirebase.io/auth/usage) - Verified pattern from official docs

### Pattern 2: Token Exchange Flow

**What:** Exchange Firebase ID token for custom backend JWT on login.

**When to use:** When backend API needs its own authentication tokens.

**Flow:**
1. Client authenticates with Firebase → gets Firebase ID token
2. Client sends ID token to `/api/auth/login`
3. Server verifies ID token with `firebase-admin.auth().verifyIdToken()`
4. Server creates custom JWT with user info → returns to client
5. Client uses custom JWT for all subsequent API calls

**Example (Server):**
```typescript
// server/src/services/auth.service.ts
import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export async function exchangeToken(idToken: string) {
  // Verify Firebase token
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const { uid, email } = decodedToken;

  // Find or create user in database
  let user = await prisma.user.findUnique({ where: { firebaseUid: uid } });
  if (!user) {
    user = await prisma.user.create({
      data: { firebaseUid: uid, email: email! },
    });
  }

  // Create custom JWT
  const token = jwt.sign(
    { userId: user.id, firebaseUid: uid, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token, user };
}
```

**Source:** [Firebase Admin Verify ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens) - Official Firebase documentation

### Pattern 3: JWT Middleware for API Protection

**What:** Express middleware that verifies JWT from Authorization header.

**When to use:** All protected API routes.

**Example:**
```typescript
// server/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  firebaseUid?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      firebaseUid: string;
    };
    req.userId = decoded.userId;
    req.firebaseUid = decoded.firebaseUid;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Pattern 4: Pet CRUD with Image Upload

**What:** Handle pet creation with multipart/form-data for image upload.

**When to use:** Creating pets with photos.

**Example (Mobile):**
```typescript
// mobile/src/services/pets.service.ts
import { Platform } from 'react-native';
import axios from 'axios';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

export async function addPetWithPhoto(petData: PetInput, photoUri: string) {
  const formData = new FormData();

  formData.append('name', petData.name);
  formData.append('species', petData.species);
  formData.append('breed', petData.breed || '');
  formData.append('birthDate', petData.birthDate?.toISOString() || '');
  formData.append('weight', String(petData.weight || 0));

  if (photoUri) {
    const filename = photoUri.split('/').pop()!;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('photo', {
      uri: Platform.OS === 'ios' ? photoUri.replace('file://', '') : photoUri,
      name: filename,
      type,
    } as any);
  }

  const response = await axios.post('/api/pets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}
```

### Pattern 5: Species Icon Component

**What:** Render species-appropriate emoji icons.

**When to use:** Displaying pet type in lists and detail views.

**Example:**
```typescript
// mobile/src/components/SpeciesIcon.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';

const SPECIES_EMOJI: Record<Species, string> = {
  dog: '🐕',
  cat: '🐈',
  bird: '🐦',
  rabbit: '🐰',
  fish: '🐟',
  other: '🐾',
};

interface SpeciesIconProps {
  species: Species;
  size?: number;
}

export function SpeciesIcon({ species, size = 24 }: SpeciesIconProps) {
  const emoji = SPECIES_EMOJI[species] || SPECIES_EMOJI.other;

  return (
    <Text style={[styles.icon, { fontSize: size }]}>
      {emoji}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
```

### Pattern 6: Auth-Aware Navigation

**What:** Root navigator that conditionally renders auth or main stack based on authentication state.

**When to use:** Initial app load, determining user's navigation context.

**Example:**
```typescript
// mobile/src/navigation/RootNavigator.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export function RootNavigator() {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return null; // Or splash screen
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| User authentication | Custom auth with password hashing | Firebase Auth | Proven security, handles token refresh automatically |
| Token verification | Custom token parsing | firebase-admin SDK | Official Firebase token verification |
| JWT creation | Custom token signing | jsonwebtoken | Industry standard, well-tested |
| Image selection | Custom native module | react-native-image-picker | Handles permissions, cropping, compression |
| Session persistence | LocalStorage with manual expiry | Firebase's onAuthStateChanged | Native SDK handles secure persistence |

**Key insight:** Authentication has complex security requirements. Firebase Auth provides battle-tested implementations for password validation, token refresh, and session management that would take months to replicate correctly.

## Common Pitfalls

### Pitfall 1: Firebase Token Expiry During Active Session
**What goes wrong:** User's Firebase token expires (1 hour) but custom JWT is still valid, causing API calls to fail when trying to verify the Firebase token on backend.
**Why it happens:** Firebase ID tokens expire in 1 hour, but we're exchanging them for 7-day custom JWTs. If we use Firebase token directly for verification, it will fail after 1 hour.
**How to avoid:** Always exchange Firebase token for custom JWT on login. The custom JWT should be what we verify on each API call, not the Firebase token.
**Warning signs:** 401 errors after ~1 hour of active use.

### Pitfall 2: Image Picker Permissions Rejected
**What goes wrong:** Photo selection silently fails or returns undefined on iOS when camera roll permission not granted.
**Why it happens:** iOS requires explicit permission requests for photo library access.
**How to avoid:** Handle permission states explicitly and show user-friendly message if denied.
**Warning signs:** Empty `assets` array in ImagePicker response.

### Pitfall 3: Double Navigation on Auth State Change
**What goes wrong:** After login, navigation attempts to go to Dashboard but auth state listener fires again, causing multiple navigation calls.
**Why it happens:** `onAuthStateChanged` fires during initialization, and login also triggers it.
**How to avoid:** Use a `isInitialized` flag to prevent handling auth state changes during initialization.
**Warning signs:** Navigation errors or stuck loading states after login.

### Pitfall 4: Form Data Not Properly Serialized for Image Upload
**What goes wrong:** Image upload succeeds but backend can't parse it, or image is corrupted.
**Why it happens:** FormData requires specific format on React Native (uri, name, type fields).
**How to avoid:** Ensure FormData append uses correct object structure with `uri`, `name`, and `type` properties.
**Warning signs:** 400 Bad Request from upload endpoint, or uploaded image can't be opened.

### Pitfall 5: Firebase Admin Not Initialized Before Use
**What goes wrong:** Server crashes with "Firebase App not initialized" when verifying tokens.
**Why it happens:** Forgetting to call `admin.initializeApp()` before using auth methods.
**How to avoid:** Initialize Firebase Admin in server startup, before any routes are registered.
**Warning signs:** "Firebase app not initialized" error on first API call.

### Pitfall 6: Pet Deletion Cascade Without Warning
**What goes wrong:** Deleting a pet removes all associated health records, symptoms, etc., without explicit user warning.
**Why it happens:** Prisma cascade delete on petId relation.
**How to avoid:** Show confirmation dialog with explicit warning about data loss before deleting pet.
**Warning signs:** Missing confirmation UI, unexpected data loss in testing.

## Code Examples

### Firebase Auth Email Sign-Up (Verified)

```typescript
// Source: https://rnfirebase.io/auth/usage#emailpassword-sign-in
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';

async function signUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      getAuth(),
      email,
      password
    );
    console.log('User account created:', userCredential.user.email);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }
    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }
    throw error;
  }
}
```

### Firebase Auth Sign-In (Verified)

```typescript
// Source: https://rnfirebase.io/auth/usage#emailpassword-sign-in
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';

async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      getAuth(),
      email,
      password
    );
    console.log('User signed in:', userCredential.user.email);
    const idToken = await userCredential.user.getIdToken();
    return idToken;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.log('No user found with this email');
    }
    if (error.code === 'auth/wrong-password') {
      console.log('Incorrect password');
    }
    throw error;
  }
}
```

### Backend Token Verification (Verified)

```typescript
// Source: https://firebase.google.com/docs/auth/admin/verify-id-tokens
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

async function verifyToken(idToken: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Token verified. UID:', decodedToken.uid);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error;
  }
}
```

### Backend JWT Creation (Verified)

```typescript
// Source: https://www.npmjs.com/package/jsonwebtoken
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: '123', email: 'user@example.com' },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

console.log('JWT created:', token);
```

### AsyncStorage for JWT Persistence

```typescript
// Source: https://react-native-async-storage.github.io/async-storage/
import AsyncStorage from '@react-native-async-storage/async-storage';

async function storeToken(token: string) {
  try {
    await AsyncStorage.setItem('jwt_token', token);
    console.log('Token stored successfully');
  } catch (error) {
    console.error('Error storing token:', error);
  }
}

async function getToken() {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}
```

### Image Picker Integration

```typescript
// Source: https://www.npmjs.com/package/react-native-image-picker
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

async function selectImage(): Promise<string | null> {
  const result: ImagePickerResponse = await launchImageLibrary({
    mediaType: 'photo',
    maxWidth: 1000,
    maxHeight: 1000,
    quality: 0.8,
  });

  if (result.didCancel) {
    return null;
  }

  if (result.errorCode) {
    console.error('Image picker error:', result.errorMessage);
    return null;
  }

  return result.assets?.[0]?.uri || null;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|-------------------|--------------|--------|
| Custom JWT auth | Firebase Auth + custom JWT exchange | 2020+ | Faster auth implementation, less security risk |
| FormData string serialization | Native FormData API | RN 0.65+ | Better file upload reliability |
| AsyncStorage for all data | Firebase persistence + AsyncStorage for JWT only | 2021+ | Simpler session management |
| Manual token refresh | Firebase handles automatically | Firebase SDK | No manual refresh logic needed |
| Local image storage | Firebase Storage / cloud storage | 2019+ | Accessible across devices |

**Deprecated/outdated:**
- Manual Firebase token refresh (now automatic)
- react-native-firebase v5.x (replaced by v6+ with autolinking)
- LocalStorage for auth state (use Firebase's built-in persistence)

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Server | ✓ | v24.13.1 | — |
| npm | Package installation | ✓ | 10.9.0 | — |
| PostgreSQL | Database | ? | — | Install PostgreSQL 16 |
| Firebase project | Auth + Storage | ? | — | Create at console.firebase.google.com |
| iOS Simulator | iOS testing | ? | — | macOS required |
| Android Emulator | Android testing | ? | — | Available on Windows |

**Missing dependencies with no fallback:**
- Firebase project — Required for auth, create at console.firebase.google.com
- PostgreSQL 16 — Required for Prisma, install from postgresql.org

**Missing dependencies with fallback:**
- iOS build environment — Use Android for initial testing, or EAS Build cloud service
- Physical iOS device — Use Android device or simulator for testing

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (bundled with React Native 0.76) |
| Config file | mobile/jest.config.js |
| Quick run command | `npm test -- --testPathPattern="auth\|pet" --passWithNoTests` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | Sign up with email/password | Unit | `jest auth.service.ts` | ❌ |
| AUTH-02 | Log in with credentials | Unit | `jest auth.service.ts` | ❌ |
| AUTH-03 | Session persists on restart | Integration | Manual test | N/A |
| AUTH-04 | Logout from any screen | Integration | Manual test | N/A |
| AUTH-05 | Token exchange on login | Unit | `jest auth.service.ts` | ❌ |
| PET-01 | Add pet with all fields | Unit | `jest pets.service.ts` | ❌ |
| PET-02 | View pet list | Unit | `jest pets.service.ts` | ❌ |
| PET-03 | Edit pet info | Unit | `jest pets.service.ts` | ❌ |
| PET-04 | Delete pet with confirmation | Integration | Manual test | N/A |
| PET-05 | Species icon displays | Unit | `jest SpeciesIcon.tsx` | ❌ |
| DASH-01 | Health score on dashboard | Integration | Manual test | N/A |

### Wave 0 Gaps
- [ ] `mobile/src/services/__tests__/auth.service.test.ts` — AUTH-01, AUTH-02, AUTH-05
- [ ] `mobile/src/services/__tests__/pets.service.test.ts` — PET-01, PET-02, PET-03
- [ ] `mobile/src/components/__tests__/SpeciesIcon.test.tsx` — PET-05
- [ ] `server/src/__tests__/auth.controller.test.ts` — Token exchange tests
- [ ] `server/src/__tests__/pets.controller.test.ts` — CRUD tests

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | Yes | Firebase Auth with email/password |
| V3 Session Management | Yes | Firebase native persistence + custom JWT |
| V4 Access Control | Yes | User can only access own pets (userId filter) |
| V5 Input Validation | Yes | Zod validation on all inputs |
| V6 Cryptography | Yes | HTTPS in transit, JWT signed with secret |

### Known Threat Patterns for Auth + Pets

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Brute force login | Elevation | Firebase rate limiting, password requirements |
| Token theft | Information Disclosure | HTTPS only, short JWT expiry (7 days) |
| Unauthorized pet access | Tampering | Middleware verifies userId matches resource owner |
| Image injection | Tampering | Validate file type, sanitize filename |
| SQL injection via Prisma | Tampering | Prisma parameterized queries (automatic) |
| XSS in pet names | Information Disclosure | React Native escapes text automatically |

## Sources

### Primary (HIGH confidence)
- [React Native Firebase Auth Usage](https://rnfirebase.io/auth/usage) - Official auth documentation
- [Firebase Admin Verify ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens) - Token verification
- [Firebase Auth Persistence](https://rnfirebase.io/auth/usage#persisting-authentication-state) - Session handling
- [jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken) - Package docs
- [react-native-image-picker npm](https://www.npmjs.com/package/react-native-image-picker) - Image selection

### Secondary (MEDIUM confidence)
- [Firebase Auth Error Codes](https://firebase.google.com/docs/auth/admin/errors) - Error handling
- [Zustand GitHub](https://github.com/pmndrs/zustand) - State management patterns
- [AsyncStorage React Native](https://react-native-async-storage.github.io/async-storage/) - Storage usage

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Firebase ID token expires in 1 hour | Token Exchange Flow | Token refresh logic needs adjustment |
| A2 | Custom JWT with 7-day expiry is acceptable | Token Exchange Flow | May need shorter expiry for security |
| A3 | react-native-image-picker handles iOS/Android permissions correctly | Image Upload | May need additional permission handling |
| A4 | Firebase Admin SDK works with Node 24 | Server Auth | May need Node 20 LTS if compatibility issues |

## Open Questions

1. **Should we store pet photos in Firebase Storage or our own server?**
   - What we know: Firebase Storage is built for this, but adds complexity
   - What's unclear: Cost, access control, CDN availability
   - Recommendation: Use Firebase Storage for Phase 2, migrate if needed

2. **Should we implement email verification?**
   - What we know: Firebase supports it, requires user action
   - What's unclear: User experience impact, deliverability in Korea
   - Recommendation: Skip for Phase 2, add in Phase 4+ if needed

3. **Should we use a form validation library?**
   - What we know: Zod is popular with Prisma, but adds bundle size
   - What's unclear: Complexity of current forms
   - Recommendation: Use Zod for server validation, simple checks on mobile

4. **What Firebase region should we use?**
   - What we know: User base is Korean
   - What's unclear: Whether us-central1 is acceptable or should use asia-northeast1
   - Recommendation: Use asia-northeast1 (Tokyo) for lower latency

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All packages verified via npm registry
- Architecture: HIGH — Based on official Firebase docs and established patterns
- Pitfalls: MEDIUM — Based on React Native Firebase community knowledge

**Research date:** 2026-04-19
**Valid until:** 2026-05-19 (30 days for stable stack)
