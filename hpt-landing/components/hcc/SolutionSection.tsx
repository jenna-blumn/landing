'use client';

import styles from './SolutionSection.style';

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

const LinkIcon = () => (
  <svg viewBox="0 0 24 24">
    <IconGradient id="hccSolLink" />
    <path
      {...STROKE_PROPS}
      stroke="url(#hccSolLink)"
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24">
    <IconGradient id="hccSolSettings" />
    <g {...STROKE_PROPS} stroke="url(#hccSolSettings)">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </g>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24">
    <IconGradient id="hccSolShield" />
    <path
      {...STROKE_PROPS}
      stroke="url(#hccSolShield)"
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
    />
  </svg>
);

const CAPS = [
  {
    icon: <LinkIcon />,
    title: '기간계 시스템 연동',
    desc: 'ERP, 코어뱅킹, CRM 등 기존 시스템과 실시간 양방향 연동',
    items: ['주문 시스템 연동', '인앱 상담 구축', 'AICC / IPCC 연동'],
  },
  {
    icon: <SettingsIcon />,
    title: '업무 자동화',
    desc: '단순 FAQ 응답이 아닌 실제 업무 프로세스를 챗봇이 직접 수행',
    items: ['대출 진행 상태 조회', '카드 심사 자동화', '계약 조회'],
  },
  {
    icon: <ShieldIcon />,
    title: '보안 아키텍처',
    desc: '고객사 클라우드 또는 폐쇄망에 직접 설치되어 데이터가 외부로 유출되지 않는 구조',
    items: ['민감정보 자동 마스킹', '고객사 보안 정책 적용', '정기 보안 패치 제공'],
  },
];

export default function SolutionSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <span css={styles.badge}>Core Capabilities</span>
          <h2 css={styles.title}>DCS 구축 역량</h2>
          <p css={styles.subtitle}>
            SaaS에서는 불가능한 엔터프라이즈 환경에 최적화된 기술력을
            제공합니다.
          </p>
        </div>
        <div css={styles.grid}>
          {CAPS.map((cap) => (
            <article key={cap.title} css={styles.card}>
              <span css={styles.icon}>{cap.icon}</span>
              <h3 css={styles.cardTitle}>{cap.title}</h3>
              <p css={styles.cardDesc}>{cap.desc}</p>
              <ul css={styles.list}>
                {cap.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
