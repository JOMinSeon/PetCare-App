# Technology Stack: AI Symptom Analysis

**Project:** Petcare App v1.1 AI 증상 분석
**Researched:** 2026-04-15
**Confidence:** HIGH (official documentation sources)

---

## Executive Summary

Adding AI symptom analysis requires **ONE new frontend library** (`expo-camera`) and **ONE backend SDK** (`openai`). The existing `expo-image-picker@55.0.18` can handle gallery selection, but `expo-camera` is needed for live camera preview with guided overlays. AI analysis happens server-side via OpenAI Vision API — no on-device ML models.

---

## Stack Changes

### Frontend (PetcareApp — React Native/Expo SDK 54)

#### ADD: expo-camera

| Property | Value |
|----------|-------|
| **Package** | `expo-camera` |
| **Recommended Version** | `~17.0.0` (bundled with Expo SDK 55, backwards compatible with SDK 54) |
| **Install Command** | `npx expo install expo-camera` |
| **Purpose** | Live camera preview with `CameraView` component for guided symptom capture |
| **Why Needed** | System camera UI (expo-image-picker) lacks overlay guides and custom UX for "take photo of symptom" flow |

#### ALREADY INSTALLED: expo-image-picker

| Property | Value |
|----------|-------|
| **Package** | `expo-image-picker` |
| **Current Version** | `55.0.18` |
| **Purpose** | Gallery selection and system camera fallback |
| **Usage** | `launchCameraAsync()` for system camera, `launchImageLibraryAsync()` for gallery |

#### DO NOT ADD: TensorFlow Lite, ONNX, or any on-device ML

| Why Not | Explanation |
|---------|-------------|
| **Bundle size** | TF Lite adds 50-100MB to app bundle |
| **Inference speed** | Slow on mobile, battery-draining |
| **Update latency** | Can't update model without app release |
| **Accuracy** | Server-side Vision APIs outperform mobile models |

---

### Backend (Node.js/Express — package.json root)

#### ADD: openai SDK

| Property | Value |
|----------|-------|
| **Package** | `openai` |
| **Recommended Version** | `^4.85.0` or latest |
| **Install Command** | `npm install openai` |
| **Purpose** | OpenAI Vision API for image analysis |
| **Why** | Official SDK handles vision endpoints, base64 encoding, error handling |

#### Existing Stack Unchanged

| Package | Version | Purpose |
|---------|---------|---------|
| `@prisma/client` | `^7.7.0` | Database ORM |
| `bcrypt` | `^6.0.0` | Password hashing |
| `jose` | `^6.2.2` | JWT handling |

---

## Library Comparison

### Camera Options for React Native/Expo

| Library | Pros | Cons | Recommendation |
|---------|------|------|----------------|
| **expo-camera** | Live preview, overlay support, flash control, front/back camera | Requires custom UI implementation | **Recommended for symptom capture** |
| **expo-image-picker** | Already installed, simple API, system UI handles permissions | No live preview, system camera UI can't show overlay guides | Use for gallery selection only |

**Decision:** Use `expo-camera` for the main symptom capture screen. Use `expo-image-picker` as fallback for users who prefer system camera.

### AI Vision API Options

| Provider | Model | Pros | Cons | MVP Verdict |
|----------|-------|------|------|-------------|
| **OpenAI** | GPT-4o, GPT-4.1-mini | Excellent vision, structured output, simple API | Pay-per-use | **Recommended** |
| **Anthropic Claude** | Claude 3.5 Sonnet | Strong reasoning, vision | Pay-per-use | Backup option |
| **Google Vertex AI** | Gemini | Good vision, Google Cloud integration | Complex setup | Overkill for MVP |

**OpenAI Vision is recommended because:**
1. Single API call for analysis + structured output
2. Well-documented with Node.js SDK
3. Pay-per-use (no monthly commitment)
4. GPT-4o handles medical/pet symptom reasoning well

---

## Integration with Existing Expo SDK 54

### Compatibility Matrix

| Library | Expo SDK 54 | Expo SDK 55 | Notes |
|---------|-------------|-------------|-------|
| `expo-camera` | ✅ Compatible | ✅ Bundled | Install via `npx expo install expo-camera` |
| `expo-image-picker` | ✅ Compatible | ✅ Bundled | Already installed (55.0.18) |
| `openai` (Node.js) | ✅ Compatible | N/A | Backend package, no Expo dependency |

### Permissions Required

**iOS (Info.plist additions):**
```xml
<key>NSCameraUsageDescription</key>
<string>Take photos of pet symptoms for AI analysis</string>
```

**Android (AndroidManifest.xml):**
- `CAMERA` permission added automatically by expo-camera

---

## Installation Commands

### Frontend (PetcareApp/)

```bash
# Install expo-camera (backwards compatible with SDK 54)
npx expo install expo-camera

# Verify expo-image-picker is at 55.0.18+ (already installed)
npx expo install expo-image-picker
```

### Backend (root/)

```bash
# Install OpenAI SDK for Node.js
npm install openai
```

---

## What NOT to Add

| Library | Why Not |
|---------|---------|
| `react-native-tensorflow-lite` | On-device ML adds 50-100MB bundle, slower than server-side |
| `expo-ml-kit` or similar | ML Kit face detection irrelevant for pet symptoms |
| `onnxruntime-react-native` | Complex setup, no accuracy benefit over cloud APIs |
| Custom training data pipelines | Out of scope for MVP — use general-purpose Vision API |

---

## Architecture Decision

```
┌─────────────────────────────────────────┐
│  React Native (Expo SDK 54)             │
│  ┌────────────────────────────────────┐ │
│  │ CameraScreen                       │ │
│  │ - expo-camera CameraView           │ │
│  │ - Overlay guides (e.g., "position │ │
│  │   symptom in circle")              │ │
│  │ - takePictureAsync() → base64     │ │
│  └────────────────────────────────────┘ │
│                  │                        │
│                  │ POST /api/symptoms    │
│                  ▼                        │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  Node.js Backend                        │
│  ┌────────────────────────────────────┐ │
│  │ symptomAnalysis.service.ts         │ │
│  │ - openai.chat.completions.create  │ │
│  │ - model: gpt-4o                    │ │
│  │ - image passed as base64           │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Recommended Versions (Verified)

| Package | Version | Source |
|---------|---------|--------|
| `expo-camera` | `~17.0.0` | Expo SDK 55 bundled, backwards compatible |
| `expo-image-picker` | `55.0.18` | Already installed |
| `openai` | `^4.85.0` | npm latest as of 2026-04 |

---

## Open Questions

1. **GPT-4o vs GPT-4.1-mini cost tradeoff** — Mini is cheaper but may have lower medical reasoning accuracy. Recommend starting with 4o for MVP quality, switching to mini if cost becomes issue.

2. **Image storage** — Temporary base64 in memory vs saving to disk first. Base64 is simpler but larger payload.

---

## Sources

- [Expo Camera Documentation](https://docs.expo.dev/versions/latest/sdk/camera/) — Official Expo docs
- [Expo Image Picker Documentation](https://docs.expo.dev/versions/latest/sdk/imagepicker/) — Official Expo docs
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision) — Official OpenAI docs (2026-04)
- [Expo SDK 54 Changelog](https://expo.dev/changelog/sdk-54) — Released August 27, 2025
- [Expo SDK 55 Changelog](https://expo.dev/changelog/sdk-55) — Released February 25, 2026
