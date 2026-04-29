import styles from './AiBanner.style';

import ScrollReveal from '@/components/ui/ScrollReveal';

export default function AiBanner() {
  return (
    <div css={styles.container} data-header-theme="dark">
      <div css={styles.wrapper}>
        <div css={styles.subText}>
          명확한 지시를 해도 AI는 <br />
          잘못된 응답을 할 수 있습니다
        </div>
        <ScrollReveal
          wordAnimationStart="top 70%"
          baseOpacity={0.5}
          baseRotation={0}
          blurStrength={13}
        >
          {`하지만, 해피톡 AI 에이전트는\n차별화된 하이브리드 구조로 \n믿고 맡길 수 있습니다.`}
        </ScrollReveal>
      </div>
    </div>
  );
}
