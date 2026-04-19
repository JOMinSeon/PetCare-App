# Phase 5: Digital Pet ID & Medical Records - Research

**Researched:** 2026-04-19
**Domain:** Digital Pet ID (QR codes), Medical Records Management, Camera Permissions
**Confidence:** MEDIUM-HIGH

## Summary

Phase 5 implements digital pet IDs with QR codes and medical records management. QR code generation uses `react-native-qrcode-svg` with `react-native-svg`, while scanning uses `react-native-vision-camera` with built-in code scanner (react-native-camera is deprecated). The existing Prisma schema already contains a `MedicalRecord` model that supports vaccinations and checkups. The main additions needed are: User model extension for emergency phone, API endpoints for medical records CRUD, mobile screens for medical record management, and QR code generation/scanning UI.

**Primary recommendation:** Use react-native-qrcode-svg for generation and react-native-vision-camera for scanning. Store QR data as JSON containing pet ID, owner contact, and basic pet info for emergency retrieval.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- QR Code Generation: `react-native-qrcode-svg` v6.3.21 with `react-native-svg` v15.15.4
- QR Code Scanning: `react-native-vision-camera` v5.0.1 with built-in code scanner
- Medical Record Storage: Extend existing MedicalRecord Prisma model
- Emergency Contact: Store in User model (new field `emergencyPhone`)
- Teal Primary Color: Continue `#00897B`

### the agent's Discretion
- Medical record card UI design
- QR code content structure
- Dashboard reminder display logic
- Camera permission flow UI

### Deferred Ideas (OUT OF SCOPE)
- QR code deep linking to app
- Sharing QR code as image file
- Multiple emergency contacts
- Vet clinic integration

## Standard Stack

### Core Dependencies
| Library | Version | Purpose | Why Standard |
|---------|--------|---------|--------------|
| react-native-qrcode-svg | 6.3.21 | QR code generation | SVG-based, customizable, maintained |
| react-native-svg | 15.15.4 | SVG rendering for QR codes | Required by qrcode-svg |
| react-native-vision-camera | 5.0.1 | Camera access + QR scanning | Actively maintained, replaces deprecated react-native-camera |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|--------|---------|-------------|
| react-native-permissions | 5.5.1 | Unified permission handling | For camera permission requests |
| @react-native-async-storage/async-storage | 2.2.0 | Local caching of medical records | Already installed |

**Installation:**
```bash
cd mobile
npm install react-native-qrcode-svg react-native-svg react-native-vision-camera react-native-permissions
cd ios && pod install
```

**Version verification:**
- react-native-qrcode-svg: 6.3.21 (published 2024)
- react-native-svg: 15.15.4 (published 2024)
- react-native-vision-camera: 5.0.1 (published Apr 2026)

## Architecture Patterns

### Recommended Project Structure
```
mobile/src/
├── components/
│   ├── medical/
│   │   ├── MedicalRecordCard.tsx      # Individual record display
│   │   ├── VaccinationCard.tsx          # Vaccination-specific card
│   │   ├── CheckupCard.tsx             # Checkup-specific card
│   │   └── MedicalRecordForm.tsx      # Add/edit form
│   ├── petId/
│   │   ├── PetIDCard.tsx               # Digital ID card display
│   │   ├── QRCodeDisplay.tsx          # QR code with pet info
│   │   └── QRScanner.tsx              # Camera-based scanner
│   └── common/
│       └── PermissionGate.tsx          # Permission request wrapper
├── screens/
│   ├── medical/
│   │   ├── MedicalRecordsScreen.tsx   # List grouped records
│   │   └── AddMedicalRecordScreen.tsx # Add vaccination/checkup
│   └── petId/
│       ├── PetIDScreen.tsx             # Digital ID + QR display
│       └── QRScannerScreen.tsx         # Scan QR to retrieve info
├── stores/
│   └── medicalStore.ts                 # Zustand store for medical records
├── services/
│   └── medical.service.ts              # API calls for medical records
└── types/
    └── index.ts                        # Add MedicalRecord, Vaccination, Checkup types

server/src/
├── routes/
│   └── medical.routes.ts              # Medical record endpoints
├── controllers/
│   └── medical.controller.ts          # CRUD handlers
└── services/
    └── medical.service.ts             # Business logic
```

### Pattern 1: Medical Record Grouping

**What:** Display medical records as cards grouped by type (vaccinations, checkups)

**When to use:** Medical records list screen

**Example:**
```typescript
// Group records by type
const groupedRecords = records.reduce((acc, record) => {
  const key = record.type; // 'vaccination' | 'checkup'
  if (!acc[key]) acc[key] = [];
  acc[key].push(record);
  return acc;
}, {} as Record<string, MedicalRecord[]>);

// Render sections
Object.entries(groupedRecords).map(([type, records]) => (
  <View key={type}>
    <Text style={styles.sectionTitle}>
      {type === 'vaccination' ? '💉 Vaccinations' : '🏥 Checkups'}
    </Text>
    {records.map(record => (
      <MedicalRecordCard key={record.id} record={record} />
    ))}
  </View>
));
```

### Pattern 2: QR Code Content Structure

**What:** JSON payload embedded in QR code for emergency retrieval

**When to use:** Generating QR code for pet ID

**Example:**
```typescript
interface PetEmergencyQRData {
  petId: string;
  petName: string;
  species: string;
  breed?: string;
  weight?: number;
  age?: string;
  emergencyPhone: string;
  ownerName: string;
}

// QR content: JSON stringified (keep under ~2KB for reliable scanning)
const qrData: PetEmergencyQRData = {
  petId: pet.id,
  petName: pet.name,
  species: pet.species,
  breed: pet.breed,
  weight: pet.weight,
  age: calculateAge(pet.birthDate),
  emergencyPhone: user.emergencyPhone,
  ownerName: user.name, // if available
};

// Generate QR
<QRCodeSVG
  value={JSON.stringify(qrData)}
  size={200}
  backgroundColor="white"
  color="#00897B"
/>
```

### Pattern 3: Camera Permission Gate

**What:** Graceful permission handling before camera access

**When to use:** QR scanner screen

**Example:**
```typescript
import { usePermission } from 'react-native-permissions';

function QRScannerScreen() {
  const cameraPermission = usePermission(PERMISSION_TYPE.CAMERA);

  if (cameraPermission.status === DENIED) {
    return (
      <PermissionGate
        icon="📷"
        title="Camera Access Required"
        message="To scan pet QR codes, please grant camera access."
        onRequest={() => cameraPermission.request()}
        onDismiss={() => navigation.goBack()}
      />
    );
  }

  if (cameraPermission.status === BLOCKED) {
    return (
      <View style={styles.blockedContainer}>
        <Text>Camera access is blocked.</Text>
        <Text>Please enable it in Settings.</Text>
        <Button onPress={openSettings}>Open Settings</Button>
      </View>
    );
  }

  return <CameraScanner onScanned={handleQRScanned} />;
}
```

### Pattern 4: Dashboard Vaccination Reminders

**What:** Display upcoming vaccinations in dashboard

**When to use:** Dashboard care reminders section

**Example:**
```typescript
// Filter and sort vaccinations by next due date
const upcomingVaccinations = medicalRecords
  .filter(r => r.type === 'vaccination' && r.nextDueDate)
  .filter(r => {
    const daysUntil = differenceInDays(new Date(r.nextDueDate), new Date());
    return daysUntil <= 30; // Within 30 days
  })
  .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());

// Map to CareReminder format
const reminders: CareReminder[] = upcomingVaccinations.map(v => ({
  id: v.id,
  petId: v.petId,
  petName: pets.find(p => p.id === v.petId)?.name || 'Unknown',
  type: 'vaccination' as const,
  title: v.name,
  dueDate: v.nextDueDate,
  isOverdue: new Date(v.nextDueDate) < new Date(),
}));
```

### Pattern 5: Digital ID Card Design

**What:** Display essential pet info in ID card format

**When to use:** Pet ID screen

**Example:**
```typescript
function PetIDCard({ pet, user }: { pet: Pet; user: User }) {
  return (
    <View style={styles.idCard}>
      <View style={styles.idHeader}>
        <Text style={styles.idTitle}>Pet ID Card</Text>
        <Text style={styles.vitalPawLogo}>🐾 VitalPaw</Text>
      </View>

      <View style={styles.idContent}>
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{pet.name}</Text>
          <SpeciesIcon species={pet.species} size={32} />
        </View>

        <View style={styles.infoGrid}>
          <InfoRow label="Species" value={pet.species} />
          <InfoRow label="Breed" value={pet.breed || 'Unknown'} />
          <InfoRow label="Weight" value={pet.weight ? `${pet.weight} kg` : 'Unknown'} />
          <InfoRow label="Age" value={calculateAge(pet.birthDate)} />
        </View>

        <View style={styles.emergencyContact}>
          <Text style={styles.emergencyLabel}>Emergency Contact</Text>
          <Text style={styles.emergencyPhone}>{user.emergencyPhone}</Text>
        </View>
      </View>

      <View style={styles.idFooter}>
        <Text style={styles.petId}>ID: {pet.id.slice(0, 8)}</Text>
      </View>
    </View>
  );
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| QR code generation | Custom canvas-based QR drawing | react-native-qrcode-svg | Handles encoding, error correction, sizing correctly |
| Camera access | Direct native module calls | react-native-vision-camera | Handles lifecycle, permissions, device differences |
| Permission handling | Manual native permission requests | react-native-permissions | Unified API across iOS/Android, handles all states |
| Date comparisons | Manual day calculations | date-fns (already used in project) | Handles timezones, edge cases |

**Key insight:** QR code scanning requires native camera integration. Building custom camera handling leads to lifecycle bugs, permission inconsistencies, and crashes on different devices. Use established libraries.

## Runtime State Inventory

> Skip this section — Phase 5 does not involve rename/refactor/migration.

## Common Pitfalls

### Pitfall 1: QR Code Data Size
**What goes wrong:** QR codes become unreadable when data exceeds ~2KB
**Why it happens:** QR code capacity depends on version (size) and error correction level
**How to avoid:** Keep data minimal. Store only pet ID and reference backend for full data
**Warning signs:** QR scanner requires multiple attempts, or only works at certain distances

### Pitfall 2: Camera Permission States
**What goes wrong:** App crashes or shows blank screen when camera permission is denied
**Why it happens:** Not handling DENIED, BLOCKED, and GRANTED states distinctly
**How to avoid:** Always check permission status before rendering camera, provide clear user action for each state
**Warning signs:** "Camera undefined" errors in crash logs

### Pitfall 3: Vaccination Due Date Validation
**What goes wrong:** User can set next due date before administered date
**Why it happens:** No date validation in form submission
**How to avoid:** Validate that nextDueDate >= date administered
**Warning signs:** Negative day counts in reminder calculations

### Pitfall 4: Medical Record Grouping Performance
**What goes wrong:** Slow list rendering with many records
**Why it happens:** Re-grouping records on every render
**How to avoid:** Use useMemo for grouping, consider FlatList with section headers

## Code Examples

### Vaccination Record Addition (Frontend Form)
```typescript
// Source: Based on existing symptom log pattern in mobile
interface VaccinationInput {
  name: string;           // e.g., "Rabies", "Distemper"
  date: string;          // ISO date when administered
  nextDueDate?: string;  // ISO date for next vaccination
}

async function addVaccination(petId: string, data: VaccinationInput) {
  const response = await api.post('/medical-records', {
    type: 'vaccination',
    petId,
    ...data,
  });
  return response.medicalRecord;
}
```

### Checkup Record Addition (Frontend Form)
```typescript
// Source: Based on existing symptom log pattern
interface CheckupInput {
  hospital: string;      // Vet clinic name
  date: string;          // ISO date of checkup
  summary?: string;      // Notes from visit
  name?: string;         // Optional checkup title (e.g., "Annual Physical")
}

async function addCheckup(petId: string, data: CheckupInput) {
  const response = await api.post('/medical-records', {
    type: 'checkup',
    petId,
    name: data.name || `Checkup at ${data.hospital}`,
    ...data,
  });
  return response.medicalRecord;
}
```

### Medical Records List with Grouping
```typescript
// Source: Pattern from DashboardScreen reminders section
function MedicalRecordsScreen({ route }) {
  const { petId } = route.params;
  const { records, isLoading, fetchRecords } = useMedicalStore();

  const groupedRecords = useMemo(() => {
    return records.reduce((acc, record) => {
      const key = record.type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(record);
      return acc;
    }, {} as Record<string, MedicalRecord[]>);
  }, [records]);

  return (
    <SectionList
      sections={[
        { title: 'Vaccinations', data: groupedRecords.vaccination || [] },
        { title: 'Checkups', data: groupedRecords.checkup || [] },
      ]}
      renderItem={({ item }) => <MedicalRecordCard record={item} />}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
    />
  );
}
```

### QR Code Generation
```typescript
// Source: react-native-qrcode-svg documentation
import QRCodeSVG from 'react-native-qrcode-svg';

function QRCodeDisplay({ pet, emergencyPhone }) {
  const qrData = JSON.stringify({
    petId: pet.id,
    petName: pet.name,
    species: pet.species,
    emergencyPhone,
  });

  return (
    <View style={styles.qrContainer}>
      <QRCodeSVG
        value={qrData}
        size={200}
        backgroundColor="white"
        color="#00897B"
      />
      <Text style={styles.qrHint}>
        Scan to retrieve emergency info
      </Text>
    </View>
  );
}
```

### QR Code Scanning
```typescript
// Source: react-native-vision-camera documentation
import { Camera, useCodeScanner } from 'react-native-vision-camera';

function QRScannerScreen({ onScanned }) {
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        const data = JSON.parse(codes[0].value);
        onScanned(data);
      }
    },
  });

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={devices.back}
      isActive={true}
      codeScanner={codeScanner}
    />
  );
}
```

### Permission Request Flow
```typescript
// Source: react-native-permissions documentation
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

const cameraPermission = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
});

async function ensureCameraPermission(): Promise<boolean> {
  const result = await check(cameraPermission);

  if (result === RESULTS.GRANTED) return true;
  if (result === RESULTS.DENIED) {
    const requestResult = await request(cameraPermission);
    return requestResult === RESULTS.GRANTED;
  }
  // BLOCKED case - user must go to settings
  return false;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-native-camera for scanning | react-native-vision-camera | 2023 (camera deprecated) | Actively maintained, better performance |
| Canvas-based QR generation | SVG-based QR generation | 2019+ | Sharper, scalable, smaller APK |
| Manual permission handling | react-native-permissions | 2018+ | Unified API across platforms |

**Deprecated/outdated:**
- react-native-camera: Deprecated June 2023, use react-native-vision-camera
- Legacy QR libraries (react-native-qrcode, react-native-barcode-mask): Use react-native-qrcode-svg

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | react-native-qrcode-svg v6.3.21 works with RN 0.76.9 | Standard Stack | May need version adjustment if native module issues occur |
| A2 | react-native-vision-camera v5.0.1 works with RN 0.76.9 | Standard Stack | Camera APIs change; may need adapter code |
| A3 | Camera permission naming is same on iOS/Android | Code Examples | Android uses different permission names |

## Open Questions

1. **Should QR data reference backend or contain all info?**
   - What we know: QR codes can hold ~2KB max; pet ID + phone fits easily
   - What's unclear: Should we include basic pet info or just ID for backend lookup?
   - Recommendation: Include minimal info (pet ID, phone) so shelters can act even if offline

2. **Should emergency phone be required at signup?**
   - What we know: ID-04 requires emergency contact accessible from ID card
   - What's unclear: Current User model has no emergencyPhone field
   - Recommendation: Add optional field, prompt to complete in pet profile settings

3. **What vaccination names to suggest?**
   - What we know: MED-01 requires "name" field
   - What's unclear: Should we provide common vaccination presets?
   - Recommendation: Free text with suggestions (Rabies, DHPP, Bordetella for dogs; FVRCP for cats)

## Environment Availability

> Step 2.6: SKIPPED (no external dependencies beyond npm packages)

Phase 5 dependencies are all npm packages that will be installed:
- react-native-qrcode-svg
- react-native-svg
- react-native-vision-camera
- react-native-permissions

No external tools, services, or CLIs required beyond standard React Native development environment.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (already in project) |
| Config file | mobile/jest.config.js |
| Quick run command | `npm test -- --testPathPattern="medical\|petId" --passWithNoTests` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| MED-01 | Add vaccination with name, date, next due | unit | `jest tests/medical.test.ts -x` | ❌ Wave 0 |
| MED-02 | Add checkup with date, hospital, summary | unit | `jest tests/medical.test.ts -x` | ❌ Wave 0 |
| MED-03 | Group records by type in display | unit | `jest tests/medical.test.ts -x` | ❌ Wave 0 |
| MED-04 | Dashboard shows vaccination reminders | unit | `jest tests/dashboard.test.ts -x` | ❌ Wave 0 |
| ID-01 | Generate unique QR code per pet | unit | `jest tests/petId.test.ts -x` | ❌ Wave 0 |
| ID-02 | QR contains pet ID and contact | unit | `jest tests/petId.test.ts -x` | ❌ Wave 0 |
| ID-03 | Digital ID shows name, species, weight, age | unit | `jest tests/petId.test.ts -x` | ❌ Wave 0 |
| ID-04 | Emergency phone accessible from ID | unit | `jest tests/petId.test.ts -x` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test -- --testPathPattern="medical\|petId"`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/medical.test.ts` — covers MED-01, MED-02, MED-03
- [ ] `tests/petId.test.ts` — covers ID-01, ID-02, ID-03, ID-04
- [ ] `tests/dashboard.test.ts` — covers MED-04 (dashboard reminders)
- [ ] Framework already installed: Jest is in devDependencies

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Firebase Auth (Phase 2) |
| V3 Session Management | yes | JWT stored in AsyncStorage |
| V4 Access Control | yes | User can only access own pets' medical records |
| V5 Input Validation | yes | Zod validation on medical record inputs |
| V6 Cryptography | no | No sensitive crypto; QR data is not encrypted |

### Known Threat Patterns for Medical Records

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Unauthorized medical record access | Information Disclosure | User can only query their own pet's records (enforced at API layer) |
| Medical record injection | Tampering | Input validation with Zod, parameterized Prisma queries |
| QR code data exposure | Information Disclosure | QR contains only emergency contact, not medical history |
| Permission bypass | Elevation | react-native-permissions checks before camera access |

## Sources

### Primary (HIGH confidence)
- react-native-qrcode-svg npm page - v6.3.21, usage patterns
- react-native-vision-camera GitHub - v5.0.1, QR scanning API
- react-native-permissions npm page - v5.5.1, permission handling
- Existing Prisma schema in server/prisma/schema.prisma - MedicalRecord model

### Secondary (MEDIUM confidence)
- VisionCamera documentation website - Code scanner setup
- React Native documentation - Permission guidelines

### Tertiary (LOW confidence)
- General React Native QR code implementation patterns - Training data, needs verification

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM-HIGH - Libraries verified via npm, compatibility with RN 0.76.9 assumed
- Architecture: MEDIUM - Pattern-based on existing project structure
- Pitfalls: MEDIUM - Based on common React Native issues, not specific to these libraries

**Research date:** 2026-04-19
**Valid until:** 2026-05-19 (30 days for stable libraries)
