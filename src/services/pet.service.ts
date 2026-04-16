/**
 * Pet Service Layer
 * Phase 01-02: Pet Profile Management
 */

import { PrismaClient, PetSpecies } from '@prisma/client';
import { CreatePetInput, UpdatePetInput } from '../models/pet';

const prisma = new PrismaClient();

/**
 * Create a new pet for a user
 */
export async function createPet(
  userId: string,
  input: CreatePetInput
): Promise<{
  id: string;
  userId: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  birthDate: Date | null;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}> {
  return prisma.pet.create({
    data: {
      userId,
      name: input.name,
      species: input.species,
      breed: input.breed || null,
      birthDate: input.birthDate ? new Date(input.birthDate) : null,
      photoUrl: input.photoUrl || null,
    },
  });
}

/**
 * Get all pets for a user
 */
export async function getPetsByUser(userId: string): Promise<Array<{
  id: string;
  userId: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  birthDate: Date | null;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}>> {
  return prisma.pet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get a single pet by ID
 */
export async function getPetById(id: string): Promise<{
  id: string;
  userId: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  birthDate: Date | null;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
} | null> {
  return prisma.pet.findUnique({
    where: { id },
  });
}

/**
 * Update a pet (only if user owns it)
 */
export async function updatePet(
  id: string,
  userId: string,
  input: UpdatePetInput
): Promise<{
  id: string;
  userId: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  birthDate: Date | null;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
} | null> {
  // First check ownership
  const pet = await prisma.pet.findUnique({
    where: { id },
  });

  if (!pet || pet.userId !== userId) {
    return null;
  }

  return prisma.pet.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.species !== undefined && { species: input.species }),
      ...(input.breed !== undefined && { breed: input.breed }),
      ...(input.birthDate !== undefined && {
        birthDate: input.birthDate ? new Date(input.birthDate) : null,
      }),
      ...(input.photoUrl !== undefined && { photoUrl: input.photoUrl }),
    },
  });
}

/**
 * Delete a pet (only if user owns it)
 */
export async function deletePet(
  id: string,
  userId: string
): Promise<boolean> {
  const pet = await prisma.pet.findUnique({
    where: { id },
  });

  if (!pet || pet.userId !== userId) {
    return false;
  }

  await prisma.pet.delete({
    where: { id },
  });

  return true;
}
