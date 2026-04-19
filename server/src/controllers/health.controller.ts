import { Request, Response } from 'express';
import prisma from '../config/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import healthScoreService, { HealthScoreResponse } from '../services/healthScore.service.js';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected', timestamp: new Date().toISOString() });
  }
};

export const getPetHealth = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const petId = req.params.id as string;
    const userId = req.userId;

    // Verify pet belongs to user
    const pet = await prisma.pet.findFirst({
      where: { id: petId, userId },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    // Use HealthScoreService to calculate score with full factor breakdown
    const healthScore: HealthScoreResponse = await healthScoreService.calculateScore(petId, userId);

    res.json(healthScore);
  } catch (error) {
    console.error('Error calculating health score:', error);
    res.status(500).json({ error: 'Failed to calculate health score' });
  }
};
