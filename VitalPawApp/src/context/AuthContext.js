import React, { createContext, useContext } from 'react';
import { useAuthStore } from '../store';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { user, token, isAuthenticated, login, logout, register } = useAuthStore();

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);