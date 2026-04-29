import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px 20px 40px;
    text-align: center;
    min-height: 500px;

    ${media.desktop} {
      padding: 132px 60px 0;
    }
  `,

  textBox: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    max-width: 100%;

    ${media.desktop} {
      max-width: 1396px;
    }
  `,

  badge: css`
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 9999px;
    background: rgba(39, 39, 42, 0.06);
    color: #52525b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
    }
  `,

  mainTitle: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-54);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  description: css`
    color: #4e4e55;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);

      > br {
        display: none;
      }
    }
  `,

  ctaContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 24px;

    ${media.desktop} {
      gap: 40px;
      margin-top: 20px;
      padding: 20px 60px;
    }
  `,

};
