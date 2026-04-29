import { css } from '@emotion/react';

import { media } from '@/styles/breakpoints';

export default {
  container: css`
    background-color: #18181b;
    display: flex;
    align-items: center;
    align-self: stretch;
    flex-direction: column;
    color: #fff;
  `,

  wrapper: css`
    width: 100%;
    max-width: 360px;
    padding: 80px 12px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    text-align: center;

    .scroll-reveal {
      margin: 0;
    }

    .scroll-reveal-text {
      font-weight: var(--font-weight-bold);
      font-family: 'Inter', 'SUIT Variable';
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    ${media.desktop} {
      max-width: 1496px;
      padding: 80px 0;

      .scroll-reveal-text {
        font-size: var(--font-size-32);
        line-height: var(--line-height-tight);
        letter-spacing: var(--letter-spacing-tight);

        > br:last-of-type {
          display: none;
        }
      }
    }
  `,

  subText: css`
    text-align: center;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    background: linear-gradient(90deg, #b2dbf1 0%, #e56a63 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);

      > br {
        display: none;
      }
    }
  `,
};
