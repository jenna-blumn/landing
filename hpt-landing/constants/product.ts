import FlowCard1 from '@/assets/images/flow/flow-card-1.png';
import FlowCard2 from '@/assets/images/flow/flow-card-2.png';
import FlowCard3 from '@/assets/images/flow/flow-card-3.png';
import FlowCard4 from '@/assets/images/flow/flow-card-4.png';
import FlowCard5 from '@/assets/images/flow/flow-card-5.png';
import FlowCard6 from '@/assets/images/flow/flow-card-6.png';

import FlowCardMobile1 from '@/assets/images/flow/flow-card_mobile-1.png';
import FlowCardMobile2 from '@/assets/images/flow/flow-card_mobile-2.png';
import FlowCardMobile3 from '@/assets/images/flow/flow-card_mobile-3.png';
import FlowCardMobile4 from '@/assets/images/flow/flow-card_mobile-4.png';
import FlowCardMobile5 from '@/assets/images/flow/flow-card_mobile-5.png';
import FlowCardMobile6 from '@/assets/images/flow/flow-card_mobile-6.png';

export const SOLUTION_CARDS = [
  {
    id: 1,
    title: '채팅 상담',
    description:
      '여러 채널의 문의를 한 화면에서 관리하고,\n고객 데이터까지 한눈에 확인하세요.',
    isWhiteCard: false,
    image: FlowCard1.src,
    imageMobile: FlowCardMobile1.src,
  },
  {
    id: 2,
    title: 'AI 워크플로우',
    description:
      '단순 문의는 AI 워크플로우로 해결하여\n비용과 리스크를 효과적으로 줄일 수 있어요.',
    isWhiteCard: false,
    image: FlowCard2.src,
    imageMobile: FlowCardMobile2.src,
  },
  {
    id: 3,
    title: 'AI 어시스턴트',
    description:
      '상담의 본질에만 집중할 수 있게 요약부터 후처리,\n상담 품질 개선까지 도와드려요.',
    isWhiteCard: true,
    image: FlowCard3.src,
    imageMobile: FlowCardMobile3.src,
  },
  {
    id: 4,
    title: '알림톡 비즈메시지',
    description:
      '주문, 결제, 배송 등 고객에게 꼭 필요한 소식을 카카오톡으로 바로 전달하세요.',
    isWhiteCard: true,
    image: FlowCard4.src,
    imageMobile: FlowCardMobile4.src,
  },
  {
    id: 5,
    title: 'AI ARS 콜브릿지 연동',
    description:
      '콜브릿지를 연동하여 AI 전화 상담과 실시간 STT를 이용해보세요.',
    isWhiteCard: true,
    image: FlowCard5.src,
    imageMobile: FlowCardMobile5.src,
  },
  {
    id: 6,
    title: '커스텀 기능',
    description:
      '추가로 필요한 기능은 언제든 문의주세요.\n기업별 맞춤 솔루션을 구축해드립니다.',
    isWhiteCard: true,
    image: FlowCard6.src,
    imageMobile: FlowCardMobile6.src,
  },
];

export const STATS = [
  {
    number: '1억 \n2천만+',
    title: '누적 채팅방 수',
    description: '스케일이 다른 채팅 상담 처리량',
  },
  {
    number: '97.9%',
    title: '챗봇 처리율',
    description: '웹으로 인입된 채팅은 챗봇이 알아서',
  },
  {
    number: '1401일',
    title: '평균 가입일',
    description: '해피톡과 함께한 긴 인연은 신뢰로부터',
  },
];

export const STATS_GRADIENT_COLORS = ['#19C257', '#3676FF', '#003CBD'];

export const STATS_FOOTNOTE = '2026년 1월 20일 기준';

export const CTA_BADGES = ['14일 무료체험', '가입 즉시 상담 시작', '합리적인 플랜'];
