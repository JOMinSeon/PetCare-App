# VitalPaw Proactive

## What This Is

A mobile application that provides integrated pet health care services, allowing pet owners to monitor their pets' health data (activity, weight, diet, medical history) in one place and receive actionable health management guidance and services.

## Core Value

Pet owners can confidently monitor and manage their companion animals' health through unified data tracking and proactive care recommendations.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Dashboard with pet health summary and alerts
- [ ] Data monitoring with graphs and trend analysis (weight, activity)
- [ ] History log for activities, diet, medical records, checkups
- [ ] Service/community features (vet appointments, consultations, product purchasing)
- [ ] User and pet profile management
- [ ] Date range filtering for data analysis (7 days to 1 year)
- [ ] Reusable UI components: Card, Metric Display, Action Button, Chart/Graph, Input Form

### Out of Scope

- Real-time chat with veterinarians — deferred to v2
- Video consultation — high complexity, not core to health tracking value
- Multi-pet management with advanced billing — single pet focus for v1
- Social features beyond service/community — not differentiated

## Context

**Technology:** React Native (as specified by user)

**Target Users:** Pet owners who are proactive about their companion animals' health and wellness

**Competitive Focus:** Unlike generic pet apps, this emphasizes proactive health monitoring with data visualization and actionable insights

## Constraints

- **Platform**: React Native mobile app
- **Design Language**: Clean, minimalist, professional; teal/green primary with orange accents
- **Typography**: Sans-serif fonts (Pretendard, Noto Sans KR for Korean support)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React Native | Cross-platform efficiency for mobile-first pet health app | — Pending |
| Bottom tab navigation | Industry standard for mobile apps with 4-5 main sections | — Pending |
| Teal/green color palette | Conveys cleanliness, nature, trust for pet care | — Pending |

---

*Last updated: 2026-04-16 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state