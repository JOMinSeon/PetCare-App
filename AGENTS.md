<!-- GSD:project-start source:PROJECT.md -->
## Project

**VitalPaw Proactive**

A mobile application that provides integrated pet health care services, allowing pet owners to monitor their pets' health data (activity, weight, diet, medical history) in one place and receive actionable health management guidance and services.

**Core Value:** Pet owners can confidently monitor and manage their companion animals' health through unified data tracking and proactive care recommendations.

### Constraints

- **Platform**: React Native mobile app
- **Design Language**: Clean, minimalist, professional; teal/green primary with orange accents
- **Typography**: Sans-serif fonts (Pretendard, Noto Sans KR for Korean support)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

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
# Core (using Expo)
# Navigation
# State & Data
# Charts
# Secure Storage
# Notifications
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
- Focus on manual data entry UI
- Use phone sensors sparingly (optional step counting)
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
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
