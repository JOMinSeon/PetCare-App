# Architecture: AI Symptom Analysis (v1.1)

**Domain:** Mobile AI-powered pet health symptom analysis
**Researched:** 2026-04-15
**Confidence:** MEDIUM

---

## Executive Summary

AI symptom analysis integrates as a **new health record type** flowing through existing infrastructure. The camera capture uses `expo-camera` (not yet installed), image analysis happens server-side via AI Vision API, and results persist as health records linked to existing pet profiles. No architectural revolution — only extension.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         React Native (Expo SDK 54)                      │
│  ┌──────────────┐  ┌──────────────────┐  ┌─────────────────────────┐   │
│  │ CameraScreen │  │ AnalysisResult   │  │ SymptomHistoryScreen    │   │
│  │ (expo-camera)│──▶│ (AI results +    │  │ (timeline integration) │   │
│  │              │  │  recommended     │  │                         │   │
│  │              │  │  actions)        │  │                         │   │
│  └──────────────┘  └──────────────────┘  └─────────────────────────┘   │
│          │                  │                        │                   │
│          ▼                  ▼                        ▼                   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              SymptomAnalysisContext (NEW)                         │   │
│  │  - analyzeSymptom(petId, imageUri): Promise<AnalysisResult>    │   │
│  │  - history: SymptomRecord[]                                      │   │
│  │  - isAnalyzing: boolean                                          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              symptomAnalysis.service.ts (NEW)                    │   │
│  │  POST /api/pets/:petId/symptoms/analyze ──▶ multipart/form-data │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ REST API (multipart/form-data)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Node.js Backend                                  │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  POST /api/pets/:petId/symptoms/analyze                          │   │
│  │  - Receives image                                                 │   │
│  │  - Stores image to filesystem/S3                                  │   │
│  │  - Calls AI Vision API (OpenAI/Claude/Google)                    │   │
│  │  - Parses AI response                                             │   │
│  │  - Creates SymptomAnalysis record in DB                          │   │
│  │  - Returns AnalysisResult                                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  SymptonAnalysis Model (Prisma) — NEW                             │   │
│  │  - id, petId, imageUrl, aiRawResponse, symptoms[],               │   │
│  │  - severity, recommendedActions, createdAt                       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Boundaries

### Mobile (PetcareApp/src)

| Component | File | Responsibility |
|-----------|------|---------------|
| **CameraScreen** | `app/(tabs)/symptom/camera.tsx` (NEW) | Live camera preview, capture button, flash toggle |
| **AnalysisResultScreen** | `app/(tabs)/symptom/result.tsx` (NEW) | Display AI analysis, severity, recommended actions |
| **SymptomHistoryScreen** | `app/(tabs)/health/[petId]/symptoms.tsx` (NEW) | Timeline of symptom analyses |
| **SymptomAnalysisContext** | `src/contexts/SymptomAnalysisContext.tsx` (NEW) | State management for analysis flow |
| **symptomAnalysis.service** | `src/services/symptomAnalysis.service.ts` (NEW) | API calls to backend |
| **symptom.types** | `src/types/symptom.types.ts` (NEW) | TypeScript interfaces |

### Backend (src/)

| Component | File | Responsibility |
|-----------|------|---------------|
| **symptoms.analyze route** | `src/app/api/pets/[petId]/symptoms/analyze/route.ts` (NEW) | Upload image, call AI, return results |
| **SymptomAnalysis model** | `src/models/symptomAnalysis.ts` (NEW) | Prisma schema extension |
| **AI Vision Service** | `src/services/aiVision.service.ts` (NEW) | Abstract AI provider (OpenAI/Claude) |

---

## Data Flow

### Analysis Request Flow

```
1. User opens CameraScreen
2. expo-camera renders live preview (back camera default)
3. User taps capture → takePictureAsync() returns local URI
4. UI transitions to AnalysisResultScreen with loading state
5. SymptomAnalysisContext.analyzeSymptom(petId, imageUri) called
6. symptomAnalysis.service uploads image to backend
7. Backend:
   a. Receives multipart form data
   b. Saves image to storage (local filesystem or S3)
   c. Calls AI Vision API with image URL + prompt
   d. Parses AI response into structured SymptomAnalysis
   e. Saves to database
   f. Returns AnalysisResult
8. Context updates state → UI shows results
9. User can save as health record or dismiss
```

### Integration with Existing Systems

| Existing System | Integration Point |
|-----------------|-------------------|
| **PetContext** | Required: user must select pet before analysis. PetSelector component reused. |
| **HealthContext** | SymptomAnalysis saved as `HealthRecordType.SYMPTOM_ANALYSIS` with AI response in `data` field |
| **Timeline (HealthContext.fetchTimeline)** | Automatically includes symptom analyses when filtered by type |

---

## New Types (symptom.types.ts)

```typescript
export enum SymptomSeverity {
  LOW = 'LOW',           // Monitor at home
  MEDIUM = 'MEDIUM',     // Schedule vet visit soon
  HIGH = 'HIGH',          // Immediate vet attention
  CRITICAL = 'CRITICAL',  // Emergency
}

export interface DetectedSymptom {
  name: string;           // "Skin irritation", "Eye discharge"
  confidence: number;     // 0.0 - 1.0
  description: string;
}

export interface RecommendedAction {
  action: string;         // "Apply topical antiseptic"
  urgency: 'HOME_CARE' | 'SCHEDULE_VET' | 'EMERGENCY';
  notes?: string;
}

export interface AnalysisResult {
  id: string;
  petId: string;
  imageUrl: string;
  symptoms: DetectedSymptom[];
  overallSeverity: SymptomSeverity;
  summary: string;
  recommendedActions: RecommendedAction[];
  aiProvider: 'OPENAI' | 'CLAUDE' | 'GOOGLE_VISION';
  createdAt: string;
}

export interface CreateSymptomAnalysisInput {
  imageUri: string;  // Local URI of captured image
}

export interface SaveAsHealthRecordInput {
  analysisId: string;
  notes?: string;  // User can add personal notes
}
```

---

## API Endpoints

### POST /api/pets/:petId/symptoms/analyze

**Purpose:** Upload symptom image and get AI analysis

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file), `userId` (string)

**Response (200):**
```json
{
  "id": "uuid",
  "petId": "uuid",
  "imageUrl": "https://storage/images/uuid.jpg",
  "symptoms": [
    {
      "name": "Skin redness",
      "confidence": 0.87,
      "description": "Localized erythema on ventral abdomen"
    }
  ],
  "overallSeverity": "MEDIUM",
  "summary": "Possible allergic dermatitis, recommend vet evaluation",
  "recommendedActions": [
    {
      "action": "Schedule veterinary appointment within 48-72 hours",
      "urgency": "SCHEDULE_VET",
      "notes": "Bring recent diet/environment change history"
    }
  ],
  "createdAt": "2026-04-15T10:30:00Z"
}
```

**Errors:**
- 400: No image provided
- 401: Unauthorized
- 413: Image too large (>10MB)
- 422: AI unable to analyze (unclear image)
- 500: AI service error

---

## State Management Pattern

Follows existing Context + Service pattern:

```typescript
// SymptomAnalysisContext.tsx
interface SymptomAnalysisContextType {
  currentAnalysis: AnalysisResult | null;
  history: AnalysisResult[];
  isAnalyzing: boolean;
  error: string | null;
  
  analyzeSymptom: (petId: string, imageUri: string) => Promise<AnalysisResult>;
  saveAsHealthRecord: (analysisId: string, notes?: string) => Promise<void>;
  clearCurrentAnalysis: () => void;
  fetchHistory: (petId: string) => Promise<void>;
}
```

---

## Dependency on Existing Health Record System

**Design Decision:** Symptom analysis is a **health record type**.

```typescript
// health.types.ts extension
export enum HealthRecordType {
  VACCINATION = 'VACCINATION',
  MEDICATION = 'MEDICATION',
  EXAMINATION = 'EXAMINATION',
  SYMPTOM_ANALYSIS = 'SYMPTOM_ANALYSIS',  // NEW
}
```

**Rationale:** Reuses existing:
- Pet linking (petId foreign key)
- User access control (users see only their pets' records)
- Timeline view (existing health timeline shows symptom analyses)
- CRUD operations (existing health record handlers)

**Extension Required:**
- `CreateHealthRecordInput.data` must accept `SymptomAnalysisData`
- Health timeline filter must support `SYMPTOM_ANALYSIS` type

---

## Build Order (Dependency-Aware)

| Step | Task | Dependencies | Rationale |
|------|------|--------------|-----------|
| 1 | **Install expo-camera** | None | Required for camera UI |
| 2 | **Create symptom.types.ts** | None | Types needed everywhere |
| 3 | **Create symptomAnalysis.service.ts** | Types | API communication |
| 4 | **Create SymptomAnalysisContext** | Service, Types | State management |
| 5 | **Build CameraScreen UI** | expo-camera, Context | Core user interaction |
| 6 | **Build AnalysisResultScreen** | Context, Types | Display results |
| 7 | **Backend: Create SymptomAnalysis model** | None | Database schema |
| 8 | **Backend: Implement AI Vision service** | Model | AI integration |
| 9 | **Backend: Create /symptoms/analyze route** | AI service | API endpoint |
| 10 | **Backend: Add SYMPTOM_ANALYSIS to HealthRecord** | Model | Extend existing |
| 11 | **Build SymptomHistoryScreen** | Context, HealthContext | Timeline view |
| 12 | **Integration: Pet selector** | PetContext | Pre-analysis |

**Note:** Steps 7-10 (backend) can parallelize with Steps 1-6 (frontend) once types are agreed upon.

---

## Anti-Patterns to Avoid

### 1. Do NOT Process AI Client-Side
**Bad:** Bundle TensorFlow Lite model in app for on-device inference
**Why:** 
- App bundle size increases by 50-100MB
- Model inference slow on mobile, drains battery
- Can't update model without app update
- Better results with server-side Vision APIs

**Good:** Server-side AI with fast response (<3 seconds)

### 2. Do NOT Block UI During Upload
**Bad:** Await analysis before showing any feedback
**Why:** Large images take time to upload

**Good:** Show "Uploading..." immediately, then "Analyzing...", then results

### 3. Do NOT Save Raw AI Responses Directly
**Bad:** Store full AI raw text in database
**Why:** AI responses vary, can't query/filter

**Good:** Parse into structured `DetectedSymptom[]` array before saving

### 4. Do NOT Allow Analysis Without Pet Context
**Bad:** Allow anonymous symptom analysis
**Why:** Symptom context requires species/breed/age for accurate analysis

**Good:** Require pet selection before camera opens

---

## Scalability Considerations

| Scale | Challenge | Solution |
|-------|-----------|----------|
| 100 users | Storage | Local filesystem fine |
| 10K users | AI cost | Cache similar diagnoses, batch processing off-peak |
| 100K users | AI latency | Queue with async processing, push notifications |
| 1M users | Storage + AI cost | S3/Cloudflare R2, AI tiered pricing, freemium limits |

**MVP Scope:** Local storage + synchronous AI processing is acceptable.

---

## Key Integration Points Summary

| System | Integration | Complexity |
|--------|-------------|------------|
| Pet profiles | Required petId for analysis | Low (reuse PetContext) |
| Health records | SymptomAnalysis stored as HealthRecord | Low (extend HealthRecordType) |
| Health timeline | Filter by SYMPTOM_ANALYSIS shows history | Low (existing filter mechanism) |
| Notifications | Option to remind vet appointment | Medium (existing notification system) |
| Community | User could share analysis (optional) | Low (reuse PostContext) |

---

## Sources

- **Expo Camera:** `expo-camera` documentation (v54 compatible)
- **Expo Image Picker:** Already installed `expo-image-picker@55.0.18`
- **Pattern Source:** Existing HealthContext + health.service.ts architecture
- **AI Vision Options:** OpenAI Vision (GPT-4o), Claude (Sonnet 4), Google Cloud Vision — recommendation is **OpenAI Vision** for:
  - Strong general image understanding
  - Cost-effective pricing
  - Single API call for analysis + structured output
  - Well-documented REST API

---

## Open Questions

1. **AI Provider Selection:** Final recommendation requires vendor pricing research (not yet done)
2. **Image Storage:** Local filesystem vs cloud storage decision pending scale requirements
3. **Offline Support:** Caching last analysis for offline viewing not in MVP scope
4. **Analysis History Limit:** How many past analyses to keep per pet (pagination vs infinite scroll)
