# Phase 3: Service Discovery - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

동물병원 검색, 예약, 리뷰 시스템. 사용자가 주변 동물병원을 찾고, 예약을 하며, 리뷰를 작성할 수 있다.
</domain>

<decisions>
## Implementation Decisions

### 데이터 소스
- **D-01:** Kakao Maps API 사용 — 한국 동물병원 검색 및 위치 기반 서비스

### 검색/표시 방식
- **D-02:** 지도 + 리스트 hybrid — 지도에 병원 마커 + 하단 리스트로 병원은 정보 제공

### 예약
- **D-03:** 인앱 예약 — 외부 링크 없음, 앱 내에서 직접 날짜/시간 선택 후 예약 확정

### 리뷰
- **D-04:** 星级 + 텍스트 리뷰 — 1-5星 평점과 자유 텍스트 리뷰

### 아키텍처
- **D-05:** 기존 앱 구조 따름 — Context + Service 패턴, expo-router 사용

### 백엔드
- **D-06:** REST API (기존 아키텍처 유지)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `.planning/ROADMAP.md` — Phase 3 goal and requirements
- `.planning/REQUIREMENTS.md` — SERV-01, SERV-02, SERV-03, SERV-04 requirements
- `.planning/PROJECT.md` — Petcare App vision and constraints
- `PetcareApp/` — Existing codebase (Context, Service, Types patterns)

### Kakao Maps
- Kakao Maps JavaScript SDK docs
- Kakao Maps API REST API docs for clinic search

</canonical_refs>

<codebase_context>
## Existing Code Insights

### Reusable Assets
- Context pattern: `AuthContext`, `PetContext`, `HealthContext`, `PostContext`, `ReminderContext`, `AnalyticsContext`
- Service pattern: `auth.service.ts`, `pet.service.ts`, `health.service.ts`, `post.service.ts`
- Type definitions: `pet.types.ts`, `health.types.ts`, `post.types.ts`, `analytics.types.ts`, `notification.types.ts`

### Established Patterns
- React Native + Expo SDK
- expo-router file-based routing
- Context + Service architecture
- FlatList for scrollable lists
- StyleSheet for styling (not Tailwind)

### Integration Points
- New clinic search → new tab or integrate with explore tab
- Booking → stored in user appointment history
- Reviews → linked to clinics and users

### Phase 2 Patterns
- Analytics chart: dots-based line chart in `analytics.tsx`
- Community cards: shadow/rounded card style in `community.tsx`
</codebase_context>

<specifics>
## Specific Ideas

- 지도 위에 병원 마커 표시, 마커 터치 시 상세 정보 Overlay 또는 Bottom Sheet
- 리스트는 FlatList로 구현, 카드 형태 (community.tsx 스타일 참고)
- 예약은 DateTimePicker로 날짜/시간 선택
- 리뷰는星级 Emoji 선택기 + TextInput 형태
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope
</deferred>

---

*Phase: 03-service-discovery*
*Context gathered: 2026-04-15*
