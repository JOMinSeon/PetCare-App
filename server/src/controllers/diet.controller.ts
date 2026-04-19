import { Request, Response } from 'express';
import { dietService } from '../services/diet.service';
import { z } from 'zod';

export class DietController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const petId = req.params.petId;
      const days = parseInt(req.query.days as string) || 30;
      const diets = await dietService.getDiets(petId, days);
      res.json({ diets });
    } catch (error) {
      console.error('Error listing diets:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const petId = req.params.petId;
      const data = z.object({
        foodName: z.string().min(1).max(200),
        amountGrams: z.number().int().min(1).max(10000),
        calories: z.number().int().min(1).max(10000),
        protein: z.number().int().min(0).optional(),
        fat: z.number().int().min(0).optional(),
        carbs: z.number().int().min(0).optional(),
        date: z.string().datetime(),
      }).parse(req.body);

      const diet = await dietService.logDiet(petId, data);
      res.status(201).json(diet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
        return;
      }
      console.error('Error creating diet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { petId, dietId } = req.params;
      const data = z.object({
        foodName: z.string().min(1).max(200).optional(),
        amountGrams: z.number().int().min(1).max(10000).optional(),
        calories: z.number().int().min(1).max(10000).optional(),
        protein: z.number().int().min(0).optional(),
        fat: z.number().int().min(0).optional(),
        carbs: z.number().int().min(0).optional(),
        date: z.string().datetime().optional(),
      }).parse(req.query);

      const diet = await dietService.updateDiet(petId, dietId, data);
      res.json(diet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
        return;
      }
      console.error('Error updating diet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { petId, dietId } = req.params;
      await dietService.deleteDiet(petId, dietId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting diet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async stats(req: Request, res: Response): Promise<void> {
    try {
      const petId = req.params.petId;
      const stats = await dietService.getDietStats(petId);
      res.json(stats);
    } catch (error) {
      console.error('Error getting diet stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const dietController = new DietController();