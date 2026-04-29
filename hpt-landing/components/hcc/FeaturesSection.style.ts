import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    width: 100%;
    background-color: #f2f6ff;
    padding: 60px 20px 80px;
  `,

  inner: css`
    max-width: 1194px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;

    ${media.desktop} {
      gap: 60px;
    }
  `,

  title: css`
    color: #484848;
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    text-align: center;

    ${media.desktop} {
      font-size: var(--font-size-42);
      line-height: var(--line-height-tight);
    }
  `,

  cardWrapper: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    ${media.desktop} {
      flex-direction: row;
      align-items: stretch;
      gap: 18px;
    }
  `,
};
