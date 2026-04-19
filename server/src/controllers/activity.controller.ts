import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { ActivityService } from '../services/activity.service';
import { z } from 'zod';

const createActivitySchema = z.object({
  steps: z.number().int().min(0).optional(),
  durationMinutes: z.number().int().min(1).max(1440),
  date: z.string().datetime(),
});

const updateActivitySchema = z.object({
  steps: z.number().int().min(0).optional(),
  durationMinutes: z.number().int().min(1).max(1440).optional(),
  date: z.string().datetime().optional(),
});

export class ActivityController {
  private service = new ActivityService();

  async list(req: Request, res: Response): Promise<void> {
    try {
      const petId = req.params.petId;
      const days = parseInt(req.query.days as string) || 30;

      const activities = await this.service.getActivities(petId, days);
      res.json({ activities });
    } catch (error) {
      console.error('Error listing activities:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const petId = req.params.petId;
      const data = createActivitySchema.parse(req.body);

      const activity = await this.service.logActivity(petId, data);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
        return;
      }
      console.error('Error creating activity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { petId, activityId } = req.params;
      const data = updateActivitySchema.parse(req.query);

      const activity = await this.service.updateActivity(petId, activityId, data);
      res.json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
        return;
      }
      console.error('Error updating activity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { petId, activityId } = req.params;
      await this.service.deleteActivity(petId, activityId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting activity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async stats(req: Request, res: Response): Promise<void> {
    try {
      const petId = req.params.petId;
      const stats = await this.service.getActivityStats(petId);
      res.json(stats);
    } catch (error) {
      console.error('Error getting activity stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const activityController = new ActivityController();