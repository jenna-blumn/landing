'use client';

import type { ReactNode } from 'react';
import styles from './GradientBorder.style';

interface GradientBorderProps {
  children: ReactNode;
}

export default function GradientBorder({ children }: GradientBorderProps) {
  return (
    <div css={styles.wrapper}>
      <div css={styles.gradient} />
      <div css={styles.inner}>{children}</div>
    </div>
  );
}
