import { css } from '@emotion/react';

import { media } from '@/styles/breakpoints';

export default {
  footer: css`
    width: 360px;
    margin: 0 auto;
    padding: 40px 20px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 100vw;
    overflow: hidden;

    ${media.desktop} {
      width: 100%;
      margin: 0;
    }
  `,

  container: css`
    display: flex;
    width: 100%;
    max-width: 640px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;

    ${media.desktop} {
      width: 100%;
      flex-direction: row;
      max-width: 1520px;
      justify-content: space-between;
      align-items: center;
    }
  `,

  topContainer: css`
    padding: 0 0 20px 0;

    ${media.desktop} {
      padding-bottom: 28px;
    }
  `,

  bottomContainer: css`
    padding: 20px 0 0 0;
    border-top: 1px solid #f4f4f5;

    ${media.desktop} {
      padding-top: 20px;
    }
  `,

  leftCol: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: normal;
    align-items: flex-start;
    flex-shrink: 0;
    align-self: stretch;

    ${media.desktop} {
      gap: 20px;
      flex: none;
      width: fit-content;
    }
  `,

  rightCol: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    align-self: stretch;
    flex-shrink: 0;

    ${media.desktop} {
      flex: 1;
      min-width: 0;
    }
  `,

  rightColInner: css`
    display: contents;

    ${media.desktop} {
      display: flex;
      margin-left: auto;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 20px;
    }
  `,

  logoWrapper: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    height: 48px;

    > img {
      height: 21.639px;
    }

    ${media.desktop} {
      gap: 10px;
      justify-content: flex-end;
      height: 21.639px;
      align-items: flex-start;
      flex-direction: column;
      width: fit-content;
    }
  `,

  leftBody: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    align-self: stretch;

    ${media.desktop} {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-end;
      align-content: flex-end;
      gap: 12px 16px;
      width: 302px;
    }
  `,

  block: css`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 4px;

    @media (min-width: 961px) {
      height: 58px;
      gap: 0;

      &:last-of-type {
        display: flex;
      }
    }
  `,

  callCenter: css`
    > p {
      &:first-of-type {
        color: #6f6f77;
        font-size: var(--font-size-13);
        font-weight: var(--font-weight-regular);
        line-height: var(--line-height-normal);
        letter-spacing: var(--letter-spacing-tight);
        gap: 6px;
        display: flex;
        align-items: center;
      }

      &:nth-of-type(2) {
        color: #4e4e55;
        font-size: var(--font-size-15);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-normal);
        letter-spacing: var(--letter-spacing-tight);
      }
    }
  `,

  divide: css`
    width: 1px;
    height: 14px;
    background-color: rgba(0, 0, 0, 0.2);
    display: inline-block;
  `,

  mobileEmail: css`
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      display: none;
    }
  `,

  downloadButton: css`
    border: none;
    outline: none;
    display: flex;
    padding: 10px 14px;
    justify-content: center;
    align-items: center;
    gap: 6px;
    border-radius: 6px;
    background-color: #18181b;

    span {
      color: #fff;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  list: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    > p {
      color: #131313;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    > div {
      display: flex;
      min-width: 144px;
      gap: 20px;
      align-items: flex-start;
    }

    a {
      display: flex;

      justify-content: center;
      align-items: center;
      gap: 0;
      color: rgba(17, 17, 21, 0.9);
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    ${media.desktop} {
      flex-shrink: 0;

      > p {
        font-size: var(--font-size-15);
        line-height: var(--line-height-normal);
      }

      > div {
        gap: 0;
        flex-direction: column;
      }

      a {
        width: 144px;
        padding: 10px 0;
        gap: 6px;
        text-align: center;
        justify-content: flex-start;
        color: #4e4e55;
      }
    }
  `,

  mobileTwoColumn: css`
    display: flex !important;
    flex-wrap: wrap;

    ${media.desktop} {
      display: none !important;
    }
  `,

  twoColumn: css`
    display: none !important;
    flex-direction: row !important;

    ${media.desktop} {
      display: flex !important;
    }
  `,

  linksContainer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    width: 100%;

    > p {
      color: #6f6f77;
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
      white-space: nowrap;
    }

    > img {
      width: 41.333px;
      height: 41.333px;
      aspect-ratio: 1/1;
      flex-shrink: 0;
    }

    ${media.desktop} {
      justify-content: flex-end;
      width: 296px;
      align-self: flex-end;
    }
  `,

  address: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    align-content: normal;
    align-self: stretch;

    p {
      color: #6f6f77;
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);

      &.bold {
        font-weight: var(--font-weight-regular);
      }
    }

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 8px;
    }

    ${media.desktop} {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: normal;
      align-items: center;
      align-content: center;
      gap: 8px;
      flex: 1 0 0;

      p {
        font-size: var(--font-size-13);
        line-height: var(--line-height-normal);
        white-space: nowrap;
      }

      > div {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: normal;
        align-items: center;
      }
    }
  `,

  ismsImage: css`
    cursor: pointer;
  `,
};
