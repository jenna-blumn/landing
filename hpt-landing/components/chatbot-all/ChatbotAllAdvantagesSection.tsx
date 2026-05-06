'use client';

import Link from 'next/link';
import styles from './ChatbotAllAdvantagesSection.style';

const AGENT_CAPS = [
  {
    icon: 'understand',
    title: '고객 문의 이해',
    desc: '고객의 의도를 정확히 파악합니다.',
  },
  {
    icon: 'response',
    title: '자동 응답 및 업무 처리',
    desc: '반복 문의를 자동 해결합니다.',
  },
  {
    icon: 'routing',
    title: '상담 전 처리 및 분기',
    desc: '적절한 담당자에게 자동 연결합니다.',
  },
];

type AgentCapIcon = (typeof AGENT_CAPS)[number]['icon'];

const IconGradient = ({ id }: { id: string }) => (
  <defs>
    <linearGradient id={id} x1="4" y1="4" x2="44" y2="44">
      <stop offset="0%" stopColor="#2dd4bf" />
      <stop offset="100%" stopColor="#2563eb" />
    </linearGradient>
  </defs>
);

const AgentCapabilityIcon = ({
  id,
  icon,
}: {
  id: string;
  icon: AgentCapIcon;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 48 48"
    aria-hidden="true"
  >
    <IconGradient id={id} />
    {icon === 'understand' && (
      <path
        fill="none"
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        d="M24 28a4 4 0 1 0 0-8a4 4 0 0 0 0 8m-6.636-14a12.05 12.05 0 0 0-3.453 3.5m-1.713 8.68a12.1 12.1 0 0 1 0-4.36M17.364 34a12.05 12.05 0 0 1-3.453-3.5m12.449 5.268a12.1 12.1 0 0 1-4.72 0M30.636 34a12.1 12.1 0 0 0 3.453-3.5m1.714-4.32a12.1 12.1 0 0 0 0-4.36M30.636 14a12.1 12.1 0 0 1 3.453 3.5M21.64 12.232a12.1 12.1 0 0 1 4.72 0M44 24a20.2 20.2 0 0 0-.4-4M4 24a20.2 20.2 0 0 1 .4-4m34.246 17.62a20 20 0 0 1-2.796 2.493M9.354 37.62a20 20 0 0 0 2.796 2.493m3.562-34.32a20 20 0 0 0-3.562 2.094m20.138-2.094a20 20 0 0 1 3.562 2.094m-9.603-3.762a20.2 20.2 0 0 0-4.494 0m4.494 39.75a20 20 0 0 0 4.253-.955m-8.747.955a20 20 0 0 1-4.253-.955M8.155 11.794a20 20 0 0 0-1.908 2.986m33.598-2.985a20 20 0 0 1 1.908 2.985M6.247 33.22a20 20 0 0 1-1.378-3.372m36.884 3.372a20 20 0 0 0 1.378-3.372"
      />
    )}
    {icon === 'response' && (
      <g fill="none">
        <path
          stroke={`url(#${id})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M42 30v-5.538C42 14.266 33.941 6 24 6S6 14.266 6 24.462V30"
        />
        <path
          stroke={`url(#${id})`}
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M34 32a4 4 0 0 1 4-4h4v14h-4a4 4 0 0 1-4-4z"
        />
        <path
          fill={`url(#${id})`}
          d="M42 32h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2zM6 32H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2z"
        />
        <path
          stroke={`url(#${id})`}
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M6 28h4a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H6z"
        />
      </g>
    )}
    {icon === 'routing' && (
      <g
        fill="none"
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      >
        <path d="M41 25c0 9.941-8.059 18-18 18S5 34.941 5 25S13.059 7 23 7" />
        <path d="M12 28.5c8.5 0 12-.5 19-9.5" />
        <path d="M23 19h8v8m0-22v4.5M43.5 17H39m1.89-10L37 10.89" />
      </g>
    )}
  </svg>
);

export default function ChatbotAllAdvantagesSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <h2 css={styles.title}>
            AI 에이전트와 지식베이스 설정까지{' '}
            <br />
            함께 지원합니다
          </h2>
        </div>
        <div css={styles.grid}>
          {AGENT_CAPS.map((cap, index) => (
            <article key={cap.title} css={styles.card}>
              <span css={styles.cardIcon}>
                <AgentCapabilityIcon
                  id={`agent-capability-gradient-${index}`}
                  icon={cap.icon}
                />
              </span>
              <h3 css={styles.cardTitle}>{cap.title}</h3>
              <p css={styles.cardDesc}>{cap.desc}</p>
            </article>
          ))}
        </div>
        <div css={styles.ctaWrapper}>
          <Link
            href="/agent"
            css={styles.ctaButton}
            data-gtm-event="CHATBOT_ALL_AGENT_EXPERIENCE"
          >
            AI 에이전트 체험하기
          </Link>
        </div>
      </div>
    </section>
  );
}
