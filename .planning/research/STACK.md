# Stack Research

**Domain:** Pet Health & Wellness Tracker
**Researched:** 2026-04-16
**Confidence:** MEDIUM

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React Native | 0.85.x | Mobile framework | User-specified; cross-platform efficiency |
| TypeScript | 5.x | Type safety | Catches errors at compile time, better DX |
| Expo | SDK 52+ | Development workflow | Faster dev cycles, managed builds, excellent docs |
| React Navigation | 7.x | Navigation | Community standard for RN navigation |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-native-async-storage/async-storage | 2.x | Local data persistence | Pet profiles, health logs, settings |
| react-native-chart-kit | 6.x | Data visualization | Weight/activity graphs on dashboard |
| expo-secure-store | ~ | Secure token storage | Auth tokens, sensitive data |
| date-fns | 3.x | Date manipulation | History log filtering, date ranges |
| zustand | 5.x | State management | Lightweight alternative to Context for global state |
| expo-notifications | ~ | Push notifications | Medication reminders, vet appointments |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Expo Doctor | Validate setup | Diagnose environment issues |
| ESLint + Prettier | Code quality | Pre-configured in Expo |
| Jest + React Native Testing Library | Unit/component testing | First-party RN testing solution |

## Installation

```bash
# Core (using Expo)
npx create-expo-app@latest VitalPaw --template blank-typescript

# Navigation
npx expo install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context

# State & Data
npm install @react-native-async-storage/async-storage zustand date-fns

# Charts
npx expo install react-native-chart-kit react-native-svg

# Secure Storage
npx expo install expo-secure-store

# Notifications
npx expo install expo-notifications
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Expo | Bare React Native CLI | Need custom native modules not in Expo |
| Zustand | Context + useReducer | Complex nested state requiring redux-like patterns |
| AsyncStorage | WatermelonDB / SQLite | Need for complex queries or larger datasets |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| class components | Deprecated, verbose | Functional components with hooks |
| Legacy Navigation (v5) | Community support shifting to v6+ | React Navigation v7 |
| react-native-firebase (older) | Complexity, native setup burden | Expo-compatible alternatives |
| Console.log in production | Performance degradation | expo-build-properties minification |

## Stack Patterns by Variant

**If hardware-optional (phone-based tracking):**
- Focus on manual data entry UI
- Use phone sensors sparingly (optional step counting)

**If hardware-required (wearable integration):**
- Plan for Bluetooth/BLE integration
- Consider background sync services

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Expo SDK 52 | React Native 0.76+ | Auto-matching |
| React Navigation 7.x | Expo SDK 50+ | Check peer dependencies |
| AsyncStorage 2.x | Node 18+, RN 0.76+ | Latest version recommended |

## Sources

- React Native Official Docs (https://reactnative.dev/docs/getting-started)
- Expo Documentation (https://docs.expo.dev)
- React Navigation Docs (https://reactnavigation.org/docs/getting-started)
- React Native Community Packages (https://reactnative.directory)

---
*Stack research for: Pet Health & Wellness Tracker*
*Researched: 2026-04-16*