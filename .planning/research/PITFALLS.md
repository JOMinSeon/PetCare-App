# Pitfalls Research

**Domain:** Pet Healthcare Mobile App + Backend API
**Researched:** 2026-04-19
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Token Management Complexity

**What goes wrong:**
Auth tokens expire unexpectedly, causing silent failures or logout loops.

**Why it happens:**
Firebase tokens expire in 1 hour, JWT refresh tokens add complexity many devs underestimate.

**How to avoid:**
Implement proper token refresh logic before expiration, store refresh tokens securely.

**Warning signs:**
Users randomly logged out, "Invalid token" errors in logs.

**Phase to address:**
Phase 2 (Authentication & Core Data)

---

### Pitfall 2: AI Overconfidence in Symptom Analysis

**What goes wrong:**
AI suggests definitive diagnosis when it should only suggest probability/recommendation.

**Why it happens:**
Pressure to show "smart" features leads to overconfident phrasing.

**How to avoid:**
Always phrase as "may indicate" / "consult vet" with clear disclaimers.

**Warning signs:**
AI output uses definitive language like "is" instead of "could be".

**Phase to address:**
Phase 3 (AI Features)

---

### Pitfall 3: Map API Rate Limits

**What goes wrong:**
Google Maps API quotas hit unexpectedly, map stops loading.

**Why it happens:**
Free tier has strict limits, testing with real API keys burns quota.

**How to avoid:**
Implement caching, use mock data in development, monitor quota usage.

**Warning signs:**
Map tiles loading slowly before complete failure.

**Phase to address:**
Phase 4 (Services & Map)

---

### Pitfall 4: Health Score Algorithm Disputes

**What goes wrong:**
Users question or distrust health score calculation with no transparency.

**Why it happens:**
Proprietary algorithm with no explanation of factors/weights.

**How to avoid:**
Show breakdown of score calculation, allow users to see what affects their score.

**Warning signs:**
Users asking "why is my score low?" with no answer available.

**Phase to address:**
Phase 3 (AI Features)

---

### Pitfall 5: Database Connection Exhaustion

**What goes wrong:**
PostgreSQL connections run out under concurrent mobile requests.

**Why it happens:**
Each mobile client opens connection, no pooling configured.

**How to avoid:**
Use Prisma connection pooling, set reasonable pool limits.

**Warning signs:**
Database connection timeout errors spike during peak.

**Phase to address:**
Phase 2 (Authentication & Core Data)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoded API URL | Faster dev | Must change for prod | Only in constants |
| Skipping validation | Faster API write | Security holes | Never |
| No pagination | Simpler API | Memory issues | Only for <100 rows |
| Storing passwords | Simple auth | Security disaster | Never |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Firebase Auth | Not handling token refresh | Implement silent refresh |
| Google Maps | API key in client | Server-side proxy for quota |
| Prisma | Connection per request | Use pool with singleton |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| N+1 queries | Slow list loads | Include relations | >10 pets per user |
| Large JSON payloads | Slow API | Pagination + selective fields | >50 records |
| Image uploads unoptimized | Slow uploads | Compress before upload | Images >500KB |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| JWT in localStorage | XSS theft | EncryptedStorage or httpOnly cookie |
| No input validation | SQL injection | Zod validation on all inputs |
| Missing rate limiting | API abuse | express-rate-limit middleware |
| No HTTPS enforcement | MITM attacks | HSTS header + force HTTPS |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Generic health score without explanation | Confusion, distrust | Show factor breakdown |
| Symptom input too complex | Users skip logging | 3-tap max logging |
| Map filters too buried | Unused feature | Prominent filter button |
| Emergency button buried | Panic in crisis | Always visible emergency access |

## "Looks Done But Isn't" Checklist

- [ ] **Auth:** Token refresh actually tested (not just initial login)
- [ ] **Health Score:** Algorithm explanation accessible to users
- [ ] **Symptom Logger:** Works offline with sync later
- [ ] **Maps:** Handles no-permission gracefully
- [ ] **Medical Records:** Date formatting consistent with locale

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Token expiry loop | HIGH | Force re-login, add refresh debug logging |
| AI overconfidence | MEDIUM | Update disclaimer language, review outputs |
| Map rate limit | MEDIUM | Implement caching, switch to paid tier |
| DB connection exhaustion | HIGH | Restart server, add pool limits |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Token management | Phase 2 | Test token expiry flow |
| AI overconfidence | Phase 3 | Review AI output language |
| Map rate limits | Phase 4 | Test with cached data |
| Health score disputes | Phase 3 | User can see score breakdown |
| DB connection | Phase 2 | Load test concurrent connections |

## Sources

- Firebase auth best practices
- React Native security checklist
- Prisma performance pitfalls
- Google Maps API quotas documentation