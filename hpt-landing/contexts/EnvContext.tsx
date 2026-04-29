'use client';

import { createContext, useContext, type ReactNode } from 'react';

export interface EnvValues {
  WEBHOOK_API_URL: string;
  SOCKET_URL: string;
  HAPPYTALK_COUNSELOR_URL: string;
  HAPPYTALK_URL: string;
  WEB_CHAT_URL: string;
}

const EnvContext = createContext<EnvValues | null>(null);

interface EnvProviderProps {
  env: EnvValues;
  children: ReactNode;
}

export function EnvProvider({ env, children }: EnvProviderProps) {
  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
}

export function useEnv(): EnvValues {
  const context = useContext(EnvContext);
  if (!context) {
    throw new Error('useEnv must be used within EnvProvider');
  }
  return context;
}
