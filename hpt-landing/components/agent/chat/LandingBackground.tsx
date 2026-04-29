"use client";

import styles from "./LandingBackground.style";

export default function LandingBackground() {
  return (
    <div css={styles.container}>
      <div css={styles.gradient} />
      <div css={styles.dots} />
    </div>
  );
}
