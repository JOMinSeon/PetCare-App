# AI Symptom Analysis Feature: Research Synthesis

**Project:** Petcare App v1.1 AI 증상 분석
**Synthesized:** 2026-04-15
**Source Files:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md

---

## Executive Summary

AI symptom analysis for pet health adds **camera-based image capture** via `expo-camera` and **server-side AI vision processing** via OpenAI Vision API (GPT-4o). No on-device ML — the app captures images and sends them to the backend, which calls OpenAI's API and returns structured analysis results. This integrates with existing pet profiles and health record infrastructure as a new `SYMPTOM_ANALYSIS` health record type.

**The core workflow:** User selects a pet → captures symptom photo → backend sends to AI → returns possible conditions with urgency assessment (Red/Yellow/Green) and recommendations → saved to health timeline. **Medical disclaimers are mandatory and must be prominent.**

**Key risks:** False confidence leading to delayed vet care, accuracy overclaiming, and privacy of pet health data (including photos). These require explicit mitigation: reframing confidence scores, avoiding diagnostic language, and ensuring AI provider contracts prohibit training data reuse.

---

## Key Findings

### From STACK.md (Confidence: HIGH — official documentation)

| Component | Technology | Version | Rationale |
|-----------|------------|---------|-----------|
| **Camera** | `expo-camera` | `~17.0.0` | Live preview with overlay support; `expo-image-picker` lacks guided UX |
| **AI Vision** | `openai` SDK | `^4.85.0` | GPT-4o Vision API; pay-per-use, excellent medical reasoning |
| **Image Picker** | `expo-image-picker` | `55.0.18` | Already installed; gallery selection fallback |

**DO NOT ADD:** TensorFlow Lite, ONNX, or any on-device ML (50-100MB bundle penalty, slower inference, can't update without app release, worse accuracy than server-side).

### From FEATURES.md (Confidence: MEDIUM — web search sources)

**Table Stakes (MVP must-have):**
- Photo capture/upload with camera permissions
- Basic LLM-based symptom analysis (GPT-4o Vision or Gemini 1.5 Flash)
- Urgency indicator (Traffic Light: Red/Yellow/Green)
- Results with recommendations
- Prominent medical disclaimer (legal requirement)
- Analysis history/timeline integration

**Differentiators (v2+ scope):**
- Multi-modal input (photo + text combined)
- Condition-specific home care instructions
- Vet clinic integration (Kakao Maps API exists in v1.0)
- Voice output for accessibility
- Document OCR for lab reports
- Pet health history context for AI

**Anti-Features (explicitly avoid):**
- Definitive diagnosis claims → use "possible conditions" framing
- Guaranteed accuracy claims → use confidence percentages
- Prescription capability → recommend OTC or vet consult
- Real-time video analysis → static images sufficient

### From ARCHITECTURE.md (Confidence: MEDIUM)

**New Components:**
| Layer | Component | File |
|-------|-----------|------|
| Mobile | CameraScreen | `app/(tabs)/symptom/camera.tsx` |
| Mobile | AnalysisResultScreen | `app/(tabs)/symptom/result.tsx` |
| Mobile | SymptomHistoryScreen | `app/(tabs)/health/[petId]/symptoms.tsx` |
| Mobile | SymptomAnalysisContext | `src/contexts/SymptomAnalysisContext.tsx` |
| Mobile | symptomAnalysis.service | `src/services/symptomAnalysis.service.ts` |
| Mobile | symptom.types | `src/types/symptom.types.ts` |
| Backend | symptoms.analyze route | `src/app/api/pets/[petId]/symptoms/analyze/route.ts` |
| Backend | SymptomAnalysis model | `src/models/symptomAnalysis.ts` |
| Backend | AI Vision Service | `src/services/aiVision.service.ts` |

**API Endpoint:** `POST /api/pets/:petId/symptoms/analyze` — multipart/form-data, returns structured `AnalysisResult`

**Integration:** Symptom analysis is a `HealthRecordType.SYMPTOM_ANALYSIS` — reuses existing pet linking, access control, timeline view, and CRUD operations.

**Build Order:** Types → Service → Context → Camera UI → Result UI (frontend) can parallelize with Model → AI Service → Route → HealthRecord extension (backend).

### From PITFALLS.md (Confidence: MEDIUM — peer-reviewed + industry sources)

**Critical Pitfalls:**
1. **False confidence / delayed vet care** — Prevent with mandatory disclaimers, reframed confidence (show uncertainty), escalation prompts for emergency symptoms
2. **Accuracy overclaiming** — Never claim "diagnose"; use "suggests potential"; validate accuracy claims with peer-reviewed data
3. **Privacy leakage** — Pet health photos are sensitive; ensure AI vendor contracts prohibit training data reuse; end-to-end encryption
4. **Training data bias** — Model skews toward popular dog/cat breeds; publish coverage stats; fallback to "consult vet" for edge cases

**Moderate Pitfalls:**
5. **Regulatory uncertainty** — Korea's KVLG may apply; frame as "informational" not "diagnostic"; consult regulatory expert before launch
6. **Image quality failures** — Built-in quality validation with reshoot prompts; guidance UI for ideal photo conditions
7. **User misunderstanding of AI role** — Marketing must emphasize augmentation not replacement; require disclaimer acknowledgment before first use

---

## Implications for Roadmap

### Suggested Phase Structure

**Phase 1: Foundation — Camera + API Skeleton**
- Install `expo-camera` and configure permissions (iOS Info.plist, Android manifest)
- Create `symptom.types.ts` with TypeScript interfaces
- Create `symptomAnalysis.service.ts` for API communication
- Create backend route skeleton (POST `/api/pets/:petId/symptoms/analyze`) returning mock data
- Build basic CameraScreen with live preview and capture button
- **Rationale:** No AI integration yet — establishes camera flow and API contract

**Phase 2: AI Integration — OpenAI Vision**
- Implement `aiVision.service.ts` calling OpenAI GPT-4o Vision API
- Store image to filesystem/S3
- Parse AI response into structured `DetectedSymptom[]`
- Create `SymptomAnalysis` Prisma model
- Wire CameraScreen → API → AnalysisResultScreen flow
- **Rationale:** Core value prop; needs real AI to validate response structure

**Phase 3: Safety + Compliance**
- Add mandatory medical disclaimer (prominent, unavoidable)
- Implement urgency escalation prompts (Red/Yellow/Green)
- Add confidence reframe (show uncertainty, not certainty)
- Emergency symptom detection (vomiting, lethargy, breathing issues → immediate vet prompt)
- **Rationale:** Pitfall prevention before beta; legal requirement

**Phase 4: Health Record Integration**
- Extend `HealthRecordType` with `SYMPTOM_ANALYSIS`
- Save analysis to timeline via HealthContext
- Build SymptomHistoryScreen for timeline view
- Integration with PetContext (pet selection required before capture)
- **Rationale:** Leverages existing infrastructure; completes the user journey

**Phase 5: Beta + Validation**
- Limited beta with real users
- Accuracy validation (track follow-through, survey users)
- Image quality monitoring
- Regulatory review of marketing copy
- **Rationale:** Validate against real-world conditions before broader launch

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | Official Expo/OpenAI documentation; verified versions |
| **Features** | MEDIUM | Web search sources; GitHub repos; patterns confirmed but specific accuracy not validated |
| **Architecture** | MEDIUM | Extends existing patterns well-documented in codebase; API design solid |
| **Pitfalls** | MEDIUM | Peer-reviewed sources (Lancet, PubMed) for critical pitfalls; industry best practices for others |

### Gaps to Address

1. **AI Provider Pricing** — OpenAI vs Claude vs Gemini cost analysis not completed; recommend starting with OpenAI pay-per-use
2. **Image Storage** — Local filesystem vs S3 decision pending scale requirements (MVP: local sufficient for <100 users)
3. **Regulatory Review** — Korea KVLG compliance needs expert consultation before Phase 5 beta
4. **Accuracy Validation** — No peer-reviewed accuracy data for GPT-4o on pet symptoms; start with broad disclaimers
5. **Training Data Diversity** — Breed/species coverage statistics not available; monitor error rates post-launch

---

## Research Flags

| Phase | Needs Research | Notes |
|-------|---------------|-------|
| Phase 1 | NO | Standard Expo patterns; well-documented |
| Phase 2 | NO | OpenAI Vision API well-documented |
| Phase 3 | YES | Disclaimer legal language; Korea KVLG specifics |
| Phase 4 | NO | Existing HealthRecord patterns in codebase |
| Phase 5 | YES | Accuracy validation methodology; beta user selection criteria |

---

## Sources

| Source | Confidence | Key Points |
|--------|------------|------------|
| Expo Camera Documentation | HIGH | `expo-camera` API, permissions, SDK compatibility |
| Expo Image Picker Documentation | HIGH | Already installed; gallery fallback |
| OpenAI Vision API | HIGH | GPT-4o vision, Node.js SDK, pricing |
| Expo SDK 54/55 Changelog | HIGH | SDK compatibility matrix |
| Lancet Infectious Diseases (2026) | HIGH | AI barriers: privacy, bias, regulatory gaps |
| PubMed: AI in veterinary diagnostic imaging (2024) | HIGH | Vet AI limitations |
| FDA AI/ML in animal health framework | MEDIUM | US regulatory considerations |
| VetTrack-AI (GitHub) | MEDIUM | LLM-based symptom analysis patterns |
| PetDiseaseApi (GitHub) | MEDIUM | YOLOv8 classification approach |
| vet-bot (GitHub) | MEDIUM | Traffic light urgency system |

---

*Generated by GSD Research Synthesizer — 2026-04-15*
