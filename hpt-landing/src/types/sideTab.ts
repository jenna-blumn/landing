export type SideTabDisplayMode = 'drawer';

export interface OmsConnectionConfig {
  apiKey: string;
  apiSecret: string;
  storeId: string;
  apiEndpoint: string;
  syncInterval: number;
}

export interface OmsInfo {
  id: string;
  name: string;
  defaultEndpoint: string;
}

export interface SideTabConfig {
  id: number;
  tabId: string | null;
  linkedOmsId: string | null;
  omsConfig: OmsConnectionConfig | null;
  isVisible: boolean;
  displayMode: SideTabDisplayMode;
  width: number;
  color: string;
}

export const DEFAULT_SIDE_TAB_WIDTH = 350;
export const MIN_SIDE_TABS = 0;
export const MAX_SIDE_TABS = 5;

export const SIDE_TAB_COLORS = [
  { name: 'Orange', value: '#FF6B35', light: '#FFB59A' },
  { name: 'Teal', value: '#00B4D8', light: '#90E0EF' },
  { name: 'Pink', value: '#FF006E', light: '#FF66A3' },
  { name: 'Yellow', value: '#FFB703', light: '#FFD670' },
  { name: 'Green', value: '#06D6A0', light: '#7EECD0' },
];

export const OMS_LIST: OmsInfo[] = [
  { id: 'cafe24', name: 'Cafe24', defaultEndpoint: 'https://api.cafe24.com/v1' },
  { id: 'naver-smartstore', name: '네이버 스마트스토어', defaultEndpoint: 'https://api.commerce.naver.com/v1' },
  { id: 'ezadmin', name: '이지어드민', defaultEndpoint: 'https://api.ezadmin.co.kr/v1' },
  { id: 'sellmate', name: '셀메이트', defaultEndpoint: 'https://api.sellmate.co.kr/v1' },
];

export const SYNC_INTERVAL_OPTIONS = [
  { value: 5, label: '5분' },
  { value: 10, label: '10분' },
  { value: 15, label: '15분' },
  { value: 30, label: '30분' },
  { value: 60, label: '1시간' },
];
