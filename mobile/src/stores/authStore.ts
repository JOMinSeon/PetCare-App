import { create } from 'zustand';
import { getAuth, onAuthStateChanged, User } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  jwtToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setJwtToken: (token: string | null) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  jwtToken: null,
  isLoading: true,
  isAuthenticated: false,
  isInitialized: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  setJwtToken: (token) => {
    set({ jwtToken: token });
    if (token) {
      AsyncStorage.setItem('jwt_token', token).catch(console.error);
    } else {
      AsyncStorage.removeItem('jwt_token').catch(console.error);
    }
  },

  logout: async () => {
    const auth = getAuth();
    try {
      await auth.signOut();
      set({ user: null, jwtToken: null, isAuthenticated: false });
      await AsyncStorage.removeItem('jwt_token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  initialize: async () => {
    const auth = getAuth();

    // First check for stored JWT
    try {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      if (storedToken) {
        set({ jwtToken: storedToken });
      }
    } catch (error) {
      console.error('Error reading stored token:', error);
    }

    // Then listen for Firebase auth state changes
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          isInitialized: true,
        });
        resolve();
      });
    });
  },
}));
