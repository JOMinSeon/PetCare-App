---
phase: "04-services-notifications"
plan: "phase-4"
type: "execute"
wave: 1
depends_on: ["03-dashboard-visualization"]
files_modified:
  - "VitalPaw/src/store/appointmentStore.ts"
  - "VitalPaw/src/store/notificationStore.ts"
  - "VitalPaw/src/screens/DashboardScreen.tsx"
  - "VitalPaw/src/screens/ProfileScreen.tsx"
  - "VitalPaw/src/components/AppointmentCard.tsx"
  - "VitalPaw/src/components/NotificationPreferences.tsx"
  - "VitalPaw/src/components/HealthTipsList.tsx"
  - "VitalPaw/src/components/PaymentHistoryList.tsx"
  - "VitalPaw/src/components/BookAppointmentModal.tsx"
  - "VitalPaw/src/services/notificationService.ts"
  - "VitalPaw/src/types/index.ts"
  - "VitalPaw/package.json"
autonomous: false
requirements:
  - "SERV-01"
  - "SERV-02"
  - "SERV-03"
  - "SERV-04"
  - "PROF-02"
  - "PROF-03"

must_haves:
  truths:
    - "User can book vet appointments with date/time selection"
    - "User can view upcoming appointments"
    - "User receives push notifications for medication reminders"
    - "User can access health tips and educational content"
    - "User can manage notification preferences"
    - "User can view payment/subscription history"
  artifacts:
    - path: "VitalPaw/src/store/appointmentStore.ts"
      provides: "Appointment state management with booking and viewing"
      exports: ["useAppointmentStore"]
    - path: "VitalPaw/src/store/notificationStore.ts"
      provides: "Notification preferences state management"
      exports: ["useNotificationStore"]
    - path: "VitalPaw/src/services/notificationService.ts"
      provides: "Push notification handling for medication reminders"
      exports: ["NotificationService"]
    - path: "VitalPaw/src/components/BookAppointmentModal.tsx"
      provides: "Modal for booking vet appointments with date/time"
      exports: ["BookAppointmentModal"]
    - path: "VitalPaw/src/components/AppointmentCard.tsx"
      provides: "Card component for displaying appointments"
      exports: ["AppointmentCard"]
    - path: "VitalPaw/src/components/HealthTipsList.tsx"
      provides: "Health tips and educational content list"
      exports: ["HealthTipsList"]
    - path: "VitalPaw/src/components/PaymentHistoryList.tsx"
      provides: "Payment/subscription history list"
      exports: ["PaymentHistoryList"]
    - path: "VitalPaw/src/components/NotificationPreferences.tsx"
      provides: "Notification preferences toggle switches"
      exports: ["NotificationPreferences"]
---

<objective>
Implement services and notifications for Phase 4: vet appointment booking, medication reminders via push notifications, health tips, notification preferences, and payment history.
</objective>

<execution_context>
 @$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
## Existing Code Structure

### Current Navigation (AppNavigator.tsx)
- Bottom tab navigator with 4 tabs: Dashboard, Monitoring, History, Profile
- ProfileScreen has placeholder notification settings items (line 148-168)

### Current ProfileScreen
- Has "Notifications" section with placeholder items for Push and Email notifications
- These need to be wired up to actual notification preferences

### Current DashboardScreen
- Has mock alerts for vet appointments (line 94-99)
- These should be replaced with actual upcoming appointments

### Existing Types (types/index.ts)
- Has HealthEntry types but no Appointment or NotificationPreference types
- Need to add: Appointment, NotificationPreferences, Payment/Subscription types

### Health Store (healthStore.ts)
- Already has medication entries with reminderEnabled flag (line 147 in MedicationEntry)

## Dependencies to Add

### package.json additions needed:
- expo-notifications (for push notifications)
- @react-native-community/datetimepicker (for appointment date/time selection)

## Interface Contracts to Add

### New types needed:
```typescript
// Appointment
interface Appointment {
  id: string;
  petId: string;
  veterinarianName: string;
  clinicName: string;
  appointmentDate: Date;
  appointmentTime: string; // "HH:mm" format
  reason: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
}

// NotificationPreferences
interface NotificationPreferences {
  pushEnabled: boolean;
  medicationReminders: boolean;
  appointmentReminders: boolean;
  dailySummary: boolean;
  healthAlerts: boolean;
  emailEnabled: boolean;
}

// Payment/Subscription
interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'refunded';
  description: string;
  paymentDate: Date;
}

// HealthTip
interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: 'nutrition' | 'exercise' | 'healthcare' | 'behavior';
  imageUrl?: string;
}
```

## Task Specifications

### Task 1: Install Required Dependencies
**Files:** `VitalPaw/package.json`

**Action:**
1. Add expo-notifications to dependencies
2. Add @react-native-community/datetimepicker to dependencies
3. Run npm install to install new packages

**Verify:**
- Check package.json has new dependencies
- Run expo install to verify compatibility

### Task 2: Create Type Definitions
**Files:** `VitalPaw/src/types/index.ts`

**Action:**
1. Add Appointment interface
2. Add NotificationPreferences interface
3. Add Payment interface
4. Add HealthTip interface
5. Update RootTabParamList to add Appointments tab

**Verify:**
- TypeScript compiles without errors

### Task 3: Create Appointment Store
**Files:** `VitalPaw/src/store/appointmentStore.ts`

**Action:**
1. Create useAppointmentStore using Zustand
2. Implement: appointments array, addAppointment, updateAppointment, deleteAppointment, getAppointmentsByPetId, getUpcomingAppointments
3. Use AsyncStorage for persistence with APPOINTMENTS_STORAGE_KEY
4. Include mock data for demo purposes

**Verify:**
- Store has all required methods
- Data persists across app restarts

### Task 4: Create Notification Store
**Files:** `VitalPaw/src/store/notificationStore.ts`

**Action:**
1. Create useNotificationStore using Zustand
2. Implement: preferences object, updatePreference, togglePreference, resetToDefaults
3. Use AsyncStorage for persistence with NOTIFICATION_PREFS_STORAGE_KEY
4. Default all preferences to true

**Verify:**
- Store has all required methods
- Data persists across app restarts

### Task 5: Create Notification Service
**Files:** `VitalPaw/src/services/notificationService.ts`

**Action:**
1. Create NotificationService class with static methods:
   - requestPermissions(): Request notification permissions
   - scheduleMedicationReminder(medicationEntry): Schedule local notification
   - cancelMedicationReminder(id): Cancel scheduled notification
   - scheduleAppointmentReminder(appointment): Schedule appointment reminder
   - getScheduledNotifications(): List scheduled notifications
2. Use expo-notifications for all scheduling
3. Handle permission denied gracefully

**Verify:**
- Permissions can be requested
- Notifications can be scheduled and cancelled

### Task 6: Create BookAppointmentModal Component
**Files:** `VitalPaw/src/components/BookAppointmentModal.tsx`

**Action:**
1. Create modal with form fields:
   - Pet selector (dropdown)
   - Veterinarian name (text input)
   - Clinic name (text input)
   - Date picker (using DateTimePicker)
   - Time picker (using DateTimePicker)
   - Reason (text input)
   - Notes (optional text area)
2. Add validation for required fields
3. Call appointmentStore.addAppointment on submit

**Verify:**
- Modal opens/closes properly
- All form fields work
- Validation shows errors for missing required fields

### Task 7: Create AppointmentCard Component
**Files:** `VitalPaw/src/components/AppointmentCard.tsx`

**Action:**
1. Create card component showing:
   - Pet name
   - Veterinarian and clinic
   - Date and time
   - Status badge (scheduled/completed/cancelled)
   - Reason
2. Add edit and cancel actions
3. Use Ionicons for icons

**Verify:**
- Card displays all appointment information
- Actions work properly

### Task 8: Create HealthTipsList Component
**Files:** `VitalPaw/src/components/HealthTipsList.tsx`

**Action:**
1. Create list of static health tips covering:
   - Nutrition tips (balanced diet, portion control)
   - Exercise tips (daily walks, playtime)
   - Healthcare tips (vaccinations, dental care)
   - Behavior tips (training, socialization)
2. Use mock data for tips
3. Make it scrollable with categories

**Verify:**
- Tips display with proper formatting
- Categories are visually distinct

### Task 9: Create PaymentHistoryList Component
**Files:** `VitalPaw/src/components/PaymentHistoryList.tsx`

**Action:**
1. Create list showing mock payment history:
   - Subscription payments (monthly plan)
   - One-time payments (service fees)
2. Display amount, date, status, description
3. Status badges (completed/pending/refunded)

**Verify:**
- Payments display with proper formatting
- Status badges show correct colors

### Task 10: Create NotificationPreferences Component
**Files:** `VitalPaw/src/components/NotificationPreferences.tsx`

**Action:**
1. Create toggle switches for:
   - Push Notifications (master toggle)
   - Medication Reminders
   - Appointment Reminders
   - Daily Summary
   - Health Alerts
   - Email Notifications
2. Wire each toggle to notificationStore.updatePreference
3. Show current status and allow changes

**Verify:**
- All toggles display correct current state
- Toggling updates the store and persists

### Task 11: Update ProfileScreen with Notification Preferences
**Files:** `VitalPaw/src/screens/ProfileScreen.tsx`

**Action:**
1. Import NotificationPreferences component
2. Replace placeholder notification items with actual NotificationPreferences component
3. Add Payment History section linking to payment screen/modal
4. Add Health Tips section linking to tips screen/modal

**Verify:**
- Profile screen shows NotificationPreferences
- Toggles work and persist

### Task 12: Update DashboardScreen with Appointments
**Files:** `VitalPaw/src/screens/DashboardScreen.tsx`

**Action:**
1. Import AppointmentCard and BookAppointmentModal
2. Add state for showAppointmentModal
3. Replace mock alerts with actual upcoming appointments from appointmentStore
4. Add "Book Appointment" quick action button
5. Show upcoming appointments section

**Verify:**
- Dashboard shows real upcoming appointments
- Book appointment modal works

### Task 13: Integrate Medication Reminder Notifications
**Files:** `VitalPaw/src/components/AddMedicationModal.tsx`

**Action:**
1. Import notificationService
2. When medication with reminderEnabled=true is saved, call notificationService.scheduleMedicationReminder
3. When reminder is toggled off, cancel the notification
4. Use medication name and dosage for notification content

**Verify:**
- Saving medication with reminder creates notification
- Disabling reminder cancels notification

### Task 14: Add Appointments Tab to Navigation
**Files:** `VitalPaw/src/navigation/AppNavigator.tsx`

**Action:**
1. Add Appointments tab between Monitoring and History
2. Create AppointmentsScreen component
3. Show list of upcoming and past appointments
4. Include FAB for booking new appointment

**Verify:**
- New tab appears in navigation
- Appointments list displays correctly

### Task 15: Human Verification Checkpoint
**Type:** checkpoint:human-verify
**Gate:** blocking

**What Built:**
- Vet appointment booking with date/time selection
- Appointment list viewing (upcoming and past)
- Push notification system for medication reminders
- Health tips and educational content screen
- Notification preferences management
- Payment/subscription history view

**How to Verify:**
1. Open app and navigate to Dashboard
2. Book a new appointment:
   - Tap "Book Appointment" button
   - Fill in vet name, clinic, date, time
   - Submit and verify appointment appears
3. View appointments:
   - Go to Appointments tab
   - Verify appointment shows with correct details
4. Test notifications:
   - Go to Profile > Notifications
   - Toggle medication reminders ON
   - Add a medication with reminder enabled
   - Verify notification is scheduled
5. View health tips:
   - Find Health Tips in Profile or Dashboard
   - Browse tips by category
6. Check payment history:
   - Find Payment History in Profile
   - Verify mock payments display
7. Test notification preferences:
   - Toggle each preference off/on
   - Verify changes persist after app restart

**Resume Signal:** Type "approved" or describe issues
</task>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| client → notificationService | Untrusted scheduling data crosses here |
| client → appointmentStore | User input for appointments crosses here |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|------------|-----------------|
| T-04-01 | Denial of Service | NotificationService | mitigate | Handle notification permission denied gracefully |
| T-04-02 | Tampering | Appointment data | mitigate | Validate appointment data before storage |
| T-04-03 | Information Disclosure | Notification content | mitigate | Don't include sensitive pet health details in notification title |
</threat_model>

<verification>
- Run TypeScript compilation to verify types
- Run app and verify all components render
- Test notification permissions flow
- Test appointment booking flow
</verification>

<success_criteria>
- [ ] SERV-01: User can book vet appointments with date/time selection
- [ ] SERV-02: User can view upcoming appointments
- [ ] SERV-03: User receives push notifications for medication reminders
- [ ] SERV-04: User can access health tips and educational content
- [ ] PROF-02: User can manage notification preferences
- [ ] PROF-03: User can view payment/subscription history
- [ ] Checkpoint approved by user
</success_criteria>

<output>
After completion, create `.planning/phases/04-services-notifications/phase-4-SUMMARY.md`
</output>
