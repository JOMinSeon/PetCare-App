import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../services/prisma.service.js';
import { verifyIdToken, initializeFirebase, FirebaseTokenPayload } from '../services/firebase.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vitalpaw-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

interface JWTPayload {
  userId: string;
  firebaseUid: string;
  email: string;
}

// Initialize Firebase on module load
initializeFirebase();

/**
 * Exchange Firebase ID token for custom JWT
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ error: 'idToken is required' });
      return;
    }

    // Verify Firebase token
    const decodedToken: FirebaseTokenPayload = await verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          email: email || `user_${uid}@vitalpaw.app`,
        },
      });
    }

    // Create custom JWT
    const token = jwt.sign(
      {
        userId: user.id,
        firebaseUid: uid,
        email: user.email,
      } as JWTPayload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Register new user with Firebase token
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ error: 'idToken is required' });
      return;
    }

    // Verify Firebase token
    const decodedToken: FirebaseTokenPayload = await verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    if (!email) {
      res.status(400).json({ error: 'Email is required for registration' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        firebaseUid: uid,
        email,
      },
    });

    // Create custom JWT
    const token = jwt.sign(
      {
        userId: user.id,
        firebaseUid: uid,
        email: user.email,
      } as JWTPayload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(401).json({
      error: 'Registration failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Get current user from JWT
 * GET /api/auth/me
 */
export async function me(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pets: {
          select: {
            id: true,
            name: true,
            species: true,
            breed: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      pets: user.pets,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
}

/**
 * Logout (client-side token removal)
 * POST /api/auth/logout
 */
export function logout(req: Request, res: Response): void {
  // JWT is stateless, so logout is handled client-side
  // This endpoint exists for API consistency and future token blacklisting
  res.json({ message: 'Logged out successfully' });
}

/**
 * Verify Firebase ID token directly
 * POST /api/auth/firebase/verify
 */
export async function verifyFirebaseToken(req: Request, res: Response): Promise<void> {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ error: 'idToken is required' });
      return;
    }

    const decodedToken = await verifyIdToken(idToken);

    res.json({
      valid: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid token',
    });
  }
}
