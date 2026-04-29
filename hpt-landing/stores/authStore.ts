'use client';

import { create } from 'zustand';

import { getUniqueId } from '@/lib/util';

interface AuthState {
  isAuth: boolean;
  userId: string;
  siteId: string;
  siteName: string;
  categoryId: string;
  divisionId: string;
}

interface AuthActions {
  reset: () => void;
  initialize: () => void;
  setAuthStatus: (isAuth: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const patchInfo = {
  userId: '',
  siteId: '5000101181',
  siteName: '블룸에이아이 주식회사',
  categoryId: '81100',
  divisionId: '81101',
  isAuth: false,
};

const prodInfo = {
  userId: '',
  siteId: '5000101443',
  siteName: '블룸에이아이 주식회사',
  categoryId: '208145',
  divisionId: '208146',
  isAuth: false,
};

const getDefaultState = (profile: string): AuthState =>
  profile === 'patch' ? patchInfo : prodInfo;

const getInitialProfile = (): string =>
  typeof window !== 'undefined'
    ? (window as any).__PROFILE__ || 'production'
    : 'production';

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...getDefaultState(getInitialProfile()),
  reset: () => {
    const { siteId } = get();
    const profile = siteId === patchInfo.siteId ? 'patch' : 'production';
    const state = getDefaultState(profile);
    set(state);
  },
  initialize: () => {
    const { siteId } = get();

    set({ userId: getUniqueId(siteId) });
  },
  setAuthStatus: (isAuth: boolean) => set({ isAuth }),
}));
