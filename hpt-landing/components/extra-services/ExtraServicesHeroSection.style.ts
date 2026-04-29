import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px 16px 40px;
    background: rgba(197, 225, 252, 0.6);

    ${media.desktop} {
      padding: 132px 60px 60px;
    }
  `,

  inner: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1194px;
    gap: 40px;

    ${media.desktop} {
      gap: 70px;
    }
  `,

  titleArea: css`
    text-align: center;
  `,

  mainTitle: css`
    color: #1a1a1a;
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-54);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
    }
  `,

  heroImage: css`
    width: 100%;
    max-width: 1174px;
    height: auto;
    border-radius: 12px;
  `,
};
