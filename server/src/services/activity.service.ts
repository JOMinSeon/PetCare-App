import { prisma } from '../config/database';
import { z } from 'zod';

const CreateActivityRequestSchema = z.object({
  steps: z.number().int().min(0).optional(),
  durationMinutes: z.number().int().min(1).max(1440),
  date: z.string().datetime(),
});

const UpdateActivityRequestSchema = z.object({
  steps: z.number().int().min(0).optional(),
  durationMinutes: z.number().int().min(1).max(1440).optional(),
  date: z.string().datetime().optional(),
});

export class ActivityService {
  async logActivity(petId: string, data: z.infer<typeof CreateActivityRequestSchema>) {
    return prisma.activity.create({
      data: {
        petId,
        steps: data.steps,
        durationMinutes: data.durationMinutes,
        date: new Date(data.date),
      },
    });
  }

  async getActivities(petId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.activity.findMany({
      where: { petId, date: { gte: startDate } },
      orderBy: { date: 'desc' },
    });
  }

  async updateActivity(petId: string, activityId: string, data: z.infer<typeof UpdateActivityRequestSchema>) {
    const existing = await prisma.activity.findFirst({
      where: { id: activityId, petId },
    });

    if (!existing) {
      throw new Error('Activity not found');
    }

    return prisma.activity.update({
      where: { id: activityId },
      data: {
        ...(data.steps !== undefined && { steps: data.steps }),
        ...(data.durationMinutes && { durationMinutes: data.durationMinutes }),
        ...(data.date && { date: new Date(data.date) }),
      },
    });
  }

  async deleteActivity(petId: string, activityId: string) {
    const existing = await prisma.activity.findFirst({
      where: { id: activityId, petId },
    });

    if (!existing) {
      throw new Error('Activity not found');
    }

    return prisma.activity.delete({ where: { id: activityId } });
  }

  async getActivityStats(petId: string) {
    const pet = await prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) {
      throw new Error('Pet not found');
    }

    const goalMinutes = this.calculateDailyGoal(pet.species, pet.weight || 1);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const activities = await prisma.activity.findMany({
      where: { petId, date: { gte: startDate, lte: endDate } },
      orderBy: { date: 'asc' },
    });

    const chartData: { date: string; minutes: number; steps: number }[] = [];
    let totalMinutes = 0;
    let totalSteps = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];

      const dayActivities = activities.filter(a => {
        const activityDate = new Date(a.date).toISOString().split('T')[0];
        return activityDate === dateStr;
      });

      const dayMinutes = dayActivities.reduce((sum, a) => sum + a.durationMinutes, 0);
      const daySteps = dayActivities.reduce((sum, a) => sum + (a.steps || 0), 0);

      chartData.push({ date: dateStr, minutes: dayMinutes, steps: daySteps });
      totalMinutes += dayMinutes;
      totalSteps += daySteps;
    }

    const averageDaily = totalMinutes / 7;
    const goalProgress = Math.min((averageDaily / goalMinutes) * 100, 100);

    return {
      petId,
      totalMinutes,
      totalSteps,
      averageDaily: Math.round(averageDaily),
      goalMinutes,
      goalProgress: Math.round(goalProgress),
      chartData,
    };
  }

  calculateDailyGoal(species: string, weightKg: number): number {
    const baseMinutes: Record<string, number> = {
      dog: 60,
      cat: 30,
      bird: 20,
      rabbit: 30,
      fish: 5,
      other: 30,
    };

    const base = baseMinutes[species.toLowerCase()] || 30;
    const weightAdjustment = species.toLowerCase() === 'dog' && weightKg > 20 ? 5 : 0;
    return base + weightAdjustment;
  }
}

export const activityService = new ActivityService();