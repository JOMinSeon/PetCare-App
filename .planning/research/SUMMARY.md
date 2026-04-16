# Project Research Summary

**Project:** VitalPaw Proactive (Pet Health & Wellness Tracker)
**Domain:** Pet Health & Wellness Mobile App
**Researched:** 2026-04-16
**Confidence:** MEDIUM

## Executive Summary

VitalPaw Proactive is a cross-platform pet health tracking mobile application enabling pet owners to monitor their pets' health metrics (weight, activity, medications, vaccinations) and receive proactive wellness alerts. Industry analysis reveals a market gap: hardware-heavy competitors (FitBark, Tractive) dominate GPS/health tracking while software-only solutions (11pets) lack robust data visualization. This positions VitalPaw to differentiate through proactive health insights and intuitive data presentation.

Experts build pet health apps using React Native with Expo SDK for cross-platform efficiency, TypeScript for type safety, and React Navigation 7.x as the community standard. The recommended architecture emphasizes container/presentational component separation, service layer abstraction for testability, and offline-first data persistence. Critical pitfalls include storing sensitive health data in unencrypted AsyncStorage, FlatList performance collapse with history data, and chart rendering that blocks the JS thread.

Key risks requiring mitigation: (1) AsyncStorage security vulnerability—never store health data or tokens unencrypted; (2) Performance degradation in dashboard/history screens—implement getItemLayout and memoization early; (3) Offline capability—pet owners need reliable data entry without network dependency. Success depends on building a solid offline-first data layer before adding visualization features.

## Key Findings

### Recommended Stack

**Core technologies with rationale:**

| Technology | Purpose | Rationale |
|------------|---------|-----------|
| React Native 0.85.x | Mobile framework | User-specified; cross-platform efficiency |
| TypeScript 5.x | Type safety | Catches errors at compile time, better DX |
| Expo SDK 52+ | Development workflow | Faster dev cycles, managed builds, excellent docs |
| React Navigation 7.x | Navigation | Community standard for RN navigation |

**Supporting libraries:**

| Library | Purpose | Key Consideration |
|---------|---------|-------------------|
| @react-native-async-storage/async-storage 2.x | Local data persistence | Pet profiles, health logs; NOT for sensitive data |
| react-native-chart-kit 6.x | Data visualization | Weight/activity graphs; requires native driver optimization |
| expo-secure-store | Secure token storage | Auth tokens, sensitive credentials—use instead of AsyncStorage for tokens |
| date-fns 3.x | Date manipulation | History log filtering, date ranges |
| zustand 5.x | State management | Lightweight alternative to Context for global state |
| expo-notifications | Push notifications | Medication reminders, vet appointments |

**Version compatibility:** Expo SDK 52 requires React Native 0.76+; React Navigation 7.x requires Expo SDK 50+; AsyncStorage 2.x requires Node 18+ and RN 0.76+.

### Expected Features

**Must have (table stakes)—missing these = product feels incomplete:**
- Pet profile management (name, breed, age, weight, photo)
- Weight logging with trend graphs
- Activity tracking (steps, distance, active minutes)
- Medication reminders with push notifications
- Vaccination records with due date alerts
- Health history timeline (chronological log of events)
- Data visualization (charts for weight, activity over time)
- Multi-pet support (tab-based or list-based navigation)

**Should have (competitive differentiators):**
- Date range filtering (7 days, 30 days, 90 days, 1 year views)
- Vet appointment reminders with calendar sync
- Family/caregiver sharing with granular permissions
- Vet record export (PDF summary for vet visits)
- Benchmark comparison ("how does my dog compare to others their age/breed")
- Early health alerts (requires baseline data, ML pattern recognition)

**Defer to v2+ (hardware-dependent or high complexity):**
- GPS tracking / virtual fences (requires hardware or phone GPS; subscription model)
- Wearable integration (Fitbit, Google Fit, Apple Watch sync)
- Real-time vet video consultation (high infrastructure cost; low utilization)
- Auto-diagnosis from symptoms (liability risk; requires physical exam)
- Service marketplace (vet booking; requires partner integrations)

### Architecture Approach

React Native pet health apps follow container/presentational component separation with custom hooks for business logic encapsulation. React Navigation (bottom-tabs + native-stack) is the community standard. State architecture uses Context + useReducer for global state (pets, health data, auth) with local useState for ephemeral UI state. Service layer abstraction (API/storage separated from components) enables testability and offline support.

**Major components and responsibilities:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Navigation Container (NavigationContainer + Root Navigator)    │
└─────────────────────────────────────────────────────────────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
Bottom Tab    Stack Navigator
Navigator     (per feature)
    │
    ▼
Screen Components ←→ Context Providers ←→ Service Layer
(containers)       (global state)        (api/storage)
    │
    ▼
Presentational Components (reusable UI: cards, charts, forms)
```

**Project structure rationale:**
- `screens/`: Page-level views, separated from reusable components; feature-based subfolders (Dashboard, History, Services, Profile)
- `components/`: Organized by purpose (common, charts, pets, forms) not by screen; promotes reuse
- `hooks/`: Custom hooks encapsulate business logic; each domain (pets, health data, auth) gets own hook
- `contexts/`: Global state accessible throughout app (current pet, user session, theme)
- `services/`: Separated into api/ (remote), storage/ (local), analytics; enables mocking and swapping implementations
- `types/`: Centralized TypeScript definitions; navigation types essential for type-safe routing

**Data flow:** User Action → Screen Component → Custom Hook → Service Layer → (Local Storage or API) → Context Reducer → UI Re-render

### Critical Pitfalls

**Top 5 pitfalls requiring early prevention:**

1. **AsyncStorage security** — Never store health data or tokens in unencrypted AsyncStorage. Pet health data (weight records, medical history, vaccination dates) is sensitive. Use expo-secure-store for credentials and tokens. Phase: Phase 2 (Data Layer)

2. **FlatList performance collapse** — History logs without getItemLayout, memoization, and proper windowing become unresponsive at 50+ records. Implement getItemLayout for predictable row heights, use React.memo on list items, move renderItem outside component. Phase: Phase 3 (Dashboard)

3. **Chart JS thread blocking** — JavaScript-based chart animations without native driver block UI. Use useNativeDriver: true, memoize chart components, consider SVG-based charts with native rendering. Phase: Phase 3 (Dashboard)

4. **Token-based auth instability** — Cookie-based auth behaves inconsistently between iOS and Android. Use JWT stored in Keychain (iOS) / EncryptedSharedPreferences (Android), not AsyncStorage. Phase: Phase 2 (Data Layer)

5. **Offline-first neglect** — Pet owners need to log data regardless of connectivity. Implement local persistence (SQLite/WatermelonDB), queue API calls when offline, use optimistic UI updates. Phase: Phase 2 (Data Layer)

**Additional pitfalls requiring Phase 1 attention:**
- Console.log performance drain in production (use babel-plugin-transform-remove-console)
- Touch target size violations (minimum 44x44pt for accessibility)
- Missing input validation (validate weight > 0, no future dates for past events)
- Deep linking security (use universal links, not custom URL schemes with raw IDs)

## Implications for Roadmap

### Phase 1: Foundation & Infrastructure
**Rationale:** No features can be built without solid navigation and state management foundation. Performance patterns established here affect all subsequent phases.

**Delivers:** Project setup with Expo, TypeScript configuration, navigation structure (bottom tabs + stacks), Context providers for pets/auth/theme, screen skeletons for all tabs, basic presentational components.

**Avoids:** Console.log drain (babel config), touch target violations (design system), prop drilling anti-pattern.

**Key decisions:** Stack variant (Expo vs bare RN CLI), folder organization strategy, state management approach (Context + useReducer vs Zustand).

### Phase 2: Data Layer & Core Features
**Rationale:** Health data must persist across app restarts and work offline. Security cannot be an afterthought.

**Delivers:** Pet CRUD operations, health log entries (weight, activity, diet), AsyncStorage persistence for non-sensitive data, expo-secure-store for tokens, offline queue, input validation, deep linking security.

**Avoids:** AsyncStorage security pitfall, offline-first pitfall, input validation pitfall, token auth pitfall.

**Research flag:** Vet API integration research needed before Phase 5.

### Phase 3: Dashboard & Visualization
**Rationale:** Core value proposition—pet owners need to see their pet's health at a glance. This is where the app differentiates.

**Delivers:** Dashboard with pet selector and quick stats, weight/activity/diet charts with date filtering, health alert cards, data entry forms (weight, activity, diet), image optimization for pet photos.

**Avoids:** FlatList performance pitfall, chart JS thread blocking pitfall, image memory pressure pitfall.

**Research flag:** Chart performance may need deeper profiling on mid-range devices.

### Phase 4: History & Detail Views
**Rationale:** Complete the data story—log → view → analyze. Users need to drill into historical records.

**Delivers:** History list with FlatList (properly optimized), detail screens for each health metric (weight detail, activity detail, diet detail), search and filter functionality, date range selection, export functionality (PDF for vet visits).

**Key implementation:** Ensure getItemLayout, memoization, and proper FlatList configuration are in place before building this phase.

### Phase 5: Services & Notifications
**Rationale:** Differentiating features that add value beyond basic tracking. Built on solid core.

**Delivers:** Vet appointment reminders with calendar integration, medication reminders with push notifications, vaccination due date alerts, family sharing with granular permissions, vet record sharing.

**Research flag:** Vet integration API research needed; calendar integration patterns.

### Phase 6: Polish & Backend (Optional for v1)
**Rationale:** For teams planning cloud sync and advanced features.

**Delivers:** Real API integration (currently using mocks), offline queue completion, authentication flows, performance optimization pass, accessibility audit, multi-pet support refinement.

### Research Flags

- **Phase 3 (Dashboard):** Chart performance profiling recommended—test on mid-range Android device (1GB RAM)
- **Phase 5 (Services):** Vet API integration patterns need research; calendar integration approach
- **Architecture:** Expo vs bare React Native CLI decision affects native module choices (recommend starting with Expo for faster iteration)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | React Navigation and core libraries well-documented; Expo SDK choice aligns with user context; alternatives documented |
| Features | MEDIUM | Based on competitor analysis (FitBark, Tractive, 11pets, PetDesk); user validation recommended before Phase 3 |
| Architecture | MEDIUM | Standard React Native patterns; no domain-specific nuances identified; service layer and offline patterns well-established |
| Pitfalls | HIGH | Sourced from official React Native docs (v0.85); specific phase mapping provides clear implementation guidance |

**Overall confidence:** MEDIUM

### Gaps to Address

- **Expo vs bare React Native CLI decision:** Affects native module choices. Recommend Expo for v1 unless custom native modules required.
- **Backend API requirements:** Current research assumes local-only with offline queue. Cloud sync architecture needs clarification.
- **Multi-pet support scope for v1:** MVP could focus on single-pet with multi-pet architecture in place, or implement full multi-pet from start.
- **User validation:** Feature prioritization based on competitor analysis; direct user interviews recommended before Phase 3 development.

## Sources

### Primary (HIGH confidence)
- React Native Official Docs — https://reactnative.dev/docs/security, https://reactnative.dev/docs/performance, https://reactnative.dev/docs/optimizing-flatlist-configuration
- React Navigation Docs — https://reactnavigation.org/docs/getting-started
- React Native Architecture Overview — https://reactnative.dev/docs/architecture-overview

### Secondary (MEDIUM confidence)
- Expo Documentation — https://docs.expo.dev
- React Native Community Packages — https://reactnative.directory
- Competitor analysis: FitBark (product website, Mayo Clinic research partner), Tractive (product website, Early Health Alerts), 11pets (care management), PetDesk (appointment booking)
- React Native FlatList Optimization — Official docs

---
*Research completed: 2026-04-16*
*Ready for roadmap: yes*