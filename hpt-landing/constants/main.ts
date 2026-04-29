import {
  ChatMessage,
  ExperienceTab,
  ExperienceTabItem,
  ReviewItem,
} from '@/models/main';
import AdminExperience from '@/assets/images/experience-admin.png';
import ManagerExperience from '@/assets/images/experience-manager.png';
import CounselorExperience from '@/assets/images/experience-counselor.png';

import ReviewOliveYoung from '@/assets/images/review-oliveyoung.png';
import ReviewToss from '@/assets/images/review-toss.png';
import ReviewMusinsa from '@/assets/images/review-musinsa.png';
import ReviewMusinsaLogo from '@/assets/images/review-musinsa-logo.png';
import ReviewTossLogo from '@/assets/images/review-toss-logo.png';
import ReviewOliveYoungLogo from '@/assets/images/review-oliveyoung-logo.png';

export const EXPERIENCE_TABS: ExperienceTabItem[] = [
  {
    id: ExperienceTab.ADMIN,
    label: '운영자',
    image: AdminExperience,
    title: '비용과 리스크를 최소한으로',
    points: [
      '해피톡 AI를 통한 자동 상담으로 운영 리소스 최소화',
      '다양한 서비스 연동으로 상담 운영 일원화 ',
      '철저한 보안 관리로 안전한 채팅 상담',
    ],
  },
  {
    id: ExperienceTab.MANAGER,
    label: '관리자',
    image: ManagerExperience,
    title: '복잡한 관리 업무도 편리하게',

    points: [
      '통합 대시보드에서 모든 채널의 상담 현황 실시간 모니터링',
      '이전 상담 다 읽을 필요 없이 AI 상담 요약으로 한눈에 파악',
      '체계화된 템플릿과 AI 말투 교정으로 일관된 상담 품질 제공 가능',
    ],
  },
  {
    id: ExperienceTab.COUNSELOR,
    label: '상담사',
    image: CounselorExperience,
    title: '상담의 본질에만 집중할 수 있게',

    points: [
      '여러 채널에서 인입되는 상담을 동시에 처리',
      '과거 상담 이력, 주문 정보를 한 화면에서 확인하여 체계적인 상담 가능',
      'AI 어시스턴트가 요약부터 후처리까지 한번에',
    ],
  },
];

export const EXPERIENCE_TAB_LABELS = {
  [ExperienceTab.ADMIN]: '운영자',
  [ExperienceTab.MANAGER]: '관리자',
  [ExperienceTab.COUNSELOR]: '상담사',
};

export const REVIEW_ITEMS: ReviewItem[] = [
  {
    id: 'oliveyoung',
    image: ReviewOliveYoung,
    logo: ReviewOliveYoungLogo,
    company: '올리브영',
    review:
      '하루 동안 접수된 고객 문의들을 분석해보니 단순 문의에 해당하는 FAQ 비율은 80%에 달했는데요. 이를 챗봇으로 해결했더니 상담사 리소스는 상담의 20%만 필요하게 되었어요.해피톡 AI를 통해 90%까지 자동화하는게 목표입니다.',
  },
  {
    id: 'toss',
    image: ReviewToss,
    logo: ReviewTossLogo,
    company: '토스',
    review:
      '챗봇을 도입 이후 한 달 만에 상담사에게 접수되는 상담량은 월평균 30% 감소했습니다. 이로 인해 상담사들이 한 고객에게 사용할 수 있는 시간적 여유가 생겨 고객서비스 질이 상승했어요.',
  },
  {
    id: 'musinsa',
    image: ReviewMusinsa,
    logo: ReviewMusinsaLogo,
    company: '무신사',
    review:
      'SaaS 솔루션임에도 불구하고 저희가 원하는 대로 커스터마이징 할 수 있어 해피톡을 택했습니다. IVR 시나리오 커스텀을 통해 성수기 고객센터 상담 연결 포기율이 5~10% 감소했습니다.',
  },
];

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    isUser: true,
    message: '안녕하세요, 상품 반품하고 싶어요!',
  },
  {
    id: 'msg-2',
    isUser: false,
    message:
      '반품 가능 여부 확인을 도와드릴게요 😊\n\n휴대폰 번호 뒷자리 4자리를 입력해주세요.',
  },
  {
    id: 'msg-3',
    isUser: true,
    message: '7712 입니다.',
  },
  {
    id: 'msg-4',
    isUser: false,
    message:
      '주문 확인되었습니다.\n\n📦 주문번호 20260202-1451\n\n• 상품: 후드 집업\n• 배송 완료일: 3일 전\n\n현재 반품 신청이 가능한 기간입니다.',
  },
  {
    id: 'msg-5',
    isUser: true,
    message: '반품 신청 부탁드려요!',
  },
  {
    id: 'msg-6',
    isUser: false,
    message:
      '반품 사유를 선택해주세요.\n\n① 단순 변심\n② 상품 불량\n③ 오배송\n④ 기타',
  },
  {
    id: 'msg-7',
    isUser: true,
    message: '1번 단순 변심이에요~',
  },
  {
    id: 'msg-8',
    isUser: false,
    message:
      '단순 변심 반품은 왕복 배송비 6,000원이 발생합니다.\n\n동의하시면 반품 접수를 진행할게요.',
  },
  {
    id: 'msg-9',
    isUser: true,
    message: '네 괜찮아요, 진행해주세요!',
  },
  {
    id: 'msg-10',
    isUser: false,
    message:
      '반품 접수를 진행 중입니다…\n\n수거 요청이 완료되었습니다 😊\n택배 기사 방문 예정입니다.',
  },
  {
    id: 'msg-11',
    isUser: true,
    message: '아 근데 택을 이미 제거했는데 괜찮을까요?',
  },
  {
    id: 'msg-12',
    isUser: false,
    message:
      '상품 상태 확인이 필요한 상황입니다.\n반품 가능 여부 판단을 위해 상담사 연결을 도와드릴게요. 잠시만 기다려 주세요.',
  },
];
