# Phase 1: Project Foundation - Context

**Phase:** 1
**Name:** Project Foundation
**Goal:** Development environment established with React Native project, Express API boilerplate, PostgreSQL schema, and Git structure
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

### the agent's Discretion
- Specific React Native 0.76.x patch version (0.76.9 recommended)
- Express project structure organization
- Prisma schema organization approach
- Git initialization strategy
- Build tooling configuration

### Deferred Ideas (OUT OF SCOPE)
- Real-time chat with veterinarians
- Video consultations
- Pet social community
- Marketplace/e-commerce for pet supplies

---

## Phase 1 Success Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | React Native CLI project initializes without errors on both iOS and Android | `npx react-native init` completes without errors |
| 2 | Express API server starts and connects to PostgreSQL database | `npm run dev` starts server, `prisma db push` succeeds |
| 3 | Prisma schema defines all data models (User, Pet, HealthRecord, Symptom, Activity, Diet, MedicalRecord, Service) | `prisma/ schema.prisma` contains all 8 models |
| 4 | Git repository initialized with appropriate .gitignore for Node.js and React Native | `.gitignore` exists with proper entries |
| 5 | Project builds successfully for development (debug APK/IPA) | `npm run android` / `npm run ios` completes |

---

## Implementation Approach

### 1. Project Structure

Create a monorepo-style structure with two main directories:

```
vitalpaw-proactive/
├── mobile/                    # React Native app
│   ├── android/               # Android native code
│   ├── ios/                   # iOS native code
│   ├── src/                   # TypeScript source
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/           # Screen components
│   │   ├── navigation/        # React Navigation setup
│   │   ├── store/              # Zustand stores
│   │   ├── services/           # API clients
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Utility functions
│   ├── App.tsx                # Root component
│   └── package.json
│
├── server/                    # Express API
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   └── index.ts            # Entry point
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   └── package.json
│
├── .gitignore
└── README.md
```

### 2. Technical Decisions

#### React Native: 0.76.9
- **Why 0.76.x:** Per locked decision in ROADMAP
- **Why CLI over Expo:** Requires native modules for maps, GPS, QR code scanning
- **TypeScript enabled:** Default in 0.76+ (no template flag needed)

#### Express Structure
```
server/src/
├── index.ts                   # App entry, middleware setup
├── config/
│   └── database.ts            # Prisma client initialization
├── controllers/
│   └── health.controller.ts  # Basic health check
├── middleware/
│   ├── error.middleware.ts    # Global error handler
│   └── auth.middleware.ts     # JWT verification (stub)
├── routes/
│   └── index.ts               # Route aggregation
└── services/
    └── prisma.service.ts      # Prisma client singleton
```

#### Prisma Schema Design
All 8 models as per success criteria:
- **User** — Firebase UID, email, created_at
- **Pet** — name, species, breed, birth_date, weight, photo_url, user_id
- **HealthRecord** — calculated score, factors, pet_id, calculated_at
- **Symptom** — description, severity, date, pet_id
- **Activity** — steps, duration_minutes, date, pet_id
- **Diet** — food_name, amount_grams, calories, date, pet_id
- **MedicalRecord** — type (vaccination/checkup), details, date, next_due_date, pet_id
- **Service** — name, type, address, lat, lng, phone, rating, is_24h, is_emergency

#### Git Strategy
- `.gitignore` for Node.js (node_modules, build outputs)
- `.gitignore` for React Native (android/.gradle, ios/build, *.apk, *.ipa)
- Commit initial empty structure before adding code

### 3. Implementation Order

1. **Initialize Git repository** with `.gitignore`
2. **Create mobile directory** structure
3. **Initialize React Native project** via CLI
4. **Install mobile dependencies** (Zustand, React Navigation, etc.)
5. **Create server directory** structure
6. **Initialize Express project** with TypeScript
7. **Install server dependencies** (Express, Prisma, etc.)
8. **Create Prisma schema** with all 8 models
9. **Run Prisma db push** to verify schema
10. **Create Express boilerplate** (health check endpoint)
11. **Verify full-stack startup** (both servers run)

### 4. Build Verification Steps

**Mobile:**
```bash
cd mobile
npm run android    # Should produce debug APK
npm run ios        # Should succeed (macOS only)
```

**Server:**
```bash
cd server
npm run dev        # Should start on port 3000
curl localhost:3000/health  # Should return 200
```

---

## Dependencies Summary

### Mobile (React Native 0.76.9)
| Package | Version | Purpose |
|---------|---------|---------|
| react-native | 0.76.9 | Core framework |
| react | 19.x | React (bundled with RN) |
| typescript | ^5.0.0 | Type safety |
| zustand | ^5.0.0 | State management |
| @react-navigation/native | ^7.0.0 | Navigation |
| @react-navigation/native-stack | ^7.0.0 | Stack navigator |
| react-native-screens | latest | Native screens |
| react-native-safe-area-context | latest | Safe area handling |

### Server (Node.js + Express)
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.0.0 | Web framework |
| @prisma/client | ^7.0.0 | Database ORM |
| prisma | ^7.0.0 | Prisma CLI |
| typescript | ^5.0.0 | Type safety |
| cors | latest | CORS middleware |
| dotenv | latest | Environment variables |

### Database
- PostgreSQL 16 (per ROADMAP locked decision)

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| React Native CLI init fails on Windows | Low | High | Use PowerShell/admin prompt |
| PostgreSQL connection fails | Medium | High | Document connection string format |
| iOS build requires macOS | High | Medium | Build verification on macOS only |
| Native module conflicts | Low | High | Use compatible versions per RN 0.76 |
| Node 24 compatibility issues | Low | Medium | Use Node 20 LTS if issues arise |

---

## Out of Scope for Phase 1

- Authentication (Phase 2)
- Any UI screens or components
- API routes beyond health check
- Real database seeding
- Push notifications
- Maps integration
