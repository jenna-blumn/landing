import { useEffect, useState } from 'react';

import styles from './MobileThirdGuide.style';
import RoutingGuideBlock from '@/components/agent/RoutingGuideBlock';

interface MobileThirdGuideProps {
  isInView: boolean;
  isScenarioDesktop?: boolean;
}

export default function MobileThirdGuide({ isInView }: MobileThirdGuideProps) {
  const [isThinking, setIsThinking] = useState(true);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setIsThinking(false);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setIsThinking(true);
    }
  }, [isInView]);

  return (
    <div css={styles.container}>
      {isInView && (
        <div css={styles.wrapper}>
          <RoutingGuideBlock isAyvin isRoute isThinking={isThinking} isMobile />
        </div>
      )}
    </div>
  );
}
