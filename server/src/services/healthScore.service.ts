/**
 * Health Score Service
 * 
 * Service class for calculating and retrieving health scores for pets.
 * Fetches all required data and calculates weighted health score.
 */

import prisma from '../config/database.js';
import {
  calculateHealthScore,
  PetData,
  ActivityData,
  DietData,
  SymptomData,
  HealthScoreResult,
} from '../utils/healthCalculator.js';

export interface HealthScoreResponse {
  petId: string;
  score: number;
  factors: {
    name: string;
    value: number;
    weight: number;
    contribution: number;
  }[];
  breakdown: {
    activityScore: number;
    activityMinutes: number;
    activityGoal: number;
    dietScore: number;
    caloriesConsumed: number;
    caloriesTarget: number;
    ageScore: number;
    ageYears: number;
    weightScore: number;
    weightKg: number;
    symptomScore: number;
    symptomPenalty: number;
  };
  lastUpdated: string;
}

export class HealthScoreService {
  /**
   * Calculate health score for a pet with full factor breakdown
   */
  async calculateScore(petId: string, userId: string): Promise<HealthScoreResponse> {
    // Fetch pet data
    const pet = await prisma.pet.findFirst({
      where: { id: petId, userId },
      include: {
        activities: true,
        diets: true,
        symptoms: true,
      },
    });

    if (!pet) {
      throw new Error('Pet not found');
    }

    // Transform data for calculator
    const petData: PetData = {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      birthDate: pet.birthDate,
      weight: pet.weight,
    };

    const activityData: ActivityData[] = pet.activities.map(a => ({
      id: a.id,
      durationMinutes: a.durationMinutes,
      steps: a.steps,
      date: a.date,
    }));

    const dietData: DietData[] = pet.diets.map(d => ({
      id: d.id,
      calories: d.calories,
      date: d.date,
    }));

    const symptomData: SymptomData[] = pet.symptoms.map(s => ({
      id: s.id,
      severity: s.severity as 'mild' | 'moderate' | 'severe',
      date: s.date,
    }));

    // Calculate health score
    const result: HealthScoreResult = calculateHealthScore(
      petData,
      activityData,
      dietData,
      symptomData
    );

    // Update HealthRecord in database
    const now = new Date();
    await prisma.healthRecord.upsert({
      where: { petId },
      update: {
        score: result.score,
        factors: {
          activity: result.breakdown.activityScore,
          diet: result.breakdown.dietScore,
          age: result.breakdown.ageScore,
          weight: result.breakdown.weightScore,
          symptoms: result.breakdown.symptomScore,
        },
        calculatedAt: now,
      },
      create: {
        petId,
        score: result.score,
        factors: {
          activity: result.breakdown.activityScore,
          diet: result.breakdown.dietScore,
          age: result.breakdown.ageScore,
          weight: result.breakdown.weightScore,
          symptoms: result.breakdown.symptomScore,
        },
        calculatedAt: now,
      },
    });

    return {
      petId,
      score: result.score,
      factors: result.factors.map(f => ({
        name: f.name,
        value: f.value,
        weight: f.weight,
        contribution: f.contribution,
      })),
      breakdown: result.breakdown,
      lastUpdated: now.toISOString(),
    };
  }

  /**
   * Get cached health score from database (faster than recalculating)
   */
  async getCachedScore(petId: string, userId: string): Promise<HealthScoreResponse | null> {
    const pet = await prisma.pet.findFirst({
      where: { id: petId, userId },
      include: {
        healthRecord: true,
      },
    });

    if (!pet || !pet.healthRecord) {
      return null;
    }

    const record = pet.healthRecord;
    const factors = record.factors as Record<string, number>;

    // Reconstruct factors array from stored data
    const factorData = [
      { name: 'Activity', weight: 0.30 },
      { name: 'Diet', weight: 0.25 },
      { name: 'Age', weight: 0.20 },
      { name: 'Weight', weight: 0.15 },
      { name: 'Symptoms', weight: 0.10 },
    ];

    const factorArray = factorData.map(f => ({
      name: f.name,
      value: factors[f.name.toLowerCase()] || 0,
      weight: f.weight,
      contribution: Math.round(((factors[f.name.toLowerCase()] || 0) / 100) * f.weight * 100),
    }));

    const score = factorArray.reduce((sum, f) => sum + f.contribution, 0);

    return {
      petId,
      score,
      factors: factorArray,
      breakdown: {
        activityScore: factors.activity || 0,
        activityMinutes: 0,
        activityGoal: 0,
        dietScore: factors.diet || 0,
        caloriesConsumed: 0,
        caloriesTarget: 0,
        ageScore: factors.age || 0,
        ageYears: 0,
        weightScore: factors.weight || 0,
        weightKg: 0,
        symptomScore: factors.symptoms || 0,
        symptomPenalty: 0,
      },
      lastUpdated: record.calculatedAt.toISOString(),
    };
  }
}

export default new HealthScoreService();
