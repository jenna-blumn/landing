export type CompositeCardId =
  | 'info.customer-info'
  | 'info.customer-memo'
  | 'info.customer-tag'
  | 'contact.classification-tags'
  | 'contact.consultation-info'
  | 'contact.notes-special'
  | 'history.consultation-history'
  | 'history.activity-log';

export const COMPOSITE_CARD_CATALOG: { id: CompositeCardId; label: string; group: string }[] = [
  { id: 'info.customer-info', label: '고객 정보', group: '고객' },
  { id: 'info.customer-memo', label: '고객 메모', group: '고객' },
  { id: 'info.customer-tag', label: '고객 태그', group: '고객' },
  { id: 'contact.consultation-info', label: '상담 정보', group: 'Contact' },
  { id: 'contact.classification-tags', label: '분류/태그', group: 'Contact' },
  { id: 'contact.notes-special', label: '메모/특이사항', group: 'Contact' },
  { id: 'history.consultation-history', label: '상담 이력', group: 'History' },
  { id: 'history.activity-log', label: '활동 로그', group: 'History' },
];

export const COMPOSITE_TAB_ID = 'custom-composite';

export interface CompositeTabSettings {
  enabled: boolean;
  tabId: string;
  name: string;
  cardOrder: CompositeCardId[];
}


export interface ReferenceTabConfig {
  id: string;
  name: string;
  order: number;
  leftSecondary: boolean;
  mainReference: boolean;
  rightSecondary: boolean;
  sideTabSlotId: number | null;
  isCustom: boolean;
  customTabKind?: 'generic' | 'composite';
}

export interface OmsReferenceConfig {
  id: string;
  name: string;
  sideTabSlotId: number | null;
}

export interface TaskButtonSettings {
  displayMode: 'floating' | 'fixed' | 'gnb' | 'rnb' | 'sidebar-fixed';
  fixedDrawerHeight: number;
}

export interface ReferenceSettings {
  tabs: ReferenceTabConfig[];
  omsList: OmsReferenceConfig[];
  rnbVisible: boolean;
  taskButton?: TaskButtonSettings;
  compositeTab: CompositeTabSettings;
}

export const isTabVisible = (tab: ReferenceTabConfig): boolean => {
  return tab.mainReference || tab.leftSecondary || tab.rightSecondary || tab.sideTabSlotId !== null;
};

export const isTabInMainReference = (tab: ReferenceTabConfig): boolean => {
  return tab.mainReference;
};

export const DEFAULT_COMPOSITE_TAB: CompositeTabSettings = {
  enabled: false,
  tabId: COMPOSITE_TAB_ID,
  name: '맞춤',
  cardOrder: [],
};

export const DEFAULT_TABS: ReferenceTabConfig[] = [
  { id: 'info', name: '고객', order: 0, leftSecondary: false, mainReference: true, rightSecondary: false, sideTabSlotId: null, isCustom: false },
  { id: 'contact', name: '컨택', order: 1, leftSecondary: false, mainReference: true, rightSecondary: false, sideTabSlotId: null, isCustom: false },
  { id: 'integration', name: '연동', order: 2, leftSecondary: false, mainReference: true, rightSecondary: false, sideTabSlotId: null, isCustom: false },
  { id: 'assistant', name: 'Assistant', order: 3, leftSecondary: false, mainReference: true, rightSecondary: false, sideTabSlotId: null, isCustom: false },
  { id: 'history', name: 'History', order: 4, leftSecondary: false, mainReference: true, rightSecondary: false, sideTabSlotId: null, isCustom: false },
];

export const DEFAULT_OMS_LIST: OmsReferenceConfig[] = [
  { id: 'cafe24', name: '카페24', sideTabSlotId: null },
  { id: 'naver-smartstore', name: '네이버 스마트스토어', sideTabSlotId: null },
  { id: 'ezadmin', name: '이지어드민', sideTabSlotId: null },
  { id: 'sellmate', name: '셀메이트', sideTabSlotId: null },
];
