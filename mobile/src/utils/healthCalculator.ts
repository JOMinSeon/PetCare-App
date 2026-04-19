/**
 * Health Score Calculator - Mobile Utilities
 * 
 * Mirror of server-side health calculator for local calculations.
 * Weights: Activity 30%, Diet 25%, Age 20%, Weight 15%, Symptoms 10%
 */

// Factor weights (must mirror server)
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

// Factor colors for visualization
export const FACTOR_COLORS = {
  Activity: '#42A5F5',  // Blue
  Diet: '#66BB6A',       // Green
  Age: '#FFA726',        // Orange
  Weight: '#AB47BC',     // Purple
  Symptoms: '#EF5350',   // Red
} as const;

export interface HealthFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
  rawValue?: string;
}

/**
 * Calculate age in years from birth date string
 */
export function calculateAgeFromBirthDate(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = (now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.round(years * 10) / 10;
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
 * Get activity score (0-100) from actual vs goal minutes
 */
export function getActivityScore(actualMinutes: number, goalMinutes: number): number {
  if (goalMinutes <= 0) return 50;
  const ratio = actualMinutes / goalMinutes;
  return Math.min(Math.round(ratio * 100), 100);
}

/**
 * Get diet score (0-100) from actual vs target calories
 */
export function getDietScore(actualCalories: number, targetCalories: number): number {
  if (targetCalories <= 0) return 50;
  
  const ratio = actualCalories / targetCalories;
  
  if (ratio >= 0.9 && ratio <= 1.1) {
    return 100;
  } else if (ratio >= 0.8 && ratio <= 1.2) {
    return 80;
  } else if (ratio >= 0.7 && ratio <= 1.3) {
    return 60;
  } else if (ratio >= 0.5 && ratio <= 1.5) {
    return 40;
  } else {
    return 20;
  }
}

/**
 * Get weight score (0-100) based on ideal weight range
 */
export function getWeightScore(weight: number, species: string): number {
  const idealRanges: Record<string, { min: number; max: number }> = {
    dog: { min: 5, max: 30 },
    cat: { min: 2, max: 6 },
    bird: { min: 0.05, max: 0.5 },
    rabbit: { min: 1, max: 4 },
  };
  
  const ideal = idealRanges[species] || idealRanges.dog;
  
  if (weight >= ideal.min && weight <= ideal.max) {
    return 100;
  } else if (weight < ideal.min) {
    const percentDiff = ((ideal.min - weight) / ideal.min) * 100;
    return Math.max(100 - percentDiff, 30);
  } else {
    const percentDiff = ((weight - ideal.max) / ideal.max) * 100;
    return Math.max(100 - percentDiff, 30);
  }
}

/**
 * Get age score (0-100) based on optimal age range
 */
export function getAgeScore(ageYears: number, species: string): number {
  const optimalRanges: Record<string, { min: number; max: number }> = {
    dog: { min: 1, max: 7 },
    cat: { min: 1, max: 10 },
    bird: { min: 1, max: 8 },
    rabbit: { min: 1, max: 6 },
  };
  
  const optimal = optimalRanges[species] || optimalRanges.dog;
  
  if (ageYears >= optimal.min && ageYears <= optimal.max) {
    return 100;
  } else if (ageYears < optimal.min) {
    const yearsDiff = optimal.min - ageYears;
    return Math.max(100 - yearsDiff * 10, 40);
  } else {
    const yearsDiff = ageYears - optimal.max;
    return Math.max(100 - yearsDiff * 8, 30);
  }
}

/**
 * Calculate health score from factor values
 */
export function calculateHealthScoreFromFactors(
  activityScore: number,
  dietScore: number,
  ageScore: number,
  weightScore: number,
  symptomScore: number
): { score: number; factors: HealthFactor[] } {
  const factors: HealthFactor[] = [
    {
      name: 'Activity',
      value: activityScore,
      weight: FACTOR_WEIGHTS.activity,
      contribution: Math.round((activityScore / 100) * FACTOR_WEIGHTS.activity * 100),
    },
    {
      name: 'Diet',
      value: dietScore,
      weight: FACTOR_WEIGHTS.diet,
      contribution: Math.round((dietScore / 100) * FACTOR_WEIGHTS.diet * 100),
    },
    {
      name: 'Age',
      value: ageScore,
      weight: FACTOR_WEIGHTS.age,
      contribution: Math.round((ageScore / 100) * FACTOR_WEIGHTS.age * 100),
    },
    {
      name: 'Weight',
      value: weightScore,
      weight: FACTOR_WEIGHTS.weight,
      contribution: Math.round((weightScore / 100) * FACTOR_WEIGHTS.weight * 100),
    },
    {
      name: 'Symptoms',
      value: symptomScore,
      weight: FACTOR_WEIGHTS.symptoms,
      contribution: Math.round((symptomScore / 100) * FACTOR_WEIGHTS.symptoms * 100),
    },
  ];
  
  const score = factors.reduce((sum, f) => sum + f.contribution, 0);
  
  return { score, factors };
}

/**
 * Format factor breakdown for display
 */
export function formatFactorBreakdown(factors: HealthFactor[]): string {
  return factors
    .map(f => `${f.name}: ${f.value}/100 (${f.contribution} pts)`)
    .join('\n');
}

/**
 * Get color for health score value
 */
export function getScoreColor(value: number): string {
  if (value >= 80) return '#22c55e'; // Green
  if (value >= 60) return '#f59e0b'; // Amber
  if (value >= 40) return '#f97316'; // Orange
  return '#ef4444'; // Red
}

/**
 * Get label for health score value
 */
export function getScoreLabel(value: number): string {
  if (value >= 80) return 'Excellent';
  if (value >= 60) return 'Good';
  if (value >= 40) return 'Fair';
  return 'Needs Attention';
}

/**
 * Get color for a specific factor
 */
export function getFactorColor(factorName: string): string {
  return FACTOR_COLORS[factorName as keyof typeof FACTOR_COLORS] || '#9E9E9E';
}
