import { Router } from 'express';
import { getServices, getServiceById } from '../controllers/service.controller.js';

const router = Router();

// GET /api/services - List all services with optional filters
router.get('/', getServices);

// GET /api/services/:id - Get a single service by ID
router.get('/:id', getServiceById);

export default router;
