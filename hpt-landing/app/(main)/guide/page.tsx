'use client';

import { css } from '@emotion/react';
import { useEffect } from 'react';

const styles = {
  container: css`
    width: 100%;
    height: 100vh;
    overflow: hidden;
  `,

  iframe: css`
    width: 100%;
    height: calc(100vh - 60px);
    margin-top: 60px;
    border: none;
  `,
};

export default function GuidePage() {
  // TODO
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://blumnai.oopy.io') return;

      try {
        const { slug } = JSON.parse(event.data);

        console.log(slug);
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div css={styles.container}>
      <iframe
        src="https://blumnai.oopy.io/happytalk/help"
        css={styles.iframe}
      />
    </div>
  );
}
