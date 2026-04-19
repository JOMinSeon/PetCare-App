# Phase 3: Health Tracking & AI - Context

**Phase:** 3
**Name:** Health Tracking & AI
**Goal:** Users can track their pets' health metrics with AI-powered symptom analysis
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
- Health score must show breakdown of contributing factors (HLTH-03)
- AI symptom analysis MUST be phrased as probability, not diagnosis (SYMP-05, NOTE-02)

### the agent's Discretion
- Health score algorithm weights and thresholds
- AI symptom pattern matching approach (rule-based vs ML)
- Chart library choice (victory-native vs react-native-chart-kit)
- Alert delivery mechanism (in-app vs push notification)
- Activity goal calculation per species/weight
- Macronutrient estimation approach for diet logging

### Deferred Ideas (OUT OF SCOPE)
- Real-time chat with veterinarians — defer to future (requires 24/7 staffing)
- Video consultations — infrastructure cost too high for v1
- Pet social community — not core to health management value
- Marketplace/e-commerce for pet supplies — can integrate later, not differentiator
- Advanced AI/ML symptom analysis — use rule-based pattern matching for v1

---

## Phase 3 Requirements

| ID | Description |
|----|-------------|
| HLTH-01 | Health score calculated from age, activity, diet factors |
| HLTH-02 | Health score displayed as numeric value (0-100) |
| HLTH-03 | Health score breakdown shown to user (what factors contribute) |
| HLTH-04 | Score updates when new data logged |
| SYMP-01 | User can log symptom with date and severity (mild/moderate/severe) |
| SYMP-02 | User can view symptom history by date |
| SYMP-03 | User can edit existing symptom records |
| SYMP-04 | User can delete symptom records |
| SYMP-05 | AI analyzes symptom patterns and provides risk assessment (probability, not diagnosis) |
| SYMP-06 | High-risk patterns trigger alert recommending vet consultation |
| ACT-01 | User can log daily steps count |
| ACT-02 | User can log activity duration (minutes) |
| ACT-03 | Activity data displayed in line chart (7-day view) |
| ACT-04 | Activity goal progress shown (percentage of daily target) |
| DIET-01 | User can log meals (food name, amount in grams, calories) |
| DIET-02 | Daily calorie intake displayed vs recommended |
| DIET-03 | Macronutrient breakdown shown (protein, fat, carbs) |
| DIET-04 | Diet chart shows weekly nutrient trends |
| DASH-02 | Dashboard shows upcoming care reminders |
| DASH-03 | Quick action buttons for: Symptom Log, Activity, Diet, Emergency |
| DASH-04 | Recent activity feed visible on dashboard |
| NOTE-02 | App alerts user when symptom pattern indicates high risk |

---

## Implementation Approach

### 1. Health Score Algorithm (HLTH-01, HLTH-02, HLTH-03, HLTH-04)

The health score is a weighted composite (0-100) calculated from multiple factors:

#### Factor Weights
| Factor | Weight | Source |
|--------|--------|--------|
| Age | 0.20 | Pet.birthDate |
| Activity | 0.30 | Recent 7-day activity data |
| Diet | 0.25 | Recent 7-day diet data |
| Weight | 0.15 | Pet.weight (if available) |
| Symptoms | 0.10 | Recent symptom severity/frequency |

#### Activity Score Calculation (0-100)
- Based on % of daily activity goal achieved over last 7 days
- Daily goal = species-specific base (dogs: 60min, cats: 30min, etc.)
- Goal adjusted by weight: larger pets need more activity
- Formula: `avgDailyMinutes / targetMinutes * 100`, capped at 100

#### Diet Score Calculation (0-100)
- Based on % of daily calorie target achieved over last 7 days
- Calorie target = weight * species multiplier (dogs: 30kcal/lb, cats: 20kcal/lb)
- Both over and under-eating reduce score
- Formula: `min(actual/target, 1.2) * 100`, capped at 100 for适度, reduced for excess

#### Symptom Score Calculation (0-100)
- Recent 30-day symptom analysis
- Severity weights: mild=0.3, moderate=0.6, severe=1.0
- Frequency impact: more symptoms = lower score
- Pattern detection: recurring symptoms reduce score more

#### Score Update Trigger
- Score recalculates when new activity, diet, or symptom data is logged
- Use Prisma transaction to update HealthRecord atomically
- Cache calculated score in HealthRecord for quick dashboard display

### 2. Symptom Logging & AI Analysis (SYMP-01 to SYMP-06)

#### Symptom Data Model
```typescript
interface Symptom {
  id: string;
  description: string;      // User-entered text
  severity: 'mild' | 'moderate' | 'severe';
  date: Date;
  petId: string;
  // AI-generated fields (added server-side)
  riskScore?: number;       // 0-100 probability
  riskFactors?: string[];  // ["recurring", "severe", "multiple_symptoms"]
}
```

#### AI Pattern Analysis (SYMP-05)
Rule-based pattern matching for v1:

| Pattern | Condition | Risk Level | Recommendation |
|---------|-----------|------------|----------------|
| Single severe | severity=severe | 60% | Consult vet within 24hr |
| Multiple moderate | 3+ moderate in 7 days | 50% | Monitor closely |
| Recurring same | Same description 3+ times | 70% | Vet visit recommended |
| Escalating | Severity increasing over time | 75% | Seek vet attention |
| Multiple severe | 2+ severe in 30 days | 85% | Immediate vet visit |

**Disclaimer Language (MANDATORY):**
- "This symptom pattern may indicate [condition] with [X]% probability"
- "Based on [N] similar cases, veterinary consultation is recommended"
- NEVER say "Your pet has [diagnosis]"

#### High-Risk Alert (SYMP-06, NOTE-02)
- Trigger when riskScore >= 70
- Show in-app alert on dashboard
- Store alert in database for notification history
- Alert includes: symptom summary, risk level, recommended action

### 3. Activity Tracking (ACT-01 to ACT-04)

#### Activity Data Model
```typescript
interface Activity {
  id: string;
  steps: number | null;      // Step count (optional)
  durationMinutes: number;   // Activity duration
  date: Date;
  petId: string;
}
```

#### 7-Day Line Chart (ACT-03)
- X-axis: Last 7 days (Mon-Sun or rolling)
- Y-axis: Activity duration in minutes
- Use victory-native LineChart
- Show goal line as horizontal reference

#### Daily Goal Calculation (ACT-04)
| Species | Base Minutes | Per KG Adjustment |
|---------|--------------|------------------|
| Dog | 60 | +5 min/kg over 20kg |
| Cat | 30 | +2 min/kg over 5kg |
| Bird | 20 | minimal |
| Rabbit | 30 | +3 min/kg over 3kg |

### 4. Diet Logging (DIET-01 to DIET-04)

#### Diet Data Model
```typescript
interface Diet {
  id: string;
  foodName: string;
  amountGrams: number;
  calories: number;
  protein?: number;    // grams (optional, estimated from food db)
  fat?: number;       // grams
  carbs?: number;     // grams
  date: Date;
  petId: string;
}
```

#### Macronutrient Estimation
- Use a local food database (JSON) with common pet foods
- User selects from list or enters custom
- Auto-calculate macros from grams and food type
- Default estimates: protein=25%, fat=15%, carbs=60% (adjustable)

#### Weekly Nutrient Trends Chart (DIET-04)
- Group by day, sum calories and macros
- Show stacked bar chart or multi-line chart
- Compare to daily targets with reference lines

### 5. Dashboard Enhancements (DASH-02, DASH-03, DASH-04)

#### Quick Action Buttons (DASH-03)
| Button | Icon | Action | Color |
|--------|------|--------|-------|
| Symptom Log | 📋 | Navigate to SymptomLogScreen | #00897B (teal) |
| Activity | 🏃 | Navigate to ActivityLogScreen | #42A5F5 (blue) |
| Diet | 🍽️ | Navigate to DietLogScreen | #66BB6A (green) |
| Emergency | 🚨 | Call vet / Show emergency info | #EF5350 (red) |

#### Recent Activity Feed (DASH-04)
- Show last 10 activities across all types
- Grouped by date
- Types: symptom_logged, activity_recorded, meal_logged, reminder_shown
- Format: "[Pet] [action] - [time ago]"

#### Care Reminders (DASH-02)
- From MedicalRecord.nextDueDate
- Show upcoming vaccinations, checkups
- Highlight overdue items in red

---

## Data Flow Diagrams

### Health Score Update Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ New Data    │     │ API         │     │ Prisma      │
│ Logged      │     │ Endpoint    │     │ Transaction  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                  │                  │
       │ POST /api/pets/:id/activities        │
       │──────────────────────────────────────│
       │                  │                  │
       │                  │ Calculate score  │
       │                  │ ─────────────── │
       │                  │ 1. Fetch 7-day  │
       │                  │    activity data │
       │                  │ 2. Fetch 7-day  │
       │                  │    diet data     │
       │                  │ 3. Fetch 30-day │
       │                  │    symptoms      │
       │                  │ 4. Apply weights │
       │                  │ 5. Update cache  │
       │                  │                  │
       │<─────────────────────────────────────│
       │     { score, factors }               │
       │                  │                  │
       │  Emit score update event             │
```

### Symptom AI Analysis Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Symptom     │     │ Analysis    │     │ Risk        │
│ Logged       │     │ Engine      │     │ Determinator │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                  │                  │
       │ POST /api/pets/:id/symptoms         │
       │──────────────────────────────────────│
       │                  │                  │
       │                  │ Pattern check   │
       │                  │ ─────────────── │
       │                  │ • Severity      │
       │                  │ • Frequency     │
       │                  │ • Recurrence    │
       │                  │ • Escalation    │
       │                  │                  │
       │                  │ Calculate       │
       │                  │ riskScore       │
       │                  │                  │
       │                  │ riskScore >= 70?│
       │                  │ ─────────────── │
       │                  │ YES → Create    │
       │                  │     Alert       │
       │                  │                  │
       │<─────────────────────────────────────│
       │     { symptom, riskScore, alert? }   │
```

---

## File Structure

### Mobile (mobile/src)
```
├── services/
│   ├── health.service.ts      # Health score, symptom, activity, diet API
│   └── alerts.service.ts       # Alert management
├── store/
│   ├── healthStore.ts          # Health score state
│   ├── symptomStore.ts         # Symptom CRUD state
│   ├── activityStore.ts        # Activity tracking state
│   ├── dietStore.ts            # Diet logging state
│   └── dashboardStore.ts       # Enhanced dashboard state
├── screens/
│   ├── health/
│   │   ├── HealthScoreScreen.tsx     # Full score breakdown
│   │   └── SymptomLogScreen.tsx      # Log/edit symptoms
│   ├── symptoms/
│   │   ├── SymptomHistoryScreen.tsx  # View by date
│   │   └── SymptomDetailScreen.tsx  # Edit/delete
│   ├── activity/
│   │   ├── ActivityLogScreen.tsx    # Log steps/duration
│   │   └── ActivityChartScreen.tsx   # 7-day view
│   ├── diet/
│   │   ├── DietLogScreen.tsx        # Log meals
│   │   └── DietChartScreen.tsx       # Weekly trends
│   └── dashboard/
│       └── DashboardScreen.tsx      # Enhanced with reminders, quick actions
├── components/
│   ├── charts/
│   │   ├── ActivityLineChart.tsx     # 7-day activity
│   │   ├── DietBarChart.tsx          # Weekly nutrients
│   │   └── MacrosPieChart.tsx         # Protein/fat/carbs
│   ├── HealthScoreCard.tsx            # Compact score display
│   ├── SymptomCard.tsx                # Symptom list item
│   ├── QuickActionButton.tsx          # Dashboard quick actions
│   ├── ActivityCard.tsx               # Activity log item
│   ├── DietCard.tsx                   # Meal log item
│   ├── RiskAlert.tsx                  # High-risk alert banner
│   └── ReminderCard.tsx               # Care reminder item
└── utils/
    ├── healthCalculator.ts      # Score calculation logic
    ├── symptomAnalyzer.ts       # AI pattern matching
    └── dietCalculator.ts        # Calorie/macro calculations
```

### Server (server/src)
```
├── controllers/
│   ├── symptom.controller.ts    # CRUD + AI analysis
│   ├── activity.controller.ts  # Activity logging
│   ├── diet.controller.ts      # Diet logging
│   └── alert.controller.ts     # Alert management
├── services/
│   ├── symptomAnalysis.service.ts  # Pattern matching engine
│   └── healthScore.service.ts      # Score calculation
├── routes/
│   ├── symptom.routes.ts
│   ├── activity.routes.ts
│   ├── diet.routes.ts
│   └── alert.routes.ts
└── utils/
    ├── riskCalculator.ts       # Risk scoring logic
    └── recommendations.ts      # Vet recommendation generator
```

---

## API Endpoints

### Symptom Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/pets/:id/symptoms | List symptoms (paginated, by date) |
| GET | /api/pets/:id/symptoms/:symptomId | Get single symptom |
| POST | /api/pets/:id/symptoms | Create symptom + AI analysis |
| PUT | /api/pets/:id/symptoms/:symptomId | Update symptom |
| DELETE | /api/pets/:id/symptoms/:symptomId | Delete symptom |
| GET | /api/pets/:id/symptoms/analysis | Get AI risk assessment |

### Activity Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/pets/:id/activities | List activities (by date range) |
| POST | /api/pets/:id/activities | Log activity |
| PUT | /api/pets/:id/activities/:activityId | Update activity |
| DELETE | /api/pets/:id/activities/:activityId | Delete activity |
| GET | /api/pets/:id/activities/stats | Get 7-day summary + chart data |

### Diet Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/pets/:id/diets | List diet entries (by date range) |
| POST | /api/pets/:id/diets | Log meal |
| PUT | /api/pets/:id/diets/:dietId | Update meal |
| DELETE | /api/pets/:id/diets/:dietId | Delete meal |
| GET | /api/pets/:id/diets/stats | Get daily/weekly summary |

### Alert Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/pets/:id/alerts | List active alerts |
| PUT | /api/alerts/:alertId/dismiss | Dismiss alert |

---

## Verification Steps

### Health Score
1. Log activity for 7 days → score should reflect activity factor
2. Log diet entries → score should reflect diet factor
3. Log symptoms → score should decrease based on severity
4. Score breakdown should sum to total and show all factors

### Symptom Flow
1. Log symptom → risk assessment returned
2. View symptom history → grouped by date, most recent first
3. Edit symptom → changes reflected in history
4. Delete symptom → removed from history and recalculates risk
5. Log multiple severe symptoms → alert triggered

### Activity Flow
1. Log activity → appears in today's entries
2. View 7-day chart → shows line with goal reference
3. Progress shows % of daily target
4. Multiple entries per day → summed for chart

### Diet Flow
1. Log meal → shows in daily list with calories
2. View daily total → compares to recommended
3. View macro breakdown → shows protein/fat/carbs
4. View weekly chart → shows trends over 7 days

### Dashboard
1. Quick actions navigate to correct screens
2. Reminders show upcoming care items
3. Recent activity shows last 10 items
4. High-risk alert appears when triggered

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Health score feels arbitrary | Medium | Medium | Transparent factor display, let users understand weights |
| AI analysis too conservative | Medium | Medium | Use proven rule patterns, iterate based on feedback |
| AI analysis too aggressive | Medium | Medium | Clear disclaimer language, never diagnose |
| Charts perform poorly on low-end devices | Low | Medium | Use simplified charts, test on older devices |
| Food database incomplete | High | Low | Allow custom entry, estimate macros |

---

## Out of Scope for Phase 3

- Push notifications for alerts (Phase 6)
- Advanced AI/ML symptom analysis
- Integration with wearable devices
- Automatic activity tracking (GPS)
- Diet recommendations engine
- Social sharing of health data
- Export health reports to PDF

---

## Dependencies

### Mobile
- victory-native ^41.20.2 — Charts (line, bar, pie)
- date-fns ^4.1.0 — Date manipulation
- zod ^4.3.6 — Validation

### Server
- date-fns ^4.1.0 — Date queries
- zod ^4.3.6 — Input validation

### Existing (already installed)
- @react-native-async-storage/async-storage
- @react-native-firebase/auth
- @react-native-firebase/app
- axios
- zustand
