'use client';

import styles from './layout.style';

export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div css={styles.container}>
      {children}
    </div>
  );
}
