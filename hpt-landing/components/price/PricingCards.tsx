'use client';

import styles from './PricingCards.style';

interface Plan {
  name: string;
  price: string;
  unit: string;
  description: string;
  badge: string | null;
  highlight: boolean;
  features: string[];
  cta: string;
  ctaHref: string;
  subtext: string;
}

const PLANS: Plan[] = [
  {
    name: 'Free',
    price: '0',
    unit: '원',
    description: '상담 운영을 처음 시작하는 팀에 추천',
    badge: null,
    highlight: false,
    features: [
      '최근 상담 내역 확인 (7일)',
      '웹채팅 · 카카오톡 기본 채널 제공',
      '상담 분류 및 기본 자동화 기능 제공',
      'AI 기능 체험 및 테스트 환경 제공',
    ],
    cta: '시작하기',
    ctaHref: 'https://counselor.happytalk.io/auth/join',
    subtext: '계정 1개 제공',
  },
  {
    name: 'Starter',
    price: '35,000',
    unit: '원/월',
    description: '상담 운영을 확장하는 팀에 추천',
    badge: null,
    highlight: false,
    features: [
      '+ Free의 모든 기능',
      '채팅 채널 추가(네이버톡톡, 인스타그램)',
      '주문 정보 연동(카페 24, 스마트스토어)',
      '무제한 상담 응대, 상담 계정 추가',
      '기본 상담 통계 및 리포트',
    ],
    cta: '시작하기',
    ctaHref: 'https://counselor.happytalk.io/auth/join',
    subtext: '계정당, VAT 별도',
  },
  {
    name: 'Pro',
    price: '85,000',
    unit: '원/월',
    description: '상담 운영 자동화가 필요한 팀에 추천',
    badge: '추천',
    highlight: true,
    features: [
      '+ Starter의 모든 기능',
      '상담 자동 배정(자동/하이브리드 배정)',
      '상담 팀 관리(매니저 계정, 그룹별 관리)',
      '상담 상태별 다양한 자동 메시지',
      '상담 품질 통계 및 리포트',
    ],
    cta: '시작하기',
    ctaHref: 'https://counselor.happytalk.io/auth/join',
    subtext: '계정당, VAT 별도',
  },
];

const CheckIcon = () => (
  <svg
    css={styles.checkIcon()}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default function PricingCards() {
  return (
    <div css={styles.container}>
      <div css={styles.grid}>
        {PLANS.map((plan) => (
          <div key={plan.name} css={styles.card(plan.highlight)}>
            {plan.badge && (
              <div css={styles.badgeWrap}>
                <span css={styles.badge}>{plan.badge}</span>
              </div>
            )}

            <div css={styles.cardHeader}>
              <h3 css={styles.planName(plan.highlight)}>{plan.name}</h3>
              <div css={styles.priceRow}>
                <span css={styles.price()}>{plan.price}</span>
                <span css={styles.unit()}>{plan.unit}</span>
              </div>
              <p css={styles.subtext()}>{plan.subtext}</p>
              <p css={styles.description()}>{plan.description}</p>
            </div>

            <ul css={styles.features}>
              {plan.features.map((feature) => {
                const isInherited = feature.startsWith('+ ');
                return (
                  <li key={feature} css={styles.featureItem}>
                    {isInherited ? (
                      <span css={styles.iconSpacer} />
                    ) : (
                      <CheckIcon />
                    )}
                    <span
                      css={styles.featureText(plan.highlight, isInherited)}
                    >
                      {feature}
                    </span>
                  </li>
                );
              })}
            </ul>

            <a
              href={plan.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              css={styles.cta(plan.highlight)}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      <p css={styles.note}>
        모든 플랜은 14일 동안 프로 플랜의 모든 기능을 무료로 체험할 수 있습니다.
      </p>
    </div>
  );
}
