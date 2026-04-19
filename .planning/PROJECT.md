# VitalPaw Proactive

## What This Is

A proactive pet healthcare platform that combines preventive health management and maximum convenience. The mobile app (React Native) connects to a separate backend (Node.js + PostgreSQL), enabling pet owners to track health scores, log symptoms, find nearby pet services, manage diet, and access digital pet IDs with medical history.

## Core Value

Pet owners can proactively manage their pets' health with AI-powered symptom analysis and timely veterinary connections, reducing emergency situations through early detection.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Pet registration with profile management
- [ ] Health score calculation (age, activity, diet)
- [ ] Symptom logging with date-based records
- [ ] AI-powered symptom pattern analysis with risk assessment
- [ ] Activity tracking (steps, duration)
- [ ] Diet planning with calorie/nutrient tracking
- [ ] Digital Pet ID with QR code
- [ ] Medical history (vaccinations, checkups)
- [ ] Nearby pet services map with filters
- [ ] Quick action buttons for core features

### Out of Scope

- Real-time chat with veterinarians — defer to future (requires 24/7 staffing)
- Video consultations — infrastructure cost too high for v1
- Pet social community — not core to health management value
- Marketplace/e-commerce for pet supplies — can integrate later, not differentiator

## Context

- **Frontend:** React Native CLI (not Expo) for full native module control
- **Backend:** Separate Node.js/Express server with PostgreSQL database
- **Auth:** Firebase Auth for user authentication
- **State:** Zustand for React Native state management
- **Design:** "Clinical Sanctuary" concept — professional yet warm aesthetic
- **Users:** Korean pet owners who want preventive care, not just reactive treatment

## Constraints

- **Tech Stack:** React Native CLI + Node.js backend + PostgreSQL — user specified separate implementation
- **Platform:** Mobile-first (iOS/Android), maps require GPS
- **Data Sensitivity:** Medical records require secure storage and encryption
- **Offline:** App should cache critical data for offline viewing

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Separate backend vs BaaS | User requirement — full control over business logic | — Pending |
| React Native CLI vs Expo | Need native modules for maps/GPS/QR code | — Pending |
| Firebase Auth vs custom auth | Faster implementation, proven security | — Pending |
| Teal primary color palette | Medical professionalism with warmth | — Pending |

---
*Last updated: 2026-04-19 after initialization*