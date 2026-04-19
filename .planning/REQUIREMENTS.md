# Requirements: VitalPaw Proactive

**Defined:** 2026-04-19
**Core Value:** Pet owners can proactively manage their pets' health with AI-powered symptom analysis and timely veterinary connections

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password
- [ ] **AUTH-02**: User can log in with email/password
- [ ] **AUTH-03**: User session persists across app restarts
- [ ] **AUTH-04**: User can log out from any screen
- [ ] **AUTH-05**: Firebase ID token exchanged for backend JWT on login

### Pet Profiles

- [ ] **PET-01**: User can add a new pet (name, species, breed, birth_date, weight, photo)
- [ ] **PET-02**: User can view list of their pets
- [ ] **PET-03**: User can edit pet profile information
- [ ] **PET-04**: User can delete a pet profile
- [ ] **PET-05**: Pet profile displays species-appropriate icon

### Health Score

- [ ] **HLTH-01**: Health score calculated from age, activity, diet factors
- [ ] **HLTH-02**: Health score displayed as numeric value (0-100)
- [ ] **HLTH-03**: Health score breakdown shown to user (what factors contribute)
- [ ] **HLTH-04**: Score updates when new data logged

### Symptom Tracking

- [ ] **SYMP-01**: User can log symptom with date and severity (mild/moderate/severe)
- [ ] **SYMP-02**: User can view symptom history by date
- [ ] **SYMP-03**: User can edit existing symptom records
- [ ] **SYMP-04**: User can delete symptom records
- [ ] **SYMP-05**: AI analyzes symptom patterns and provides risk assessment
- [ ] **SYMP-06**: High-risk patterns trigger alert recommending vet consultation

### Activity Tracking

- [ ] **ACT-01**: User can log daily steps count
- [ ] **ACT-02**: User can log activity duration (minutes)
- [ ] **ACT-03**: Activity data displayed in line chart (7-day view)
- [ ] **ACT-04**: Activity goal progress shown (percentage of daily target)

### Diet Planning

- [ ] **DIET-01**: User can log meals (food name, amount in grams, calories)
- [ ] **DIET-02**: Daily calorie intake displayed vs recommended
- [ ] **DIET-03**: Macronutrient breakdown shown (protein, fat, carbs)
- [ ] **DIET-04**: Diet chart shows weekly nutrient trends

### Medical Records

- [ ] **MED-01**: User can add vaccination records (name, date, next due date)
- [ ] **MED-02**: User can add checkup records (date, hospital, summary)
- [ ] **MED-03**: Medical records displayed as cards grouped by type
- [ ] **MED-04**: Upcoming vaccinations shown in dashboard reminders

### Digital Pet ID

- [ ] **ID-01**: Pet profile generates unique QR code
- [ ] **ID-02**: QR code contains pet ID and owner contact info
- [ ] **ID-03**: Digital ID card shows essential info (name, species, weight, age)
- [ ] **ID-04**: Emergency contact phone number accessible from ID card

### Services Map

- [ ] **MAP-01**: Map displays nearby pet services (veterinaries, pet stores)
- [ ] **MAP-02**: User can filter by service type
- [ ] **MAP-03**: User can filter by "24-hour" availability
- [ ] **MAP-04**: User can filter by "emergency service" availability
- [ ] **MAP-05**: Service cards show distance, rating, open/closed status
- [ ] **MAP-06**: User can call service directly from card
- [ ] **MAP-07**: User can open navigation to service location

### Dashboard

- [ ] **DASH-01**: Dashboard shows health score prominently
- [ ] **DASH-02**: Dashboard shows upcoming care reminders
- [ ] **DASH-03**: Quick action buttons for: Symptom Log, Activity, Diet, Emergency
- [ ] **DASH-04**: Recent activity feed visible on dashboard

### Notifications

- [ ] **NOTE-01**: App sends reminder for upcoming vaccinations
- [ ] **NOTE-02**: App alerts user when symptom pattern indicates high risk
- [ ] **NOTE-03**: User can view notification history

## v2 Requirements

### Advanced Features

- **ADV-01**: Push notifications for medication reminders
- **ADV-02**: Personalized diet recommendations based on health issues
- **ADV-03**: Community features (local walking groups)
- **ADV-04**: Veterinarian chat (async messaging)
- **ADV-05**: Insurance product recommendations based on health data

## Out of Scope

| Feature | Reason |
|---------|--------|
| Video consultations | Infrastructure cost too high for v1 |
| Real-time vet chat | Requires 24/7 staffing, defer to future |
| Social media feed | Not core to health management value |
| Pet supply marketplace | Scope creep, can integrate later |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 2 | Pending |
| AUTH-02 | Phase 2 | Pending |
| AUTH-03 | Phase 2 | Pending |
| AUTH-04 | Phase 2 | Pending |
| AUTH-05 | Phase 2 | Pending |
| PET-01 | Phase 2 | Pending |
| PET-02 | Phase 2 | Pending |
| PET-03 | Phase 2 | Pending |
| PET-04 | Phase 2 | Pending |
| PET-05 | Phase 2 | Pending |
| DASH-01 | Phase 2 | Pending |
| HLTH-01 | Phase 3 | Pending |
| HLTH-02 | Phase 3 | Pending |
| HLTH-03 | Phase 3 | Pending |
| HLTH-04 | Phase 3 | Pending |
| SYMP-01 | Phase 3 | Pending |
| SYMP-02 | Phase 3 | Pending |
| SYMP-03 | Phase 3 | Pending |
| SYMP-04 | Phase 3 | Pending |
| SYMP-05 | Phase 3 | Pending |
| SYMP-06 | Phase 3 | Pending |
| ACT-01 | Phase 3 | Pending |
| ACT-02 | Phase 3 | Pending |
| ACT-03 | Phase 3 | Pending |
| ACT-04 | Phase 3 | Pending |
| DIET-01 | Phase 3 | Pending |
| DIET-02 | Phase 3 | Pending |
| DIET-03 | Phase 3 | Pending |
| DIET-04 | Phase 3 | Pending |
| DASH-02 | Phase 3 | Pending |
| DASH-03 | Phase 3 | Pending |
| DASH-04 | Phase 3 | Pending |
| NOTE-02 | Phase 3 | Pending |
| MAP-01 | Phase 4 | Pending |
| MAP-02 | Phase 4 | Pending |
| MAP-03 | Phase 4 | Pending |
| MAP-04 | Phase 4 | Pending |
| MAP-05 | Phase 4 | Pending |
| MAP-06 | Phase 4 | Pending |
| MAP-07 | Phase 4 | Pending |
| MED-01 | Phase 5 | Pending |
| MED-02 | Phase 5 | Pending |
| MED-03 | Phase 5 | Pending |
| MED-04 | Phase 5 | Pending |
| ID-01 | Phase 5 | Pending |
| ID-02 | Phase 5 | Pending |
| ID-03 | Phase 5 | Pending |
| ID-04 | Phase 5 | Pending |
| NOTE-01 | Phase 6 | Pending |
| NOTE-03 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 50 total
- Mapped to phases: 50
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-19*
*Last updated: 2026-04-19 after roadmap creation*