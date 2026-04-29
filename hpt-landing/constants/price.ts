/* ── Horizontal Card (무료 / 확장 서비스) ── */

export interface HorizontalCardData {
  title: string;
  description: string;
  features: string[];
}

export const FREE_PLAN: HorizontalCardData = {
  title: '무료',
  description: '부담없이 이용하는 기본 채팅',
  features: [
    '상담/조회 (최근 7일)',
    '다양한 채팅 채널 제공 (웹채팅, 카카오톡)',
    'SMS 인증, 상담 분류, 자동 종료 등 기본 기능 제공',
    'AI 에이전트 빌더 및 체험용 트래픽 제공',
  ],
};

export const ADDON_SERVICE: HorizontalCardData = {
  title: '확장 서비스',
  description: '추가 기능으로 상담 기능 확장',
  features: ['멀티 브랜드', '콜브릿지 (ARS+CTI)', '알림톡, 문자 발송'],
};

/* ── 유료 플랜 (스타터 / 프로 / 엔터프라이즈) ── */

export interface PaidPlanData {
  name: string;
  description: string;
  price: string;
  priceNote: string;
  baseText: string;
  badge?: string;
  features: string[];
}

export const PAID_PLANS: PaidPlanData[] = [
  {
    name: '스타터',
    description: '상담 운영을 시작하는 팀에 추천',
    price: '35,000',
    priceNote: '(계정당, VAT 별도)',
    baseText: '+ 기본 채팅 기능',
    features: [
      '채팅 채널 추가 제공 (네이버톡톡, 인스타그램)',
      '주문 정보 연동 (카페24, 스마트스토어 등)',
      '무제한 상담 응대, 상담 계정 추가',
      '기본 상담 통계 및 리포트 제공',
    ],
  },
  {
    name: '프로',
    description: '상담 운영 자동화가 필요한 팀에 추천',
    price: '85,000',
    priceNote: '(계정당, VAT 별도)',
    baseText: '+ 스타터의 모든 기능',
    badge: '추천',
    features: [
      '상담 자동 배정 (자동, 하이브리드)',
      '상담 팀 관리 (매니저 계정, 그룹별 관리)',
      '상담 상태별 다양한 자동 메시지',
      '상담 품질 통계 및 리포트 제공',
    ],
  },
  {
    name: '엔터프라이즈',
    description: '맞춤 상담 운영이 필요한 팀에 추천',
    price: '별도협의',
    priceNote: '(상담 계정 10개 이상 사용 기업)',
    baseText: '+ 프로의 모든 기능',
    features: [
      '서비스 커스터마이징 지원',
      'API 연동 지원',
      '자체 서비스 연동 (본인인증, 회원가입 등)',
      '결제 방식 선택 (카드 / 세금계산서)',
    ],
  },
];

/* ── 플랜 상세 요약 비교 (PlanDetailSection) ── */

export interface PlanDetailItem {
  name: string;
  description: string;
  price: string;
  includesText?: string;
  features: string[];
}

export const PLAN_DETAIL_ITEMS: PlanDetailItem[] = [
  {
    name: 'Free',
    description: '기본 상담 기능을 무료로 시작',
    price: '0',
    features: [
      '상담 응대/조회 (최근 7일)',
      '다양한 채팅 채널 제공 (웹채팅, 카카오톡)',
      '상담 분류, 자동 종료 등 기본 기능 제공',
      'SMS 인증 기능 제공',
      'AI 에이전트 빌더 및 체험용 트래픽 제공',
    ],
  },
  {
    name: 'Starter',
    description: '상담 운영을 시작하는 팀에 추천',
    price: '35,000',
    includesText: 'Free의 모든 기능 포함',
    features: [
      '채팅 채널 추가 제공 (네이버톡톡, 인스타그램)',
      '고객/주문 정보 연동 (cafe24, 스마트스토어 등)',
      '무제한 상담 응대, 상담 계정 추가',
      '기본 상담 통계 및 리포트 제공',
    ],
  },
  {
    name: 'Pro',
    description: '상담 운영 자동화가 필요한 팀에 추천',
    price: '85,000',
    includesText: 'Starter의 모든 기능 포함',
    features: [
      '상담 자동 배정 (자동/하이브리드)',
      '팀 관리 (매니저 계정, 그룹별 관리)',
      '상태별 다양한 자동 메시지',
      '상담 품질 통계 및 리포트 제공',
    ],
  },
];

export const ENTERPRISE_DETAIL_FEATURES: string[] = [
  '전용 API 및 시스템 연동 지원',
  '서비스 커스터마이징 및 확장 기능',
  '별도 요금 및 결제 방식(선불/후불) 선택',
];

/* ── 플랜별 상세 기능 비교표 ── */

export const PLAN_KEYS = ['free', 'starter', 'pro'] as const;

export type PlanValue = boolean | string;

export interface FeatureRow {
  label: string;
  free: PlanValue;
  starter: PlanValue;
  pro: PlanValue;
}

export interface CategoryData {
  category: string;
  features: FeatureRow[];
}

export const PLAN_DATA: CategoryData[] = [
  {
    category: '채팅 채널 연동',
    features: [
      {
        label: '기본 채널 (웹채팅, 카카오톡)',
        free: true,
        starter: true,
        pro: true,
      },
      {
        label: '확장 채널 (네이버톡톡, 인스타그램)',
        free: false,
        starter: true,
        pro: true,
      },
    ],
  },
  {
    category: 'AI / 워크플로우',
    features: [
      {
        label: '워크플로우 빌더 (챗봇, AI 에이전트)',
        free: true,
        starter: true,
        pro: true,
      },
      {
        label: '채널/조건별 멀티 에이전트 구성',
        free: true,
        starter: true,
        pro: true,
      },
      {
        label: '지식베이스 활용',
        free: true,
        starter: true,
        pro: true,
      },
      {
        label: 'AI 에이전트 자동 답변',
        free: true,
        starter: true,
        pro: true,
      },
    ],
  },
  {
    category: '운영 연동',
    features: [
      {
        label: '고객 정보 조회',
        free: true,
        starter: true,
        pro: true,
      },
      {
        label: '주문 및 배송 정보조회\n(스마트스토어, 카페24 등)',
        free: false,
        starter: true,
        pro: true,
      },
      {
        label: '고객 태그 관리',
        free: false,
        starter: true,
        pro: true,
      },
    ],
  },
  {
    category: '팀 / 조직 관리',
    features: [
      {
        label: '상담사 계정 추가',
        free: false,
        starter: true,
        pro: true,
      },
      {
        label: '상담사 변경',
        free: false,
        starter: true,
        pro: true,
      },
      {
        label: '매니저 계정 추가',
        free: false,
        starter: false,
        pro: true,
      },
      {
        label: '상담 그룹 단위 관리',
        free: false,
        starter: false,
        pro: true,
      },
    ],
  },
  {
    category: '통계 / 운영 고도화',
    features: [
      {
        label: '기간별 통계',
        free: false,
        starter: true,
        pro: true,
      },
      {
        label: '상담사별 통계',
        free: false,
        starter: true,
        pro: true,
      },
      {
        label: '상담 품질 통계 및 상담 평가',
        free: false,
        starter: false,
        pro: true,
      },
      {
        label: '상담내역 조회/다운로드',
        free: false,
        starter: false,
        pro: true,
      },
      {
        label: '통계 리포트/데이터 다운로드',
        free: false,
        starter: true,
        pro: true,
      },
    ],
  },
  {
    category: '자동화',
    features: [
      {
        label: '시스템 자동/하이브리드 배분',
        free: false,
        starter: false,
        pro: true,
      },
      {
        label: 'Busy Time 안내',
        free: false,
        starter: false,
        pro: true,
      },
      {
        label: '상담 대기 인원 안내',
        free: false,
        starter: false,
        pro: true,
      },
      {
        label: '상담 건수 초과 안내',
        free: false,
        starter: false,
        pro: true,
      },
    ],
  },
  {
    category: '브랜딩',
    features: [
      {
        label: '회사 로고 사용',
        free: false,
        starter: true,
        pro: true,
      },
      {
        label: '웹채팅 고객화면 기능/디자인 커스텀',
        free: false,
        starter: true,
        pro: true,
      },
    ],
  },
];
