'use client';

import styles from './StatsSection.style';
import GradientText from '@/components/ui/GradientText';
import { STATS, STATS_GRADIENT_COLORS } from '@/constants/product';

export default function StatsSection() {
  return (
    <section css={styles.container}>
      <div css={styles.content}>
        <div css={styles.header}>
          <h2 css={styles.title}>고객사가 만들어준 해피톡의 기록</h2>
        </div>
        <div css={styles.statsGrid}>
          {STATS.map((stat, index) => (
            <div key={index} css={styles.statCard}>
              <div css={styles.statNumber}>
                <GradientText
                  colors={STATS_GRADIENT_COLORS}
                  animationSpeed={0}
                  direction="diagonal"
                >
                  {stat.number.split('\n').map((line, index, arr) => (
                    <span key={index}>
                      {line}
                      {index < arr.length - 1 && <br />}
                    </span>
                  ))}
                </GradientText>
              </div>
              <div css={styles.statText}>
                <h3 css={styles.statTitle}>{stat.title}</h3>
                <p css={styles.statDescription}>{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
