'use client';

import { useState } from 'react';

import styles from './PlanCalculator.style';

const TIER_RANK: Record<string, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
};

const TIER_LABEL: Record<string, string> = {
  free: '프리 플랜',
  starter: '스타터 플랜',
  pro: '프로 플랜',
  enterprise: '엔터프라이즈 플랜',
};

const TEAM_SIZE_OPTIONS = [
  { id: 'team_solo', label: '혼자 운영', tier: 'free' },
  { id: 'team_single', label: '단일 부서 운영', tier: 'starter' },
  { id: 'team_multi_dept', label: '다중 부서 운영', tier: 'pro' },
];

interface CategoryIcon {
  d: string;
}

const CategoryIconChat: CategoryIcon = {
  d: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
};
const CategoryIconOps: CategoryIcon = {
  d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
};
const CategoryIconAuto: CategoryIcon = {
  d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
};

const FEATURE_CATEGORIES = [
  {
    name: '채팅 채널',
    icon: CategoryIconChat,
    features: [
      { id: 'ch_web', label: '웹채팅', tier: 'free' },
      { id: 'ch_kakao', label: '카카오톡', tier: 'free' },
      { id: 'ch_naver', label: '네이버톡톡', tier: 'starter' },
      { id: 'ch_insta', label: '인스타그램', tier: 'starter' },
    ],
  },
  {
    name: '상담 운영',
    icon: CategoryIconOps,
    features: [
      { id: 'mgmt_manual', label: '수동 운영', tier: 'free' },
      { id: 'mgmt_stats', label: '상담 이력 확인', tier: 'starter' },
      {
        id: 'mgmt_order',
        label: '주문 정보 연동(카페 24, 스마트스토어)',
        tier: 'starter',
      },
      { id: 'mgmt_report', label: '상담 데이터 분석 리포트', tier: 'pro' },
    ],
  },
  {
    name: '자동화 및 확장',
    icon: CategoryIconAuto,
    features: [
      { id: 'auto_status_msg', label: '상담 상태별 자동 메시지', tier: 'pro' },
      { id: 'auto_assign', label: '자동 상담 배정', tier: 'pro' },
      { id: 'ext_api', label: 'API 제공', tier: 'enterprise' },
      { id: 'ext_custom', label: '맞춤 연동 지원', tier: 'enterprise' },
    ],
  },
];

const TeamIcon = () => (
  <svg
    css={styles.categoryIcon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const CategoryIconSvg = ({ icon }: { icon: CategoryIcon }) => (
  <svg
    css={styles.categoryIcon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d={icon.d}
    />
  </svg>
);

const ArrowIcon = () => (
  <svg
    css={styles.arrowIcon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

export default function PlanCalculator() {
  const [selectedTeamSize, setSelectedTeamSize] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const getRecommendedPlan = (): string => {
    let maxTier = 'free';

    if (selectedTeamSize) {
      const opt = TEAM_SIZE_OPTIONS.find((o) => o.id === selectedTeamSize);
      if (opt && TIER_RANK[opt.tier] > TIER_RANK[maxTier]) {
        maxTier = opt.tier;
      }
    }

    const selected = FEATURE_CATEGORIES.flatMap((c) => c.features).filter(
      (f) => selectedFeatures.includes(f.id)
    );

    for (const f of selected) {
      if (TIER_RANK[f.tier] > TIER_RANK[maxTier]) {
        maxTier = f.tier;
      }
    }

    return maxTier;
  };

  const showResult = selectedTeamSize !== null || selectedFeatures.length > 0;
  const plan = getRecommendedPlan();
  const isEnterprise = plan === 'enterprise';
  const featuresActive = selectedFeatures.length > 0;

  return (
    <div css={styles.container}>
      <div css={styles.panel(featuresActive)}>
        <div css={styles.panelHeader}>
          <span css={styles.panelTitle}>필요 기능 선택</span>
        </div>

        <div css={styles.groups}>
          {/* 팀 구조 */}
          <div css={styles.group}>
            <div css={styles.groupLabel}>
              <TeamIcon />
              <span>팀 구조</span>
            </div>
            <div css={styles.chips}>
              {TEAM_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setSelectedTeamSize(
                      selectedTeamSize === opt.id ? null : opt.id
                    )
                  }
                  css={styles.chip(selectedTeamSize === opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {FEATURE_CATEGORIES.map((category) => (
            <div key={category.name} css={styles.group}>
              <div css={styles.groupLabel}>
                <CategoryIconSvg icon={category.icon} />
                <span>{category.name}</span>
              </div>
              <div css={styles.chips}>
                {category.features.map((feat) => (
                  <button
                    key={feat.id}
                    type="button"
                    onClick={() => toggleFeature(feat.id)}
                    css={styles.chip(selectedFeatures.includes(feat.id))}
                  >
                    {feat.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showResult && (
        <div css={styles.result}>
          <p css={styles.resultLabel}>위 조건으로 상담했을 때 추천 플랜은</p>
          <p css={styles.resultPlan}>
            {TIER_LABEL[plan]}을 안내해드립니다.
          </p>
          <a
            href={
              isEnterprise
                ? 'https://www.happytalk.io/contact'
                : 'https://counselor.happytalk.io/auth/join'
            }
            target="_blank"
            rel="noopener noreferrer"
            css={styles.resultCta}
          >
            {isEnterprise ? '도입 문의하기' : '14일 무료로 시작하기'}
            <ArrowIcon />
          </a>
        </div>
      )}
    </div>
  );
}
