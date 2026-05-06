'use client';

import type { CSSProperties } from 'react';

import styles from './LogosSection.style';
import { LOGO_ROW1, LOGO_ROW2 } from '@/constants/chatting';

type LogoStyle = CSSProperties & {
  '--logo-width': string;
  '--logo-height': string;
  '--logo-radius': string;
};

export default function LogosSection() {
  const logos = [...LOGO_ROW1, ...LOGO_ROW2];

  return (
    <section css={styles.container}>
      <div css={styles.logoGrid}>
        {logos.map((logo) => {
          const logoStyle: LogoStyle = {
            '--logo-width': `${logo.frame.width}px`,
            '--logo-height': `${logo.frame.height}px`,
            '--logo-radius': `${logo.radius ?? 0}px`,
          };

          return (
            <div key={logo.name} css={styles.logoItem}>
              <img
                src={logo.src}
                alt={logo.name}
                css={styles.logoImage}
                style={logoStyle}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
