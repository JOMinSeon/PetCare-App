import { Router } from 'express';
import { login, register, me, logout, verifyFirebaseToken } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes (no authentication required)
router.post('/login', login);
router.post('/register', register);
router.post('/firebase/verify', verifyFirebaseToken);
router.post('/logout', logout);

// Protected routes (authentication required)
router.get('/me', authMiddleware, me);

export default router;
