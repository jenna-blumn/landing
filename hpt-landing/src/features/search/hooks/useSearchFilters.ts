import { useCallback, useMemo } from 'react';
import {
  SearchFilters,
  PeriodFilter,
  ChannelFilter,
  CategoryFilter,
  AdditionalStatusFilter,
  ContactStatus,
  FilterMode,
  getDefaultSearchFilters,
  getDefaultChannelFilter,
  getDefaultAdditionalStatus,
  getDefaultCategoryFilter,
  periodPresetToDateRange,
} from '../types';

interface UseSearchFiltersProps {
  searchFilters: SearchFilters;
  onSearchFiltersChange: (filters: SearchFilters) => void;
  filterMode: FilterMode;
  isManagerMode: boolean;
}

export const useSearchFilters = ({
  searchFilters,
  onSearchFiltersChange,
  filterMode,
  isManagerMode,
}: UseSearchFiltersProps) => {
  const isAIResponseMode = filterMode === 'ai-response';
  const isUnassignedMode = filterMode === 'unassigned';
  const isStandardMode = filterMode === 'standard';

  // === 기간 필터 ===
  const handlePeriodChange = useCallback((period: PeriodFilter | null) => {
    onSearchFiltersChange({ ...searchFilters, searchPeriod: period });
  }, [searchFilters, onSearchFiltersChange]);

  // === 채널 필터 ===
  const handleChannelChange = useCallback((channelFilter: ChannelFilter) => {
    onSearchFiltersChange({ ...searchFilters, channelFilter });
  }, [searchFilters, onSearchFiltersChange]);

  // === 추가 상태 필터 ===
  const handleAdditionalStatusChange = useCallback((additionalStatus: AdditionalStatusFilter) => {
    onSearchFiltersChange({ ...searchFilters, additionalStatus });
  }, [searchFilters, onSearchFiltersChange]);

  // === 분류 필터 ===
  const handleCategoryChange = useCallback((categoryFilter: CategoryFilter) => {
    onSearchFiltersChange({ ...searchFilters, categoryFilter });
  }, [searchFilters, onSearchFiltersChange]);

  // === 상담사 필터 ===
  const handleConsultantChange = useCallback((consultant: string[] | null) => {
    onSearchFiltersChange({
      ...searchFilters,
      consultant: consultant && consultant.length > 0 ? consultant : null,
    });
  }, [searchFilters, onSearchFiltersChange]);

  // === 상태(Status) 필터 ===
  const handleStatusChange = useCallback((status: ContactStatus | null) => {
    onSearchFiltersChange({
      ...searchFilters,
      status: status ? [status] : null,
      consultant: (status === 'ai-response' || status === 'assignment-waiting')
        ? null : searchFilters.consultant,
    });
  }, [searchFilters, onSearchFiltersChange]);

  // === 개별 필터 해제 ===
  const clearPeriod = useCallback(() => {
    onSearchFiltersChange({ ...searchFilters, searchPeriod: null });
  }, [searchFilters, onSearchFiltersChange]);

  const clearChannel = useCallback(() => {
    onSearchFiltersChange({
      ...searchFilters,
      channelFilter: getDefaultChannelFilter(),
    });
  }, [searchFilters, onSearchFiltersChange]);

  const clearAdditionalStatus = useCallback(() => {
    onSearchFiltersChange({
      ...searchFilters,
      additionalStatus: getDefaultAdditionalStatus(),
    });
  }, [searchFilters, onSearchFiltersChange]);

  const clearCategory = useCallback(() => {
    onSearchFiltersChange({
      ...searchFilters,
      categoryFilter: getDefaultCategoryFilter(),
    });
  }, [searchFilters, onSearchFiltersChange]);

  const clearConsultant = useCallback(() => {
    onSearchFiltersChange({ ...searchFilters, consultant: null });
  }, [searchFilters, onSearchFiltersChange]);

  const clearStatus = useCallback(() => {
    onSearchFiltersChange({ ...searchFilters, status: null });
  }, [searchFilters, onSearchFiltersChange]);

  const clearPriority = useCallback(() => {
    onSearchFiltersChange({ ...searchFilters, priority: null });
  }, [searchFilters, onSearchFiltersChange]);

  const clearWaitingTime = useCallback(() => {
    onSearchFiltersChange({ ...searchFilters, waitingTime: null });
  }, [searchFilters, onSearchFiltersChange]);

  const clearFavorite = useCallback(() => {
    onSearchFiltersChange({ ...searchFilters, favorite: null });
  }, [searchFilters, onSearchFiltersChange]);

  const clearFlagFilter = useCallback(() => {
    onSearchFiltersChange({ ...searchFilters, flagFilter: null });
  }, [searchFilters, onSearchFiltersChange]);

  const clearTokenUsage = useCallback(() => {
    onSearchFiltersChange({ ...searchFilters, tokenUsage: null });
  }, [searchFilters, onSearchFiltersChange]);

  // === 전체 초기화 ===
  const resetAllFilters = useCallback(() => {
    const defaults = getDefaultSearchFilters();
    onSearchFiltersChange({
      ...defaults,
      consultant: isStandardMode && !isManagerMode ? '김상담' : null,
      status: isAIResponseMode ? ['ai-response'] : isUnassignedMode ? ['assignment-waiting'] : null,
    });
  }, [onSearchFiltersChange, isStandardMode, isManagerMode, isAIResponseMode, isUnassignedMode]);

  // === 활성 필터 수 계산 ===
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchFilters.consultant) count++;
    if (searchFilters.searchPeriod) count++;

    // 채널 필터: 기본값(전체)이 아니면 활성
    const cf = searchFilters.channelFilter;
    if (!(cf.chat.enabled && cf.phone.enabled && cf.chat.subChannels.length === 0 && cf.phone.subChannels.length === 0)) {
      count++;
    }

    // 분류 필터
    const cat = searchFilters.categoryFilter;
    if (cat.major.length > 0 || cat.middle.length > 0 || cat.minor.length > 0) count++;

    if (searchFilters.tag) count++;
    if (searchFilters.priority) count++;
    if (searchFilters.waitingTime) count++;
    if (searchFilters.status) count++;
    if (searchFilters.favorite) count++;
    if (searchFilters.flagFilter) count++;
    if (searchFilters.tokenUsage) count++;

    // 추가 상태 필터
    const as = searchFilters.additionalStatus;
    if (as.chatStatuses.length > 0 || as.phoneStatuses.length > 0) count++;

    return count;
  }, [searchFilters]);

  // === 기간 → 날짜 범위 변환 (필터링용) ===
  const effectiveDateRange = useMemo((): { start: string; end: string } | null => {
    if (!searchFilters.searchPeriod) return null;
    if (searchFilters.searchPeriod.preset) {
      return periodPresetToDateRange(searchFilters.searchPeriod.preset);
    }
    return searchFilters.searchPeriod.custom;
  }, [searchFilters.searchPeriod]);

  return {
    // 모드
    isAIResponseMode,
    isUnassignedMode,
    isStandardMode,

    // 변경 핸들러
    handlePeriodChange,
    handleChannelChange,
    handleAdditionalStatusChange,
    handleCategoryChange,
    handleConsultantChange,
    handleStatusChange,

    // 개별 해제
    clearPeriod,
    clearChannel,
    clearAdditionalStatus,
    clearCategory,
    clearConsultant,
    clearStatus,
    clearPriority,
    clearWaitingTime,
    clearFavorite,
    clearFlagFilter,
    clearTokenUsage,

    // 전체 초기화
    resetAllFilters,

    // 유틸
    activeFilterCount,
    effectiveDateRange,
  };
};
