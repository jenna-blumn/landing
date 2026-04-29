import featureDistributionImg from '@/assets/images/hcc/feature-distribution.png';
import featureImg from '@/assets/images/hcc/feature.png';
import featureChannelImg from '@/assets/images/hcc/feature-channel.png';
import dataStorageImg from '@/assets/images/hcc/why-data-storage.png';
import serverExpansionImg from '@/assets/images/hcc/why-server-expansion.png';
import legacyIntegrationImg from '@/assets/images/hcc/why-legacy-integration.png';

export interface FeatureCardData {
  image: string;
  alt: string;
  titles: string[];
  features: string[];
}

export const FEATURE_CARDS: FeatureCardData[] = [
  {
    image: featureDistributionImg.src,
    alt: '챗봇-상담원 간 상담배분으로 업무 효율 극대화',
    titles: ['챗봇-상담원 간 상담배분으로', '업무 효율 극대화'],
    features: [
      '챗봇 우선 상담을 통한 단순 문의 해결하고, 복잡하고 중요한 상담만 상담사 연결',
      '상담사는 기존의 챗봇 상담 내용을 조회 후 내용을 이어서 상담',
    ],
  },
  {
    image: featureImg.src,
    alt: '응대 성공률 97%',
    titles: ['응대 성공률 97%', '룰 베이스 시나리오'],
    features: [
      '챗봇 빌더를 통한 손쉬운 구성',
      '상담사 연결 없이 챗봇 내에서 스스로 문의를 신속히 해결',
      '고객의 다양한 조건별 맞춤형 시나리오 구성',
    ],
  },
  {
    image: featureChannelImg.src,
    alt: '메시징 기반 다양한 채널의 고객문의를 통합 관리',
    titles: ['메시징 기반 다양한 채널의', '고객문의를 통합 관리'],
    features: [
      '카카오톡, 네이버 톡톡 등의 인입도 해피톡 구축형 솔루션 하나로 통합 관리',
      'APP, WEB에 플로팅 버튼을 배치하여 다양한 인입채널 구성 가능',
    ],
  },
];

export interface WhyHCCCardData {
  id: string;
  image: string;
  title: string;
  description: string;
}

export const WHY_HCC_CARDS: WhyHCCCardData[] = [
  {
    id: 'data-storage',
    image: dataStorageImg.src,
    title: '안전하게 상담 데이터 저장',
    description:
      '고객사 소유의 클라우드에 저장되어 데이터 외부 유출 위험이 낮음',
  },
  {
    id: 'server-expansion',
    image: serverExpansionImg.src,
    title: '서버 설치 및 확장 용이',
    description:
      '별도의 서버 설치 비용이 발생하지 않으며 인프라 유지 보수 비용 부담 없음',
  },
  {
    id: 'legacy-integration',
    image: legacyIntegrationImg.src,
    title: '기존 레거시 연동',
    description: '기존 레거시 연동 및 유연한 커스터마이징 가능',
  },
];
