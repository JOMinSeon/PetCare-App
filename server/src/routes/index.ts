import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller.js';
import authRoutes from './auth.routes.js';
import petRoutes from './pet.routes.js';
import healthRoutes from './health.routes.js';
import symptomRoutes from './symptom.routes.js';
import activityRoutes from './activity.routes.js';
import dietRoutes from './diet.routes.js';
import serviceRoutes from './service.routes.js';
import medicalRecordRoutes from './medicalRecord.routes.js';

const router = Router();

router.get('/health', healthCheck);
router.use('/auth', authRoutes);
router.use('/pets', petRoutes);
router.use('/pets', healthRoutes);
router.use('/', symptomRoutes);
router.use('/', activityRoutes);
router.use('/', dietRoutes);
router.use('/services', serviceRoutes);
router.use('/', medicalRecordRoutes);

export default router;
