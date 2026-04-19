import { Router } from 'express';
import { getPetHealth } from '../controllers/health.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All health routes require authentication
router.use(authMiddleware);

// GET /api/pets/:id/health - Get health score for a pet
router.get('/:id/health', getPetHealth);

export default router;