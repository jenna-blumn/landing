import React, { createContext, useContext, useMemo } from 'react';
import type { AuthConfig } from '../types/auth';

interface AuthContextValue {
  auth: AuthConfig;
  isManager: boolean;
  isConsultant: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  auth: AuthConfig;
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ auth, children }) => {
  const value = useMemo<AuthContextValue>(() => ({
    auth,
    isManager: auth.role === 'manager',
    isConsultant: auth.role === 'consultant',
  }), [auth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
