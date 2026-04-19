import * as admin from 'firebase-admin';

// Firebase Admin SDK initialization
// Uses environment variables for configuration
// FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

let firebaseInitialized = false;

export function initializeFirebase(): void {
  if (firebaseInitialized) {
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      'Firebase credentials not configured. Auth endpoints will not work without FIREBASE_* environment variables.'
    );
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  firebaseInitialized = true;
  console.log('Firebase Admin initialized');
}

export interface FirebaseTokenPayload {
  uid: string;
  email: string | null;
  email_verified: boolean;
  firebase: {
    identities: {
      email?: string[];
      [key: string]: unknown;
    };
    sign_in_provider: string;
  };
  iss: string;
  aud: string;
  auth_time: number;
  sub: string;
  iat: number;
  exp: number;
}

/**
 * Verify a Firebase ID token and return its decoded payload
 * @param idToken - The Firebase ID token to verify
 * @returns The decoded token payload
 * @throws Error if token is invalid or expired
 */
export async function verifyIdToken(idToken: string): Promise<FirebaseTokenPayload> {
  if (!firebaseInitialized) {
    throw new Error('Firebase not initialized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken as FirebaseTokenPayload;
  } catch (error) {
    throw new Error(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get user by Firebase UID
 * @param uid - Firebase UID
 * @returns User record or null if not found
 */
export async function getUserByUid(uid: string) {
  if (!firebaseInitialized) {
    throw new Error('Firebase not initialized');
  }

  try {
    return await admin.auth().getUser(uid);
  } catch (error) {
    return null;
  }
}

export { admin };
