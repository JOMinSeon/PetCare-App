import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from '@react-native-firebase/auth';
import { apiService } from './api';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  // Firebase Auth handles password validation
}

/**
 * Sign up with email and password
 * Creates a Firebase user and exchanges the ID token for a custom JWT
 */
export async function signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
  const auth = getAuth();

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    credentials.email,
    credentials.password
  );

  const idToken = await userCredential.user.getIdToken();

  // Exchange Firebase token for custom JWT from our backend
  const response = await apiService.post<AuthResponse>('/auth/register', {
    idToken,
  });

  return response;
}

/**
 * Sign in with email and password
 * Authenticates with Firebase and exchanges the ID token for a custom JWT
 */
export async function signIn(credentials: LoginCredentials): Promise<AuthResponse> {
  const auth = getAuth();

  const userCredential = await signInWithEmailAndPassword(
    auth,
    credentials.email,
    credentials.password
  );

  const idToken = await userCredential.user.getIdToken();

  // Exchange Firebase token for custom JWT from our backend
  const response = await apiService.post<AuthResponse>('/auth/login', {
    idToken,
  });

  return response;
}

/**
 * Sign out from Firebase
 * Clears local storage and signs out from Firebase
 */
export async function signOut(): Promise<void> {
  const auth = getAuth();
  await firebaseSignOut(auth);
}

/**
 * Get current Firebase user
 */
export function getCurrentUser(): User | null {
  const auth = getAuth();
  return auth.currentUser;
}

/**
 * Get Firebase ID token for current user
 */
export async function getIdToken(): Promise<string | null> {
  const user = getCurrentUser();
  if (!user) {
    return null;
  }
  return await user.getIdToken();
}

/**
 * Verify Firebase ID token directly
 */
export async function verifyFirebaseToken(idToken: string): Promise<{
  valid: boolean;
  uid?: string;
  email?: string;
  error?: string;
}> {
  try {
    const response = await apiService.post<{ valid: boolean; uid: string; email: string }>(
      '/auth/firebase/verify',
      { idToken }
    );
    return response;
  } catch (error: any) {
    return {
      valid: false,
      error: error.response?.data?.error || 'Token verification failed',
    };
  }
}
