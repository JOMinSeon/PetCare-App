import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { SymptomAnalysisService } from '../services/symptomAnalysis.service';
import { z } from 'zod';

const createSymptomSchema = z.object({
  description: z.string().min(1).max(500),
  severity: z.enum(['mild', 'moderate', 'severe']),
  date: z.string().datetime(),
});

const updateSymptomSchema = z.object({
  description: z.string().min(1).max(500).optional(),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(),
  date: z.string().datetime().optional(),
});

export class SymptomController {
  private analysisService = new SymptomAnalysisService();

  async list(req: Request, res: Response): Promise<void> {
    try {
      const petId = req.params.petId;
      const { page = '1', limit = '20' } = req.query;

      const pet = await prisma.pet.findUnique({ where: { id: petId } });
      if (!pet) {
        res.status(404).json({ error: 'Pet not found' });
        return;
      }

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const symptoms = await prisma.symptom.findMany({
        where: { petId },
        orderBy: { date: 'desc' },
        take: parseInt(limit as string),
        skip,
      });

      const total = await prisma.symptom.count({ where: { petId } });

      res.json({ symptoms, total, page: parseInt(page as string), limit: parseInt(limit as string) });
    } catch (error) {
      console.error('Error listing symptoms:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { petId, symptomId } = req.params;

      const symptom = await prisma.symptom.findFirst({
        where: { id: symptomId, petId },
      });

      if (!symptom) {
        res.status(404).json({ error: 'Symptom not found' });
        return;
      }

      res.json(symptom);
    } catch (error) {
      console.error('Error getting symptom:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const petId = req.params.petId;
      const data = createSymptomSchema.parse(req.body);

      const pet = await prisma.pet.findUnique({ where: { id: petId } });
      if (!pet) {
        res.status(404).json({ error: 'Pet not found' });
        return;
      }

      const symptom = await prisma.symptom.create({
        data: {
          description: data.description,
          severity: data.severity,
          date: new Date(data.date),
          petId,
        },
      });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentSymptoms = await prisma.symptom.findMany({
        where: { petId, date: { gte: thirtyDaysAgo } },
        orderBy: { date: 'desc' },
      });

      const analysisResult = this.analysisService.analyzeSymptoms(recentSymptoms);

      if (analysisResult.riskScore >= 70) {
        await prisma.alert.create({
          data: {
            petId,
            type: 'high_risk_symptom',
            severity: 'high',
            message: analysisResult.recommendation,
            details: JSON.stringify({
              riskScore: analysisResult.riskScore,
              riskFactors: analysisResult.riskFactors,
              triggeredPatterns: analysisResult.triggeredPatterns,
              symptomId: symptom.id,
            }),
          },
        });
      }

      res.status(201).json({
        ...symptom,
        analysis: {
          riskScore: analysisResult.riskScore,
          riskLevel: analysisResult.riskLevel,
          riskFactors: analysisResult.riskFactors,
          recommendation: analysisResult.recommendation,
          disclaimer: 'This is probability-based assessment, not a diagnosis. Please consult a veterinarian.',
          triggeredPatterns: analysisResult.triggeredPatterns,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
        return;
      }
      console.error('Error creating symptom:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { petId, symptomId } = req.params;
      const data = updateSymptomSchema.parse(req.query);

      const existing = await prisma.symptom.findFirst({
        where: { id: symptomId, petId },
      });

      if (!existing) {
        res.status(404).json({ error: 'Symptom not found' });
        return;
      }

      const symptom = await prisma.symptom.update({
        where: { id: symptomId },
        data: {
          ...(data.description && { description: data.description }),
          ...(data.severity && { severity: data.severity }),
          ...(data.date && { date: new Date(data.date) }),
        },
      });

      res.json(symptom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
        return;
      }
      console.error('Error updating symptom:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { petId, symptomId } = req.params;

      const existing = await prisma.symptom.findFirst({
        where: { id: symptomId, petId },
      });

      if (!existing) {
        res.status(404).json({ error: 'Symptom not found' });
        return;
      }

      await prisma.symptom.delete({ where: { id: symptomId } });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting symptom:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async analysis(req: Request, res: Response): Promise<void> {
    try {
      const petId = req.params.petId;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const symptoms = await prisma.symptom.findMany({
        where: { petId, date: { gte: thirtyDaysAgo } },
        orderBy: { date: 'desc' },
      });

      const result = this.analysisService.analyzeSymptoms(symptoms);

      res.json({
        ...result,
        disclaimer: 'This is probability-based assessment, not a diagnosis. Please consult a veterinarian.',
        symptomCount: symptoms.length,
      });
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const symptomController = new SymptomController();