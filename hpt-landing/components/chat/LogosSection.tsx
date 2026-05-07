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

  const renderLogo = (logo: (typeof logos)[number], key: string) => {
    const logoStyle: LogoStyle = {
      '--logo-width': `${logo.frame.width}px`,
      '--logo-height': `${logo.frame.height}px`,
      '--logo-radius': `${logo.radius ?? 0}px`,
    };

    return (
      <div key={key} css={styles.logoItem}>
        <img
          src={logo.src}
          alt={logo.name}
          css={styles.logoImage}
          style={logoStyle}
        />
      </div>
    );
  };

  return (
    <section css={styles.container}>
      <div css={styles.marquee}>
        <div css={styles.track}>
          <div css={styles.set}>
            {logos.map((logo, i) => renderLogo(logo, `a-${i}`))}
          </div>
          <div css={styles.set} aria-hidden="true">
            {logos.map((logo, i) => renderLogo(logo, `b-${i}`))}
          </div>
        </div>
      </div>
    </section>
  );
}
