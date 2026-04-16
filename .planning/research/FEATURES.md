# Feature Landscape: AI Pet Symptom Analysis

**Domain:** Camera-based AI symptom analysis for pets
**Researched:** 2026-04-15
**Confidence:** MEDIUM (WebSearch-based, limited Context7/Official doc access)

## How AI Pet Symptom Analysis Works

### Two Main Approaches

| Approach | How It Works | Example |
|----------|--------------|---------|
| **LLM-Based Analysis** | User describes symptoms in text; LLM (Gemini, GPT-4) reasons over veterinary knowledge to provide possible conditions, urgency, recommendations | VetTrack-AI, vet-bot |
| **Computer Vision Analysis** | User uploads image (skin lesion, eye, etc.); CNN/YOLOv8 model classifies into specific disease categories | PetDiseaseApi (YOLOv8, 22 conditions) |

### Typical Workflow

```
1. User selects pet from profile (species, breed, age needed for context)
2. User captures/uploads symptom photo OR describes symptoms in text
3. AI processes:
   - Image: Object detection/classification (what condition, where)
   - Text: LLM reasoning over symptom description
4. Returns structured response:
   - Possible condition(s) with confidence %
   - Severity/urgency level (Low/Medium/High/Emergency or Red/Yellow/Green)
   - Treatment recommendations
   - Prevention tips
5. Always: Medical disclaimer (NOT a substitute for vet diagnosis)
```

### Urgency Assessment Systems

Common pattern across solutions: **Traffic Light System**
- 🔴 **Red/Emergency** — Seek immediate vet care
- 🟡 **Yellow/Watch** — Monitor closely, vet visit soon
- 🟢 **Green/Low** — Likely benign, monitor

---

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Dependencies |
|---------|--------------|------------|--------------|
| **Photo capture/upload** | Core interaction for visual symptom analysis | Low | Camera permissions, image storage |
| **Basic symptom analysis** | Primary value proposition | Medium | AI API (LLM or CV model) |
| **Urgency indicator** | Helps users decide if immediate vet visit needed | Low | AI output formatting |
| **Results with recommendations** | Users need to know what to do next | Low | Knowledge base integration |
| **Medical disclaimer** | Legal requirement for health-adjacent apps | Low | UI copy |
| **Analysis history/timeline** | Track symptom progression over time | Medium | Database, existing pet profiles |

### Dependencies on Existing v1.0 Features

| Existing Feature | How It Supports AI Analysis |
|------------------|----------------------------|
| Pet profiles | Species/breed/age required for accurate AI context |
| Health records | Prior conditions help AI avoid false positives |
| Reminders | Can trigger follow-up reminders based on AI recommendations |

---

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Multi-modal input** | Combine photo + text description for richer context | Medium | LLM can reason over both |
| **Condition-specific guidance** | Step-by-step home care instructions for common issues | Medium | Requires detailed knowledge base |
| **Vet clinic integration** | One-tap booking from AI results to nearby animal hospital | Medium | Existing Kakao Maps API (v1.0) |
| **Voice output** | Murf TTS-style audio playback of results for accessibility | Medium | Third-party TTS API |
| **Document OCR** | Parse lab reports, vaccination certificates from photos | High | Vision AI + document understanding |
| **Pet context awareness** | AI considers pet's full health history, not just current symptom | Medium | Requires health records integration |
| **Community data anonymization** | Show "X users had similar symptoms, Y resolved with..." | High | Privacy-preserving aggregation |

### AI Backing Options

| Approach | Pros | Cons | Complexity |
|---------|------|------|------------|
| **LLM API (Gemini, GPT-4)** | Natural language reasoning, no training needed | API costs, slower, may hallucinate | Low |
| **Fine-tuned CV model (YOLOv8)** | Fast, accurate for specific conditions | Requires training data, limited to trained conditions | High |
| **Hybrid (LLM + CV)** | Best of both — CV for detection, LLM for reasoning | Complexity of integrating two systems | High |

**Recommendation for MVP:** Start with LLM API only. Use GPT-4o or Gemini Flash for:
- Symptom text analysis
- Photo analysis via vision-capable LLMs (GPT-4o, Gemini 1.5)

This avoids training a custom model while providing broad coverage.

---

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Definitive diagnosis claims** | AI cannot replace veterinary examination; legal/ethical risk | Frame as "possible conditions" with confidence ranges |
| **Guaranteed accuracy** | Never 100%; will fail on edge cases | Use confidence percentages, always recommend vet confirmation |
| **Prescription capability** | Illegal without veterinary license | Recommend OTC options or "consult your vet" |
| **Real-time video analysis** | High complexity, latency issues, not needed for static photos | Static image analysis sufficient |
| **Ignoring pet context** | Same symptom means different things for different species/breeds/ages | Always require pet selection first |
| **No urgency escalation** | Users may dismiss serious symptoms | Strong urgency indicators, especially for emergency signs |

---

## MVP Recommendation

### Prioritize (v1.1)

1. **Pet selection with context** — Select which pet, species/breed/age pre-populated from profiles
2. **Photo capture + upload** — Camera integration (Expo Camera or Image Picker)
3. **LLM-based symptom analysis** — Use GPT-4o Vision or Gemini 1.5 Flash for image + text input
4. **Urgency indicator** — Red/Yellow/Green with clear action labels
5. **Results display** — Condition name, confidence %, what to do next
6. **Medical disclaimer** — Prominent, unavoidable
7. **Save to timeline** — Link analysis to pet's health record

### Defer (Future Milestones)

| Feature | Reason for Deferral |
|---------|---------------------|
| Custom CV model training | High cost, LLM vision sufficient for MVP |
| Lab report OCR | Complex document understanding |
| Vet booking from results | Can link to existing hospital search |
| Community symptom matching | Privacy concerns, low priority |
| Voice output | Accessibility nice-to-have, not core |

---

## Feature Dependencies

```
Pet Profile Selection
    ↓
Photo Capture (or Text Description)
    ↓
AI Analysis (LLM Vision API)
    ↓
Urgency Assessment + Recommendations
    ↓
Save to Health Timeline ←→ Existing Health Records
    ↓
(Optional) Trigger Reminder
```

---

## Technical Considerations

### Image Requirements
- Format: JPG, PNG, WEBP
- Size limit: 10MB typical for API calls
- Guidance to users: Clear, well-lit photos of affected area

### API Options (2025-2026)

| Provider | Vision Capability | Cost | Notes |
|----------|-------------------|------|-------|
| OpenAI GPT-4o | Image input + reasoning | Pay-per-use | Well-documented, reliable |
| Google Gemini 1.5 Flash | Image input + reasoning | Free tier generous | Good for prototype |
| Anthropic Claude | Vision (3.5 Sonnet) | Pay-per-use | Strong reasoning |

### Response Structure (Recommended)

```json
{
  "analysis_id": "uuid",
  "pet_id": "uuid",
  "input_type": "image" | "text" | "both",
  "possible_conditions": [
    {
      "name": "Skin allergy",
      "confidence": 0.78,
      "description": "Redness and itching typically indicate...",
      "severity": "medium"
    }
  ],
  "urgency": "yellow",
  "urgency_message": "Monitor closely; see vet within 24-48 hours if worsening",
  "recommendations": ["Keep area clean", "Prevent scratching", "Schedule vet visit"],
  "disclaimer": "This is not a veterinary diagnosis. Consult a licensed vet.",
  "created_at": "ISO8601"
}
```

---

## Sources

- [VetTrack-AI](https://github.com/kashisharora-14/VetTrack-AI) — LLM-based symptom analysis with Gemini, photo diagnosis (GitHub, 2026)
- [PetDiseaseApi](https://github.com/Eswarchinthakayala-webdesign/PetDiseaseApi) — YOLOv8-based disease classification for 22 conditions (GitHub, 2026)
- [vet-bot](https://github.com/ArtSteel/vet-bot) — LLM + Vision AI for pet document parsing, urgency traffic light system (GitHub, 2026)
- [Pawp](https://www.pawp.com) — 24/7 vet consultation service (production app, 2025)

**Confidence Notes:**
- Sources are GitHub repos and product websites — not peer-reviewed or formally verified
- Technology patterns (LLM + CV hybrid) confirmed across multiple independent implementations
- Specific model accuracy claims not independently validated