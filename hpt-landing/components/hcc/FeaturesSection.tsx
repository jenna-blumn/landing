'use client';

import styles from './FeaturesSection.style';
import FeatureCard from '@/components/hcc/FeatureCard';

import { FEATURE_CARDS } from '@/constants/hcc';

export default function FeaturesSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <h2 css={styles.title}>
          해피톡 구축형 솔루션은 다양한 관리 및 상담 기능들을 제공합니다.
        </h2>
        <div css={styles.cardWrapper}>
          {FEATURE_CARDS.map((card, index) => (
            <FeatureCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
