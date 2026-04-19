# Phase 2: Authentication & Pet Profiles - Plan 02

**Phase:** 2
**Plan:** 02
**Wave:** 2 (Pet CRUD)
**Status:** Pending

---

## Objective

Implement pet CRUD operations with photo upload, species icons, and all required API routes.

---

## Success Criteria Mapping

| # | Criterion | Task |
|---|-----------|------|
| 6 | User can add a new pet with name, species, breed, birth_date, weight, and photo | T1, T2, T3 |
| 7 | User can view a list of all their registered pets | T2, T4 |
| 8 | User can edit any pet profile information | T2, T5 |
| 9 | User can delete a pet profile with confirmation | T2, T6 |
| 10 | Pet profile displays species-appropriate icon (dog, cat, bird, etc.) | T1, T3 |

---

## Tasks

### Task 1: Pet Schema & API (server)
- Update Prisma schema with Pet model (already defined in Phase 1)
- Create `GET /api/pets` - List all pets for authenticated user
- Create `POST /api/pets` - Create new pet
- Create `GET /api/pets/:id` - Get single pet details
- Create `PUT /api/pets/:id` - Update pet
- Create `DELETE /api/pets/:id` - Delete pet with confirmation
- Add image URL field storage (mock/placeholder for Phase 2)

### Task 2: Pet Store (mobile)
- Create `petStore.ts` with Zustand
- Implement CRUD actions: createPet, updatePet, deletePet, fetchPets
- Store pet list in state
- Handle loading/error states

### Task 3: Pet Screens (mobile)
- Create `AddPetScreen.tsx` - Form with all fields plus species picker
- Create `PetListScreen.tsx` - Grid of pet cards with species icons
- Create `EditPetScreen.tsx` - Pre-filled form for editing
- Create `PetDetailScreen.tsx` - Full pet profile view
- Species icon mapping: 🐕 dog, 🐈 cat, 🐦 bird, 🐰 rabbit, 🐟 fish, 🐾 other

### Task 4: Image Picker (mobile)
- Install `react-native-image-picker` package
- Add photo selection to AddPet/EditPet screens
- Store image URL (placeholder path for Phase 2)

---

## Files to Create/Modify

### Server
- `server/src/controllers/pet.controller.ts`
- `server/src/routes/pet.routes.ts`
- `server/src/middleware/auth.middleware.ts` (update)

### Mobile
- `mobile/src/stores/petStore.ts`
- `mobile/src/screens/pets/AddPetScreen.tsx`
- `mobile/src/screens/pets/PetListScreen.tsx`
- `mobile/src/screens/pets/EditPetScreen.tsx`
- `mobile/src/screens/pets/PetDetailScreen.tsx`
- `mobile/src/components/PetCard.tsx`
- `mobile/src/components/SpeciesIcon.tsx`

---

## Verification

1. User can add a new pet with all required fields
2. Pet list displays all user's pets with correct species icons
3. User can edit pet information
4. User can delete pet with confirmation dialog
5. Species icons display correctly for each pet type

---

## Dependencies

- Plan 01 (Firebase Auth) complete
- Auth middleware protecting pet routes