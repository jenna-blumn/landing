import styles from './MobileFourthGuide.style';
import RoutingGuideBlock from '@/components/agent/RoutingGuideBlock';

interface MobileFourthGuideProps {
  isInView: boolean;
  isScenarioDesktop?: boolean;
}

export default function MobileFourthGuide({
  isInView,
}: MobileFourthGuideProps) {
  return (
    <div css={styles.container}>
      {isInView && (
        <div css={styles.wrapper}>
          <RoutingGuideBlock isAyvin={false} isRoute isMobile />
        </div>
      )}
    </div>
  );
}
