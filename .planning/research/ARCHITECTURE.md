# Architecture Research

**Domain:** Pet Health & Wellness Tracker
**Researched:** 2026-04-16
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Entry Point                          │
│                      (App.tsx / index.js)                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Navigation Root                            │
│              (NavigationContainer + Root Navigator)              │
└─────────────────────────────────────────────────────────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Bottom Tab     │  │  Stack Navigator  │  │  Stack Navigator │
│   Navigator      │  │  (Dashboard)      │  │  (Services)     │
└──────────────────┘  └──────────────────┘  └──────────────────┘
          │                     │                     │
          ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Dashboard Tab   │  │  Dashboard Home  │  │  Vet Appts Screen │
│  • Home          │  │  • Pet Selector │  │  • Consultations │
│  • Activity      │  │  • Quick Stats  │  │  • Community     │
│  • Weight        │  │  • Alerts       │  │  • Bookings      │
│  • Diet          │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Navigation Root** | App-wide navigation state, linking to native navigation | `NavigationContainer` with React Navigation |
| **Tab Navigator** | Bottom tab bar switching between major feature areas | `@react-navigation/bottom-tabs` |
| **Stack Navigator** | Screen-to-screen navigation within each tab | `@react-navigation/native-stack` |
| **Screen Components** | Full-screen views that map to routes | Functional components with `useNavigation` hook |
| **Presentational Components** | Reusable UI elements (cards, buttons, inputs) | Dumb components receiving props |
| **Custom Hooks** | Encapsulated business logic and state management | `useHealthData()`, `usePets()`, `useAuth()` |
| **Context Providers** | Global state accessible throughout tree | `PetsProvider`, `AuthProvider`, `ThemeProvider` |
| **Service Layer** | API calls, local storage, data transformation | `api/`, `storage/`, `services/` |
| **Chart Components** | Data visualization wrappers | `react-native-chart-kit` or `victory-native` |

## Recommended Project Structure

```
src/
├── app/                    # App-level setup
│   ├── App.tsx            # Root component
│   └── Navigation.tsx     # Navigation configuration
├── screens/               # Screen components (page-level views)
│   ├── Dashboard/
│   │   ├── DashboardScreen.tsx
│   │   ├── ActivityScreen.tsx
│   │   ├── WeightScreen.tsx
│   │   └── DietScreen.tsx
│   ├── History/
│   │   └── HistoryScreen.tsx
│   ├── Services/
│   │   ├── ServicesScreen.tsx
│   │   ├── VetAppointmentsScreen.tsx
│   │   ├── ConsultationsScreen.tsx
│   │   └── CommunityScreen.tsx
│   └── Profile/
│       ├── ProfileScreen.tsx
│       ├── PetManagementScreen.tsx
│       └── SettingsScreen.tsx
├── components/            # Reusable UI components
│   ├── common/          # Generic components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Header.tsx
│   │   └── LoadingSpinner.tsx
│   ├── charts/          # Chart components
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   └── PieChart.tsx
│   ├── pets/            # Pet-specific components
│   │   ├── PetCard.tsx
│   │   ├── PetSelector.tsx
│   │   └── HealthBadge.tsx
│   └── forms/           # Form components
│       ├── WeightEntryForm.tsx
│       ├── ActivityEntryForm.tsx
│       └── DietEntryForm.tsx
├── navigation/           # Navigation structure
│   ├── RootNavigator.tsx
│   ├── TabNavigator.tsx
│   └── types.ts         # TypeScript navigation types
├── hooks/               # Custom React hooks
│   ├── usePets.ts
│   ├── useHealthData.ts
│   ├── useAuth.ts
│   └── useTheme.ts
├── contexts/            # React Context providers
│   ├── PetsContext.tsx
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── HealthDataContext.tsx
├── services/            # Business logic and API
│   ├── api/             # API service layer
│   │   ├── client.ts    # HTTP client setup
│   │   ├── pets.ts      # Pet-related API calls
│   │   ├── health.ts    # Health data API calls
│   │   └── appointments.ts
│   ├── storage/         # Local persistence
│   │   ├── asyncStorage.ts
│   │   └── offlineQueue.ts
│   └── analytics/       # Analytics tracking
├── types/               # TypeScript type definitions
│   ├── pet.ts
│   ├── health.ts
│   ├── user.ts
│   └── navigation.ts
├── utils/               # Utility functions
│   ├── dateUtils.ts
│   ├── formatters.ts
│   └── validators.ts
├── constants/           # App constants
│   ├── theme.ts         # Colors, typography, spacing
│   └── config.ts       # Feature flags, API URLs
└── assets/             # Static assets
    ├── images/
    └── icons/
```

### Structure Rationale

- **`screens/`**: Screen components are page-level views, kept separate from reusable components. Each feature area (Dashboard, History, Services, Profile) gets its own subfolder for co-located related screens.
- **`components/`**: Organized by purpose (`common/`, `charts/`, `pets/`, `forms/`) rather than by screen. This promotes reuse across the app.
- **`hooks/`**: Custom hooks encapsulate business logic, keeping screens thin and focused on UI. Each domain concept (pets, health data, auth) gets its own hook.
- **`contexts/`**: Global state that needs to be accessible throughout the app (current pet selection, user session, theme). Using a dedicated `contexts/` folder makes these easy to find.
- **`services/`**: Separated into `api/` (remote), `storage/` (local), and `services/` (business logic). This separation makes it easy to mock services during testing and swap implementations.
- **`types/`**: Centralized TypeScript definitions ensure type consistency across the codebase. Navigation types are especially important for type-safe routing.
- **`constants/`**: Theme and configuration kept here, imported throughout the app. Allows bulk updates (e.g., changing primary color) in one place.

## Architectural Patterns

### Pattern 1: Container/Presentational Components

**What:** Separation between components that handle logic/state (containers) and those that only render UI based on props (presentational).

**When to use:** Default pattern for all components. Presentational components are reusable across contexts; container components connect to stores/hooks.

**Example:**
```typescript
// Presentational - only cares about receiving data and callbacks
const HealthCard = ({ title, value, trend, onPress }) => (
  <Card onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.value}>{value}</Text>
    <TrendIndicator trend={trend} />
  </Card>
);

// Container - connects to context/hooks, provides data
const HealthCardContainer = ({ metricType }) => {
  const { currentPet } = usePets();
  const { getLatestReading } = useHealthData();
  const reading = getLatestReading(metricType, currentPet?.id);
  
  return (
    <HealthCard
      title={metricType}
      value={reading?.value}
      trend={reading?.trend}
      onPress={() => navigation.navigate('Detail', { metricType })}
    />
  );
};
```

**Trade-offs:**
- **Pros:** Clear separation, easy to test presentational components in isolation, promotes reuse
- **Cons:** More files, slightly more boilerplate. For very simple components that won't be reused, this overhead may not be worth it.

### Pattern 2: State Reduction with Context

**What:** Global state managed via `useReducer` + React Context, allowing complex state logic to be extracted from components.

**When to use:** When multiple components need to access and update the same state (pets list, health records). Pairs well with the "Context + Hooks" pattern from React documentation.

**Example:**
```typescript
// Reducer handles all state transitions
function petsReducer(state: PetsState, action: PetsAction): PetsState {
  switch (action.type) {
    case 'ADD_PET':
      return { ...state, pets: [...state.pets, action.payload] };
    case 'SELECT_PET':
      return { ...state, selectedPetId: action.payload };
    case 'UPDATE_PET':
      return {
        ...state,
        pets: state.pets.map(p => p.id === action.payload.id ? action.payload : p)
      };
    default:
      return state;
  }
}

// Context provides state + dispatch
export const PetsContext = createContext<{
  state: PetsState;
  dispatch: Dispatch<PetsAction>;
}>(null);

// Provider wraps app
export const PetsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(petsReducer, initialState);
  return (
    <PetsContext.Provider value={{ state, dispatch }}>
      {children}
    </PetsContext.Provider>
  );
};

// Custom hook for convenient access
export const usePets = () => {
  const context = useContext(PetsContext);
  if (!context) throw new Error('usePets must be used within PetsProvider');
  return context;
};
```

**Trade-offs:**
- **Pros:** Consolidates complex state logic in one place, enables centralized debugging with devtools, scales well as app grows
- **Cons:** Adds indirection, requires understanding of reducer pattern. Overkill for simple local state.

### Pattern 3: Service Layer Abstraction

**What:** API calls and local storage wrapped in service modules, not called directly from components.

**When to use:** Always. Direct API calls from components create tight coupling and make testing difficult.

**Example:**
```typescript
// services/api/health.ts
export const HealthService = {
  async getWeightHistory(petId: string, dateRange: DateRange): Promise<WeightEntry[]> {
    const response = await apiClient.get(`/pets/${petId}/weights`, {
      params: { from: dateRange.from, to: dateRange.to }
    });
    return response.data;
  },

  async addWeightEntry(petId: string, entry: NewWeightEntry): Promise<WeightEntry> {
    const response = await apiClient.post(`/pets/${petId}/weights`, entry);
    return response.data;
  },
};

// hooks/useHealthData.ts
export const useHealthData = () => {
  const addWeightEntry = async (petId: string, entry: NewWeightEntry) => {
    // Optimistic update
    dispatch({ type: 'ADD_WEIGHT_ENTRY', payload: entry });
    // Sync with server
    try {
      await HealthService.addWeightEntry(petId, entry);
    } catch (error) {
      // Rollback on failure
      dispatch({ type: 'REMOVE_WEIGHT_ENTRY', payload: entry.id });
      throw error;
    }
  };
  // ...
};
```

**Trade-offs:**
- **Pros:** Easy to mock in tests, centralized error handling, single place to add caching/retry logic, swap API implementation without touching components
- **Cons:** Another layer of abstraction to maintain. For very small apps with just local storage, this may be excessive.

### Pattern 4: Feature-Based Folder Organization

**What:** Related files grouped by feature rather than by file type. Screen components, their hooks, their context, and their utils live together.

**When to use:** Medium-to-large apps where features are clearly distinct (Dashboard, History, Services, Profile).

**Example:**
```
src/features/
├── dashboard/
│   ├── screens/
│   │   └── DashboardScreen.tsx
│   ├── components/
│   │   ├── QuickStats.tsx
│   │   └── AlertCard.tsx
│   ├── hooks/
│   │   └── useDashboardData.ts
│   └── types/
│       └── dashboard.ts
├── health/
│   ├── screens/
│   ├── components/
│   ├── hooks/
│   └── services/
└── appointments/
    ├── screens/
    ├── components/
    └── services/
```

**Trade-offs:**
- **Pros:** Easy to find all files related to a feature, features can be split into separate packages later, co-located files that change together
- **Cons:** Can lead to duplication of common utilities, harder to see all components of a type at once. Works best when feature boundaries are stable.

## Data Flow

### Request Flow

```
User Action
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ Screen Component                                                 │
│ (handles UI rendering, delegates logic to hooks)                │
└─────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ Custom Hook                                                      │
│ (useHealthData, usePets, etc.)                                  │
│ - Calls service layer                                           │
│ - Dispatches to context reducer                                 │
│ - Returns data + action functions                                │
└─────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│ Service Layer                                                    │
│ - Validates input                                               │
│ - Transforms data                                               │
│ - Handles offline queue if needed                              │
└─────────────────────────────────────────────────────────────────┘
    │
    ├──► Local Storage (AsyncStorage) ────► Offline-first data
    │                                              │
    │                                              ▼
    │                                    ┌─────────────────┐
    │                                    │ Offline Queue   │
    │                                    │ (retry on conn) │
    │                                    └─────────────────┘
    │
    └──► API Client ──────────────────────► Backend API
                 │
                 ▼
          ┌─────────────────┐
          │ Response Handler │
          │ - Transform     │
          │ - Cache         │
          │ - Update state  │
          └─────────────────┘
                 │
                 ▼
          ┌─────────────────┐
          │ Context Reducer  │
          │ (updates state)  │
          └─────────────────┘
                 │
                 ▼
          UI Re-renders with new data
```

### State Management

For a pet health tracking app, three tiers of state management are appropriate:

| Tier | What Lives Here | Implementation |
|------|-----------------|----------------|
| **Local/ephemeral** | Form input, toggle states, UI modals | `useState` in component |
| **Feature-level** | Health data for current pet, pet list, filters | `useReducer` + Context |
| **App-wide** | User session, theme preference, selected pet | `useReducer` + Context at root |

**Recommended state management stack:**
- **React Context + useReducer** for global state (pets, health data, auth)
- **React Query or SWR** for server state (caching, background refetch, optimistic updates)
- **AsyncStorage** for persistence across app restarts
- **No Redux** unless team has strong Redux experience — Context + useReducer scales sufficiently for this domain

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|-------------------------|
| **0-1k users** | Single codebase, local-only with offline queue, minimal backend. Focus on core tracking features. |
| **1k-100k users** | Introduce React Query for API caching, add backend persistence, implement proper authentication (JWT), add analytics |
| **100k+ users** | Split into microservices (pets service, health service, appointments service), add CDN for assets, consider native modules for performance-critical features, implement horizontal scaling |

## Anti-Patterns

### Anti-Pattern 1: Prop Drilling

**What people do:** Passing props through many levels of components just to reach deeply nested children that need them.

**Why it's wrong:** Creates tight coupling between parent and distant child, makes refactoring painful, props become unclear at intermediate components.

**Do this instead:** Use Context for shared state that crosses component boundaries, or use a custom hook that accesses the context directly.

```typescript
// Bad: every intermediate component must accept and pass petId
const GrandParent = ({ petId }) => <Parent petId={petId} />;
const Parent = ({ petId }) => <Child petId={petId} />;
const Child = ({ petId }) => <Grandchild petId={petId} />;
const Grandchild = ({ petId }) => <Display petId={petId} />;

// Good: context provides petId directly to any component that needs it
const Display = () => {
  const { selectedPetId } = usePets();
  return <Text>Pet: {selectedPetId}</Text>;
};
```

### Anti-Pattern 2: Monolithic Screen Components

**What people do:** Putting all logic, state, and rendering in one massive screen component (1000+ lines).

**Why it's wrong:** Impossible to test in isolation, hard to understand, multiple concerns mixed together (UI, data fetching, validation).

**Do this instead:** Break screens into presentational components + container components, extract logic to custom hooks.

```typescript
// Bad: one file with everything
const DashboardScreen = () => {
  const [pets, setPets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  // ... 500 more lines of mixed logic and JSX
};

// Good: separation
const DashboardScreen = () => {
  const { pets, selectedPet } = usePets();
  const { activities, weights, isLoading } = useDashboardData(selectedPet?.id);

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView>
      <PetSelector pets={pets} selectedPet={selectedPet} />
      <QuickStats activities={activities} weights={weights} />
      <ActivityChart data={activities} />
      <WeightChart data={weights} />
      <RecentAlerts />
    </ScrollView>
  );
};
```

### Anti-Pattern 3: Direct API Calls in Components

**What people do:** Calling `fetch()` or axios directly inside useEffect or event handlers.

**Why it's wrong:** Mixed concerns (UI + networking), impossible to share request logic between components, no caching, no error handling standardization.

**Do this instead:** Centralize API calls in service layer modules, call those services from hooks.

### Anti-Pattern 4: Mixing Business Logic with UI State

**What people do:** Using `useState` for derived data that could be calculated from existing state.

**Why it's wrong:** Redundant state that can get out of sync, violates principle of single source of truth.

**Do this instead:** Calculate derived values during render; only store canonical state.

```typescript
// Bad: storing derived value
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// Good: calculate during render
const fullName = `${firstName} ${lastName}`;
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Backend API** | REST API via axios/fetch wrapped in service layer | Use React Query for caching/background refresh |
| **Local Storage** | AsyncStorage for persistence | Use a wrapper that handles serialization, consider SQLite for large datasets |
| **Charts Library** | `react-native-chart-kit` for line/bar charts; `victory-native` for more complex viz | Prefer SVG-based libraries over canvas-based for performance |
| **Push Notifications** | `@react-native-firebase/messaging` or Expo Notifications | Handle permission request, token management |
| **Analytics** | Segment, Mixpanel, or Firebase Analytics | Instrument after auth, track screen views automatically via navigation listeners |
| **Calendar (device)** | `react-native-calendars` for date picker integration | Useful for appointment booking |
| **Image Storage** | Firebase Storage or Cloudinary | Upload pet photos, health document scans |

### Build Order Implications

The architecture outlined above suggests this build order:

1. **Phase 1: Core Infrastructure**
   - Set up navigation (tabs + stacks)
   - Create project structure (folders, constants, theme)
   - Implement Context providers for pets and auth
   - Basic screen skeletons for all tabs

2. **Phase 2: Local Data Model**
   - Define TypeScript types for pets, health records
   - Implement AsyncStorage persistence layer
   - Build custom hooks to manage local data
   - Create presentational components (cards, inputs, buttons)

3. **Phase 3: Dashboard Features**
   - Build dashboard screen with pet selector
   - Implement chart components for activity/weight/diet
   - Add quick stats and alerts display
   - Build data entry forms

4. **Phase 4: History & Detail Views**
   - Build history list screen with filtering
   - Implement detail screens for each health metric
   - Add date range selection
   - Build export functionality

5. **Phase 5: Services & Community**
   - Build appointment booking flow
   - Implement community features
   - Add notification scheduling
   - Integrate with device calendar

6. **Phase 6: Polish & Backend**
   - Connect real API
   - Add offline queue
   - Implement proper authentication
   - Performance optimization (FlatList, memoization)

## Sources

- [React Native Architecture Overview](https://reactnative.dev/docs/architecture-overview) — Official documentation, last updated Oct 2024
- [React Navigation Getting Started](https://reactnavigation.org/docs/getting-started) — v7.x, community standard for navigation
- [Managing State in React](https://react.dev/learn/managing-state) — Official React docs on state patterns
- [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context) — Official pattern for complex state
- [React Native Performance](https://reactnative.dev/docs/performance) — Official performance guide
- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) — React best practices for state shape
- [React Native Navigation Patterns](https://reactnative.dev/docs/next/navigation) — Official navigation documentation

---
*Architecture research for: Pet Health & Wellness Tracker*
*Researched: 2026-04-16*
