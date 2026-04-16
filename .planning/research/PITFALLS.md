# Pitfalls Research

**Domain:** Pet Health & Wellness Tracker
**Researched:** 2026-04-16
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Sensitive Data Storage in AsyncStorage

**What goes wrong:**
Pet health data (weight records, medical history, vaccination dates, dietary information) gets stored in AsyncStorage. This unencrypted key-value store is accessible to anyone with device access, and data persists across app reinstalls.

**Why it happens:**
Developers use AsyncStorage for convenience without understanding it's unencrypted. For a pet health app handling sensitive medical information, this creates data exposure risk. AsyncStorage sandbox doesn't protect against device rooting/root access.

**How to avoid:**
- Never store sensitive pet health data in AsyncStorage
- Use react-native-keychain or expo-secure-store for credentials and tokens
- Store health records in encrypted storage or server-side with proper auth
- Implement proper token storage in Keychain (iOS) / EncryptedSharedPreferences (Android)

**Warning signs:**
- `AsyncStorage.setItem('petHealthData', JSON.stringify(...))` patterns in code
- No secure storage implementation found
- Token persistence via AsyncStorage instead of Keychain

**Phase to address:**
Phase 2 (Data Layer & Core Features) — Security is foundational

---

### Pitfall 2: FlatList Performance Collapse with Health Data History

**What goes wrong:**
History log screen renders a FlatList with weight entries, activity logs, dietary records. Without proper optimization, the list becomes unresponsive, shows blank areas during scroll, and drops frames making the app feel broken.

**Why it happens:**
Health tracking generates substantial historical data. FlatList without `getItemLayout`, `maxToRenderPerBatch`, `windowSize` configuration renders inefficiently. Anonymous renderItem functions recreate on every render. Heavy list item components (with images, nested views) compound the issue.

**How to avoid:**
```tsx
<FlatList
  data={healthRecords}
  renderItem={renderHealthRecord}  // defined outside component with useCallback
  keyExtractor={item => item.id}
  getItemLayout={(data, index) => ({
    length: 80,  // consistent row height
    offset: 80 * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={21}
  initialNumToRender={15}
/>
```
- Implement `getItemLayout` for predictable row heights
- Use React.memo on list items with custom comparison functions
- Move renderItem outside component, wrap in useCallback
- Use lightweight components for list items — avoid heavy nesting

**Warning signs:**
- History screen scroll performance degrades over time
- "Blank areas" visible when scrolling quickly
- JS thread FPS drops below 60 during list scroll

**Phase to address:**
Phase 3 (Dashboard & Visualization) — List performance affects core UX

---

### Pitfall 3: Deep Linking Security Vulnerability

**What goes wrong:**
App implements deep linking for vet appointment reminders or pet profile sharing. Sensitive data (pet ID, health record references) gets passed in URL scheme, exposing it to interception by malicious apps registered to the same scheme.

**Why it happens:**
Deep link URL schemes (`vitalpaw://appointment/123`) can be hijacked on both iOS and Android. Without proper validation, attackers can intercept deep links and gain access to pet health data or perform actions on behalf of the user.

**How to avoid:**
- Never pass sensitive data (pet IDs, health record IDs) in deep link URLs
- Use universal links (iOS) / App Links (Android) which have proper validation
- Implement token-based deep link verification
- Add PKCE for any OAuth flows triggered via deep links
- Validate all incoming deep link data on the server side

**Warning signs:**
- Deep link URLs contain database IDs or sensitive identifiers
- No universal links/App links configured, only custom URL schemes
- Deep link handlers accept raw IDs without verification

**Phase to address:**
Phase 2 (Data Layer & Core Features) — Security must precede feature integration

---

### Pitfall 4: Chart/Graph Data Visualization Performance

**What goes wrong:**
Dashboard displays weight trends, activity graphs. Animations during chart rendering block the JS thread, causing dropped frames and unresponsive UI. Graph interactions feel sluggish.

**Why it happens:**
Charts using JavaScript-based rendering (via Animated API without native driver) compete with business logic for JS thread time. Re-rendering charts on data updates without proper memoization causes performance collapse.

**How to avoid:**
- Use native-driver animations (`useNativeDriver: true`) for chart animations
- Implement `LayoutAnimation` for static chart updates instead of Animated API
- Memoize chart components to prevent unnecessary re-renders
- Consider SVG-based charts with native rendering (react-native-svg + victory-native)
- Separate heavy chart data processing from UI updates with InteractionManager

**Warning signs:**
- Chart animations cause visible frame drops
- JS thread FPS drops below 50 when charts update
- Smooth 60fps in dev mode but poor performance in release

**Phase to address:**
Phase 3 (Dashboard & Visualization) — Charts are core differentiator

---

### Pitfall 5: Token-Based Auth with Cookie Issues

**What goes wrong:**
Login works initially but sessions expire unexpectedly. Refresh tokens don't work properly, users get logged out frequently. Cookie-based authentication behaves inconsistently between iOS and Android.

**Why it happens:**
React Native's fetch has known issues with `credentials: omit` and `redirect: manual` options. Cookie-based auth is "currently unstable" per React Native docs. Same-name headers on Android result in only latest header being present. iOS redirects with `Set-Cookie` don't set cookies properly.

**How to avoid:**
- Use token-based auth (JWT) stored securely in Keychain/EncryptedSharedPreferences
- Avoid relying on cookie-based sessions in React Native
- Implement proper token refresh logic with retry handling
- Test auth flows on both platforms, not just iOS
- Use axios or dedicated networking library with better auth support

**Warning signs:**
- Users reporting frequent unexpected logout
- Auth works on iOS but fails on Android
- Token refresh endpoint gets called repeatedly

**Phase to address:**
Phase 2 (Data Layer & Core Features) — Auth must be reliable

---

### Pitfall 6: Console.log Performance Drain in Production

**What goes wrong:**
App runs fine in development but becomes sluggish in production. Debugging libraries (redux-logger, axios interceptors) continue logging to console. Performance degrades significantly over time.

**Why it happens:**
Console statements execute even in bundled production builds. Debug libraries often include console.log calls that fire on every action. The JS thread bottleneck from excessive logging accumulates over time.

**How to avoid:**
```json
// .babelrc
{
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
```
- Install `babel-plugin-transform-remove-console` in production builds
- Remove all console.* statements before bundling
- Audit third-party libraries for logging behavior
- Use proper logging libraries that respect log levels

**Warning signs:**
- Performance significantly better in dev than release
- Bundle size increased by debug libraries
- No console stripping in production builds

**Phase to address:**
Phase 1 (Foundation) — Performance fundamentals established early

---

### Pitfall 7: Neglecting Data Offline-First Architecture

**What goes wrong:**
Pet owners can't log weight/diet when offline (common in rural areas or basements). Data entered offline is lost when app closes. App becomes unusable without network connection.

**Why it happens:**
Health tracking apps need to work when connectivity is intermittent. Without offline-first design, users in poor connectivity areas abandon the app. Pet health logging needs to be immediate and persistent.

**How to avoid:**
- Implement local data persistence (SQLite, WatermelonDB) for health records
- Queue API calls when offline, sync when connection restored
- Use optimistic UI updates — show data saved locally immediately
- Implement proper conflict resolution for sync scenarios
- Test app in airplane mode regularly

**Warning signs:**
- Health data entry requires network to complete
- No local storage implementation found
- App shows error/failure when offline

**Phase to address:**
Phase 2 (Data Layer & Core Features) — Offline-first is critical for health tracking

---

### Pitfall 8: Image-Heavy UI Causing Memory Pressure

**What goes wrong:**
Pet profile screens with multiple photos, health report attachments. App crashes on lower-end devices or when scrolling through pet photo galleries. Memory warnings appear in production.

**Why it happens:**
Unoptimized images loaded at full resolution consume excessive memory. React Native Image component re-cropping on size animation is expensive. No image caching means network requests repeat. Memory leaks from image loading accumulate.

**How to avoid:**
- Use thumbnail images for lists, full resolution only on detail view
- Implement image caching with @d11/react-native-fast-image or similar
- Resize/compress images before storage (especially from camera)
- Use `transform: [{scale}]` for zoom animations instead of resizing Image width/height
- Enable `resizeMode: 'cover'` and preload images
- Test on low-memory devices (1GB RAM)

**Warning signs:**
- App crashes on older Android devices
- Memory warnings in production
- Image loading causes visible lag

**Phase to address:**
Phase 3 (Dashboard & Visualization) — Media impacts health tracking UX

---

### Pitfall 9: Missing Input Validation on Health Data

**What goes wrong:**
Users can enter invalid data (negative weight, future dates for past events, non-numeric values). Bad data corrupts graphs and trend analysis. Health insights become meaningless.

**Why it happens:**
Form inputs lack proper validation. Number inputs accept any value. Date pickers allow nonsensical dates. No data sanitization before storage.

**How to avoid:**
- Validate all inputs at entry point (weight > 0, reasonable ranges for species)
- Use controlled components with validation state
- Implement date validation (no future dates for past health events)
- Add visual feedback for invalid entries
- Sanitize data before chart rendering

**Warning signs:**
- Weight graphs show impossible values
- Users report "broken" charts
- No validation errors visible during data entry

**Phase to address:**
Phase 2 (Data Layer & Core Features) — Data integrity is foundational

---

### Pitfall 10: Touch Target Size Violations

**What goes wrong:**
Users can't reliably tap buttons for pet health logging. Small touch targets on forms cause mis-taps. Accessibility issues, especially for older pet owners.

**Why it happens:**
Default button sizes too small. Form inputs clustered too closely. Touch areas don't extend beyond visible bounds (known React Native issue on Android: negative margin not supported).

**How to avoid:**
- Ensure minimum 44x44pt touch targets for all interactive elements
- Use TouchableOpacity/TouchableHighlight with proper feedback
- Space form elements adequately (minimum 8dp between targets)
- Test with actual device, not just simulator
- Provide accessible alternative (larger buttons option)

**Warning signs:**
- Users report "missed taps" in beta testing
- Form submission fails due to wrong element activation
- Accessibility audit fails on touch target sizes

**Phase to address:**
Phase 1 (Foundation) — UX fundamentals from the start

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using AsyncStorage for user tokens | Quick auth implementation | Security vulnerability, token exposure | Never for auth |
| Skipping FlatList optimization | Faster initial development | Unresponsive history log, user churn | Only for <20 items |
| Hardcoded API endpoints | Simpler initial setup | No environment switching, production issues | Development only |
| Skipping input validation | Faster form completion | Corrupted health data, meaningless insights | Never |
| No offline support | Simpler architecture | App unusable offline, user abandonment | Only for demo/prototype |
| Using anonymous renderItem | Less code initially | Performance collapse as list grows | Never in production |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| React Navigation | Using JS-based stack instead of native-stack | Use @react-navigation/native-stack for performance; configure react-native-screens properly on Android |
| Vet API integration | Passing sensitive IDs in URL params | Use POST for data fetching, implement server-side validation |
| Calendar/Reminder integration | Deep link without validation | Use universal links, validate tokens server-side |
| Image picker | Loading full-res images directly | Compress/resize before display, use thumbnails for lists |
| Notification system | Not handling permission denial gracefully | Test permission flows, provide fallback UX |
| Network requests | Not handling timeout properly | Implement retry with exponential backoff, show user feedback |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Development mode performance | App feels slow, stutters | Always test in release build | Production deployment |
| Console logging in release | Gradual JS thread slowdown | Use babel-plugin-transform-remove-console | Production with debug libs |
| Unoptimized FlatList | Blank areas during scroll, dropped frames | Implement getItemLayout, proper config | History log with >50 items |
| Heavy chart re-renders | Chart animations block UI | Memoize, use native driver | Dashboard with multiple charts |
| Image loading without caching | Memory pressure, repeated network calls | Implement FastImage, preload | Pet gallery with >20 photos |
| State updates during animations | UI freezes momentarily | Wrap in InteractionManager or use LayoutAnimation | Any animated transitions |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing auth tokens in AsyncStorage | Token theft via device access | Use Keychain (iOS) / EncryptedSharedPreferences (Android) |
| Passing pet IDs in deep link URLs | Data interception, unauthorized access | Use universal links, token-based validation |
| No HTTPS enforcement | Man-in-middle attacks on health data | Enable SSL pinning, reject cleartext |
| Logging sensitive health data | Data exposure in crash reports | Sanitize logs, strip PII |
| No input sanitization | Invalid health data corruption | Validate all inputs, sanitize before storage |
| Skipping PKCE in OAuth | Authorization code interception | Always use PKCE with OAuth flows |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|----------------|
| Small touch targets | Failed taps, frustration, abandoned logging | Minimum 44x44pt targets, adequate spacing |
| No offline feedback | Users think data lost, don't trust app | Show "saved locally" indicator when offline |
| Unclear date formats | Confusion about pet's health timeline | Use relative dates ("3 days ago") with absolute on detail |
| Complex onboarding | Users drop before logging first pet | Simplified first pet setup, defer optional features |
| No empty states | App looks broken when no data | Friendly illustrations, clear CTA to add first entry |
| Missing loading states | App appears frozen during data fetch | Skeleton screens, progress indicators |
| Inconsistent navigation | Can't find expected features | Follow platform conventions, bottom tabs for main sections |

---

## "Looks Done But Isn't" Checklist

- [ ] **History Log:** FlatList renders but lacks getItemLayout — scrolling will lag with real data
- [ ] **Dashboard:** Charts animate but use JS-driven animations — will drop frames on lower-end devices
- [ ] **Auth:** Login works but tokens stored in AsyncStorage — vulnerable to token theft
- [ ] **Data Entry:** Forms accept input but no validation — invalid weight/date data will corrupt charts
- [ ] **Offline Mode:** App works but no local persistence — data lost when app closes
- [ ] **Deep Links:** Pet profile opens via URL but contains raw ID — vulnerable to interception
- [ ] **Images:** Pet photos display but load at full resolution — memory pressure on older devices
- [ ] **Notifications:** Reminders fire but no permission handling — crashes on first launch for some users

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Sensitive data storage | Phase 2 | Confirm no AsyncStorage for health data |
| FlatList performance | Phase 3 | Test scrolling with 100+ records |
| Deep linking security | Phase 2 | Security audit before launch |
| Chart performance | Phase 3 | Profile on mid-range device |
| Token auth issues | Phase 2 | Test session persistence across app restart |
| Console.log drain | Phase 1 | Verify babel config strips logs in release |
| Offline-first data | Phase 2 | Test in airplane mode |
| Image memory pressure | Phase 3 | Test on 1GB RAM device |
| Input validation | Phase 2 | Attempt invalid data entry, verify rejection |
| Touch target size | Phase 1 | Accessibility audit, physical device testing |

---

## Sources

- [React Native Security Documentation](https://reactnative.dev/docs/security) (Official, v0.85)
- [React Native Performance Documentation](https://reactnative.dev/docs/performance) (Official, v0.85)
- [React Native FlatList Optimization](https://reactnative.dev/docs/optimizing-flatlist-configuration) (Official, v0.85)
- [React Native Networking](https://reactnative.dev/docs/network) (Official, v0.85)
- [React Native Handling Touches](https://reactnative.dev/docs/handling-touches) (Official, v0.85)
- [React Navigation Getting Started](https://reactnavigation.org/docs/getting-started/) (Community, v7.x)

---
*Pitfalls research for: Pet Health & Wellness Tracker*
*Researched: 2026-04-16*