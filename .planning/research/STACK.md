# Stack Research

**Domain:** Pet Healthcare Mobile App + Backend API
**Researched:** 2026-04-19
**Confidence:** HIGH

## Recommended Stack

### Mobile App (React Native)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React Native CLI | 0.76.x | Cross-platform mobile UI | Native module access for maps/QR |
| Zustand | ^4.5 | State management | Lightweight, TypeScript support |
| React Navigation | ^6 | Navigation | Industry standard for RN |
| victory-native | ^37 | Charts | SVG-based, customizable |
| react-native-svg | ^15 | Chart dependency | Lightweight SVG rendering |
| react-native-maps | ^1.8 | GPS/Map | Full native Google/Apple maps |
| react-native-qrcode-scanner | ^2 | QR code | Pet ID functionality |
| firebase | ^10 | Authentication | Secure auth, proven at scale |

### Backend API

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Node.js | 20 LTS | Runtime | Stable, large ecosystem |
| Express | ^4.18 | API framework | Minimal, flexible |
| PostgreSQL | 16 | Primary database | Reliable, JSON support |
| Prisma | ^5.5 | ORM | Type-safe, migrations |
| JSON Web Token | — | Auth tokens | Stateless auth |
| bcrypt | ^5 | Password hashing | Secure, proven |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| date-fns | ^3 | Date formatting | All date operations |
| zod | ^3 | Validation | API request validation |
| cors | ^2.18 | CORS handling | Development middleware |
| helmet | ^7 | Security headers | Production API hardening |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| VS Code + extensions | IDE | RN debugging support |
| Postman / Insomnia | API testing | Endpoint validation |
| pgAdmin | DB management | Visual PostgreSQL client |
| Firebase Console | Auth monitoring | User management |

## Installation

```bash
# Mobile App
npx react-native@latest init VitalPawProactive --version 0.76.5
npm install zustand @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
npm install react-native-svg victory-native firebase
npm install react-native-maps react-native-qrcode-scanner
npm install date-fns

# Backend API
mkdir vitalpaw-api && cd vitalpaw-api
npm init -y
npm install express prisma @prisma/client
npm install -D typescript @types/express @types/node ts-node
npx prisma init
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| React Native CLI | Expo | If no native modules needed |
| Zustand | Redux Toolkit | If complex global state |
| Prisma | TypeORM / Knex | Type safety priority |
| PostgreSQL | MongoDB | If schema flexibility needed |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Expo (for this project) | Need native modules for maps/QR/GPS | React Native CLI |
| SQLite | Not for production scale | PostgreSQL |
| Realm | Complex setup, sync issues | PostgreSQL with Prisma |

## Stack Patterns by Variant

**If iOS-only:**
- Use CocoaPods for native dependencies
- Apple Maps can replace Google Maps

**If maps performance critical:**
- Consider react-native-mapbox-gl instead
- More control over tile loading

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| React Native 0.76.x | Node.js 20 LTS | Native module support |
| Prisma 5.x | PostgreSQL 16 | Full feature support |
| Firebase 10.x | React Native 0.76 | Auth works with new arch |

## Sources

- React Native official docs (latest)
- Prisma documentation
- Express.js best practices
- Firebase React Native setup guides