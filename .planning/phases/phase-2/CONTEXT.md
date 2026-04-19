# Phase 2: Authentication & Pet Profiles - Context

**Phase:** 2
**Name:** Authentication & Pet Profiles
**Goal:** Users can securely create accounts, log in, and manage their pets
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

### the agent's Discretion
- Specific Firebase configuration approach (app vs auth module setup)
- JWT token expiration duration (7 days suggested)
- Pet species icon library choice
- Image compression strategy
- Form validation library

### Deferred Ideas (OUT OF SCOPE)
- Social login (Google, Apple, Facebook) — Phase 4+
- Push notification setup — Phase 6
- Offline mode — Phase 6

---

## Phase 2 Requirements

| ID | Description |
|----|-------------|
| AUTH-01 | User can sign up with email and password |
| AUTH-02 | User can log in with email/password |
| AUTH-03 | User session persists across app restarts |
| AUTH-04 | User can log out from any screen |
| AUTH-05 | Firebase ID token exchanged for backend JWT on login |
| PET-01 | User can add a new pet (name, species, breed, birth_date, weight, photo) |
| PET-02 | User can view list of their pets |
| PET-03 | User can edit pet profile information |
| PET-04 | User can delete a pet profile |
| PET-05 | Pet profile displays species-appropriate icon |
| DASH-01 | Dashboard shows health score prominently |

---

## Implementation Approach

### 1. Firebase Auth Flow

#### Mobile (React Native)
```
@react-native-firebase/auth v24.0.0
├── createUserWithEmailAndPassword(auth, email, password) → UserCredential
├── signInWithEmailAndPassword(auth, email, password) → UserCredential
├── getIdToken(user) → string (Firebase ID token, expires 1hr)
├── onAuthStateChanged(auth, callback) → Unsubscribe
└── signOut(auth) → void
```

#### Session Persistence (AUTH-03)
- Firebase SDK automatically persists auth state on native platforms
- `onAuthStateChanged` triggers on app restart with existing session
- No additional AsyncStorage needed for Firebase session

#### Token Exchange Flow (AUTH-05)
```
1. User signs in → Firebase UserCredential
2. Get Firebase ID token: user.getIdToken()
3. Send to backend: POST /api/auth/login { idToken }
4. Backend verifies with firebase-admin.auth().verifyIdToken(idToken)
5. Backend creates custom JWT with user data
6. Return custom JWT to client
7. Client stores custom JWT in AsyncStorage
8. Client uses custom JWT for subsequent API calls
```

### 2. Backend JWT Implementation

#### Server Dependencies
```
firebase-admin v13.8.0 — Firebase token verification
jsonwebtoken v9.0.3 — Custom JWT creation
```

#### JWT Payload
```typescript
interface JWTPayload {
  userId: string;      // Our User model's UUID
  firebaseUid: string; // Firebase UID
  email: string;
  iat: number;
  exp: number;         // 7 days from now
}
```

#### Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Exchange Firebase token for custom JWT |
| POST | /api/auth/register | Create user + exchange token |
| GET | /api/auth/me | Get current user from JWT |
| POST | /api/auth/logout | Invalidate session (optional) |

### 3. Pet CRUD Operations

#### Pet Model (already in schema.prisma)
```prisma
model Pet {
  id        String   @id @default(uuid())
  name      String
  species   String   // dog, cat, bird, rabbit, fish, other
  breed     String?
  birthDate DateTime?
  weight    Float?
  photoUrl  String?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Species Validation
```typescript
type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';

const SPECIES_LIST: Species[] = ['dog', 'cat', 'bird', 'rabbit', 'fish', 'other'];
```

#### Species Icons (PET-05)
Use emoji or vector icons mapped to species:
| Species | Icon | Source |
|---------|------|--------|
| dog | 🐕 | Native emoji |
| cat | 🐈 | Native emoji |
| bird | 🐦 | Native emoji |
| rabbit | 🐰 | Native emoji |
| fish | 🐟 | Native emoji |
| other | 🐾 | Native emoji |

#### Pet CRUD Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/pets | List all pets for current user |
| GET | /api/pets/:id | Get single pet details |
| POST | /api/pets | Create new pet |
| PUT | /api/pets/:id | Update pet |
| DELETE | /api/pets/:id | Delete pet (with confirmation) |

#### Image Upload (PET-01)
- Use react-native-image-picker v8.2.1 for photo selection
- Compress image before upload (max 500KB)
- Send as multipart/form-data to /api/pets/:id/photo
- Backend stores in Firebase Storage or local uploads directory
- Return URL to store in Pet.photoUrl

### 4. Navigation Structure

#### Auth Stack (unauthenticated users)
```
AuthStack (Native Stack Navigator)
├── LoginScreen       — Email/password login form
└── SignupScreen      — Email/password registration form
```

#### Main Stack (authenticated users)
```
MainStack (Native Stack Navigator)
├── DashboardScreen    — Health score, quick actions, recent activity
├── PetsListScreen    — Grid/list of user's pets
├── PetDetailScreen   — Single pet profile with health data
├── PetEditScreen     — Edit pet form
├── AddPetScreen      — Add new pet form
└── SettingsScreen    — User settings, logout
```

#### Tab Navigation (optional within Main)
```
MainTabs (Bottom Tab Navigator)
├── DashboardTab     → DashboardScreen
├── PetsTab          → PetsListScreen
└── SettingsTab      → SettingsScreen
```

### 5. Zustand Store Structure

#### useAuthStore
```typescript
interface AuthState {
  user: User | null;
  jwtToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setJwtToken: (token: string) => void;
  login: (email, password) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>; // Check existing session
}
```

#### usePetStore
```typescript
interface PetState {
  pets: Pet[];
  selectedPet: Pet | null;
  isLoading: boolean;
  fetchPets: () => Promise<void>;
  addPet: (pet: PetInput) => Promise<void>;
  updatePet: (id: string, pet: PetInput) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  selectPet: (pet: Pet) => void;
}
```

---

## Data Flow Diagrams

### Login Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ LoginScreen │     │ Firebase    │     │ Our Backend │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                  │                  │
       │ signInWithEmail  │                  │
       │    & Password    │                  │
       │─────────────────>│                  │
       │                  │                  │
       │<─────────────────│                  │
       │  Firebase User   │                  │
       │                  │                  │
       │ getIdToken()     │                  │
       │──────────────────│                  │
       │  ID Token (1hr)  │                  │
       │                  │                  │
       │     POST /api/auth/login            │
       │     { idToken }                    │
       │───────────────────────────────────>│
       │                  │      verifyIdToken()
       │                  │<──── firebase-admin
       │                  │                  │
       │                  │      create JWT  │
       │                  │                  │
       │<───────────────────────────────────│
       │     { jwt, user }                  │
       │                  │                  │
       │  Store JWT in AsyncStorage          │
       │  Navigate to Dashboard              │
```

### Add Pet Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ AddPetScreen│     │ Image Picker│     │ Our Backend │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                  │                  │
       │ Select photo     │                  │
       │─────────────────>│                  │
       │  Image URI       │                  │
       │<─────────────────│                  │
       │                  │                  │
       │ Fill form        │                  │
       │ (name, species)  │                  │
       │                  │                  │
       │     POST /api/pets                    │
       │     multipart/form-data               │
       │──────────────────────────────────────>│
       │                  │      Save to DB  │
       │                  │                  │
       │<─────────────────────────────────────│
       │     { pet }                          │
       │                  │                  │
       │  Update pet list                      │
```

---

## File Structure

### Mobile (mobile/src)
```
├── services/
│   ├── api.ts              # Axios instance with JWT interceptor
│   ├── auth.ts             # Auth service (login, signup, logout)
│   └── pets.ts             # Pet CRUD service
├── store/
│   ├── useAuthStore.ts     # Auth state management
│   └── usePetStore.ts      # Pet state management
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
│   ├── AuthNavigator.tsx   # Stack for unauthenticated
│   ├── MainNavigator.tsx   # Stack for authenticated
│   └── RootNavigator.tsx   # Conditionally renders auth/main
├── components/
│   ├── PetCard.tsx         # Pet list item
│   ├── SpeciesIcon.tsx    # Species-based icon component
│   └── ConfirmDialog.tsx   # Delete confirmation
└── types/
    └── index.ts            # TypeScript interfaces
```

### Server (server/src)
```
├── controllers/
│   ├── auth.controller.ts   # Login, register, me
│   └── pets.controller.ts   # CRUD operations
├── middleware/
│   └── auth.middleware.ts   # JWT verification
├── routes/
│   ├── auth.routes.ts
│   └── pets.routes.ts
├── services/
│   ├── auth.service.ts      # Token exchange logic
│   └── firebase.service.ts   # Firebase admin operations
└── utils/
    └── jwt.ts               # JWT helpers
```

---

## Verification Steps

### Auth Flow
1. Start app → shows LoginScreen (if no session)
2. Sign up with email/password → confirmation shown
3. Log in → Dashboard appears
4. Close and reopen app → still logged in (AUTH-03)
5. Tap logout → returns to LoginScreen (AUTH-04)

### Pet Flow
1. On Dashboard, tap "Add Pet" → AddPetScreen
2. Fill form: name, species (dropdown), breed, birth_date, weight
3. Select photo → preview shown
4. Save → returns to pet list with new pet (PET-01, PET-02)
5. Tap pet → PetDetailScreen with species icon (PET-05)
6. Edit pet → modify fields → save (PET-03)
7. Delete pet → confirmation dialog → removed (PET-04)

### Token Exchange
1. Log in with Firebase credentials
2. Check network tab: POST /api/auth/login with idToken
3. Response contains custom JWT
4. Subsequent API calls include Authorization: Bearer <jwt>

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Firebase token expires during use | Medium | High | Refresh token before expiry, handle 401 |
| Image upload fails on slow network | Medium | Medium | Compress images, show upload progress |
| Pet delete loses health history | Low | High | Confirm dialog, soft delete option |
| JWT stolen | Low | High | HTTPS only, short expiry (7 days) |
| Firebase config exposed | Low | Critical | Use .env, never commit secrets |

---

## Out of Scope for Phase 2

- Social login providers (Google, Apple, Facebook)
- Password reset flow
- Email verification
- Multi-factor authentication
- Push notifications
- Offline mode / data caching
- Health score calculation (Phase 3)
- Symptom logging (Phase 3)
