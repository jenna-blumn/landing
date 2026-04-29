import type { Channel } from '../../types/channel';

// === 상태 타입 ===
export type ContactStatus = 'ai-response' | 'assignment-waiting' | 'responding' | 'closed';

// === 채널 필터 타입 ===
export type ChatSubChannel = 'webchat' | 'kakao' | 'naver' | 'instagram' | 'sms';

export interface ChannelFilter {
  chat: { enabled: boolean; subChannels: ChatSubChannel[] };
  phone: { enabled: boolean; subChannels: string[] }; // 전화번호 목록
}

// 목업 전화번호 데이터
export const MOCK_PHONE_NUMBERS = [
  { value: '1588-1234', label: '1588-1234 (대표)' },
  { value: '02-1234-5678', label: '02-1234-5678 (서울)' },
  { value: '031-987-6543', label: '031-987-6543 (경기)' },
];

export const CHAT_SUB_CHANNEL_OPTIONS: Array<{ value: ChatSubChannel; label: string }> = [
  { value: 'webchat', label: '웹챗' },
  { value: 'kakao', label: '카카오톡' },
  { value: 'naver', label: '네이버톡톡' },
  { value: 'instagram', label: '인스타그램' },
  { value: 'sms', label: '문자' },
];

// === 추가 상태 필터 타입 ===
export type ChatAdditionalStatus = 'received' | 'maintain' | 'request';
export type PhoneAdditionalStatus = 'callback' | 'absent';

export interface AdditionalStatusFilter {
  chatStatuses: ChatAdditionalStatus[];
  phoneStatuses: PhoneAdditionalStatus[];
}

export const CHAT_STATUS_OPTIONS: Array<{ value: ChatAdditionalStatus; label: string }> = [
  { value: 'received', label: '접수' },
  { value: 'maintain', label: '유지' },
  { value: 'request', label: '요청' },
];

export const PHONE_STATUS_OPTIONS: Array<{ value: PhoneAdditionalStatus; label: string }> = [
  { value: 'callback', label: '콜백' },
  { value: 'absent', label: '부재' },
];

// 레거시 호환용 (기존 코드에서 사용)
export type AdditionalAttribute = 'alarm' | 'maintain' | 'request';

// === 기간 필터 타입 ===
export type PeriodPreset = 'today' | 'yesterday' | '1week' | '1month' | '3months' | '6months' | '1year';

export interface PeriodFilter {
  preset: PeriodPreset | null;
  custom: { start: string; end: string } | null;
}

export const PERIOD_PRESET_OPTIONS: Array<{ value: PeriodPreset; label: string }> = [
  { value: 'today', label: '오늘' },
  { value: 'yesterday', label: '어제' },
  { value: '1week', label: '1주일' },
  { value: '1month', label: '1개월' },
  { value: '3months', label: '3개월' },
  { value: '6months', label: '6개월' },
  { value: '1year', label: '1년' },
];

// === 분류 필터 타입 ===
export interface CategoryFilter {
  major: string[];   // 대분류
  middle: string[];  // 중분류
  minor: string[];   // 소분류
}

// === 검색 필터 메인 인터페이스 ===
export interface SearchFilters {
  consultant: string | string[] | null;
  searchPeriod: PeriodFilter | null;
  channelFilter: ChannelFilter;
  categoryFilter: CategoryFilter;
  tag: string | null;
  priority: 'vip' | 'flag' | 'all' | null;
  waitingTime: { min: number; max: number } | null;
  status: ContactStatus[] | null; // 멀티 선택 가능하도록 배열로 변경
  favorite: boolean | null;
  flagFilter: string | null;
  tokenUsage: { min: number; max: number } | null;
  additionalStatus: AdditionalStatusFilter;
}

// === 검색 결과 ===
export interface SearchResult {
  id: number;
  contactName: string;
  consultantName: string;
  brand: string;
  company: string;
  conversationTopic: string;
  lastMessage: string;
  summary: string | null;
  isVIP: boolean;
  isFavorite: boolean;
  tokenUsage: number | null;
  flag: {
    type: 'urgent' | 'important' | 'normal' | 'info' | 'completed' | null;
    color: string;
    label: string;
  } | null;
  waitingSince: number;
  elapsedTime: number | null;
  lastActivity: string;
  lastActivityTimestamp: number;
  channel: string;
  status: 'active' | 'waiting' | 'closed';
  startTime: string;
  tags: string[];
  messages: Array<{
    id: number;
    sender: 'customer' | 'agent';
    text: string;
    time: string;
  }>;
}

// === 필터 유형 ===
export type FilterType =
  | 'all'
  | 'consultant'
  | 'searchPeriod'
  | 'channel'
  | 'categoryMajor'
  | 'categoryMiddle'
  | 'categoryMinor'
  | 'tag'
  | 'priority'
  | 'waitingTime'
  | 'status'
  | 'favorite'
  | 'flagFilter'
  | 'tokenUsage'
  | 'additionalStatus';

export type SortOption = 'relevance' | 'newest' | 'oldest';

export type FilterMode = 'standard' | 'ai-response' | 'unassigned';

export interface SearchModeSnapshot {
  isSidebarCollapsed: boolean;
  selectedMainCategory: 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
  selectedAdditionalCategory: 'request' | 'maintain' | null;
  selectedQueueType: 'ai-response' | 'queue-waiting' | null;
  selectedChannel: Channel;
  selectedBrands: string[];
  selectedRoomId: number | null;
  filterMode: FilterMode;
}

// === 기본값 팩토리 ===
export const getDefaultChannelFilter = (selectedChannel?: 'all' | 'chat' | 'phone' | 'board' | 'email'): ChannelFilter => {
  const channel = selectedChannel || 'all';

  // board와 email은 비동기 텍스트 채널이므로 chat으로 분류
  const isChatChannel = channel === 'chat' || channel === 'board' || channel === 'email';

  return {
    chat: {
      enabled: channel === 'all' || isChatChannel,
      subChannels: [], // 빈 배열 = 전체
    },
    phone: {
      enabled: channel === 'all' || channel === 'phone',
      subChannels: [], // 빈 배열 = 전체
    },
  };
};

export const getDefaultAdditionalStatus = (): AdditionalStatusFilter => ({
  chatStatuses: [],
  phoneStatuses: [],
});

export const getDefaultCategoryFilter = (): CategoryFilter => ({
  major: [],   // 빈 배열 = 전체
  middle: [],
  minor: [],
});

export const getDefaultSearchFilters = (selectedChannel?: 'all' | 'chat' | 'phone' | 'board' | 'email'): SearchFilters => ({
  consultant: null,
  searchPeriod: null,
  channelFilter: getDefaultChannelFilter(selectedChannel),
  categoryFilter: getDefaultCategoryFilter(),
  tag: null,
  priority: null,
  waitingTime: null,
  status: null,
  favorite: null,
  flagFilter: null,
  tokenUsage: null,
  additionalStatus: getDefaultAdditionalStatus(),
});

// === 기간 프리셋 → 날짜 범위 변환 유틸 ===
export const periodPresetToDateRange = (preset: PeriodPreset): { start: string; end: string } => {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  let start: Date;

  switch (preset) {
    case 'today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      break;
    case 'yesterday':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      break;
    case '1week':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0);
      break;
    case '1month':
      start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 0, 0, 0);
      break;
    case '3months':
      start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate(), 0, 0, 0);
      break;
    case '6months':
      start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate(), 0, 0, 0);
      break;
    case '1year':
      start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), 0, 0, 0);
      break;
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};
