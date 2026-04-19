import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@react-native-firebase/auth';
import { useAuthStore } from '../stores/authStore';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  jwtToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setJwtToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const {
    user,
    jwtToken,
    isLoading,
    isAuthenticated,
    isInitialized,
    setJwtToken,
    logout: storeLogout,
    initialize,
  } = useAuthStore();

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await initialize();
      if (mounted) {
        setIsInitializing(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [initialize]);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await authSignIn({ email, password });
    setJwtToken(response.token);
  };

  const signup = async (email: string, password: string): Promise<void> => {
    const response = await authSignUp({ email, password });
    setJwtToken(response.token);
  };

  const logout = async (): Promise<void> => {
    await storeLogout();
  };

  const value: AuthContextType = {
    user,
    jwtToken,
    isLoading: isInitializing || isLoading,
    isAuthenticated,
    isInitialized,
    login,
    signup,
    logout,
    setJwtToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
