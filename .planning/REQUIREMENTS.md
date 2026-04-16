# Requirements: VitalPaw Proactive

**Defined:** 2026-04-16
**Core Value:** Pet owners can confidently monitor and manage their companion animals' health through unified data tracking and proactive care recommendations.

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can create account with email and password
- [ ] **AUTH-02**: User receives email verification after signup
- [ ] **AUTH-03**: User can log in and stay logged in across sessions
- [ ] **AUTH-04**: User can log out from any page
- [ ] **AUTH-05**: User session persists securely using Keychain/Expo Secure Store

### Pet Profiles

- [ ] **PETP-01**: User can add a pet with name, species, breed, birthdate, weight
- [ ] **PETP-02**: User can edit existing pet profile information
- [ ] **PETP-03**: User can view pet profile summary on dashboard
- [ ] **PETP-04**: User can upload pet photo

### Health Tracking

- [ ] **HLTH-01**: User can log weight entries with date and value
- [ ] **HLTH-02**: User can log activity entries (type, duration, intensity)
- [ ] **HLTH-03**: User can set medication reminders with frequency
- [ ] **HLTH-04**: User can log vaccination records with date and vaccine type
- [ ] **HLTH-05**: User can view health history timeline

### Data Visualization

- [ ] **VIS-01**: User can view weight trend chart on dashboard
- [ ] **VIS-02**: User can view activity summary chart on dashboard
- [ ] **VIS-03**: User can filter data by date range (7 days to 1 year)
- [ ] **VIS-04**: Charts show target lines and normal range shading

### History Log

- [ ] **HIST-01**: User can view chronological feed of all health entries
- [ ] **HIST-02**: User can filter history by entry type (weight, activity, medication, vaccination)
- [ ] **HIST-03**: User can search history by date or keyword
- [ ] **HIST-04**: Each history entry shows date, type icon, title, and brief summary

### Dashboard

- [ ] **DASH-01**: Dashboard displays pet greeting with status summary
- [ ] **DASH-02**: Dashboard shows top 3-4 key metrics (weight, activity, condition)
- [ ] **DASH-03**: Dashboard shows alert cards for important notifications
- [ ] **DASH-04**: Dashboard provides quick action buttons for common tasks
- [ ] **DASH-05**: Dashboard shows recent activity feed

### Services

- [ ] **SERV-01**: User can book vet appointments with date/time selection
- [ ] **SERV-02**: User can view upcoming appointments
- [ ] **SERV-03**: User receives push notifications for medication reminders
- [ ] **SERV-04**: User can access health tips and educational content

### Profile & Settings

- [ ] **PROF-01**: User can manage account settings (email, password)
- [ ] **PROF-02**: User can manage notification preferences
- [ ] **PROF-03**: User can view payment/subscription history

### UI Components

- [ ] **UI-01**: Card component for grouping related information
- [ ] **UI-02**: Metric Display component for single-value emphasis
- [ ] **UI-03**: Action Button component (Primary/Secondary styles)
- [ ] **UI-04**: Chart/Graph component with date filtering
- [ ] **UI-05**: Input Form components (date picker, dropdown, numeric input)
- [ ] **UI-06**: Tab navigation with visual feedback (underline animation, color change)

### Technical

- [ ] **TECH-01**: App works offline with local data persistence
- [ ] **TECH-02**: Console.log stripped from production builds
- [ ] **TECH-03**: Secure storage for sensitive data (tokens, health records)
- [ ] **TECH-04**: FlatList optimized with getItemLayout and memoization

## v2 Requirements

### Advanced Features

- **GPS tracking and virtual fences** — Requires hardware integration
- **Hardware/wearable device integration** — Step counting, sleep monitoring
- **Real-time vet video consultation** — High complexity, liability concerns
- **Multi-pet household management** — Single pet focus for v1
- **Family sharing** — Allow multiple family members to view/edit pet data

### Extended Services

- **Vet record export (PDF)** — Share records with different vets
- **Sleep monitoring** — If wearable integration added
- **Stress monitoring** — If wearable integration added
- **Health alerts with AI insights** — Proactive anomaly detection

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time vet video chat | High complexity, liability concerns, not core to health tracking value |
| Auto-diagnosis | Liability issues, requires medical professional involvement |
| Social features (pet profiles, followers) | Distracts from core health tracking value |
| Multi-pet management advanced billing | Single pet focus for v1 |
| GPS tracking without hardware | Requires wearables or phone GPS permission flow |
| Hardware wearable integration | V2+ feature, depends on ecosystem partnerships |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

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
| HIST-01 | Phase 4 | Pending |
| HIST-02 | Phase 4 | Pending |
| HIST-03 | Phase 4 | Pending |
| HIST-04 | Phase 4 | Pending |
| DASH-01 | Phase 1 | Pending |
| DASH-02 | Phase 1 | Pending |
| DASH-03 | Phase 1 | Pending |
| DASH-04 | Phase 1 | Pending |
| DASH-05 | Phase 1 | Pending |
| SERV-01 | Phase 5 | Pending |
| SERV-02 | Phase 5 | Pending |
| SERV-03 | Phase 5 | Pending |
| SERV-04 | Phase 5 | Pending |
| PROF-01 | Phase 1 | Pending |
| PROF-02 | Phase 5 | Pending |
| PROF-03 | Phase 6 | Pending |
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

**Coverage:**
- v1 requirements: 44 total
- Mapped to phases: 44
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-16*
*Last updated: 2026-04-16 after initial definition*