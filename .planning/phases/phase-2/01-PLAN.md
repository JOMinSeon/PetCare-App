# Phase 2: Authentication & Pet Profiles - Plan 01

**Phase:** 2
**Plan:** 01
**Wave:** 1 (Foundation)
**Status:** Pending

---

## Objective

Set up Firebase Auth, create auth screens (SignUp, Login, Logout), implement session persistence.

---

## Success Criteria Mapping

| # | Criterion | Task |
|---|-----------|------|
| 1 | User can sign up with email and password | T1, T2 |
| 2 | User can log in with email/password | T1, T2 |
| 3 | User session persists across app restarts | T3 |
| 4 | User can log out from any screen | T4 |

---

## Tasks

### Task 1: Firebase Configuration (server)
- Install `firebase-admin` package
- Create Firebase admin initialization with service account
- Create `POST /api/auth/firebase/verify` endpoint to verify Firebase ID token
- Create `POST /api/auth/firebase/exchange` endpoint to issue custom JWT

### Task 2: Firebase Auth Screen (mobile)
- Install `@react-native-firebase/auth` package
- Create `AuthProvider` context with Firebase auth state
- Create `SignUpScreen.tsx` with email/password form
- Create `LoginScreen.tsx` with email/password form
- Implement `onAuthStateChanged` listener for session persistence
- Create `logout()` function accessible globally

### Task 3: Session Persistence (mobile)
- Store Firebase user in Zustand store
- Persist auth state using Firebase's built-in persistence
- Auto-navigate to main app when authenticated
- Show loading screen while checking auth state

### Task 4: Navigation Structure (mobile)
- Create `AuthNavigator` for unauthenticated users (SignUp, Login)
- Create `MainNavigator` for authenticated users
- Add Logout button to dashboard
- Integrate auth state with navigation switching

---

## Files to Create/Modify

### Server
- `server/src/services/firebase.service.ts` - Firebase admin
- `server/src/controllers/auth.controller.ts` - Auth endpoints
- `server/src/routes/auth.routes.ts` - Auth route definitions
- `server/src/middleware/auth.middleware.ts` - JWT verification middleware
- `server/package.json` - Add firebase-admin, jsonwebtoken

### Mobile
- `mobile/src/contexts/AuthContext.tsx` - Auth provider
- `mobile/src/stores/authStore.ts` - Auth state store
- `mobile/src/screens/auth/SignUpScreen.tsx` - Sign up screen
- `mobile/src/screens/auth/LoginScreen.tsx` - Login screen
- `mobile/src/navigation/AuthNavigator.tsx` - Auth stack
- `mobile/src/navigation/MainNavigator.tsx` - Main stack
- `mobile/package.json` - Add @react-native-firebase/auth

---

## Verification

1. New user can sign up and receive confirmation
2. User can log in with email/password
3. App restart does not require re-authentication
4. User can log out and return to login screen
5. Invalid credentials show appropriate error message

---

## Dependencies

- Phase 1 complete (server running, Prisma schema ready)
- Firebase project with email/password provider enabled

---

## Notes

- Firebase Auth handles session persistence automatically
- JWT tokens expire after 7 days (configurable)
- Auth middleware verifies JWT on protected routes