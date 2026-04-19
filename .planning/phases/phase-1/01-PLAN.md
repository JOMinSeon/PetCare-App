---
phase: "01"
plan: "01"
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
requirements: []
must_haves:
  truths:
    - "Git repository exists with proper .gitignore for Node.js and React Native"
    - "React Native CLI project exists at ./mobile with version 0.76.9"
    - "Express API server exists at ./server with TypeScript"
    - "Prisma schema contains all 8 data models (User, Pet, HealthRecord, Symptom, Activity, Diet, MedicalRecord, Service)"
    - "Express server can start and connect to PostgreSQL"
  artifacts:
    - path: ".gitignore"
      provides: "Node.js + React Native ignore rules"
    - path: "mobile/App.tsx"
      provides: "React Native entry point"
    - path: "mobile/package.json"
      provides: "RN dependencies manifest"
    - path: "server/src/index.ts"
      provides: "Express entry point with health endpoint"
    - path: "server/prisma/schema.prisma"
      provides: "All 8 data models"
  key_links:
    - from: "server/prisma/schema.prisma"
      to: "PostgreSQL database"
      via: "prisma db push"
    - from: "server/src/index.ts"
      to: "prisma/client"
      via: "import and query"
    - from: "mobile/App.tsx"
      to: "Zustand store"
      via: "import"
---

<objective>
Initialize the VitalPaw Proactive project foundation: Git repository, React Native CLI project (0.76.9), Express API server with Prisma ORM, and PostgreSQL schema with all 8 data models.
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
## Phase 1 Context

### Project Structure (from CONTEXT.md)
```
vitalpaw-proactive/
├── mobile/                    # React Native app
│   ├── android/               # Android native code
│   ├── ios/                   # iOS native code
│   ├── src/                   # TypeScript source
│   │   ├── components/        # Reusable UI components
│   │   ├── screens/           # Screen components
│   │   ├── navigation/        # React Navigation setup
│   │   ├── store/             # Zustand stores
│   │   ├── services/          # API clients
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Helper functions
│   ├── App.tsx                # Root component
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

### Prisma Schema Models (8 total as per Success Criterion 3)
1. **User** — id (uuid), firebaseUid (unique), email (unique), createdAt
2. **Pet** — id (uuid), name, species, breed, birthDate, weight, photoUrl, userId (FK to User), createdAt, updatedAt
3. **HealthRecord** — id (uuid), score (Int), factors (Json), petId (unique FK to Pet), calculatedAt
4. **Symptom** — id (uuid), description, severity (mild/moderate/severe), date, petId (FK to Pet)
5. **Activity** — id (uuid), steps (Int nullable), durationMinutes (Int nullable), date, petId (FK to Pet)
6. **Diet** — id (uuid), foodName, amountGrams, calories, date, petId (FK to Pet)
7. **MedicalRecord** — id (uuid), type (vaccination/checkup), name, date, nextDueDate (nullable), hospital, summary, petId (FK to Pet)
8. **Service** — id (uuid), name, type (vet/pet_store/groomer), address, latitude, longitude, phone, rating, is24Hour, isEmergency

### Tech Stack Versions (from RESEARCH.md)
| Component | Version |
|-----------|---------|
| React Native CLI | 0.76.9 |
| Express | ^5.2.1 |
| Prisma | ^7.7.0 |
| @prisma/client | ^7.7.0 |
| Zustand | ^5.0.12 |
| TypeScript | ^5.0.0 |
| PostgreSQL | 16 |

### Locked Decisions (from CONTEXT.md)
- React Native CLI (not Expo) — native modules required for maps/GPS/QR code
- Separate backend vs BaaS — full control over business logic
- Firebase Auth vs custom auth — faster implementation, proven security
- Node.js/Express with Prisma ORM backend
- PostgreSQL 16 database
- Zustand for React Native state management
</context>

<tasks>

<task type="auto">
  <name>Task 1: Initialize Git repository with .gitignore</name>
  <files>.gitignore</files>
  <action>
    1. Create .gitignore file at project root with the following content:
    
    ```
    # Dependencies
    node_modules/
    
    # Build outputs
    dist/
    build/
    .next/
    
    # Environment variables
    .env
    .env.local
    .env.*.local
    
    # OS files
    .DS_Store
    Thumbs.db
    
    # IDE
    .idea/
    .vscode/
    *.swp
    *.swo
    
    # React Native
    android/app/build/
    android/build/
    android/.gradle/
    ios/build/
    ios/Pods/
    ios/*.xcworkspace
    ios/*.xcodeproj/project.xcworkspace/
    ios/*.xcodeproj/xcuserdata/
    *.apk
    *.aab
    *.ipa
    *.app
    *.hprof
    *.jsbundle
    .expo/
    
    # Testing
    coverage/
    
    # Prisma
    server/prisma/migrations/
    
    # Logs
    *.log
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    ```
    
    2. Run `git init` to initialize the repository
    3. Run `git add .gitignore` and `git commit -m "chore: add .gitignore for Node.js and React Native"`
  </action>
  <verify>
    <automated>git ls-files | grep -q "^.gitignore$"</automated>
  </verify>
  <done>Git repository initialized, .gitignore committed, all common directories and files ignored</done>
</task>

<task type="auto">
  <name>Task 2: Initialize React Native CLI project (mobile)</name>
  <files>mobile/App.tsx, mobile/package.json, mobile/tsconfig.json, mobile/android/, mobile/ios/</files>
  <action>
    1. Run `npx react-native@0.76.9 init VitalPawProactive --version 0.76.9` to initialize React Native project in ./mobile directory
    2. If the CLI creates a subdirectory, move all contents to ./mobile and remove the extra directory
    3. Verify the project structure includes android/, ios/, App.tsx, package.json, tsconfig.json
    4. DO NOT run npm install yet — it runs automatically during init
    
    Note: On Windows, run PowerShell as Administrator if permission errors occur. Use `git config core.longpaths true` to handle long paths.
  </action>
  <verify>
    <automated>test -d mobile/android && test -d mobile/ios && test -f mobile/App.tsx</automated>
  </verify>
  <done>React Native 0.76.9 project exists at ./mobile with android/, ios/, App.tsx, package.json, tsconfig.json</done>
</task>

<task type="auto">
  <name>Task 3: Install React Native dependencies (Zustand, React Navigation)</name>
  <files>mobile/package.json</files>
  <action>
    1. Navigate to ./mobile directory
    2. Run npm install for dependencies: `npm install zustand @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context`
    3. Verify package.json has these dependencies added
    4. For iOS, run `cd ios && pod install && cd ..` to install CocoaPods dependencies
    
    Note: This task depends on Task 2 completing successfully.
  </action>
  <verify>
    <automated>grep -q "zustand" mobile/package.json && grep -q "@react-navigation/native" mobile/package.json</automated>
  </verify>
  <done>Zustand, React Navigation, react-native-screens, react-native-safe-area-context installed in mobile</done>
</task>

<task type="auto">
  <name>Task 4: Create Express server project with TypeScript and Prisma</name>
  <files>server/package.json, server/tsconfig.json, server/.env, server/prisma/schema.prisma</files>
  <action>
    1. Create ./server directory structure:
       - server/src/config/database.ts
       - server/src/controllers/health.controller.ts
       - server/src/middleware/error.middleware.ts
       - server/src/middleware/auth.middleware.ts
       - server/src/routes/index.ts
       - server/src/services/prisma.service.ts
       - server/src/index.ts
       - server/prisma/schema.prisma
       - server/.env
    
    2. Create server/package.json with dependencies:
       - express, @prisma/client, cors, dotenv (production)
       - typescript, @types/node, @types/express, @types/cors, prisma (dev)
    
    3. Create tsconfig.json for server with ESNext target, strict mode
    
    4. Create .env with DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vitalpaw?schema=public
    
    5. Create prisma/schema.prisma with generator client and datasource:
       ```prisma
       generator client {
         provider = "prisma-client-js"
       }
       
       datasource db {
         provider = "postgresql"
         url      = env("DATABASE_URL")
       }
       ```
    
    6. Add all 8 models to schema.prisma:
       - User (id, firebaseUid, email, createdAt, pets relation)
       - Pet (id, name, species, breed, birthDate, weight, photoUrl, userId, createdAt, updatedAt, relations)
       - HealthRecord (id, score, factors Json, petId unique, pet relation, calculatedAt)
       - Symptom (id, description, severity, date, petId, pet relation)
       - Activity (id, steps, durationMinutes, date, petId, pet relation)
       - Diet (id, foodName, amountGrams, calories, date, petId, pet relation)
       - MedicalRecord (id, type, name, date, nextDueDate, hospital, summary, petId, pet relation)
       - Service (id, name, type, address, latitude, longitude, phone, rating, is24Hour, isEmergency)
    
    7. Run `cd server && npm install` to install dependencies
    
    8. Run `npx prisma generate` to generate Prisma client
    
    Note: This is a large task but all files are interconnected (TypeScript config, Prisma schema, Express boilerplate all reference each other).
  </action>
  <verify>
    <automated>test -f server/prisma/schema.prisma && grep -q "model User" server/prisma/schema.prisma && grep -q "model Pet" server/prisma/schema.prisma && grep -q "model HealthRecord" server/prisma/schema.prisma && grep -q "model Symptom" server/prisma/schema.prisma && grep -q "model Activity" server/prisma/schema.prisma && grep -q "model Diet" server/prisma/schema.prisma && grep -q "model MedicalRecord" server/prisma/schema.prisma && grep -q "model Service" server/prisma/schema.prisma</automated>
  </verify>
  <done>Express server exists at ./server with TypeScript, Prisma ORM, and all 8 data models defined</done>
</task>

<task type="auto">
  <name>Task 5: Create Express boilerplate (health check endpoint)</name>
  <files>server/src/index.ts, server/src/config/database.ts, server/src/controllers/health.controller.ts</files>
  <action>
    1. Create server/src/config/database.ts:
       ```typescript
       import { PrismaClient } from '@prisma/client';
       const prisma = new PrismaClient();
       export default prisma;
       ```
    
    2. Create server/src/controllers/health.controller.ts:
       ```typescript
       import { Request, Response } from 'express';
       import prisma from '../config/database';
       
       export const healthCheck = async (req: Request, res: Response) => {
         try {
           await prisma.$queryRaw`SELECT 1`;
           res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
         } catch (error) {
           res.status(503).json({ status: 'error', database: 'disconnected', timestamp: new Date().toISOString() });
         }
       };
       ```
    
    3. Create server/src/middleware/error.middleware.ts:
       ```typescript
       import { Request, Response, NextFunction } from 'express';
       export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
         console.error('Error:', err.message);
         res.status(500).json({ error: 'Internal server error' });
       };
       ```
    
    4. Create server/src/middleware/auth.middleware.ts (stub for future Phase 2):
       ```typescript
       import { Request, Response, NextFunction } from 'express';
       export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
         // Stub - will implement JWT verification in Phase 2
         next();
       };
       ```
    
    5. Create server/src/routes/index.ts:
       ```typescript
       import { Router } from 'express';
       import { healthCheck } from '../controllers/health.controller';
       const router = Router();
       router.get('/health', healthCheck);
       export default router;
       ```
    
    6. Create server/src/index.ts:
       ```typescript
       import express from 'express';
       import cors from 'cors';
       import dotenv from 'dotenv';
       import routes from './routes';
       import { errorHandler } from './middleware/error.middleware';
       
       dotenv.config();
       const app = express();
       const PORT = process.env.PORT || 3000;
       
       app.use(cors());
       app.use(express.json());
       app.use('/api', routes);
       app.use(errorHandler);
       
       app.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
       });
       ```
    
    7. Add scripts to server/package.json:
       - "dev": "tsx watch src/index.ts"
       - "build": "tsc"
       - "start": "node dist/index.js"
       - "prisma:generate": "prisma generate"
       - "prisma:push": "prisma db push"
    
    8. Run `npm run prisma:push` to verify schema (requires PostgreSQL running)
    
    Note: If PostgreSQL is not running, this step will fail but the code is correct. Document that PostgreSQL must be running for this step.
  </action>
  <verify>
    <automated>test -f server/src/index.ts && test -f server/src/config/database.ts && grep -q "healthCheck" server/src/controllers/health.controller.ts</automated>
  </verify>
  <done>Express server has health endpoint at GET /api/health that checks database connectivity</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Internet → Server | Untrusted input from mobile app crosses here |
| Server → PostgreSQL | Database queries cross here |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-01-01 | Information Disclosure | .env | mitigate | .gitignore excludes .env, document env vars |
| T-01-02 | Denial of Service | PostgreSQL connection | accept | No connection pooling configured yet (Phase 2+) |
</threat_model>

<verification>
## Phase 1 Verification Checklist

After completing this plan, verify each success criterion:

1. **React Native CLI project initializes without errors on both iOS and Android**
   - [ ] `test -d mobile/android` — Android directory exists
   - [ ] `test -d mobile/ios` — iOS directory exists
   - [ ] `grep -q "0.76.9" mobile/package.json` — Correct version

2. **Express API server starts and connects to PostgreSQL database**
   - [ ] `test -f server/src/index.ts` — Entry point exists
   - [ ] `grep -q "@prisma/client" server/package.json` — Prisma installed
   - [ ] `curl localhost:3000/api/health` returns 200 (after starting server)

3. **Prisma schema defines all data models**
   - [ ] `grep -c "^model" server/prisma/schema.prisma` returns 8
   - [ ] All 8 models present: User, Pet, HealthRecord, Symptom, Activity, Diet, MedicalRecord, Service

4. **Git repository initialized with appropriate .gitignore**
   - [ ] `git ls-files | grep -q "^.gitignore$"` — .gitignore committed
   - [ ] `grep -q "node_modules" .gitignore`
   - [ ] `grep -q "*.apk" .gitignore`

5. **Project builds successfully for development (debug APK/IPA)**
   - [ ] `cd mobile && npm run android` completes (produces APK)
   - [ ] `cd mobile && npm run ios` completes on macOS
</verification>

<success_criteria>
Phase 1 is complete when ALL of the following are TRUE:
- Git repository exists with proper .gitignore committed
- React Native 0.76.9 project exists at ./mobile with all dependencies
- Express server exists at ./server with TypeScript configuration
- Prisma schema contains all 8 models (User, Pet, HealthRecord, Symptom, Activity, Diet, MedicalRecord, Service)
- Express server starts with `npm run dev` and health endpoint responds
- Mobile Android build completes with `npm run android`
- iOS build completes with `npm run ios` (macOS only)
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1/01-SUMMARY.md`
</output>
