# Petcare App

## What This Is

 반려동물 종합 관리 앱 — 健康管理, 커뮤니티, 서비스 마켓플레이스를 하나로 통합. 1인가구와 맞벌이 가구를 대상으로 "내가不在해도 반려동물은 안정하다"는 가치를 제공한다.

## Core Value

**편의성 우선**: 바쁜 현대인도 반려동물 관리 불안감 없이 반려동물과 행복한 일상

## Current State

**Shipped:** v1.0 MVP (2026-04-15)
**Tech Stack:** React Native (Expo SDK 54), Expo Router, Zustand, REST API

## Current Milestone: v1.1 AI 증상 분석

**Goal:** 카메라로 반려동물 증상을 촬영하면 AI가 증상을 분석하고 알려주는 시스템

**Target features:**
- 카메라로 증상 사진 촬영
- AI 기반 증상 분석 (구토, 피부병, 눈 이상 등)
- 분석 결과 및 권장 조치 표시
- 증상 기록 저장 및 타임라인

## Requirements

### Validated (v1.0)

- ✅ 반려동물 프로필 관리 — v1.0
- ✅ 건강 기록 (vaccination, 약복용, 검사 이력) — v1.0
- ✅ 알림/리마인더 (약복용, 산책시간, 병원预约) — v1.0
- ✅ 건강 데이터 시각화 (체중, 활동량 트렌드) — v1.0
- ✅ 사진 공유 커뮤니티 — v1.0
- ✅ 동물병원/약국 검색 및 예약 — v1.0
- ✅ 리뷰 시스템 — v1.0

### Active (v1.1)

- [ ] AI 증상 분석 기능 정의 필요

### Out of Scope

- 반려동물 산업 전문가 대상 기능 — 일반 사용자 중심
- 실시간 채팅 — 커뮤니티는 비동기적 공유 위주
- Video 스트리밍 — 이미지/사진 공유만 지원

## Context

- 기존 DESIGN.md 참고 (Clinical Sanctuary 디자인 시스템)
- 1인가구/맞벌이 가구 페르소나 중심
- **React Native** 앱 (Expo 사용)
- Android 및 iOS 크로스 플랫폼

## Constraints

- **플랫폼**: React Native (Expo SDK 53+)
- **출시 전략**: 건강관리 MVP → 커뮤니티 유도 → 마켓플레이스 순차 출시
- **모듈 구조**: 각 기능 독립 개발/테스트 가능
- **알림 정확도**: 99% 이상 정확도 필요
- **상태 관리**: React Context + Zustand
- **백엔드**: REST API (Node.js/Express)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React Native 선택 | 빠른 개발, 크로스 플랫폼 (Android/iOS) | ✓ Confirmed |
| Expo 사용 | 쉬운 빌드, 푸시 알림, OTA 업데이트 | ✓ Confirmed |
| Kakao Maps API | 한국 동물병원 검색 최적화 | ✓ Confirmed |
| 인앱 예약 시스템 | 외부 링크 없이 직접 예약 | ✓ Confirmed |
| Context + Service 패턴 | 기존 아키텍처 일관성 | ✓ Confirmed |

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

---

*Last updated: 2026-04-15 after v1.1 milestone started*
