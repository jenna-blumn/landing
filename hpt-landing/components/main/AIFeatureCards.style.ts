import { css } from '@emotion/react';

import { media } from '@/styles/breakpoints';

export default {
  container: css`
    position: relative;
    width: 100%;
    height: fit-content;
    z-index: 1;
    display: grid;
    place-items: center;

    ${media.desktop} {
      height: 50%;
    }
  `,

  wrapper: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    width: 100%;
    max-width: 360px;
    padding: 40px 12px;

    ${media.desktop} {
      flex-direction: row;
      gap: 20px;
      width: 1496px;
      max-width: 95vw;
      padding: 0;
    }
  `,

  cardContainer: css`
    display: flex;
    padding: 24px 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    border-radius: 10px;
    align-self: stretch;

    > img {
      height: 252px;
      max-width: 100%;
      object-fit: contain;
    }

    ${media.desktop} {
      padding: 60px 40px;
      gap: 40px;
      flex: 1 0 0;

      > img {
        height: 360px;
      }
    }
  `,

  textBox: css`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    align-self: stretch;

    > p {
      color: #0a0e0fdc;
      text-align: center;
      font-size: var(--font-size-21);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);

      &:last-of-type {
        color: #000;
        font-size: var(--font-size-15);
        font-weight: var(--font-weight-regular);
        line-height: var(--line-height-normal);
        letter-spacing: var(--letter-spacing-tight);
      }
    }

    ${media.desktop} {
      gap: 16px;

      > p {
        font-size: var(--font-size-32);
        line-height: var(--line-height-tight);
        letter-spacing: var(--letter-spacing-tight);

        &:last-of-type {
          font-size: var(--font-size-18);
          line-height: var(--line-height-normal);
          letter-spacing: var(--letter-spacing-tight);
        }

        > br {
          display: none;
        }
      }
    }
  `,
};
