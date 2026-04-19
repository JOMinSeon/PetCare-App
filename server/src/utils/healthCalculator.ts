/**
 * Health Score Calculator
 * 
 * Weighted multi-factor algorithm for calculating pet health scores.
 * Weights: Activity 30%, Diet 25%, Age 20%, Weight 15%, Symptoms 10%
 */

import { subDays, differenceInYears } from 'date-fns';

// Factor weights per CONTEXT.md
export const FACTOR_WEIGHTS = {
  activity: 0.30,
  diet: 0.25,
  age: 0.20,
  weight: 0.15,
  symptoms: 0.10,
} as const;

// Species-specific activity base minutes
export const SPECIES_ACTIVITY_BASE = {
  dog: { baseMinutes: 60, perKgOver: 20, additionalMinutesPerKg: 5 },
  cat: { baseMinutes: 30, perKgOver: 5, additionalMinutesPerKg: 2 },
  bird: { baseMinutes: 20, perKgOver: 0, additionalMinutesPerKg: 0 },
  rabbit: { baseMinutes: 30, perKgOver: 3, additionalMinutesPerKg: 3 },
} as const;

// Species-specific calorie multipliers (kcal per lb body weight)
export const DAILY_CALORIE_BASE = {
  dog: 30,
  cat: 20,
  bird: 10,
  rabbit: 15,
} as const;

// Optimal age ranges per species (in years)
export const SPECIES_OPTIMAL_AGE = {
  dog: { min: 1, max: 7 },      // Dogs mature faster, shorter lifespan
  cat: { min: 1, max: 10 },     // Cats can live longer
  bird: { min: 1, max: 8 },
  rabbit: { min: 1, max: 6 },
} as const;

// Ideal weight ranges per species (in kg)
export const SPECIES_IDEAL_WEIGHT = {
  dog: { min: 5, max: 30 },
  cat: { min: 2, max: 6 },
  bird: { min: 0.05, max: 0.5 },
  rabbit: { min: 1, max: 4 },
} as const;

export interface PetData {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  birthDate?: Date | null;
  weight?: number | null;
}

export interface ActivityData {
  id: string;
  durationMinutes?: number | null;
  steps?: number | null;
  date: Date;
}

export interface DietData {
  id: string;
  calories: number;
  date: Date;
}

export interface SymptomData {
  id: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: Date;
}

export interface HealthFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
  rawValue?: string;
}

export interface HealthScoreResult {
  score: number;
  factors: HealthFactor[];
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
}

/**
 * Calculate activity score based on 7-day average vs target
 */
export function calculateActivityScore(
  activities: ActivityData[],
  species: string,
  weightKg: number
): { score: number; actualMinutes: number; goalMinutes: number } {
  const targetMinutes = getActivityGoal(species, weightKg);
  
  // Get activities from last 7 days
  const sevenDaysAgo = subDays(new Date(), 7);
  const recentActivities = activities.filter(a => new Date(a.date) >= sevenDaysAgo);
  
  // Sum total duration minutes
  const totalMinutes = recentActivities.reduce((sum, a) => sum + (a.durationMinutes || 0), 0);
  
  // Calculate average daily minutes (over 7 days)
  const avgDailyMinutes = totalMinutes / 7;
  
  // Score is percentage of goal achieved, capped at 100
  const score = Math.min(Math.round((avgDailyMinutes / targetMinutes) * 100), 100);
  
  return {
    score,
    actualMinutes: Math.round(avgDailyMinutes),
    goalMinutes: targetMinutes,
  };
}

/**
 * Calculate diet score based on calorie intake vs target
 */
export function calculateDietScore(
  diets: DietData[],
  species: string,
  weightKg: number
): { score: number; caloriesConsumed: number; caloriesTarget: number } {
  const targetCalories = getDailyCalorieTarget(species, weightKg);
  
  // Get diet entries from last 7 days
  const sevenDaysAgo = subDays(new Date(), 7);
  const recentDiets = diets.filter(d => new Date(d.date) >= sevenDaysAgo);
  
  // Sum total calories
  const totalCalories = recentDiets.reduce((sum, d) => sum + d.calories, 0);
  
  // Calculate average daily calories (over 7 days)
  const avgDailyCalories = totalCalories / 7;
  
  // Score based on how close to target
  const ratio = avgDailyCalories / targetCalories;
  let score: number;
  
  if (ratio >= 0.9 && ratio <= 1.1) {
    score = 100; // Optimal range
  } else if (ratio >= 0.8 && ratio <= 1.2) {
    score = 80; // Acceptable range
  } else if (ratio >= 0.7 && ratio <= 1.3) {
    score = 60; // Needs adjustment
  } else if (ratio >= 0.5 && ratio <= 1.5) {
    score = 40; // Significant imbalance
  } else {
    score = 20; // Critical imbalance
  }
  
  return {
    score,
    caloriesConsumed: Math.round(avgDailyCalories),
    caloriesTarget: targetCalories,
  };
}

/**
 * Calculate age score based on pet's age vs optimal range
 */
export function calculateAgeScore(
  birthDate: Date | null,
  species: string
): { score: number; ageYears: number } {
  if (!birthDate) {
    return { score: 50, ageYears: 0 }; // No data = neutral score
  }
  
  const ageYears = differenceInYears(new Date(), new Date(birthDate));
  const optimalRange = SPECIES_OPTIMAL_AGE[species as keyof typeof SPECIES_OPTIMAL_AGE] || SPECIES_OPTIMAL_AGE.dog;
  
  let score: number;
  
  if (ageYears >= optimalRange.min && ageYears <= optimalRange.max) {
    score = 100; // In optimal range
  } else if (ageYears < optimalRange.min) {
    // Younger than optimal - gradual decrease
    const yearsDiff = optimalRange.min - ageYears;
    score = Math.max(100 - yearsDiff * 10, 40);
  } else {
    // Older than optimal - gradual decrease
    const yearsDiff = ageYears - optimalRange.max;
    score = Math.max(100 - yearsDiff * 8, 30);
  }
  
  return {
    score: Math.round(score),
    ageYears,
  };
}

/**
 * Calculate weight score based on ideal weight range for species
 */
export function calculateWeightScore(
  weight: number | null,
  species: string
): { score: number; weightKg: number } {
  if (weight === null || weight <= 0) {
    return { score: 50, weightKg: 0 }; // No data = neutral score
  }
  
  const idealRange = SPECIES_IDEAL_WEIGHT[species as keyof typeof SPECIES_IDEAL_WEIGHT] || SPECIES_IDEAL_WEIGHT.dog;
  
  let score: number;
  
  if (weight >= idealRange.min && weight <= idealRange.max) {
    score = 100; // In ideal range
  } else if (weight < idealRange.min) {
    // Underweight
    const percentDiff = ((idealRange.min - weight) / idealRange.min) * 100;
    score = Math.max(100 - percentDiff, 30);
  } else {
    // Overweight
    const percentDiff = ((weight - idealRange.max) / idealRange.max) * 100;
    score = Math.max(100 - percentDiff, 30);
  }
  
  return {
    score: Math.round(score),
    weightKg: weight,
  };
}

/**
 * Calculate symptom score based on 30-day symptom history
 */
export function calculateSymptomScore(
  symptoms: SymptomData[]
): { score: number; penalty: number } {
  // Get symptoms from last 30 days
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentSymptoms = symptoms.filter(s => new Date(s.date) >= thirtyDaysAgo);
  
  if (recentSymptoms.length === 0) {
    return { score: 100, penalty: 0 }; // No symptoms = perfect score
  }
  
  // Severity weights
  const severityWeights = {
    mild: 0.3,
    moderate: 0.6,
    severe: 1.0,
  };
  
  // Calculate penalty based on severity and frequency
  let totalPenalty = 0;
  
  for (const symptom of recentSymptoms) {
    const weight = severityWeights[symptom.severity] || 0.5;
    totalPenalty += weight;
  }
  
  // Check for recurring symptoms (same description)
  const descriptionCounts: Record<string, number> = {};
  for (const symptom of recentSymptoms) {
    const key = symptom.description.toLowerCase().trim();
    descriptionCounts[key] = (descriptionCounts[key] || 0) + 1;
  }
  
  // Add penalty for recurring symptoms
  for (const count of Object.values(descriptionCounts)) {
    if (count >= 3) {
      totalPenalty += 1.0; // Recurring symptom penalty
    }
  }
  
  // Calculate final score (100 - penalty * 10, minimum 0)
  const score = Math.max(100 - Math.round(totalPenalty * 10), 0);
  
  return {
    score,
    penalty: Math.round(totalPenalty * 10),
  };
}

/**
 * Get activity goal in minutes for species and weight
 */
export function getActivityGoal(species: string, weightKg: number): number {
  const config = SPECIES_ACTIVITY_BASE[species as keyof typeof SPECIES_ACTIVITY_BASE] || SPECIES_ACTIVITY_BASE.dog;
  
  let goal = config.baseMinutes;
  
  if (weightKg > config.perKgOver && config.perKgOver > 0) {
    const extraKg = weightKg - config.perKgOver;
    goal += extraKg * config.additionalMinutesPerKg;
  }
  
  return goal;
}

/**
 * Get daily calorie target for species and weight
 */
export function getDailyCalorieTarget(species: string, weightKg: number): number {
  const weightLb = weightKg * 2.205;
  const base = DAILY_CALORIE_BASE[species as keyof typeof DAILY_CALORIE_BASE] || 25;
  return Math.round(weightLb * base);
}

/**
 * Calculate overall health score with full factor breakdown
 */
export function calculateHealthScore(
  pet: PetData,
  activities: ActivityData[],
  diets: DietData[],
  symptoms: SymptomData[]
): HealthScoreResult {
  const species = pet.species || 'dog';
  const weight = pet.weight || 10; // Default weight if not available
  
  // Calculate individual factor scores
  const activityResult = calculateActivityScore(activities, species, weight);
  const dietResult = calculateDietScore(diets, species, weight);
  const ageResult = calculateAgeScore(pet.birthDate || null, species);
  const weightResult = calculateWeightScore(pet.weight || null, species);
  const symptomResult = calculateSymptomScore(symptoms);
  
  // Build factors array with contributions
  const factors: HealthFactor[] = [
    {
      name: 'Activity',
      value: activityResult.score,
      weight: FACTOR_WEIGHTS.activity,
      contribution: Math.round((activityResult.score / 100) * FACTOR_WEIGHTS.activity * 100),
      rawValue: `${activityResult.actualMinutes} min / ${activityResult.goalMinutes} min`,
    },
    {
      name: 'Diet',
      value: dietResult.score,
      weight: FACTOR_WEIGHTS.diet,
      contribution: Math.round((dietResult.score / 100) * FACTOR_WEIGHTS.diet * 100),
      rawValue: `${dietResult.caloriesConsumed} / ${dietResult.caloriesTarget} kcal`,
    },
    {
      name: 'Age',
      value: ageResult.score,
      weight: FACTOR_WEIGHTS.age,
      contribution: Math.round((ageResult.score / 100) * FACTOR_WEIGHTS.age * 100),
      rawValue: `${ageResult.ageYears} years`,
    },
    {
      name: 'Weight',
      value: weightResult.score,
      weight: FACTOR_WEIGHTS.weight,
      contribution: Math.round((weightResult.score / 100) * FACTOR_WEIGHTS.weight * 100),
      rawValue: `${weightResult.weightKg} kg`,
    },
    {
      name: 'Symptoms',
      value: symptomResult.score,
      weight: FACTOR_WEIGHTS.symptoms,
      contribution: Math.round((symptomResult.score / 100) * FACTOR_WEIGHTS.symptoms * 100),
      rawValue: symptomResult.penalty > 0 ? `-${symptomResult.penalty} penalty` : 'No symptoms',
    },
  ];
  
  // Calculate total score
  const score = factors.reduce((sum, f) => sum + f.contribution, 0);
  
  return {
    score,
    factors,
    breakdown: {
      activityScore: activityResult.score,
      activityMinutes: activityResult.actualMinutes,
      activityGoal: activityResult.goalMinutes,
      dietScore: dietResult.score,
      caloriesConsumed: dietResult.caloriesConsumed,
      caloriesTarget: dietResult.caloriesTarget,
      ageScore: ageResult.score,
      ageYears: ageResult.ageYears,
      weightScore: weightResult.score,
      weightKg: weightResult.weightKg,
      symptomScore: symptomResult.score,
      symptomPenalty: symptomResult.penalty,
    },
  };
}
