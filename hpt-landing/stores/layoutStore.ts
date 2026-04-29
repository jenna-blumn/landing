'use client';

import { create } from 'zustand';

import { breakpoints } from '@/styles/breakpoints';

interface LayoutState {
  isDesktop: boolean | null;
}

interface LayoutActions {
  setIsDesktop: (isDesktop: boolean) => void;
}

type LayoutStore = LayoutState & LayoutActions;

export const useLayoutStore = create<LayoutStore>((set) => ({
  isDesktop: null,
  setIsDesktop: (isDesktop: boolean) => set({ isDesktop }),
}));

export const DESKTOP_MEDIA_QUERY = `(min-width: ${breakpoints.desktop}px)`;
