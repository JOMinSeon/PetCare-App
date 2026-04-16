import { jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

interface AccessTokenPayload extends JWTPayload {
  userId: string;
  email: string;
}

/**
 * Verify an access token and return the payload if valid
 */
export async function verifyAccessToken(
  token: string
): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const accessPayload = payload as AccessTokenPayload;
    if (accessPayload.userId && accessPayload.email) {
      return {
        userId: accessPayload.userId,
        email: accessPayload.email,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Express middleware to authenticate requests via Bearer token
 */
export async function authMiddleware(
  req: Request,
  res: Response
): Promise<{ userId: string; email: string } | null> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = await verifyAccessToken(token);

  return payload;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string };
    }
  }
}