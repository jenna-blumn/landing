import { create } from 'zustand';
import { SearchFilters, SearchResult, SearchModeSnapshot, FilterMode, getDefaultSearchFilters } from '../features/search/types';
import type { Channel } from '../types/channel';

interface SearchState {
  // State
  isActive: boolean;
  filterMode: FilterMode;
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  selectedResultId: number | null;
  snapshot: SearchModeSnapshot | null;

  // Actions
  activate: (snapshot: SearchModeSnapshot, filterMode: FilterMode, isManagerMode: boolean, selectedChannel: Channel) => void;
  deactivate: () => SearchModeSnapshot | null;
  setQuery: (query: string) => void;
  setFilters: (filters: SearchFilters | ((prev: SearchFilters) => SearchFilters)) => void;
  setResults: (results: SearchResult[]) => void;
  selectResult: (resultId: number | null) => void;
  updateConsultantFilter: (isManagerMode: boolean) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  isActive: false,
  filterMode: 'standard',
  query: '',
  filters: getDefaultSearchFilters(),
  results: [],
  selectedResultId: null,
  snapshot: null,

  activate: (snapshot, filterMode, isManagerMode, selectedChannel) => {
    let filters: SearchFilters;
    if (filterMode === 'ai-response') {
      filters = { ...getDefaultSearchFilters(selectedChannel), status: ['ai-response'] };
    } else if (filterMode === 'unassigned') {
      filters = { ...getDefaultSearchFilters(selectedChannel), status: ['assignment-waiting'] };
    } else {
      filters = { ...getDefaultSearchFilters(selectedChannel), consultant: isManagerMode ? null : '김상담' };
    }

    set({
      isActive: true,
      filterMode,
      snapshot,
      filters,
      query: '',
      results: [],
      selectedResultId: null,
    });
  },

  deactivate: () => {
    const { snapshot } = get();
    set({
      isActive: false,
      filterMode: 'standard',
      query: '',
      filters: getDefaultSearchFilters(),
      results: [],
      selectedResultId: null,
      snapshot: null,
    });
    return snapshot;
  },

  setQuery: (query) => set({ query }),

  setFilters: (filtersOrUpdater) => {
    if (typeof filtersOrUpdater === 'function') {
      set((state) => ({ filters: filtersOrUpdater(state.filters) }));
    } else {
      set({ filters: filtersOrUpdater });
    }
  },

  setResults: (results) => set({ results }),

  selectResult: (resultId) => set({ selectedResultId: resultId }),

  updateConsultantFilter: (isManagerMode) => {
    const { isActive, filterMode } = get();
    if (isActive && filterMode === 'standard') {
      set((state) => ({
        filters: { ...state.filters, consultant: isManagerMode ? null : '김상담' },
      }));
    }
  },
}));
