import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Re-export User type for convenience
export type { User } from '@prisma/client';