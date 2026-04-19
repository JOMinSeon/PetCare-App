import { Request, Response } from 'express';
import prisma from '../config/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected', timestamp: new Date().toISOString() });
  }
};

export interface HealthScoreResponse {
  petId: string;
  score: number;
  factors: {
    name: string;
    value: number;
    weight: number;
    contribution: number;
  }[];
  lastUpdated: string;
}

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

    // Stub health score calculation - will be enhanced in Phase 3
    // For now, return a calculated score based on available pet data
    const factors = calculateHealthFactors(pet);

    const response: HealthScoreResponse = {
      petId,
      score: factors.reduce((sum, f) => sum + f.contribution, 0),
      factors,
      lastUpdated: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    console.error('Error calculating health score:', error);
    res.status(500).json({ error: 'Failed to calculate health score' });
  }
};

interface HealthFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
}

function calculateHealthFactors(pet: { weight: number | null; birthDate: Date | null; species: string }): HealthFactor[] {
  const factors: HealthFactor[] = [];
  let baseScore = 70;

  // Weight factor (if available)
  if (pet.weight !== null) {
    const weightFactor: HealthFactor = {
      name: 'Weight',
      value: pet.weight,
      weight: 0.3,
      contribution: 0,
    };
    // Normalize weight contribution (ideal weight assumed 10-30kg for most pets)
    const normalizedWeight = Math.min(Math.max(pet.weight, 5) / 30, 1);
    weightFactor.contribution = Math.round(normalizedWeight * weightFactor.weight * 100);
    factors.push(weightFactor);
  } else {
    baseScore -= 10;
    factors.push({
      name: 'Weight',
      value: 0,
      weight: 0.3,
      contribution: 0,
    });
  }

  // Age factor (if birth date available)
  if (pet.birthDate) {
    const birthDate = new Date(pet.birthDate);
    const ageInYears = (Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const ageFactor: HealthFactor = {
      name: 'Age',
      value: Math.round(ageInYears * 10) / 10,
      weight: 0.2,
      contribution: 0,
    };
    // Younger pets get slightly higher scores (prime age 2-7 years)
    if (ageInYears >= 2 && ageInYears <= 7) {
      ageFactor.contribution = 20;
    } else if (ageInYears < 2) {
      ageFactor.contribution = 15;
    } else {
      ageFactor.contribution = 10;
    }
    factors.push(ageFactor);
  } else {
    baseScore -= 10;
    factors.push({
      name: 'Age',
      value: 0,
      weight: 0.2,
      contribution: 0,
    });
  }

  // Species baseline factor (use numeric code for species)
  const speciesCode = { dog: 1, cat: 2, bird: 3, rabbit: 4, fish: 5, other: 6 }[pet.species] ?? 6;
  factors.push({
    name: 'Species',
    value: speciesCode,
    weight: 0.1,
    contribution: 10,
  });

  // Activity factor (stub - will be connected to activity data in Phase 3)
  factors.push({
    name: 'Activity',
    value: 0,
    weight: 0.2,
    contribution: 0,
  });

  // Diet factor (stub - will be connected to diet data in Phase 3)
  factors.push({
    name: 'Diet',
    value: 0,
    weight: 0.2,
    contribution: 0,
  });

  return factors;
}
