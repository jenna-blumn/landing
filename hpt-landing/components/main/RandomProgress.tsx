'use client';

import { useEffect, useState } from 'react';
import styles from './RandomProgress.style';

const TOTAL_BARS = 23;
const ACTIVE_BARS = 18;

export default function RandomProgress() {
  const [animatedBars, setAnimatedBars] = useState<boolean[]>(
    Array.from({ length: TOTAL_BARS }, (_, i) => i < ACTIVE_BARS)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBars(
        Array.from({ length: TOTAL_BARS }, (_, i) =>
          i < ACTIVE_BARS ? Math.random() > 0.3 : false
        )
      );
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div css={styles.container}>
      {Array.from({ length: TOTAL_BARS }).map((_, index) => (
        <div
          key={index}
          css={styles.item}
          style={{
            opacity: index < ACTIVE_BARS ? (animatedBars[index] ? 1 : 0.3) : 0.15,
          }}
        />
      ))}
    </div>
  );
}
