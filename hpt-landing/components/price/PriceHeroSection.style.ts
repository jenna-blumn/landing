import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 20px 48px;
    background: #fff;

    ${media.desktop} {
      padding: 120px 60px 64px;
    }
  `,

  inner: css`
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  `,

  title: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    > span {
      color: oklch(54.6% 0.245 262.881);
    }

    ${media.desktop} {
      font-size: var(--font-size-54);
      line-height: var(--line-height-tight);
    }
  `,

  subtitle: css`
    color: #71717a;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,
};
