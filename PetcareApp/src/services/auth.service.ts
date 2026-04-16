import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = '@petcare_access_token';
const REFRESH_TOKEN_KEY = '@petcare_refresh_token';
const USER_KEY = '@petcare_user';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface User {
  id: string;
  email: string;
  createdAt: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

interface ApiError {
  error: string;
}

async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'Signup failed');
  }

  const data: AuthResponse = await response.json();
  
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  if (data.refreshToken) {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  }
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
  
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data: AuthResponse = await response.json();
  
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  if (data.refreshToken) {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  }
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
  
  return data;
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    await logout();
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  
  return data.accessToken;
}

export async function logout(): Promise<void> {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    }
  } catch {
  } finally {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
  }
}

export async function getStoredUser(): Promise<User | null> {
  const userStr = await AsyncStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export default {
  signup,
  login,
  logout,
  refreshAccessToken,
  getStoredUser,
  getAuthHeader,
};