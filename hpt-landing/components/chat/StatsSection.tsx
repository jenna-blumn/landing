'use client';

import styles from './StatsSection.style';
import GradientText from '@/components/ui/GradientText';
import {
  STATS,
  STATS_GRADIENT_COLORS,
  STATS_FOOTNOTE,
} from '@/constants/product';

export default function StatsSection() {
  return (
    <section css={styles.container}>
      <div css={styles.content}>
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
        <p css={styles.footnote}>{STATS_FOOTNOTE}</p>
      </div>
    </section>
  );
}
