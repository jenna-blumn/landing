import { useEffect, useState } from 'react';
import styles from './InteractionTemplate.style';

import MobileInteraction from '@/components/agent/MobileInteraction';
import DesktopInteraction from '@/components/agent/DesktopInteraction';

const INTERACTION_DESKTOP_QUERY = '(min-width: 1024px)';

export default function InteractionTemplate() {
  const [isWide, setIsWide] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(INTERACTION_DESKTOP_QUERY);
    setIsWide(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (isWide === null) return null;

  return (
    <div css={styles.container}>
      {isWide ? <DesktopInteraction /> : <MobileInteraction />}
    </div>
  );
}
