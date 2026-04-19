import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware.js';

const prisma = new PrismaClient();

const VALID_SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'fish', 'other'];

export const listPets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const pets = await prisma.pet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ pets });
  } catch (error) {
    console.error('Error listing pets:', error);
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
};

export const getPet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const pet = await prisma.pet.findFirst({
      where: { id, userId },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    res.json({ pet });
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({ error: 'Failed to fetch pet' });
  }
};

export const createPet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { name, species, breed, birthDate, weight, photoUrl } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Pet name is required' });
      return;
    }

    if (!species || !VALID_SPECIES.includes(species)) {
      res.status(400).json({ error: `Species must be one of: ${VALID_SPECIES.join(', ')}` });
      return;
    }

    const pet = await prisma.pet.create({
      data: {
        name: name.trim(),
        species,
        breed: breed?.trim() || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        weight: weight ? parseFloat(weight) : null,
        photoUrl: photoUrl || null,
        userId,
      },
    });

    res.status(201).json({ pet });
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(500).json({ error: 'Failed to create pet' });
  }
};

export const updatePet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, species, breed, birthDate, weight, photoUrl } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Check pet belongs to user
    const existingPet = await prisma.pet.findFirst({
      where: { id, userId },
    });

    if (!existingPet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    // Validate species if provided
    if (species && !VALID_SPECIES.includes(species)) {
      res.status(400).json({ error: `Species must be one of: ${VALID_SPECIES.join(', ')}` });
      return;
    }

    const updateData: {
      name?: string;
      species?: string;
      breed?: string | null;
      birthDate?: Date | null;
      weight?: number | null;
      photoUrl?: string | null;
    } = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({ error: 'Pet name cannot be empty' });
        return;
      }
      updateData.name = name.trim();
    }

    if (species !== undefined) {
      updateData.species = species;
    }

    if (breed !== undefined) {
      updateData.breed = breed?.trim() || null;
    }

    if (birthDate !== undefined) {
      updateData.birthDate = birthDate ? new Date(birthDate) : null;
    }

    if (weight !== undefined) {
      updateData.weight = weight ? parseFloat(weight) : null;
    }

    if (photoUrl !== undefined) {
      updateData.photoUrl = photoUrl || null;
    }

    const pet = await prisma.pet.update({
      where: { id },
      data: updateData,
    });

    res.json({ pet });
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ error: 'Failed to update pet' });
  }
};

export const deletePet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Check pet belongs to user
    const pet = await prisma.pet.findFirst({
      where: { id, userId },
    });

    if (!pet) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    await prisma.pet.delete({
      where: { id },
    });

    res.json({ message: 'Pet deleted successfully', petId: id });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ error: 'Failed to delete pet' });
  }
};