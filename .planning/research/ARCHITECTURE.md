# Architecture Research

**Domain:** Pet Healthcare Mobile App + Backend API
**Researched:** 2026-04-19
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native App                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Screens   │  │   Store     │  │  Services   │          │
│  │  (UI Layer) │  │  (Zustand)  │  │  (API Client)         │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Firebase SDK (Auth)                     │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                               │
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    Express      │  │  PostgreSQL      │  │   Firebase      │
│    API Server   │  │    Database     │  │   Auth Only     │
│  (Business Logic)│  │   (Prisma ORM)  │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| React Native Screens | UI presentation | Functional components |
| Zustand Store | Global state | Slices per feature |
| API Service | HTTP requests | Axios or fetch wrapper |
| Express API | Business logic | Route handlers + middleware |
| Prisma ORM | Database access | Type-safe queries |
| Firebase Auth | User authentication | Token-based auth |

## Recommended Project Structure

### Mobile App (`VitalPawProactive/`)
```
src/
├── components/
│   ├── common/           # Card, Button, Badge, Avatar, Input
│   ├── charts/           # LineChart, BarChart
│   └── index.ts
├── screens/
│   ├── Dashboard/        # Home screen
│   ├── Monitoring/       # Activity & symptom tracking
│   ├── History/          # Medical records
│   ├── Services/         # Map view
│   └── Profile/         # Pet profiles
├── navigation/
│   └── AppNavigator.tsx
├── store/
│   ├── authStore.ts
│   ├── petStore.ts
│   └── healthStore.ts
├── services/
│   ├── api.ts            # Backend API client
│   └── firebase.ts       # Firebase config
├── hooks/
├── theme/
│   └── colors.ts
└── utils/
```

### Backend API (`vitalpaw-api/`)
```
src/
├── routes/
│   ├── auth.ts
│   ├── pets.ts
│   ├── health.ts
│   └── services.ts
├── middleware/
│   ├── auth.ts
│   └── validation.ts
├── services/
│   ├── analysis.ts       # AI symptom analysis
│   └── notifications.ts
├── prisma/
│   └── schema.prisma
└── index.ts
```

### Structure Rationale

- **Mobile:** Feature-based screen folders with shared components
- **Backend:** Route-based organization for clear API endpoints
- **Shared:** Zustand slices mirror API routes for consistency

## Architectural Patterns

### Pattern 1: API-First State Sync

**What:** Mobile state synchronized with backend via API calls
**When to use:** Most data operations require server persistence
**Trade-offs:** Requires network, but ensures data safety

**Example:**
```typescript
// Zustand action calls API
const fetchPets = async () => {
  const pets = await api.get('/pets');
  set({ pets, loading: false });
};
```

### Pattern 2: JWT Auth with Firebase Token Exchange

**What:** Firebase ID token exchanged for custom JWT
**When to use:** Firebase Auth + custom backend
**Trade-offs:** Extra token exchange, but secure auth

**Example:**
```typescript
// Mobile: Get Firebase token
const firebaseToken = await firebase.auth().currentUser.getIdToken();

// Backend: Exchange for app JWT
const response = await fetch('/auth/exchange', {
  headers: { Authorization: `Bearer ${firebaseToken}` }
});
```

### Pattern 3: Feature-Sliced Store

**What:** Zustand store divided by feature domains
**When to use:** Apps with multiple feature areas
**Trade-offs:** More files, but better organization

## Data Flow

### Request Flow

```
[User Action]
    ↓
[Screen Component] → [Zustand Action] → [API Service] → [Express Route]
    ↓                              ↓                        ↓
[UI Update] ← [Store Update] ← [Response] ← [Prisma] ← [PostgreSQL]
```

### State Management

```
[Zustand Store (auth/pet/health)]
    ↓ (subscribe)
[Screens] ←→ [Actions] → [Store Mutations] → [Re-render]
```

### Key Data Flows

1. **Authentication:** Firebase Auth → Token exchange → JWT stored → Auth header on requests
2. **Pet Management:** CRUD via API → Store update → UI re-render
3. **Health Logging:** User input → API save → Health score recalculation → Dashboard update

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Monolithic API fine, single DB instance |
| 1k-10k users | Add connection pooling, consider read replicas |
| 10k+ users | Split services (auth, health, pets) |

### Scaling Priorities

1. **First bottleneck:** API response time under load
2. **Second bottleneck:** Database query performance
3. **Third bottleneck:** Image/media storage

## Anti-Patterns

### Anti-Pattern 1: API Calls in Components

**What people do:** Direct API calls inside screen components
**Why it's wrong:** Hard to test, duplicates logic, mixes concerns
**Do this instead:** Use Zustand actions that call API

### Anti-Pattern 2: Storing JWT in Plain LocalStorage

**What people do:** `localStorage.setItem('token', jwt)`
**Why it's wrong:** XSS vulnerable, no encryption
**Do this instead:** Use encrypted storage or memory + refresh tokens

### Anti-Pattern 3: Monolithic Screen Components

**What people do:** 500+ line screen components
**Why it's wrong:** Untestable, hard to maintain
**Do this instead:** Extract to smaller components

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Firebase Auth | SDK | Email + Google sign-in |
| Google Maps | react-native-maps | Requires API key |
| Apple Maps | react-native-maps | iOS specific |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Mobile App ↔ API Server | REST/JSON | JWT auth header |
| API Server ↔ Database | Prisma | Connection pool |

## Sources

- React Native architecture best practices
- Express.js production best practices
- Prisma performance guide