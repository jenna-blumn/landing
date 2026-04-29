'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import Aurora from '@/components/ui/Aurora';
import styles from './Background.style';
import DottedGlowEffect from '@/assets/images/dotted-glow-effect.gif';

export default function Background() {
  const pathname = usePathname();

  const renderBackground = useMemo(() => {
    switch (pathname) {
      case '/':
        return (
          <div css={[styles.container, styles.mainContainer]}>
            <img src={DottedGlowEffect.src} />
          </div>
        );
      case '/agent':
        return (
          <div css={styles.container}>
            <Aurora colorStops={['#FFF93F', '#B9FFD3', '#5C8AFF']} />
          </div>
        );
      default:
        return null;
    }
  }, [pathname]);

  if (!renderBackground) return null;

  return renderBackground;
}
