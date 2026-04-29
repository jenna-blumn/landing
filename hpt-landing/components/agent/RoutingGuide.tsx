import { useEffect, useState } from 'react';

import styles from './RoutingGuide.style';
import RoutingGuideBlock from '@/components/agent/RoutingGuideBlock';

interface Props {
  isInView: boolean;
  isAiRoute?: boolean;
}

export default function RoutingGuide({ isInView, isAiRoute = true }: Props) {
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
          <RoutingGuideBlock isAyvin isRoute={isAiRoute} isThinking={isThinking} />
          <RoutingGuideBlock isAyvin={false} isRoute={!isAiRoute} />
        </div>
      )}
    </div>
  );
}
