import { css } from '@emotion/react';

import { media } from '@/styles/breakpoints';

export default {
  container: css`
    height: auto;
    width: 100%;
    padding-top: 68px;
    position: relative;
    min-height: 100vh;
    display: grid;
    place-items: center;
  `,
  main: css`
    margin: 0 auto;
    max-width: 72rem;
    padding: 0px 12px;

    ${media.desktop} {
      padding: 0px 24px;
    }
  `,
  content: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  `,
  title: css`
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-32);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    color: #000;

    ${media.desktop} {
      font-size: var(--font-size-48);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  subtitle: css`
    color: #6f6f77;
    text-align: center;
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-15);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    margin: 12px 0 40px;

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,
};
