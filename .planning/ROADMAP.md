# VitalPaw Proactive - Roadmap

**Project:** VitalPaw Proactive  
**Version:** 1.0  
**Created:** 2026-04-19  

## Overview

Proactive pet healthcare platform enabling pet owners to track health scores, log symptoms with AI analysis, find nearby pet services, and manage digital pet IDs with medical history.

## Core Value

Pet owners can proactively manage their pets' health with AI-powered symptom analysis and timely veterinary connections, reducing emergency situations through early detection.

## Tech Stack

- **Frontend:** React Native CLI 0.76.x with Zustand
- **Backend:** Node.js/Express with Prisma ORM
- **Database:** PostgreSQL 16
- **Auth:** Firebase Auth with JWT token exchange
- **Maps:** react-native-maps with Google Maps API

---

## Phases

- [ ] **Phase 1: Project Foundation** - React Native project, Express API boilerplate, PostgreSQL schema, Git structure
- [ ] **Phase 2: Authentication & Pet Profiles** - Firebase Auth, token exchange, pet CRUD operations
- [ ] **Phase 3: Health Tracking & AI** - Health score, symptom logging, activity, diet, dashboard
- [ ] **Phase 4: Services Map** - Nearby pet services with filters and service contact
- [ ] **Phase 5: Digital Pet ID & Medical Records** - QR code generation, medical history cards
- [ ] **Phase 6: Notifications & Launch Prep** - Push notifications, offline support, EAS build

---

## Phase Details

### Phase 1: Project Foundation

**Goal:** Development environment established with React Native project, Express API boilerplate, PostgreSQL schema, and Git structure

**Depends on:** Nothing

**Requirements:** None (infrastructure only)

**Success Criteria** (what must be TRUE):

1. React Native CLI project initializes without errors on both iOS and Android
2. Express API server starts and connects to PostgreSQL database
3. Prisma schema defines all data models (User, Pet, HealthRecord, Symptom, Activity, Diet, MedicalRecord, Service)
4. Git repository initialized with appropriate .gitignore for Node.js and React Native
5. Project builds successfully for development (debug APK/IPA)

**Plans:** 1 plan

Plans:
- [x] 01-01-PLAN.md — Initialize Git, React Native project, Express server with Prisma

**UI hint:** yes

---

### Phase 2: Authentication & Pet Profiles

**Goal:** Users can securely create accounts, log in, and manage their pets

**Depends on:** Phase 1

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, PET-01, PET-02, PET-03, PET-04, PET-05, DASH-01

**Success Criteria** (what must be TRUE):

1. User can sign up with email and password and receive confirmation
2. User can log in with email/password and access the app
3. User session persists across app restarts without re-authenticating
4. User can log out from any screen and return to login
5. Firebase ID token is exchanged for backend JWT on successful login
6. User can add a new pet with name, species, breed, birth_date, weight, and photo
7. User can view a list of all their registered pets
8. User can edit any pet profile information
9. User can delete a pet profile with confirmation
10. Pet profile displays species-appropriate icon (dog, cat, bird, etc.)
11. Dashboard displays health score prominently upon login

**Plans:** TBD

**UI hint:** yes

---

### Phase 3: Health Tracking & AI

**Goal:** Users can track their pets' health metrics with AI-powered symptom analysis

**Depends on:** Phase 2

**Requirements:** HLTH-01, HLTH-02, HLTH-03, HLTH-04, SYMP-01, SYMP-02, SYMP-03, SYMP-04, SYMP-05, SYMP-06, ACT-01, ACT-02, ACT-03, ACT-04, DIET-01, DIET-02, DIET-03, DIET-04, DASH-02, DASH-03, DASH-04, NOTE-02

**Success Criteria** (what must be TRUE):

1. Health score displays as numeric value (0-100) calculated from age, activity, and diet factors
2. Health score breakdown shows user which factors contribute to the score
3. Score updates automatically when new health data is logged
4. User can log a symptom with date and severity level (mild/moderate/severe)
5. User can view complete symptom history organized by date
6. User can edit or delete existing symptom records
7. AI analyzes symptom patterns and provides risk assessment (phrased as probability, not diagnosis)
8. High-risk symptom patterns trigger an alert recommending veterinary consultation
9. User can log daily step count and activity duration in minutes
10. Activity data displays in a 7-day line chart
11. Activity goal progress shows percentage toward daily target
12. User can log meals with food name, amount in grams, and calories
13. Daily calorie intake displays compared to recommended amount
14. Macronutrient breakdown (protein, fat, carbs) is visible
15. Diet chart shows weekly nutrient trends
16. Dashboard shows upcoming care reminders
17. Dashboard provides quick action buttons for Symptom Log, Activity, Diet, and Emergency
18. Recent activity feed is visible on dashboard
19. App alerts user when symptom pattern indicates high risk

**Plans:** TBD

**UI hint:** yes

---

### Phase 4: Services Map

**Goal:** Users can find nearby pet services with filtering and direct contact

**Depends on:** Phase 2

**Requirements:** MAP-01, MAP-02, MAP-03, MAP-04, MAP-05, MAP-06, MAP-07

**Success Criteria** (what must be TRUE):

1. Map displays nearby pet services (veterinaries, pet stores) within search radius
2. User can filter map results by service type (vet, pet store, groomer, etc.)
3. User can filter to show only 24-hour availability services
4. User can filter to show only emergency service providers
5. Service cards display distance from user, rating, and open/closed status
6. User can tap to call a service directly from the card
7. User can tap to open navigation to service location

**Plans:** TBD

**UI hint:** yes

---

### Phase 5: Digital Pet ID & Medical Records

**Goal:** Users can access digital pet IDs and medical history records

**Depends on:** Phase 3

**Requirements:** MED-01, MED-02, MED-03, MED-04, ID-01, ID-02, ID-03, ID-04

**Success Criteria** (what must be TRUE):

1. User can add vaccination records with name, date administered, and next due date
2. User can add checkup records with date, hospital name, and summary notes
3. Medical records display as cards grouped by type (vaccinations, checkups)
4. Dashboard shows upcoming vaccination reminders
5. Pet profile generates a unique QR code containing pet ID and owner contact
6. QR code is scannable by shelters/vets to retrieve pet emergency info
7. Digital ID card displays essential info (name, species, weight, age)
8. Emergency contact phone number is accessible from ID card

**Plans:** TBD

**UI hint:** yes

---

### Phase 6: Notifications & Launch Prep

**Goal:** App is ready for production with push notifications and offline support

**Depends on:** Phase 5

**Requirements:** NOTE-01, NOTE-03

**Success Criteria** (what must be TRUE):

1. App sends push notifications for upcoming vaccination reminders
2. User can view notification history within the app
3. App caches critical data (pet profiles, medical records) for offline viewing
4. Error boundaries handle crashes gracefully with user-friendly messages
5. EAS build completes successfully for both iOS and Android

**Plans:** TBD

**UI hint:** yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Foundation | 1/1 | Planning complete | - |
| 2. Authentication & Pet Profiles | 0/11 | Not started | - |
| 3. Health Tracking & AI | 0/19 | Not started | - |
| 4. Services Map | 0/7 | Not started | - |
| 5. Digital Pet ID & Medical Records | 0/8 | Not started | - |
| 6. Notifications & Launch Prep | 0/5 | Not started | - |

---

## Coverage

**Total v1 Requirements:** 50

| Phase | Requirements |
|-------|--------------|
| 1 | Infrastructure (0 mapped) |
| 2 | AUTH-01–05, PET-01–05, DASH-01 (11) |
| 3 | HLTH-01–04, SYMP-01–06, ACT-01–04, DIET-01–04, DASH-02–04, NOTE-02 (22) |
| 4 | MAP-01–07 (7) |
| 5 | MED-01–04, ID-01–04 (8) |
| 6 | NOTE-01, NOTE-03 (2) |

**Coverage:** 50/50 requirements mapped ✓

---

*Last updated: 2026-04-19 after roadmap creation*
