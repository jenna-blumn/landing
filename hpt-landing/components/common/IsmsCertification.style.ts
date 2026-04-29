import { media } from '@/styles/breakpoints';
import { css } from '@emotion/react';

export default {
  container: css`
    width: 550px;
    background-color: #fff;
    border-radius: 3px;
    overflow-y: auto;
    padding: 10px;
    max-width: 90vw;

    > h2 {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
      font-weight: var(--font-weight-regular);
      letter-spacing: var(--letter-spacing-tight);
      text-align: center;
    }

    ${media.desktop} {
      > h2 {
        font-size: var(--font-size-32);
        line-height: var(--line-height-tight);
      }
    }
  `,

  boldText: css`
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
  `,

  logo: css`
    width: 110px;
    margin: 5px 0;
  `,

  divider: css`
    margin: 38px 0 20px;
    border-top: 1px solid #ddd;
  `,

  textContent: css`
    padding: 29px 0 29px 40px;
    list-style-type: square;

    li {
      margin-bottom: 28.8px;

      * {
        line-height: var(--line-height-compact-px);
      }
    }
  `,

  title: css`
    color: rgb(48, 106, 254);
    font-size: var(--font-size-15);
    display: flex;
    align-items: center;
    font-weight: var(--font-weight-regular);

    ${media.desktop} {
      font-size: var(--font-size-18);
      font-weight: var(--font-weight-regular);
    }
  `,

  description: css`
    color: rgb(97, 97, 97);
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);

    ${media.desktop} {
      font-size: var(--font-size-15);
    }
  `,

  certImg: css`
    margin-bottom: 28.8px;
  `,
};
