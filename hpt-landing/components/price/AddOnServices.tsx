'use client';

import { useState } from 'react';

import styles from './AddOnServices.style';

interface Addon {
  id: string;
  name: string;
  label: string;
  badgeText: string;
  badgeVariant: 'paid' | 'free';
  title: string;
  description: string;
  features: string[];
  isPaid: boolean;
  status: string | null;
}

const PLAN_ALLOWANCES = [
  { plan: 'Free', allowance: '-' },
  { plan: 'Starter', allowance: '10건' },
  { plan: 'Pro', allowance: '15건' },
  { plan: 'Enterprise', allowance: '별도 협의' },
];

const ADDONS: Addon[] = [
  {
    id: 'assistant',
    name: 'AI 어시스턴트',
    label: '상담 지원',
    badgeText: '무료 제공',
    badgeVariant: 'free',
    title: '상담사를 돕는 AI',
    description: '상담 내용을 분석하여 분류, 요약, 감정 분석을 자동 수행합니다.',
    features: [
      '상담 내용 자동 분류',
      '상담 종료 후 자동 요약',
      '고객 감정 분석',
    ],
    isPaid: false,
    status: '현재 무료 제공',
  },
  {
    id: 'agent',
    name: 'AI 에이전트',
    label: '자동 응대',
    badgeText: '사용량 기반 과금',
    badgeVariant: 'paid',
    title: '고객을 직접 응대하는 AI',
    description: '고객 문의를 이해하고 자동 응대하거나 상담사 연결을 수행합니다.',
    features: [
      '질문 맥락 이해 및 응대 유형 자동 판단',
      '자동 답변 또는 상담 연결',
      '시스템과 연동해 실제 데이터 조회 가능',
    ],
    isPaid: true,
    status: null,
  },
  {
    id: 'knowledge',
    name: '지식베이스',
    label: '지식 기반',
    badgeText: '무료 제공',
    badgeVariant: 'free',
    title: '지식 등록 기반 자동 응답',
    description: '일관된 상담을 제공할 수 있도록 AI를 학습합니다.',
    features: [
      '텍스트 · 파일 기반 지식 등록',
      '카테고리별 지식 체계화',
      '회사 기준에 맞는 답변 생성',
    ],
    isPaid: false,
    status: '현재 무료 제공',
  },
];

const CheckIcon = () => (
  <svg
    css={styles.checkIcon}
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

const ChevronIcon = () => (
  <svg
    css={styles.chevronIcon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const StarIcon = () => (
  <svg css={styles.starIcon} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function AddOnServices() {
  const [selected, setSelected] = useState('agent');
  const current = ADDONS.find((a) => a.id === selected) ?? ADDONS[0];

  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <span css={styles.eyebrow}>확장서비스</span>
          <h2 css={styles.title}>필요한 만큼 사용하는 AI 기능</h2>
          <p css={styles.subtitle}>
            필요한 기능만 선택해 사용하고, 사용량에 따라 비용이 발생합니다.
          </p>
        </div>

        <div css={styles.body}>
          <nav css={styles.nav}>
            {ADDONS.map((addon) => {
              const active = addon.id === selected;
              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => setSelected(addon.id)}
                  css={styles.navItem(active)}
                >
                  <div css={styles.navItemTop}>
                    <p css={styles.navItemName(active)}>{addon.name}</p>
                    {active && <ChevronIcon />}
                  </div>
                  <span css={styles.navBadge(addon.badgeVariant)}>
                    {addon.badgeText}
                  </span>
                </button>
              );
            })}
          </nav>

          <div css={styles.detail}>
            <div css={styles.detailCard}>
              <span css={styles.detailLabel}>{current.label}</span>
              <h3 css={styles.detailTitle}>{current.title}</h3>
              <p css={styles.detailDesc}>{current.description}</p>

              <div css={styles.featuresBlock}>
                <p css={styles.featuresHeader}>주요 기능</p>
                <ul css={styles.featuresList}>
                  {current.features.map((f) => (
                    <li key={f} css={styles.featureItem}>
                      <CheckIcon />
                      <span css={styles.featureText}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {current.isPaid && (
                <>
                  <div css={styles.allowanceBox}>
                    <div css={styles.allowanceHeader}>
                      <p css={styles.allowanceTitle}>플랜별 무료 제공 건수</p>
                      <span css={styles.promoBadge}>
                        <StarIcon />
                        프로모션 진행 중
                      </span>
                    </div>
                    <div css={styles.tableWrap}>
                      <table css={styles.table}>
                        <thead>
                          <tr>
                            <th css={styles.thLeft}>플랜</th>
                            <th css={styles.thRight}>무료 제공 건수</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PLAN_ALLOWANCES.map((row) => (
                            <tr key={row.plan} css={styles.tr}>
                              <td css={styles.tdLeft}>{row.plan}</td>
                              <td css={styles.tdRight}>{row.allowance}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p css={styles.allowanceNote}>
                      ※ 무료 사용량은 월 기준으로 제공됩니다
                    </p>
                  </div>

                  <div css={styles.billingBox}>
                    <p css={styles.billingText}>
                      <strong>무료 제공 건수 초과 시</strong> 고객기준(DAU)/일단위{' '}
                      <span css={styles.billingPrice}>1,000원</span> 과금
                    </p>
                    <p css={styles.billingNote}>
                      한 고객에게 여러 번 응대해도 추가 비용 없이 효율적으로 사용할 수 있습니다.
                    </p>
                  </div>
                </>
              )}

              {!current.isPaid && current.status && (
                <div css={styles.freeBox}>
                  <p css={styles.freeTitle}>무료</p>
                  <p css={styles.freeStatus}>{current.status}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
