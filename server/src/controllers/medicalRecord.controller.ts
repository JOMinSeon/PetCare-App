import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { z } from 'zod';

const CreateMedicalRecordSchema = z.object({
  type: z.enum(['vaccination', 'checkup']),
  name: z.string().min(1).max(200),
  date: z.string().datetime(),
  nextDueDate: z.string().datetime().optional(),
  hospital: z.string().max(200).optional(),
  summary: z.string().max(1000).optional(),
});

const UpdateMedicalRecordSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  date: z.string().datetime().optional(),
  nextDueDate: z.string().datetime().optional(),
  hospital: z.string().max(200).optional(),
  summary: z.string().max(1000).optional(),
});

export class MedicalRecordController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const petId = req.params.petId;
      const { type } = req.query;

      const where: any = { petId };
      if (type && (type === 'vaccination' || type === 'checkup')) {
        where.type = type;
      }

      const records = await prisma.medicalRecord.findMany({
        where,
        orderBy: { date: 'desc' },
      });

      res.json({ records });
    } catch (error) {
      console.error('Error listing medical records:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { petId, recordId } = req.params;

      const record = await prisma.medicalRecord.findFirst({
        where: { id: recordId, petId },
      });

      if (!record) {
        res.status(404).json({ error: 'Medical record not found' });
        return;
      }

      res.json(record);
    } catch (error) {
      console.error('Error getting medical record:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const petId = req.params.petId;
      const data = CreateMedicalRecordSchema.parse(req.body);

      const pet = await prisma.pet.findUnique({ where: { id: petId } });
      if (!pet) {
        res.status(404).json({ error: 'Pet not found' });
        return;
      }

      const record = await prisma.medicalRecord.create({
        data: {
          petId,
          type: data.type,
          name: data.name,
          date: new Date(data.date),
          nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : null,
          hospital: data.hospital,
          summary: data.summary,
        },
      });

      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
        return;
      }
      console.error('Error creating medical record:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { petId, recordId } = req.params;
      const data = UpdateMedicalRecordSchema.parse(req.query);

      const existing = await prisma.medicalRecord.findFirst({
        where: { id: recordId, petId },
      });

      if (!existing) {
        res.status(404).json({ error: 'Medical record not found' });
        return;
      }

      const record = await prisma.medicalRecord.update({
        where: { id: recordId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.date && { date: new Date(data.date) }),
          ...(data.nextDueDate !== undefined && { nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : null }),
          ...(data.hospital !== undefined && { hospital: data.hospital }),
          ...(data.summary !== undefined && { summary: data.summary }),
        },
      });

      res.json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
        return;
      }
      console.error('Error updating medical record:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { petId, recordId } = req.params;

      const existing = await prisma.medicalRecord.findFirst({
        where: { id: recordId, petId },
      });

      if (!existing) {
        res.status(404).json({ error: 'Medical record not found' });
        return;
      }

      await prisma.medicalRecord.delete({ where: { id: recordId } });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting medical record:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async upcoming(req: Request, res: Response): Promise<void> {
    try {
      const petId = req.params.petId;

      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const records = await prisma.medicalRecord.findMany({
        where: {
          petId,
          type: 'vaccination',
          nextDueDate: {
            gte: now,
            lte: thirtyDaysFromNow,
          },
        },
        orderBy: { nextDueDate: 'asc' },
      });

      res.json({ records });
    } catch (error) {
      console.error('Error getting upcoming vaccinations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const medicalRecordController = new MedicalRecordController();