import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const SALT_ROUNDS = 12;

/**
 * Hash a password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength (minimum 8 characters)
 */
function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Sign up a new user
 */
export async function signup(
  email: string,
  password: string
): Promise<Omit<import('@prisma/client').User, 'passwordHash'>> {
  // Validate email format
  if (!isValidEmail(email)) {
    throw new Error('Invalid email');
  }

  // Validate password strength
  if (!isValidPassword(password)) {
    throw new Error('Password too short');
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  // Return user without passwordHash
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Generate access token
 */
async function generateAccessToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Generate refresh token
 */
async function generateRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ userId, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Login user and return tokens
 */
export async function login(
  email: string,
  password: string
): Promise<{
  user: Omit<import('@prisma/client').User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
}> {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const accessToken = await generateAccessToken(user.id, user.email);
  const refreshToken = await generateRefreshToken(user.id);

  // Return user without passwordHash
  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
}

/**
 * Verify and decode a refresh token, return userId if valid
 */
export async function verifyRefreshToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.type === 'refresh' && payload.userId) {
      return { userId: payload.userId as string };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Generate new access token from refresh token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string } | null> {
  const result = await verifyRefreshToken(refreshToken);
  if (!result) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: result.userId },
  });

  if (!user) {
    return null;
  }

  const accessToken = await generateAccessToken(user.id, user.email);
  return { accessToken };
}