'use client';

import styles from './LogosSection.style';
import { LOGO_ROW1, LOGO_ROW2 } from '@/constants/chatting';

export default function LogosSection() {
  const renderTrack = (logos: typeof LOGO_ROW1) => (
    <>
      <div css={styles.logoSet}>
        {logos.map((logo, i) => (
          <div key={i} css={styles.logoItem}>
            <img src={logo.src} alt={logo.name} css={styles.logoImage} />
          </div>
        ))}
      </div>
      <div css={styles.logoSet}>
        {logos.map((logo, i) => (
          <div key={`c-${i}`} css={styles.logoItem}>
            <img src={logo.src} alt={logo.name} css={styles.logoImage} />
          </div>
        ))}
      </div>
    </>
  );

  return (
    <section css={styles.container}>
      <div css={styles.marqueeWrapper}>
        <div css={styles.track}>{renderTrack(LOGO_ROW1)}</div>
      </div>
      <div css={styles.marqueeWrapper}>
        <div css={[styles.track, styles.trackReverse]}>
          {renderTrack(LOGO_ROW2)}
        </div>
      </div>
    </section>
  );
}
