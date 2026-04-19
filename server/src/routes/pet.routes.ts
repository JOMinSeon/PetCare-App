import { Router } from 'express';
import { listPets, getPet, createPet, updatePet, deletePet } from '../controllers/pet.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All pet routes require authentication
router.use(authMiddleware);

// GET /api/pets - List all pets for current user
router.get('/', listPets);

// GET /api/pets/:id - Get single pet details
router.get('/:id', getPet);

// POST /api/pets - Create new pet
router.post('/', createPet);

// PUT /api/pets/:id - Update pet
router.put('/:id', updatePet);

// DELETE /api/pets/:id - Delete pet
router.delete('/:id', deletePet);

export default router;