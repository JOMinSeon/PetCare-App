# Phase 1: Project Foundation - Research

**Researched:** 2026-04-19
**Domain:** Mobile App (React Native) + Backend API (Node.js/Express) + Database (PostgreSQL/Prisma)
**Confidence:** HIGH

## Summary

Phase 1 establishes the foundational infrastructure for VitalPaw Proactive. The mobile app uses React Native CLI 0.76.9 (as specified in ROADMAP) with TypeScript, Zustand for state management, and React Navigation. The backend uses Express 5.x with Prisma 7.x ORM connecting to PostgreSQL 16. Git initialization with appropriate `.gitignore` files ensures clean version control from day one.

**Primary recommendation:** Use React Native 0.76.9, Express 5.2.1, Prisma 7.7.0, and PostgreSQL 16. Initialize the monorepo structure before running any scaffolding tools to ensure proper organization.

## Standard Stack

### Mobile (React Native CLI)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-native | 0.76.9 | Core framework | Required by ROADMAP (locked decision) |
| react | 19.x | UI library | Bundled with RN 0.76 |
| typescript | ^5.0.0 | Type safety | Default in RN 0.76+, recommended |
| zustand | ^5.0.12 | State management | Lightweight, no boilerplate |
| @react-navigation/native | ^7.2.2 | Navigation | De facto standard for RN navigation |
| @react-navigation/native-stack | ^7.0.0 | Stack navigator | Native performance |
| react-native-screens | latest | Native screen primitives | Required by React Navigation |
| react-native-safe-area-context | latest | Safe area handling | Required by React Navigation |

### Server (Express)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| express | ^5.2.1 | Web framework | Industry standard for Node.js APIs |
| @prisma/client | ^7.7.0 | Database ORM | Type-safe, auto-generated CRUD |
| prisma | ^7.7.0 | Database migrations | CLI for schema management |
| typescript | ^5.0.0 | Type safety | Full-stack TypeScript consistency |
| cors | latest | Cross-origin resource sharing | Required for mobile API access |
| dotenv | latest | Environment variables | 12-factor app compliance |

### Database
| Component | Version | Purpose |
|-----------|---------|---------|
| postgresql | 16 | Primary database |
| Prisma Schema | 7.x | Data modeling |

### Installation

**Mobile:**
```bash
npx react-native@0.76.9 init VitalPawProactive --version 0.76.9
cd VitalPawProactive
npm install zustand @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

**Server:**
```bash
mkdir server && cd server
npm init -y
npm install express @prisma/client cors dotenv
npm install -D typescript @types/node @types/express @types/cors prisma
npx prisma init
```

## Architecture Patterns

### Recommended Project Structure

```
vitalpaw-proactive/
├── mobile/                    # React Native app
│   ├── android/               # Android native code
│   ├── ios/                   # iOS native code
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── screens/           # Screen components
│   │   ├── navigation/        # React Navigation setup
│   │   ├── store/             # Zustand stores
│   │   ├── services/          # API clients (axios/fetch)
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # Helper functions
│   ├── App.tsx
│   └── package.json
│
├── server/                    # Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts    # Prisma client singleton
│   │   ├── controllers/
│   │   │   └── health.controller.ts
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts
│   │   │   └── auth.middleware.ts
│   │   ├── routes/
│   │   │   └── index.ts
│   │   └── index.ts           # Entry point
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── .gitignore
└── README.md
```

### Pattern 1: Monorepo with Directory-based Separation

**What:** Mobile and server in separate top-level directories within a single git repository.

**When to use:** When mobile app and API are developed together but deployed independently.

**Example:**
```bash
mkdir vitalpaw-proactive
cd vitalpaw-proactive
git init
mkdir mobile server
```

### Pattern 2: Prisma Schema-First Development

**What:** Define all data models in `schema.prisma` before writing any API code.

**When to use:** Always, for type-safe database access.

**Example (schema.prisma):**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  firebaseUid String @unique
  email     String   @unique
  createdAt DateTime @default(now())
  pets      Pet[]
}

model Pet {
  id        String   @id @default(uuid())
  name      String
  species   String
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

### Pattern 3: Zustand Store Pattern

**What:** Centralized state management with Zustand for React Native.

**When to use:** When managing global state (user session, pet data).

**Example:**
```typescript
// src/store/useAuthStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

### Anti-Patterns to Avoid

- **Don't put all code in one file:** Separate concerns (routes, controllers, services)
- **Don't use default exports for named exports:** Better autocomplete and refactoring
- **Don't skip TypeScript:** JS in RN leads to runtime errors that are hard to debug
- **Don't commit node_modules:** Use proper `.gitignore`

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Database migrations | Custom SQL scripts | Prisma migrations | Version control, rollback, type safety |
| API authentication | Custom JWT implementation | Firebase Auth + JWT exchange | Proven security, handles token refresh |
| Navigation | Custom navigation | React Navigation | Handles native transitions, deep linking |
| State management | Redux (too much boilerplate) | Zustand | Minimal boilerplate, TypeScript-friendly |

**Key insight:** React Native ecosystem has mature solutions for all common problems. Custom implementations lead to maintenance burden.

## Common Pitfalls

### Pitfall 1: React Native CLI Init on Windows
**What goes wrong:** `npx react-native init` fails with permission errors or path too long.
**Why it happens:** Windows handles long paths differently, some npm packages have Windows-specific issues.
**How to avoid:** Run PowerShell as Administrator, enable long paths via `git config core.longpaths true`, use short directory names.
**Warning signs:** `EPERM`, `ENOENT`, `path too long` errors during installation.

### Pitfall 2: Prisma Client Not Generated
**What goes wrong:** `TypeError: prisma_client_1.prismaClient is not a constructor` at runtime.
**Why it happens:** Forgetting to run `npx prisma generate` after `npx prisma db push`.
**How to avoid:** Always run `prisma generate` after schema changes.
**Warning signs:** Import errors for `@prisma/client`.

### Pitfall 3: PostgreSQL Connection String Format
**What goes wrong:** `ECONNREFUSED` when starting Express server.
**Why it happens:** Wrong format for `DATABASE_URL` in `.env`.
**How to avoid:** Use format `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`.
**Warning signs:** Connection refused on localhost:5432.

### Pitfall 4: iOS Build Requires CocoaPods
**What goes wrong:** iOS build fails with native module errors.
**Why it happens:** Native modules require `pod install` in ios directory.
**How to avoid:** Run `cd ios && pod install && cd ..` after installing new packages.
**Warning signs:** `Native module X not found` errors.

### Pitfall 5: Node.js Version Incompatibility
**What goes wrong:** `ERR_REQUIRE_ESMODULE` or cryptic module errors.
**Why it happens:** Using Node 24 with packages that only support LTS versions.
**How to avoid:** Use Node.js 20 LTS for production, verify package engines in `package.json`.
**Warning signs:** Unexpected module format errors.

## Code Examples

### Express Server with Prisma (verified pattern)

```typescript
// server/src/config/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

```typescript
// server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.json({ status: 'ok', database: 'disconnected' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Zustand Store (verified pattern)

```typescript
// mobile/src/store/useAuthStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));
```

### Prisma Schema Models

```prisma
// server/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  firebaseUid  String   @unique
  email        String   @unique
  createdAt    DateTime @default(now())
  pets         Pet[]
}

model Pet {
  id           String    @id @default(uuid())
  name         String
  species      String
  breed        String?
  birthDate    DateTime?
  weight       Float?
  photoUrl     String?
  userId       String
  user         User      @relation(fields: [userId], references: [id])
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  healthRecord HealthRecord?
  symptoms     Symptom[]
  activities   Activity[]
  diets        Diet[]
  medicalRecords MedicalRecord[]
}

model HealthRecord {
  id          String   @id @default(uuid())
  score       Int
  factors     Json     // { age: number, activity: number, diet: number }
  petId       String   @unique
  pet         Pet      @relation(fields: [petId], references: [id])
  calculatedAt DateTime @default(now())
}

model Symptom {
  id          String   @id @default(uuid())
  description String
  severity    String   // mild, moderate, severe
  date        DateTime
  petId       String
  pet         Pet      @relation(fields: [petId], references: [id])
}

model Activity {
  id              String   @id @default(uuid())
  steps           Int?
  durationMinutes Int?
  date            DateTime
  petId           String
  pet             Pet      @relation(fields: [petId], references: [id])
}

model Diet {
  id         String   @id @default(uuid())
  foodName   String
  amountGrams Float
  calories   Int
  date       DateTime
  petId      String
  pet        Pet      @relation(fields: [petId], references: [id])
}

model MedicalRecord {
  id          String   @id @default(uuid())
  type        String   // vaccination, checkup
  name        String
  date        DateTime
  nextDueDate DateTime?
  hospital    String?
  summary     String?
  petId       String
  pet         Pet      @relation(fields: [petId], references: [id])
}

model Service {
  id          String   @id @default(uuid())
  name        String
  type        String   // vet, pet_store, groomer
  address     String
  latitude    Float
  longitude   Float
  phone       String?
  rating      Float?
  is24Hour    Boolean  @default(false)
  isEmergency Boolean  @default(false)
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|-------------------|--------------|--------|
| Class components | Functional + Hooks | React 16.8+ (2019) | Less boilerplate |
| Redux | Zustand / Context | 2020+ | Simpler state management |
| React Navigation 5 | React Navigation 7 | 2023-2024 | Better TypeScript, native performance |
| Prisma 2 | Prisma 5+ | 2022+ | Better performance, enhanced features |
| Express 4 | Express 5 | 2024 | Async handlers by default |

**Deprecated/outdated:**
- `react-native init` without version specified (always pin version)
- `npm` instead of `pnpm` for monorepos (pnpm has better disk usage and scoping)

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Server, React Native | ✓ | v24.13.1 | Use nvm to switch to 20 LTS if issues |
| npm | Package installation | ✓ | 10.9.0 | — |
| PostgreSQL | Database | ? | — | Install PostgreSQL 16 |
| Git | Version control | ✓ | 2.48.0 | — |
| Java (JDK) | Android build | ? | — | Install JDK 17 |
| Xcode | iOS build (macOS) | ? | — | macOS required for iOS |

**Missing dependencies with no fallback:**
- PostgreSQL 16 — Required for Prisma, install from postgresql.org
- JDK 17 — Required for Android builds, install from oracle.com or adoptium.net

**Missing dependencies with fallback:**
- Xcode — iOS build only works on macOS, test on physical device or CI

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | React Native 0.76.9 works with Node 24 | Standard Stack | Build errors if incompatible — test early |
| A2 | PostgreSQL 16 is latest stable | Standard Stack | Old version might lack features |
| A3 | Zustand 5.x is compatible with RN 0.76 | Standard Stack | May need to downgrade if conflicts |

## Open Questions

1. **Should we use pnpm instead of npm for the monorepo?**
   - What we know: pnpm has better disk usage and monorepo support
   - What's unclear: Team familiarity, CI/CD compatibility
   - Recommendation: Use npm for now (simpler), switch to pnpm in Phase 6 if needed

2. **Where should Firebase configuration live?**
   - What we know: Firebase Auth requires google-services.json (Android) and GoogleService-Info.plist (iOS)
   - What's unclear: Whether to commit these to git or use environment variables
   - Recommendation: Use .env for API keys, commit config files without secrets

3. **Should we use EAS (Expo Application Services) or manual builds?**
   - What we know: EAS provides cloud builds for iOS without macOS
   - What's unclear: Cost, team familiarity
   - Recommendation: Manual builds for Phase 1, evaluate EAS in Phase 6

## Sources

### Primary (HIGH confidence)
- [React Native 0.76 Documentation](https://reactnative.dev/blog/2024/10/29/rn-0.76-release) — Latest 0.76.x features
- [Express 5.x Documentation](https://expressjs.com/) — Current Express version
- [Prisma Documentation](https://www.prisma.io/docs) — Schema and client usage
- [npm registry](https://www.npmjs.com/) — Package version verification

### Secondary (MEDIUM confidence)
- [React Navigation 7.x Docs](https://reactnavigation.org/docs/getting-started/) — Navigation setup
- [Zustand GitHub](https://github.com/pmndrs/zustand) — State management patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All versions verified via npm registry
- Architecture: HIGH — Standard patterns from official documentation
- Pitfalls: MEDIUM — Based on community knowledge, should verify during implementation

**Research date:** 2026-04-19
**Valid until:** 2026-05-19 (30 days for stable stack)
