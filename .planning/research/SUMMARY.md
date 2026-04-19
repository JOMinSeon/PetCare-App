# Project Research Summary

**Project:** VitalPaw Proactive
**Domain:** Pet Healthcare Mobile App + Backend API
**Researched:** 2026-04-19
**Confidence:** HIGH

## Executive Summary

VitalPaw Proactive is a React Native mobile app with a separate Node.js/Express backend and PostgreSQL database. The app enables pet owners to track health metrics, log symptoms with AI-powered analysis, find nearby pet services, and manage pet health records. Firebase Auth handles user authentication with token exchange for backend API access.

The recommended architecture separates concerns clearly: React Native handles UI with Zustand for state, Express API handles business logic, and PostgreSQL persists all data. Key differentiators are AI symptom pattern analysis and proactive health reminders.

Major risks include Firebase token refresh complexity, Google Maps API rate limits, and the need for transparent health score calculation to build user trust.

## Key Findings

### Recommended Stack

**Mobile:** React Native CLI 0.76.x with Zustand for state, React Navigation for routing, react-native-maps for GPS/location, and victory-native for charts.

**Backend:** Node.js 20 LTS with Express, Prisma ORM, PostgreSQL 16. Firebase Auth for authentication with JWT token exchange.

This stack provides native module access for maps/QR codes while maintaining development speed through proven libraries.

### Expected Features

**Must have (table stakes):**
- User authentication (email/password, social login)
- Pet profile management (CRUD operations)
- Health score calculation
- Symptom logging with date-based records
- Activity tracking (steps, duration)
- Medical history display
- Nearby pet services map with filters
- Quick action buttons

**Should have (competitive):**
- AI symptom pattern analysis — core differentiator
- Risk level assessment with alerts
- Proactive reminder system for vaccinations/medications
- Digital Pet ID with QR code

**Defer (v2+):**
- Real-time vet chat
- Video consultations
- Social community features
- Marketplace

### Architecture Approach

React Native app communicates with Express API via REST/JSON. Firebase Auth tokens are exchanged for custom JWTs for stateless API authentication. Prisma ORM manages PostgreSQL connections with connection pooling.

Key data flows: Auth (Firebase → Token exchange → JWT), Pet management (CRUD via API → Store update), Health logging (Input → API save → Score recalculation).

### Critical Pitfalls

1. **Token Management** — Firebase tokens expire in 1 hour, proper refresh logic required
2. **AI Overconfidence** — Must phrase analysis as probability, not diagnosis
3. **Map Rate Limits** — Google Maps has strict quotas, need caching strategy
4. **Health Score Transparency** — Users must understand score calculation

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Project Foundation
**Rationale:** Must establish project structure before any feature work
**Delivers:** React Native project setup, Express API boilerplate, PostgreSQL schema, Git structure
**Avoids:** Starting with spaghetti code, missing dependencies

### Phase 2: Authentication & Core Data
**Rationale:** Auth is prerequisite for all other features, pet CRUD is core data
**Delivers:** Firebase Auth integration, token exchange, pet profile CRUD
**Implements:** Database models, API routes

### Phase 3: Health Tracking & AI
**Rationale:** Core health management features and AI differentiator
**Delivers:** Symptom logger, activity logging, health score with explanation, AI analysis
**Addresses:** Feature pitfall (transparent score calculation)

### Phase 4: Services & Map
**Rationale:** Location-based services are independent of health data
**Delivers:** Pet services map with filters, service detail cards, contact integration

### Phase 5: Digital Pet ID & History
**Rationale:** Medical records need symptom logging first
**Delivers:** QR code generation, medical history cards, emergency contact info

### Phase 6: Polish & Launch Prep
**Rationale:** Performance, error handling, testing before production
**Delivers:** Error boundaries, offline support, push notifications, EAS build

### Phase Ordering Rationale

- Health data features depend on pet profiles (Phase 2 before 3)
- Map is independent but needs context from pets (after Phase 2)
- Medical history builds on symptom logging foundation
- Polish phase must be last before launch

### Research Flags

- **Phase 3:** AI analysis needs careful implementation of disclaimer language
- **Phase 4:** Map API keys need server-side proxy to protect quotas
- **Phase 5:** QR code scanning requires camera permission handling

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Well-established technologies |
| Features | HIGH | Clear from user requirements |
| Architecture | HIGH | Standard patterns applied |
| Pitfalls | MEDIUM | Based on general RN experience, domain-specific validation needed |

**Overall confidence:** HIGH

### Gaps to Address

- **AI Implementation:** Specific pattern matching algorithm needs further research
- **Map Provider:** May need to evaluate Apple Maps vs Google Maps based on region

## Sources

### Primary (HIGH confidence)
- React Native 0.76 documentation
- Express.js production best practices
- Prisma official documentation

### Secondary (MEDIUM confidence)
- Firebase Auth React Native guides
- Pet healthcare app competitor analysis

---
*Research completed: 2026-04-19*
*Ready for roadmap: yes*