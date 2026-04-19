# Phase 2: Authentication & Pet Profiles - Plan 03

**Phase:** 2
**Plan:** 03
**Wave:** 3 (Dashboard)
**Status:** Pending

---

## Objective

Create dashboard with health score display and quick action buttons.

---

## Success Criteria Mapping

| # | Criterion | Task |
|---|-----------|------|
| 11 | Dashboard displays health score prominently upon login | T1, T2 |

---

## Tasks

### Task 1: Health Score API (server)
- Create `GET /api/pets/:id/health` endpoint
- Calculate health score from activity, diet factors (stub for Phase 3)
- Return score with breakdown factors

### Task 2: Dashboard Screen (mobile)
- Create `DashboardScreen.tsx`
- Display health score prominently (large number + gauge)
- Add quick action buttons: Symptom Log, Activity, Diet, Emergency
- Show recent pet activity feed
- Show upcoming care reminders

### Task 3: Dashboard Store (mobile)
- Create `dashboardStore.ts`
- Fetch health score on load
- Cache recent data

---

## Files to Create/Modify

### Server
- `server/src/controllers/health.controller.ts` (update)
- `server/src/routes/health.routes.ts`

### Mobile
- `mobile/src/screens/dashboard/DashboardScreen.tsx`
- `mobile/src/components/HealthScoreCard.tsx`
- `mobile/src/components/QuickActionButton.tsx`
- `mobile/src/stores/dashboardStore.ts`

---

## Verification

1. Dashboard shows large health score number
2. Health score gauge visualizes the score
3. Quick action buttons navigate to correct screens (stubs ok for Phase 2)
4. Recent activity shows pet-related data

---

## Dependencies

- Plan 02 (Pet CRUD) complete
- At least one pet created to show health score