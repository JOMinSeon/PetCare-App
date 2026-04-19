# Phase 5: Digital Pet ID & Medical Records

**Phase:** 5
**Goal:** Users can access digital pet IDs and medical history records
**Depends on:** Phase 3 (Health Tracking & AI)
**Requirements:** MED-01, MED-02, MED-03, MED-04, ID-01, ID-02, ID-03, ID-04

## Decisions

### Locked Choices

1. **QR Code Generation Library:** Use `react-native-qrcode-svg` (v6.3.21) with `react-native-svg` (v15.15.4)
   - Reason: SVG-based rendering, supports custom styling, well-maintained

2. **QR Code Scanning Library:** Use `react-native-vision-camera` (v5.0.1) with built-in code scanner
   - Reason: react-native-camera is deprecated; vision-camera is actively maintained with barcode scanning support

3. **Medical Record Storage:** Extend existing `MedicalRecord` Prisma model
   - Schema already supports: type, name, date, nextDueDate, hospital, summary

4. **Emergency Contact:** Store in User model (needs new field `emergencyPhone`)

5. **Teal Primary Color:** Continue using `#00897B` (established in Phase 2)

### the agent's Discretion

- Medical record card UI design (grouping, styling)
- QR code content structure (JSON format for pet emergency info)
- Dashboard reminder display logic (threshold for "upcoming")
- Camera permission flow UI (graceful degradation vs. blocking)

### Deferred Ideas

- QR code deep linking to app (requires app scheme/uni-links setup)
- Sharing QR code as image file
- Multiple emergency contacts
- Vet clinic integration for automatic record imports
