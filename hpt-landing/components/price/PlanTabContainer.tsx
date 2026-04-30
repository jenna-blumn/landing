'use client';

import { useState } from 'react';

import styles from './PlanTabContainer.style';
import PlanCalculator from './PlanCalculator';
import PricingCards from './PricingCards';

const BoltIcon = () => (
  <svg
    css={styles.bannerIcon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg
    css={styles.bannerArrow}
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

export default function PlanTabContainer() {
  const [activeTab, setActiveTab] = useState<'recommend' | 'all'>('recommend');

  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.tabs}>
          <button
            type="button"
            onClick={() => setActiveTab('recommend')}
            css={styles.tab(activeTab === 'recommend')}
          >
            추천 플랜 찾기
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            css={styles.tab(activeTab === 'all')}
          >
            전체 플랜 보기
          </button>
        </div>

        {activeTab === 'recommend' ? (
          <PlanCalculator />
        ) : (
          <>
            <a href="#enterprise" css={styles.banner}>
              <div css={styles.bannerLeft}>
                <span css={styles.bannerIconWrap}>
                  <BoltIcon />
                </span>
                <p css={styles.bannerText}>
                  <span css={styles.bannerTitle}>기업 맞춤 상담 플랫폼</span>
                  <span css={styles.bannerSub}>Enterprise 플랜</span>
                </p>
              </div>
              <span css={styles.bannerCta}>
                어떻게 세팅되나요?
                <ArrowIcon />
              </span>
            </a>
            <PricingCards />
          </>
        )}
      </div>
    </section>
  );
}
