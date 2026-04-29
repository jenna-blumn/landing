export interface SectionConfig {
  id: string;
  name: string;
  type: 'customer-info' | 'customer-memo' | 'customer-tag' | 'custom';
  order: number;
  isCollapsed: boolean;
  visibleFields?: string[];
  apiSettings?: {
    endpoint: string;
    method: 'GET' | 'POST';
    isAutoRefresh: boolean;
    refreshInterval: number;
    useDefault?: boolean;
  };
}

export interface CustomerInfo {
  name: string;
  phone?: string;
  email: string;
  birthDate?: string;
  address?: string;
  customerId: string;
  company?: string;
  gender?: string;
  status?: string;
  lastConsultation?: string;
  isBlocked?: boolean;
  blockedReason?: string;
  blockedAt?: string;
  blockedBy?: string;
}

export interface BlockStatus {
  customerId: string;
  isBlocked: boolean;
  reason: string;
  blockedAt: string;
  blockedBy: string;
}

export interface Memo {
  id: number;
  content: string;
  author: string;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  createdBy: string;
  createdAt: string;
}

export type CustomerTagItemId = 'customer-tags' | 'customer-grade';

export interface CustomerGradeOption {
  id: string;
  label: string;
  color: string;
  textColor: string;
  order: number;
}

export interface CustomSection {
  section: SectionConfig;
  renderContent: (data?: CustomerInfo) => React.ReactNode;
}

export interface FieldDefinition {
  id: string;
  label: string;
  value: string | number;
  color?: string;
  category: 'basic' | 'contact' | 'address' | 'system' | 'activity' | 'other';
}

export interface CustomerInfoTabProps {
  customerData?: CustomerInfo;
  sections?: SectionConfig[];
  customSections?: CustomSection[];
  isManagerMode?: boolean;

  visibleFields?: Set<string>;
  onToggleFieldVisibility?: (fieldId: string) => void;
  columnSettings?: Set<string>;
  onToggleColumnSetting?: (fieldId: string) => void;

  memos?: Memo[];
  onAddMemo?: (content: string) => void;
  onEditMemo?: (memoId: number, newContent: string) => void;
  onDeleteMemo?: (memoId: number) => void;

  tags?: Tag[];
  onAddTag?: (name: string, color: string) => void;
  onEditTag?: (tagId: number, newName: string, newColor: string) => void;
  onDeleteTag?: (tagId: number) => void;

  // 고객 태그 항목 표시 설정
  customerTagVisibility?: Set<CustomerTagItemId>;
  onToggleCustomerTagVisibility?: (itemId: CustomerTagItemId) => void;
  customerTagAllItems?: CustomerTagItemId[];

  // 고객 등급
  customerGrade?: string;
  onChangeCustomerGrade?: (gradeId: string) => void;
  gradeOptions?: CustomerGradeOption[];

  customerInfoRenderer?: (data: CustomerInfo, props: Record<string, unknown>) => React.ReactNode;
  customerMemoRenderer?: (memos: Memo[], handlers: Record<string, unknown>) => React.ReactNode;
  customerTagRenderer?: (tags: Tag[], handlers: Record<string, unknown>) => React.ReactNode;

  isCustomerInfoOverlayOpen?: boolean;
  onToggleCustomerInfoOverlay?: (open: boolean) => void;

  onSectionReorder?: (sections: SectionConfig[]) => void;

  apiSettings?: {
    [sectionId: string]: SectionConfig['apiSettings'];
  };

  className?: string;
  sectionClassName?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export const SECTION_TYPES = {
  CUSTOMER_INFO: 'customer-info',
  CUSTOMER_MEMO: 'customer-memo',
  CUSTOMER_TAG: 'customer-tag',
  CUSTOM: 'custom',
} as const;

export const DEFAULT_SECTIONS: SectionConfig[] = [
  {
    id: 'customer-info',
    name: '고객 정보',
    type: 'customer-info',
    order: 0,
    isCollapsed: false,
    apiSettings: {
      endpoint: '',
      method: 'GET',
      isAutoRefresh: false,
      refreshInterval: 5,
    },
  },
  {
    id: 'customer-memo',
    name: '고객 메모',
    type: 'customer-memo',
    order: 1,
    isCollapsed: false,
    apiSettings: {
      endpoint: '',
      method: 'GET',
      isAutoRefresh: false,
      refreshInterval: 5,
    },
  },
  {
    id: 'customer-tag',
    name: '고객 태그',
    type: 'customer-tag',
    order: 2,
    isCollapsed: false,
    apiSettings: {
      endpoint: '',
      method: 'GET',
      isAutoRefresh: false,
      refreshInterval: 5,
    },
  },
];
