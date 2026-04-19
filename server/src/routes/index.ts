import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller.js';
import authRoutes from './auth.routes.js';
import petRoutes from './pet.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.get('/health', healthCheck);
router.use('/auth', authRoutes);
router.use('/pets', petRoutes);
router.use('/pets', healthRoutes);

export default router;
