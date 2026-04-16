# Roadmap: Petcare App v1.1

**Milestone:** v1.1 AI 증상 분석
**Granularity:** Standard
**Total Phases:** 4

---

## Phases

- [ ] **Phase 1: Camera + Pet Selection** - Capture symptom photo after selecting pet
- [ ] **Phase 2: AI Analysis Integration** - Send photo to AI and receive symptom analysis
- [ ] **Phase 3: Results Display + Safety** - Show urgency level, recommendations, and medical disclaimer
- [ ] **Phase 4: History + Timeline Integration** - Save analysis to timeline and view history

---

## Phase Details

### Phase 1: Camera + Pet Selection

**Goal:** User can select a pet and capture a symptom photo

**Depends on:** Nothing (first phase)

**Requirements:** SYMP-01, SYMP-02

**Success Criteria** (what must be TRUE):
1. User can open camera from symptom analysis screen
2. User can select which pet to analyze before or during capture
3. User can capture a photo using device camera
4. User can retake photo before submitting
5. App validates photo quality before proceeding

**Plans:** TBD

---

### Phase 2: AI Analysis Integration

**Goal:** System sends symptom photo to AI and receives analysis

**Depends on:** Phase 1

**Requirements:** SYMP-03

**Success Criteria** (what must be TRUE):
1. System sends captured photo to backend API
2. Backend sends photo to OpenAI GPT-4o Vision API
3. System receives structured symptom analysis from AI
4. System displays loading state during analysis
5. System handles AI errors gracefully with user-friendly message

**Plans:** TBD

---

### Phase 3: Results Display + Safety

**Goal:** User sees analysis results with urgency level, recommendations, and mandatory disclaimer

**Depends on:** Phase 2

**Requirements:** SYMP-04, SYMP-05, SYMP-06

**Success Criteria** (what must be TRUE):
1. System displays urgency level (Red/Yellow/Green) clearly visible
2. System displays recommended actions based on analysis
3. System displays mandatory medical disclaimer prominently
4. User cannot dismiss disclaimer without acknowledging it
5. Emergency symptoms trigger immediate vet consultation prompt

**Plans:** TBD

---

### Phase 4: History + Timeline Integration

**Goal:** User can save analysis to health timeline and view past analyses

**Depends on:** Phase 3

**Requirements:** SYMP-07, SYMP-08

**Success Criteria** (what must be TRUE):
1. User can save completed analysis to pet health timeline
2. Saved analysis appears in pet health record with SYMPTOM_ANALYSIS type
3. User can view list of past symptom analyses for each pet
4. User can tap past analysis to view full details
5. Analysis history is accessible from pet profile screen

**Plans:** TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Camera + Pet Selection | 0/5 | Not started | - |
| 2. AI Analysis Integration | 0/5 | Not started | - |
| 3. Results Display + Safety | 0/5 | Not started | - |
| 4. History + Timeline Integration | 0/5 | Not started | - |

---

## Coverage

**Requirements:** 8/8 mapped

| Requirement | Phase |
|-------------|-------|
| SYMP-01 | Phase 1 |
| SYMP-02 | Phase 1 |
| SYMP-03 | Phase 2 |
| SYMP-04 | Phase 3 |
| SYMP-05 | Phase 3 |
| SYMP-06 | Phase 3 |
| SYMP-07 | Phase 4 |
| SYMP-08 | Phase 4 |

---

*Last updated: 2026-04-15*
