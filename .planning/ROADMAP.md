# Roadmap: VitalPaw Proactive

**Phases:** 4 | **Requirements:** 44 mapped | **Granularity:** coarse

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Foundation & Core UI | Navigation, auth basics, pet profiles, dashboard, UI components | 19 | 13 |
| 2 | Data Layer & Health Tracking | Pet CRUD, health logs, secure storage, offline persistence | 12 | 7 |
| 3 | Dashboard & Visualization | Charts, date filtering, history log, detail views | 13 | 6 |
| 4 | Services & Notifications | Vet appointments, medication reminders, push notifications, profile | 6 | 5 |

## Phase Details

### Phase 1: Foundation & Core UI

**Goal:** Users can navigate the app, authenticate, manage basic pet profiles, and view the dashboard with key health metrics.

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, PETP-01, PETP-02, PETP-03, DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, PROF-01, UI-01, UI-02, UI-03, UI-05, UI-06, TECH-02

**Success Criteria:**
1. User can create account with email and password
2. User receives email verification after signup
3. User can log in and stay logged in across sessions
4. User can log out from any page
5. User can add a pet with name, species, breed, birthdate, weight
6. User can edit existing pet profile information
7. User can view pet profile summary on dashboard
8. Dashboard displays pet greeting with status summary
9. Dashboard shows top 3-4 key metrics (weight, activity, condition)
10. Dashboard shows alert cards for important notifications
11. Dashboard provides quick action buttons for common tasks
12. Tab navigation shows visual feedback on selection
13. All card, metric, action button, and input form components render correctly

**Plans:**
- [ ] 01-01-PLAN.md — Authentication foundation + tab navigation visual feedback
- [ ] 01-02-PLAN.md — Pet profile management (add/edit/view)
- [ ] 01-03-PLAN.md — UI component verification + Dashboard/Profile implementation

**Research Flags:**
- None — standard React Native patterns

---

### Phase 2: Data Layer & Health Tracking

**Goal:** Users can securely log and track health data (weight, activity, medications, vaccinations) with offline support.

**Requirements:** AUTH-05, HLTH-01, HLTH-02, HLTH-03, HLTH-04, HLTH-05, TECH-01, TECH-03

**Success Criteria:**
1. User session persists securely using Keychain/Expo Secure Store
2. User can log weight entries with date and value
3. User can log activity entries (type, duration, intensity)
4. User can set medication reminders with frequency
5. User can log vaccination records with date and vaccine type
6. User can view health history timeline
7. App works offline with local data persistence
8. Sensitive data (tokens, health records) stored securely

**Research Flags:**
- None — AsyncStorage and expo-secure-store patterns well-documented

---

### Phase 3: Dashboard & Visualization

**Goal:** Users can visualize health trends with charts, filter by date range, and browse detailed health history.

**Requirements:** PETP-04, VIS-01, VIS-02, VIS-03, VIS-04, HIST-01, HIST-02, HIST-03, HIST-04, UI-04, TECH-04

**Success Criteria:**
1. User can view weight trend chart on dashboard
2. User can view activity summary chart on dashboard
3. User can filter data by date range (7 days to 1 year)
4. Charts show target lines and normal range shading
5. User can upload pet photo
6. User can view chronological feed of all health entries
7. User can filter history by entry type (weight, activity, medication, vaccination)
8. User can search history by date or keyword
9. Each history entry shows date, type icon, title, and brief summary
10. FlatList history performs smoothly with 50+ records

**Research Flags:**
- Chart performance may need profiling on mid-range Android devices

---

### Phase 4: Services & Notifications

**Goal:** Users can book vet appointments, receive medication reminders via push notifications, and manage notification preferences.

**Requirements:** SERV-01, SERV-02, SERV-03, SERV-04, PROF-02, PROF-03

**Success Criteria:**
1. User can book vet appointments with date/time selection
2. User can view upcoming appointments
3. User receives push notifications for medication reminders
4. User can access health tips and educational content
5. User can manage notification preferences

**Research Flags:**
- Vet API integration patterns need research before implementation
- Calendar integration approach needed for appointment booking

---

## Traceability

All 44 v1 requirements mapped to phases ✓

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 2 | Pending |
| PETP-01 | Phase 1 | Pending |
| PETP-02 | Phase 1 | Pending |
| PETP-03 | Phase 1 | Pending |
| PETP-04 | Phase 3 | Pending |
| HLTH-01 | Phase 2 | Pending |
| HLTH-02 | Phase 2 | Pending |
| HLTH-03 | Phase 2 | Pending |
| HLTH-04 | Phase 2 | Pending |
| HLTH-05 | Phase 2 | Pending |
| VIS-01 | Phase 3 | Pending |
| VIS-02 | Phase 3 | Pending |
| VIS-03 | Phase 3 | Pending |
| VIS-04 | Phase 3 | Pending |
| HIST-01 | Phase 3 | Pending |
| HIST-02 | Phase 3 | Pending |
| HIST-03 | Phase 3 | Pending |
| HIST-04 | Phase 3 | Pending |
| DASH-01 | Phase 1 | Pending |
| DASH-02 | Phase 1 | Pending |
| DASH-03 | Phase 1 | Pending |
| DASH-04 | Phase 1 | Pending |
| DASH-05 | Phase 1 | Pending |
| SERV-01 | Phase 4 | Pending |
| SERV-02 | Phase 4 | Pending |
| SERV-03 | Phase 4 | Pending |
| SERV-04 | Phase 4 | Pending |
| PROF-01 | Phase 1 | Pending |
| PROF-02 | Phase 4 | Pending |
| PROF-03 | Phase 4 | Pending |
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| UI-03 | Phase 1 | Pending |
| UI-04 | Phase 3 | Pending |
| UI-05 | Phase 1 | Pending |
| UI-06 | Phase 1 | Pending |
| TECH-01 | Phase 2 | Pending |
| TECH-02 | Phase 1 | Pending |
| TECH-03 | Phase 2 | Pending |
| TECH-04 | Phase 3 | Pending |

---

## Next

Run `/gsd-plan-phase 1` to start Phase 1 execution.