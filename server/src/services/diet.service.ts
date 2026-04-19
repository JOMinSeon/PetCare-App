import { prisma } from '../config/database';
import { z } from 'zod';

export const calculateDailyCalorieTarget = (species: string, weightKg: number): number => {
  const weightLb = weightKg * 2.20462;
  const multipliers: Record<string, number> = {
    dog: 30,
    cat: 20,
    bird: 10,
    rabbit: 15,
    fish: 5,
    other: 20,
  };
  const multiplier = multipliers[species.toLowerCase()] || 20;
  return Math.round(weightLb * multiplier);
};

export const estimateMacros = (calories: number, protein?: number, fat?: number, carbs?: number) => {
  if (protein !== undefined && fat !== undefined && carbs !== undefined) {
    return { protein, fat, carbs };
  }
  const proteinPercent = 0.25;
  const fatPercent = 0.15;
  const carbPercent = 0.60;
  return {
    protein: Math.round((calories * proteinPercent) / 4),
    fat: Math.round((calories * fatPercent) / 9),
    carbs: Math.round((calories * carbPercent) / 4),
  };
};

export const CreateDietRequestSchema = z.object({
  foodName: z.string().min(1).max(200),
  amountGrams: z.number().int().min(1).max(10000),
  calories: z.number().int().min(1).max(10000),
  protein: z.number().int().min(0).optional(),
  fat: z.number().int().min(0).optional(),
  carbs: z.number().int().min(0).optional(),
  date: z.string().datetime(),
});

export const UpdateDietRequestSchema = z.object({
  foodName: z.string().min(1).max(200).optional(),
  amountGrams: z.number().int().min(1).max(10000).optional(),
  calories: z.number().int().min(1).max(10000).optional(),
  protein: z.number().int().min(0).optional(),
  fat: z.number().int().min(0).optional(),
  carbs: z.number().int().min(0).optional(),
  date: z.string().datetime().optional(),
});

export class DietService {
  async logDiet(petId: string, data: z.infer<typeof CreateDietRequestSchema>) {
    const macros = estimateMacros(data.calories, data.protein, data.fat, data.carbs);
    return prisma.diet.create({
      data: {
        petId,
        foodName: data.foodName,
        amountGrams: data.amountGrams,
        calories: data.calories,
        protein: macros.protein,
        fat: macros.fat,
        carbs: macros.carbs,
        date: new Date(data.date),
      },
    });
  }

  async getDiets(petId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.diet.findMany({
      where: { petId, date: { gte: startDate } },
      orderBy: { date: 'desc' },
    });
  }

  async updateDiet(petId: string, dietId: string, data: z.infer<typeof UpdateDietRequestSchema>) {
    const existing = await prisma.diet.findFirst({ where: { id: dietId, petId } });
    if (!existing) throw new Error('Diet not found');

    const macros = estimateMacros(
      data.calories || existing.calories,
      data.protein !== undefined ? data.protein : existing.protein,
      data.fat !== undefined ? data.fat : existing.fat,
      data.carbs !== undefined ? data.carbs : existing.carbs
    );

    return prisma.diet.update({
      where: { id: dietId },
      data: {
        ...(data.foodName && { foodName: data.foodName }),
        ...(data.amountGrams && { amountGrams: data.amountGrams }),
        ...(data.calories && { calories: data.calories }),
        ...(data.protein !== undefined && { protein: data.protein }),
        ...(data.fat !== undefined && { fat: data.fat }),
        ...(data.carbs !== undefined && { carbs: data.carbs }),
        ...(data.date && { date: new Date(data.date) }),
      },
    });
  }

  async deleteDiet(petId: string, dietId: string) {
    const existing = await prisma.diet.findFirst({ where: { id: dietId, petId } });
    if (!existing) throw new Error('Diet not found');
    return prisma.diet.delete({ where: { id: dietId } });
  }

  async getDietStats(petId: string) {
    const pet = await prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) throw new Error('Pet not found');

    const calorieTarget = calculateDailyCalorieTarget(pet.species, pet.weight || 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEntries = await prisma.diet.findMany({
      where: { petId, date: { gte: today } },
    });

    const caloriesConsumed = todayEntries.reduce((sum, d) => sum + d.calories, 0);
    const macros = {
      protein: todayEntries.reduce((sum, d) => sum + (d.protein || 0), 0),
      fat: todayEntries.reduce((sum, d) => sum + (d.fat || 0), 0),
      carbs: todayEntries.reduce((sum, d) => sum + (d.carbs || 0), 0),
    };

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekEntries = await prisma.diet.findMany({
      where: { petId, date: { gte: weekStart } },
      orderBy: { date: 'asc' },
    });

    const weeklyData: { date: string; calories: number; protein: number; fat: number; carbs: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayEntries = weekEntries.filter(e => e.date.toISOString().split('T')[0] === dateStr);
      weeklyData.push({
        date: dateStr,
        calories: dayEntries.reduce((sum, e) => sum + e.calories, 0),
        protein: dayEntries.reduce((sum, e) => sum + (e.protein || 0), 0),
        fat: dayEntries.reduce((sum, e) => sum + (e.fat || 0), 0),
        carbs: dayEntries.reduce((sum, e) => sum + (e.carbs || 0), 0),
      });
    }

    return {
      petId,
      dailyCalories: caloriesConsumed,
      calorieTarget,
      caloriesConsumed,
      caloriesRemaining: Math.max(0, calorieTarget - caloriesConsumed),
      macros,
      weeklyData,
    };
  }
}

export const dietService = new DietService();