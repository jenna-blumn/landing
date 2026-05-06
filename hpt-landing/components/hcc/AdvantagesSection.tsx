'use client';

import styles from './AdvantagesSection.style';

const IconGradient = ({ id }: { id: string }) => (
  <defs>
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="oklch(54.6% 0.245 262.881)" />
      <stop offset="100%" stopColor="#18181b" />
    </linearGradient>
  </defs>
);

const STROKE_PROPS = {
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const FinanceIcon = () => (
  <svg viewBox="0 0 24 24">
    <IconGradient id="hccAdvGrad1" />
    <path
      {...STROKE_PROPS}
      stroke="url(#hccAdvGrad1)"
      d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
    />
  </svg>
);

const FileTextIcon = () => (
  <svg viewBox="0 0 24 24">
    <IconGradient id="hccAdvGrad2" />
    <g {...STROKE_PROPS} stroke="url(#hccAdvGrad2)">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </g>
  </svg>
);

const HeadsetIcon = () => (
  <svg viewBox="0 0 24 24">
    <IconGradient id="hccAdvGrad3" />
    <path
      {...STROKE_PROPS}
      stroke="url(#hccAdvGrad3)"
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
    />
  </svg>
);

const TripleUserIcon = () => (
  <svg viewBox="0 0 24 24">
    <IconGradient id="hccAdvGrad4" />
    <g {...STROKE_PROPS} stroke="url(#hccAdvGrad4)">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </g>
  </svg>
);

const SmartphoneIcon = () => (
  <svg viewBox="0 0 24 24">
    <IconGradient id="hccAdvGrad5" />
    <g {...STROKE_PROPS} stroke="url(#hccAdvGrad5)">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </g>
  </svg>
);

const BotIcon = () => (
  <svg viewBox="0 0 24 24">
    <IconGradient id="hccAdvGrad6" />
    <g {...STROKE_PROPS} stroke="url(#hccAdvGrad6)">
      <path d="M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z" />
      <circle cx="12" cy="13" r="2" />
      <path d="M7 13h1M16 13h1" />
    </g>
  </svg>
);

const BUILD_CARDS = [
  {
    icon: <FinanceIcon />,
    title: '금융 상담 자동화',
    desc: '대출 진행 조회, 금융상품 안내, 심사 연동 등 금융에 특화된 상담 자동화',
  },
  {
    icon: <FileTextIcon />,
    title: '보험 계약 조회 상담',
    desc: '본인인증 기반 보험 계약 조회 및 보험 상품 안내 서비스 구축',
  },
  {
    icon: <HeadsetIcon />,
    title: 'IPCC 채팅 상담 플랫폼',
    desc: '기존 IPCC 환경과 연동된 통합 채팅 상담 시스템 고도화',
  },
  {
    icon: <TripleUserIcon />,
    title: '3자 채팅 상담 시스템',
    desc: '고객·상담사·입점사 간 실시간 3자 채팅 상담 구조 구현',
  },
  {
    icon: <SmartphoneIcon />,
    title: '인앱 상담 환경 구축',
    desc: '모바일 앱 내 상담 환경 구축 및 기간계 시스템 연동',
  },
  {
    icon: <BotIcon />,
    title: 'AICC 기반 상담 자동화',
    desc: 'AI 기반 컨택센터(AICC)를 활용한 고객 응대 자동화 및 상담 운영 효율 향상',
  },
];

export default function AdvantagesSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <h2 css={styles.title}>구축 유형</h2>
          <p css={styles.subtitle}>
            기업 환경과 요구사항에 맞는 다양한 구축 유형을 제공합니다.
          </p>
        </div>
        <div css={styles.grid}>
          {BUILD_CARDS.map((c) => (
            <article key={c.title} css={styles.card}>
              <span css={styles.icon}>{c.icon}</span>
              <h3 css={styles.cardTitle}>{c.title}</h3>
              <p css={styles.cardDesc}>{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
