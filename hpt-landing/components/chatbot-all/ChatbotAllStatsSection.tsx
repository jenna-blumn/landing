'use client';

import styles from './ChatbotAllStatsSection.style';
import GradientText from '@/components/ui/GradientText';
import { STATS_GRADIENT_COLORS } from '@/constants/product';

const STATS = [
  { value: '100', unit: '건+', label: '누적 맞춤 세팅 사례' },
  { value: '7', unit: '일', label: '평균 세팅 기간' },
  { value: '78', unit: '%', label: '문의 자동화율' },
];

export default function ChatbotAllStatsSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <h2 css={styles.title}>숫자가 증명하는 다-해줌의 성과</h2>
          <p css={styles.subtitle}>
            기업 환경 및 요구사항에 따라 세팅 기간이 달라질 수 있습니다
          </p>
        </div>
        <div css={styles.grid}>
          {STATS.map((s) => (
            <article key={s.label} css={styles.card}>
              <div css={styles.value}>
                <GradientText
                  colors={STATS_GRADIENT_COLORS}
                  animationSpeed={0}
                  direction="diagonal"
                >
                  {s.value}
                  <span>{s.unit}</span>
                </GradientText>
              </div>
              <p css={styles.label}>{s.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
