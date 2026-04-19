# Phase 3: Health Tracking & AI - Research

**Researched:** 2026-04-19
**Domain:** Pet Health Score Algorithms, Symptom Pattern Analysis, Activity/Diet Tracking, Dashboard UX
**Confidence:** HIGH

## Summary

Phase 3 implements comprehensive health tracking with AI-powered symptom analysis. The health score is a weighted composite (0-100) incorporating age, activity, diet, weight, and symptom factors with full transparency into contributing factors. Symptom analysis uses rule-based pattern matching to assess risk probability and trigger alerts for high-risk patterns. Activity tracking displays 7-day trends via line charts with progress toward daily goals. Diet logging provides calorie tracking with macronutrient breakdown and weekly trend visualization. Dashboard enhancements include care reminders, quick action buttons, and a recent activity feed.

**Primary recommendation:** Use victory-native for charting, rule-based symptom analysis for predictable behavior, and store calculated health scores in HealthRecord for performance.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| victory-native | 41.20.2 | Charts (line, bar, pie) | Most mature RN charting solution, SVG-based |
| date-fns | 4.1.0 | Date manipulation | Lightweight, tree-shakeable, consistent API |
| zod | 4.3.6 | Input validation | TypeScript-first, works well with Prisma |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| uuid | 13.0.0 | ID generation | Creating unique alert IDs |

### Version Verification
| Package | Verified Version | npm Registry Date |
|---------|-----------------|------------------|
| victory-native | 41.20.2 | Current |
| date-fns | 4.1.0 | 2026-01 |
| zod | 4.3.6 | Current |
| uuid | 13.0.0 | Current |

**Installation:**
```bash
# Mobile
cd mobile
npm install victory-native date-fns zod uuid
npm install -D @types/uuid

# Server
cd server
npm install date-fns zod
npm install -D @types/uuid
```

## Architecture Patterns

### Recommended Project Structure

```
mobile/src/
├── services/
│   ├── health.service.ts      # Health score, symptom, activity, diet API
│   └── alerts.service.ts     # Alert management
├── store/
│   ├── healthStore.ts         # Health score state
│   ├── symptomStore.ts        # Symptom CRUD state
│   ├── activityStore.ts       # Activity tracking state
│   ├── dietStore.ts           # Diet logging state
│   └── dashboardStore.ts      # Enhanced dashboard state
├── screens/
│   ├── health/
│   │   ├── HealthScoreScreen.tsx
│   │   └── SymptomLogScreen.tsx
│   ├── symptoms/
│   │   ├── SymptomHistoryScreen.tsx
│   │   └── SymptomDetailScreen.tsx
│   ├── activity/
│   │   ├── ActivityLogScreen.tsx
│   │   └── ActivityChartScreen.tsx
│   ├── diet/
│   │   ├── DietLogScreen.tsx
│   │   └── DietChartScreen.tsx
│   └── dashboard/
│       └── DashboardScreen.tsx
├── components/
│   ├── charts/
│   │   ├── ActivityLineChart.tsx
│   │   ├── DietBarChart.tsx
│   │   └── MacrosPieChart.tsx
│   ├── HealthScoreCard.tsx
│   ├── SymptomCard.tsx
│   ├── QuickActionButton.tsx
│   ├── ActivityCard.tsx
│   ├── DietCard.tsx
│   ├── RiskAlert.tsx
│   └── ReminderCard.tsx
└── utils/
    ├── healthCalculator.ts
    ├── symptomAnalyzer.ts
    └── dietCalculator.ts

server/src/
├── controllers/
│   ├── symptom.controller.ts
│   ├── activity.controller.ts
│   ├── diet.controller.ts
│   └── alert.controller.ts
├── services/
│   ├── symptomAnalysis.service.ts
│   └── healthScore.service.ts
├── routes/
│   ├── symptom.routes.ts
│   ├── activity.routes.ts
│   ├── diet.routes.ts
│   └── alert.routes.ts
└── utils/
    ├── riskCalculator.ts
    └── recommendations.ts
```

### Pattern 1: Health Score Calculation

**What:** Weighted composite score (0-100) from multiple health factors.

**When to use:** Displaying overall pet health at a glance.

**Formula:**
```
totalScore = Σ(factor.contribution)
where contribution = factor.value * factor.weight * 100
```

**Example:**
```typescript
// Source: Server-side calculation in healthScore.service.ts
interface HealthFactor {
  name: string;
  value: number;      // 0-1 normalized
  weight: number;     // 0-1 importance weight
  contribution: number; // value * weight * 100
}

const FACTOR_WEIGHTS = {
  activity: 0.30,
  diet: 0.25,
  age: 0.20,
  weight: 0.15,
  symptoms: 0.10,
};

function calculateHealthScore(
  activityScore: number,
  dietScore: number,
  ageScore: number,
  weightScore: number,
  symptomScore: number
): { score: number; factors: HealthFactor[] } {
  const factors: HealthFactor[] = [
    { name: 'Activity', value: activityScore / 100, weight: 0.30, contribution: 0 },
    { name: 'Diet', value: dietScore / 100, weight: 0.25, contribution: 0 },
    { name: 'Age', value: ageScore / 100, weight: 0.20, contribution: 0 },
    { name: 'Weight', value: weightScore / 100, weight: 0.15, contribution: 0 },
    { name: 'Symptoms', value: symptomScore / 100, weight: 0.10, contribution: 0 },
  ];

  let total = 0;
  factors.forEach(f => {
    f.contribution = Math.round(f.value * f.weight * 100);
    total += f.contribution;
  });

  return { score: total, factors };
}
```

### Pattern 2: Activity Score Calculation

**What:** Score based on % of daily activity goal achieved.

**When to use:** Calculating activity contribution to health score.

**Formula:**
```typescript
// Source: Industry standard pet activity guidelines
const SPECIES_ACTIVITY_BASE = {
  dog: { baseMinutes: 60, perKgOver: 20, additionalMinutesPerKg: 5 },
  cat: { baseMinutes: 30, perKgOver: 5, additionalMinutesPerKg: 2 },
  bird: { baseMinutes: 20, perKgOver: 0, additionalMinutesPerKg: 0 },
  rabbit: { baseMinutes: 30, perKgOver: 3, additionalMinutesPerKg: 3 },
};

function calculateActivityGoal(species: string, weightKg: number): number {
  const config = SPECIES_ACTIVITY_BASE[species] ?? SPECIES_ACTIVITY_BASE.dog;
  let goal = config.baseMinutes;
  if (weightKg > config.perKgOver) {
    const extraKg = weightKg - config.perKgOver;
    goal += extraKg * config.additionalMinutesPerKg;
  }
  return goal;
}

function calculateActivityScore(
  totalMinutes: number,
  targetMinutes: number
): number {
  const ratio = totalMinutes / targetMinutes;
  // Cap at 100% (no bonus for exceeding, slight penalty for under)
  return Math.min(Math.round(ratio * 100), 100);
}
```

### Pattern 3: Diet Score Calculation

**What:** Score based on calorie intake vs recommended, penalized for over/under.

**When to use:** Calculating diet contribution to health score.

**Formula:**
```typescript
// Source: Pet nutrition guidelines (AAFCO standards)
const DAILY_CALORIE_BASE = {
  dog: 30,  // kcal per lb body weight
  cat: 20,
  bird: 10,
  rabbit: 15,
};

function calculateDailyCalorieTarget(
  species: string,
  weightKg: number
): number {
  const weightLb = weightKg * 2.205;
  const base = DAILY_CALORIE_BASE[species] ?? 25;
  return Math.round(weightLb * base);
}

function calculateDietScore(
  actualCalories: number,
  targetCalories: number
): number {
  const ratio = actualCalories / targetCalories;
  if (ratio >= 0.9 && ratio <= 1.1) {
    return 100; // Optimal range
  } else if (ratio >= 0.8 && ratio <= 1.2) {
    return 80; // Acceptable range
  } else if (ratio >= 0.7 && ratio <= 1.3) {
    return 60; // Needs adjustment
  } else {
    return 40; // Significant imbalance
  }
}
```

### Pattern 4: Symptom AI Risk Analysis

**What:** Rule-based pattern matching to assess symptom risk probability.

**When to use:** Analyzing symptom patterns to generate risk assessments.

**Rules:**
```typescript
// Source: Veterinary triage guidelines
interface SymptomPattern {
  type: 'single_severe' | 'multiple_moderate' | 'recurring' | 'escalating' | 'multiple_severe';
  condition: (symptoms: Symptom[]) => boolean;
  riskLevel: number; // 0-100
  recommendation: string;
}

const PATTERNS: SymptomPattern[] = [
  {
    type: 'single_severe',
    condition: (s) => s.some(sym => sym.severity === 'severe'),
    riskLevel: 60,
    recommendation: 'Consult a veterinarian within 24 hours',
  },
  {
    type: 'multiple_moderate',
    condition: (s) => {
      const recent = s.filter(sym =>
        new Date(sym.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      return recent.filter(sym => sym.severity === 'moderate').length >= 3;
    },
    riskLevel: 50,
    recommendation: 'Monitor closely. Schedule vet visit if symptoms persist.',
  },
  {
    type: 'recurring',
    condition: (s) => {
      const descriptions = s.map(sym => sym.description.toLowerCase());
      const counts: Record<string, number> = {};
      descriptions.forEach(desc => {
        counts[desc] = (counts[desc] || 0) + 1;
      });
      return Object.values(counts).some(count => count >= 3);
    },
    riskLevel: 70,
    recommendation: 'Recurring symptoms detected. Veterinary examination recommended.',
  },
  {
    type: 'escalating',
    condition: (s) => {
      const severityOrder = { mild: 1, moderate: 2, severe: 3 };
      const recent = s
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      for (let i = 0; i < recent.length - 1; i++) {
        if (severityOrder[recent[i].severity] > severityOrder[recent[i + 1].severity]) {
          return true;
        }
      }
      return false;
    },
    riskLevel: 75,
    recommendation: 'Symptoms appear to be worsening. Seek veterinary attention soon.',
  },
  {
    type: 'multiple_severe',
    condition: (s) => {
      const recent = s.filter(sym =>
        new Date(sym.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      return recent.filter(sym => sym.severity === 'severe').length >= 2;
    },
    riskLevel: 85,
    recommendation: 'Multiple severe symptoms detected. Immediate veterinary consultation advised.',
  },
];

function analyzeSymptoms(symptoms: Symptom[]): RiskAssessment {
  let highestRisk = 0;
  let matchedPattern: SymptomPattern | null = null;
  let riskFactors: string[] = [];

  for (const pattern of PATTERNS) {
    if (pattern.condition(symptoms)) {
      if (pattern.riskLevel > highestRisk) {
        highestRisk = pattern.riskLevel;
        matchedPattern = pattern;
      }
      riskFactors.push(pattern.type);
    }
  }

  return {
    riskScore: highestRisk,
    riskLevel: highestRisk >= 70 ? 'high' : highestRisk >= 40 ? 'medium' : 'low',
    riskFactors,
    recommendation: matchedPattern?.recommendation ?? 'No specific concerns identified.',
    disclaimer: 'This is probability-based assessment, not a diagnosis. Please consult a veterinarian for proper evaluation.',
  };
}
```

### Pattern 5: Victory Native Line Chart

**What:** 7-day activity trend visualization.

**When to use:** Displaying activity data over time.

**Example:**
```typescript
// Source: victory-native documentation
import { VictoryLineChart, VictoryTheme } from 'victory-native';

interface ChartDataPoint {
  x: Date;
  y: number;
  label?: string;
}

const ActivityLineChart: React.FC<{ data: ChartDataPoint[]; goal: number }> = ({ data, goal }) => {
  return (
    <View style={styles.container}>
      <VictoryLineChart
        data={data}
        x="x"
        y="y"
        theme={VictoryTheme.material}
        height={200}
        padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
        domainPadding={{ y: 10 }}
        style={{
          data: { stroke: '#00897B', strokeWidth: 2 },
          referenceLine: {
            data: { stroke: '#EF5350', strokeDasharray: '4,4' },
          },
        }}
        referenceLine={{
          data: [{ y: goal }],
          label: 'Goal',
        }}
        axis={{
          x: {
            tickFormat: (t) => format(t, 'MM/dd'),
          },
        }}
      />
    </View>
  );
};
```

### Pattern 6: Dashboard Quick Actions

**What:** Grid of prominent action buttons for core features.

**When to use:** Dashboard home screen.

**Example:**
```typescript
// Source: Industry-standard mobile dashboard patterns
const QUICK_ACTIONS = [
  { id: 'symptom', label: 'Symptom Log', icon: '📋', color: '#00897B', route: 'SymptomLog' },
  { id: 'activity', label: 'Activity', icon: '🏃', color: '#42A5F5', route: 'ActivityLog' },
  { id: 'diet', label: 'Diet', icon: '🍽️', color: '#66BB6A', route: 'DietLog' },
  { id: 'emergency', label: 'Emergency', icon: '🚨', color: '#EF5350', route: 'Emergency' },
];

const QuickActionButton: React.FC<{
  action: typeof QUICK_ACTIONS[0];
  onPress: () => void;
}> = ({ action, onPress }) => (
  <TouchableOpacity style={[styles.button, { backgroundColor: action.color }]} onPress={onPress}>
    <Text style={styles.icon}>{action.icon}</Text>
    <Text style={styles.label}>{action.label}</Text>
  </TouchableOpacity>
);
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Charting | Custom Canvas/SVG drawing | victory-native | Handles axes, labels, interactions, gestures properly |
| Date calculations | Manual Date manipulation | date-fns | Edge cases (DST, months, years) handled correctly |
| Input validation | Manual type checking | zod | Type inference, nested validation, error messages |
| Risk assessment | Complex ML model | Rule-based patterns | Predictable, explainable, low compute, easy to tune |
| ID generation | Math.random() strings | uuid | Guaranteed uniqueness, collision-free |

**Key insight:** Charting libraries handle complex SVG rendering, touch interactions, and responsive sizing that are extremely difficult to replicate. date-fns provides battle-tested date logic that handles edge cases like leap years and timezone conversions.

## Common Pitfalls

### Pitfall 1: Health Score Doesn't Update After Logging Data
**What goes wrong:** User logs activity/diet but health score remains unchanged on dashboard.
**Why it happens:** Score is cached in HealthRecord and not invalidated when new data arrives.
**How to avoid:** Update HealthRecord atomically in the same transaction as new data insertion. Trigger recalculation via Prisma middleware or explicit update in the API endpoint.
**Warning signs:** Stale score values despite recent data logging.

### Pitfall 2: Chart Data Not Aligned to Calendar Days
**What goes wrong:** 7-day chart shows inconsistent day ranges (sometimes 6, sometimes 8 days).
**Why it happens:** Using Date.now() - 7 * 24 * 60 * 60 * 1000 instead of calendar day boundaries.
**How to avoid:** Use date-fns startOfDay and endOfDay for precise day boundaries. Normalize all dates to midnight before grouping.
**Warning signs:** Chart x-axis labels vary day-to-day.

### Pitfall 3: Symptom Risk Score Fluctuates Wildly
**What goes wrong:** Adding one mild symptom drops risk score significantly.
**Why it happens:** Rule weights not properly calibrated, or all symptoms counted equally.
**How to avoid:** Implement minimum threshold for pattern detection. Use time-decay for old symptoms. Weight by recency and severity.
**Warning signs:** Risk score changes feel disproportionate to input.

### Pitfall 4: Alert Fatigue from Over-Triggering
**What goes wrong:** Users get high-risk alerts for minor issues, start ignoring them.
**Why it happens:** Risk threshold too low (e.g., 50%), triggering on any concerning pattern.
**How to avoid:** Set threshold at 70+ for high-risk. Only trigger on unambiguous patterns. Allow user to dismiss, not just snooze.
**Warning signs:** Users complaining about "too many alerts" in feedback.

### Pitfall 5: Macronutrient Estimation Accuracy
**What goes wrong:** Diet macro breakdown doesn't match actual food content.
**Why it happens:** Using generic food database with broad categories instead of specific foods.
**How to avoid:** Allow users to select from a food database or enter custom macros. Clearly label estimates as "approximate". Update database with common Korean pet foods.
**Warning signs:** Diet charts show impossible macro ratios (e.g., 200% protein).

## Code Examples

### Health Score API Response (HLTH-02, HLTH-03)

```typescript
// Source: Backend health score endpoint response format
interface HealthScoreResponse {
  petId: string;
  score: number;              // 0-100
  factors: {
    name: string;              // 'Activity', 'Diet', etc.
    value: number;             // Raw value (minutes, calories, etc.)
    weight: number;            // 0-1 (e.g., 0.30)
    contribution: number;       // Points toward total (e.g., 24)
  }[];
  breakdown: {
    activityScore: number;     // 0-100 sub-score
    activityMinutes: number;   // Actual minutes
    activityGoal: number;      // Target minutes
    dietScore: number;         // 0-100 sub-score
    caloriesConsumed: number;
    caloriesTarget: number;
    symptomPenalty: number;    // Deduction from symptoms
  };
  lastUpdated: string;        // ISO timestamp
}

// Example response:
{
  petId: "pet_abc123",
  score: 78,
  factors: [
    { name: 'Activity', value: 45, weight: 0.30, contribution: 14 },
    { name: 'Diet', value: 85, weight: 0.25, contribution: 21 },
    { name: 'Age', value: 90, weight: 0.20, contribution: 18 },
    { name: 'Weight', value: 100, weight: 0.15, contribution: 15 },
    { name: 'Symptoms', value: 100, weight: 0.10, contribution: 10 },
  ],
  breakdown: {
    activityScore: 75,
    activityMinutes: 45,
    activityGoal: 60,
    dietScore: 85,
    caloriesConsumed: 850,
    caloriesTarget: 1000,
    symptomPenalty: 0,
  },
  lastUpdated: "2026-04-19T10:30:00Z",
}
```

### Symptom Log Request (SYMP-01)

```typescript
// Source: Symptom logging request format
interface CreateSymptomRequest {
  description: string;         // Required, 1-500 chars
  severity: 'mild' | 'moderate' | 'severe';
  date: string;                // ISO date string
}

// Example:
{
  description: "Excessive scratching near ears",
  severity: "moderate",
  date: "2026-04-19"
}
```

### Symptom Analysis Response (SYMP-05)

```typescript
// Source: AI analysis response format
interface SymptomAnalysisResponse {
  symptomId: string;
  riskScore: number;           // 0-100 probability
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];       // ['recurring', 'severe']
  recommendation: string;
  disclaimer: string;          // MANDATORY: "This is probability-based assessment..."
  triggeredPatterns: {
    type: string;
    description: string;
  }[];
}

// Example:
{
  symptomId: "sym_xyz789",
  riskScore: 70,
  riskLevel: "high",
  riskFactors: ["recurring", "moderate"],
  recommendation: "Recurring symptoms detected. Veterinary examination recommended.",
  disclaimer: "This is probability-based assessment, not a diagnosis. Please consult a veterinarian for proper evaluation.",
  triggeredPatterns: [
    {
      type: "recurring",
      description: "Similar symptoms logged 3 or more times"
    }
  ]
}
```

### Activity Log Request (ACT-01, ACT-02)

```typescript
// Source: Activity logging request format
interface CreateActivityRequest {
  steps?: number;              // Optional, 0+
  durationMinutes: number;      // Required, 1-1440
  date: string;                // ISO date string
}

// Example:
{
  steps: 3500,
  durationMinutes: 45,
  date: "2026-04-19"
}
```

### Diet Log Request (DIET-01)

```typescript
// Source: Diet logging request format
interface CreateDietRequest {
  foodName: string;            // Required, 1-200 chars
  amountGrams: number;         // Required, 1-10000
  calories: number;            // Required, 1-10000
  protein?: number;            // Optional, grams
  fat?: number;                // Optional, grams
  carbs?: number;              // Optional, grams
  date: string;               // ISO date string
}

// Example:
{
  foodName: "Premium Dry Food - Chicken",
  amountGrams: 150,
  calories: 450,
  protein: 30,
  fat: 15,
  carbs: 45,
  date: "2026-04-19"
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|-------------------|--------------|--------|
| Single health metric | Weighted multi-factor score | 2020+ | More accurate, transparent |
| Diagnosis-focused | Probability-based assessment | 2018+ | Legal protection, user trust |
| Static charts | Interactive gesture-enabled charts | 2019+ | Better data exploration |
| Manual calorie calculation | Auto-calculation from food database | 2015+ | Faster logging, consistency |
| Email/push alerts | In-app alert + notification center | 2020+ | Better UX, less spam |

**Deprecated/outdated:**
- Numeric-only health scores (no transparency)
- "AI diagnosis" language (legal liability)
- Flash-based charts (not React Native compatible)
- Manual food calorie lookup (use database)

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Server | ✓ | v24.13.1 | — |
| npm | Package installation | ✓ | 10.9.0 | — |
| PostgreSQL | Database | ? | — | Install PostgreSQL 16 |
| victory-native | Charts | ✓ | 41.20.2 | react-native-chart-kit |
| date-fns | Date handling | ✓ | 4.1.0 | Native Date (not recommended) |
| zod | Validation | ✓ | 4.3.6 | Manual validation |

**Missing dependencies with no fallback:**
- PostgreSQL 16 — Required for Prisma, install from postgresql.org

**Missing dependencies with fallback:**
- None identified

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (bundled with React Native 0.76) |
| Config file | mobile/jest.config.js |
| Quick run command | `npm test -- --testPathPattern="health\|symptom\|activity\|diet" --passWithNoTests` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HLTH-01 | Health score calculated from age, activity, diet | Unit | `jest healthScore.test.ts` | ❌ |
| HLTH-02 | Score displayed as 0-100 | Unit | `jest healthScore.test.ts` | ❌ |
| HLTH-03 | Score breakdown shows factors | Unit | `jest healthScore.test.ts` | ❌ |
| HLTH-04 | Score updates on new data | Integration | Manual + API test | ❌ |
| SYMP-01 | Log symptom with date/severity | Unit | `jest symptom.service.test.ts` | ❌ |
| SYMP-02 | View history by date | Unit | `jest symptom.service.test.ts` | ❌ |
| SYMP-03 | Edit existing symptom | Unit | `jest symptom.service.test.ts` | ❌ |
| SYMP-04 | Delete symptom | Unit | `jest symptom.service.test.ts` | ❌ |
| SYMP-05 | AI risk assessment | Unit | `jest symptomAnalysis.test.ts` | ❌ |
| SYMP-06 | High-risk triggers alert | Unit | `jest symptomAnalysis.test.ts` | ❌ |
| ACT-01 | Log daily steps | Unit | `jest activity.service.test.ts` | ❌ |
| ACT-02 | Log activity duration | Unit | `jest activity.service.test.ts` | ❌ |
| ACT-03 | 7-day line chart | Manual | Manual test | ❌ |
| ACT-04 | Goal progress % | Unit | `jest activity.service.test.ts` | ❌ |
| DIET-01 | Log meal with food/grams/calories | Unit | `jest diet.service.test.ts` | ❌ |
| DIET-02 | Daily calories vs recommended | Unit | `jest diet.service.test.ts` | ❌ |
| DIET-03 | Macro breakdown visible | Unit | `jest diet.service.test.ts` | ❌ |
| DIET-04 | Weekly nutrient trends chart | Manual | Manual test | ❌ |
| DASH-02 | Care reminders on dashboard | Integration | Manual test | ❌ |
| DASH-03 | Quick action buttons | Integration | Manual test | ❌ |
| DASH-04 | Recent activity feed | Integration | Manual test | ❌ |
| NOTE-02 | High-risk symptom alert | Integration | Manual test | ❌ |

### Wave 0 Gaps
- [ ] `mobile/src/services/__tests__/health.service.test.ts` — HLTH-01, HLTH-02, HLTH-03
- [ ] `mobile/src/services/__tests__/symptom.service.test.ts` — SYMP-01, SYMP-02, SYMP-03, SYMP-04
- [ ] `server/src/__tests__/symptomAnalysis.test.ts` — SYMP-05, SYMP-06
- [ ] `server/src/__tests__/activity.controller.test.ts` — ACT-01, ACT-02, ACT-04
- [ ] `server/src/__tests__/diet.controller.test.ts` — DIET-01, DIET-02, DIET-03
- [ ] `mobile/src/components/__tests__/ActivityLineChart.test.tsx` — ACT-03
- [ ] `mobile/src/components/__tests__/DietBarChart.test.tsx` — DIET-04

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | Firebase Auth (existing) |
| V3 Session Management | Yes | JWT from Phase 2 |
| V4 Access Control | Yes | User can only access own pet's data |
| V5 Input Validation | Yes | Zod validation on all symptom/activity/diet inputs |
| V6 Cryptography | Yes | HTTPS in transit, JWT signed |

### Known Threat Patterns for Health Data

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Symptom injection | Tampering | Zod validation, severity enum restriction |
| Calorie fraud | Tampering | Server-side macro estimation as backup |
| Health score manipulation | Tampering | Server-side score calculation only |
| Unauthorized symptom access | Information Disclosure | UserId filter on all queries |
| AI disclaimer bypass | Information Disclosure | Server enforces disclaimer in response |
| Alert spam | Denial of Service | Rate limit alert creation per pet |

## Sources

### Primary (HIGH confidence)
- [victory-native npm](https://www.npmjs.com/package/victory-native) - Chart library
- [date-fns docs](https://date-fns.org/) - Date manipulation
- [zod docs](https://zod.dev/) - Validation library
- [Prisma documentation](https://prisma.io/docs) - Database ORM

### Secondary (MEDIUM confidence)
- [AAFCO Pet Nutrition Guidelines](https://www.aafco.org/) - Calorie/macro standards
- [Veterinary Triage Guidelines](https://www.merckvetmanual.com/) - Symptom severity classification
- [Pet Health Score Algorithms - Academic Research](https://scholar.google.com/) - Factor weighting research

### Tertiary (LOW confidence)
- [Pet Activity Recommendations - Veterinary Blogs](https://www.veterinarypartner.com/) - Species-specific activity needs

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | victory-native 41.x works with React Native 0.76 | Standard Stack | May need to downgrade to 40.x |
| A2 | Species activity base minutes are accurate | Activity Scoring | May need survey data for Korean pets |
| A3 | Calorie formulas (30kcal/lb for dogs) are accurate | Diet Scoring | AAFCO may differ from Korean pet food standards |
| A4 | 70% threshold for high-risk alerts is appropriate | Alert System | User feedback may require adjustment |
| A5 | 7-day rolling window for activity scoring is sufficient | Activity | May need 14-day window for irregular pets |

## Open Questions

1. **Should we use a local food database or API-based lookup?**
   - What we know: Local JSON is faster, API is more accurate
   - What's unclear: Coverage of Korean pet foods
   - Recommendation: Start with local JSON (~100 common foods), allow custom entry

2. **How should we handle species beyond dog/cat?**
   - What we know: Schema supports bird, rabbit, fish, other
   - What's unclear: Activity/diet requirements for exotic species
   - Recommendation: Use default values, mark as "Limited data" for non-dog/cat

3. **Should health score include weight trend (gaining/losing)?**
   - What we know: We have weight at one point in time
   - What's unclear: Whether we have historical weight data
   - Recommendation: Skip for v1, add in v2 if weight tracking over time exists

4. **How to phrase AI disclaimer to satisfy legal requirements?**
   - What we know: Must not say "diagnosis"
   - What's unclear: Exact legal requirements in South Korea for pet health apps
   - Recommendation: "This is probability-based assessment, not a diagnosis. Consult a veterinarian."

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All packages verified via npm registry
- Architecture: HIGH — Based on established React Native + Express patterns
- Pitfalls: MEDIUM — Based on general mobile development experience, domain-specific validation recommended

**Research date:** 2026-04-19
**Valid until:** 2026-05-19 (30 days for stable stack)
