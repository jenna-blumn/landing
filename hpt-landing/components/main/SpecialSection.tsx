import styles from './SpecialSection.style';

import DashedCircle from '@/assets/svg/dashed-circle.svg';
import MapleLeaf from '@/assets/svg/maple-leaf_s264.svg';
import DotLineAi1 from '@/assets/svg/dot-line-AI1.svg';
import DotLineAi2 from '@/assets/svg/dot-line-AI2.svg';
import Headline from '@/components/main/Headline';
import AIFeatureCards from '@/components/main/AIFeatureCards';
import useViewObserver from '@/hooks/useViewObserver';

export default function SpecialSection() {
  const { ref, isInView } = useViewObserver<HTMLDivElement>({
    threshold: 0,
    once: true,
  });

  return (
    <div css={styles.layoutContainer}>
      <div css={styles.stickyWrapper}>
        <div css={styles.fixedWheel}>
          <div css={styles.ellipse} />
          <DashedCircle css={styles.dashedCircle} />
          <div css={styles.innerCircle} />
          <MapleLeaf css={styles.mapleLeaf} />
        </div>
      </div>
      <div css={styles.headlineWrapper}>
        <Headline />
        <div ref={ref} css={styles.lineSentinel} />
        <div css={styles.lineAiWrapper(isInView, 'left')}>
          <DotLineAi1 />
        </div>
        <div css={styles.lineAiWrapper(isInView, 'right')}>
          <DotLineAi2 />
        </div>
      </div>
      <AIFeatureCards />
    </div>
  );
}
