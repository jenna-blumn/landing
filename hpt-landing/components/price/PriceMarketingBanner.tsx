'use client';

import styles from './PriceMarketingBanner.style';

export default function PriceMarketingBanner() {
  return (
    <div css={styles.banner}>
      <div css={styles.textArea}>
        <p css={styles.title}>AI 상담 기능을 무료로 경험해보세요.</p>
        <p css={styles.description}>
          AI 어시스턴트 · AI 에이전트 기능을 베타 기간동안 모든 플랜에서 무료로
          사용할 수 있습니다.
        </p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/ivyai-banner-illustration.png"
        alt="AI 상담 일러스트레이션"
        css={styles.illustration}
      />
    </div>
  );
}
