import { css } from '@emotion/react';

import { media } from '@/styles/breakpoints';

export default {
  container: css`
    width: 100%;
    padding: 60px 0;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    display: flex;
    overflow: hidden;
    background-color: #fff;

    ${media.desktop} {
      padding: 72px 60px;
    }
  `,

  wrapper: css`
    display: flex;
    width: 360px;
    padding: 0 12px;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    align-self: stretch;
    overflow: visible;

    ${media.desktop} {
      width: 1496px;
      max-width: 90vw;
      padding: 0;
    }
  `,

  textBox: css`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    align-self: stretch;

    > h2 {
      flex: 1 0 0;
      color: #0a0e0fdc;
      font-size: var(--font-size-32);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
      text-align: center;

      span {
        background:
          linear-gradient(91deg, #bd59ff 3.11%, #2f9bff 50%, #27e62f 96.89%),
          rgba(0, 0, 0, 0.2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    ${media.desktop} {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0;

      > h2 {
        font-size: var(--font-size-48);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-tight);
        letter-spacing: var(--letter-spacing-tight);
        text-align: left;

        > br:first-of-type {
          display: none;
        }
      }
    }
  `,

  tabsContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    align-self: stretch;

    ${media.desktop} {
      justify-content: flex-end;
      align-items: flex-end;
    }
  `,

  tabs: css`
    display: flex;
    flex: 1;
    padding: 4px;
    align-items: center;
    gap: 2px;
    border-radius: 9999px;
    background: rgba(39, 39, 42, 0.06);

    ${media.desktop} {
      flex: unset;
    }
  `,

  tab: (isActive: boolean) => css`
    display: flex;
    flex: 1;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border-radius: 9999px;
    background-color: rgba(39, 39, 42, 0);
    color: #6f6f77;
    letter-spacing: var(--letter-spacing-tight);
    cursor: pointer;
    letter-spacing: var(--letter-spacing-tight);

    ${isActive &&
    css`
      color: #fff;
      background: #18181b;
      box-shadow:
        0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
        0 1px 2px 0 rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(39, 39, 42, 0.15);
    `}

    ${media.desktop} {
      flex: unset;

      ${isActive &&
      css`
        color: #fff;
        font-weight: var(--font-weight-bold);
        background: #18181b;
      `}
    }
  `,

  experienceContainer: css`
    display: flex;
    padding: 30px 0 20px 0;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
    overflow: visible;

    ${media.desktop} {
      padding: 60px 0 20px 0;
    }
  `,

  swiper: css`
    width: 100%;
    overflow: visible !important;
  `,

  experienceContent: (src: string) => css`
    position: relative;
    width: 320px;
    height: 420px;
    flex-shrink: 0;
    border-radius: 16px;
    background: url(${src}) no-repeat center center;
    background-size: cover;

    ${media.desktop} {
      width: 890px;
      height: 568px;
    }
  `,

  blurBackground: css`
    width: 320px;
    height: 420px;
    position: absolute;
    border-radius: 16px;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
    backdrop-filter: blur(15px);
    mask-image: linear-gradient(180deg, transparent 0%, black 100%);

    ${media.desktop} {
      width: 890px;
      height: 568px;
    }
  `,

  pagination: css`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 9999px;
      border: 1px solid rgba(39, 39, 42, 0.15);
      background: #fff;
      box-shadow:
        0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
        0 1px 2px 0 rgba(0, 0, 0, 0.05);

      &:last-of-type svg {
        transform: rotate(180deg);
      }
    }
  `,

  textContent: css`
    width: calc(100% - 40px);
    display: flex;
    padding-bottom: 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    position: absolute;
    bottom: 0;
    left: 20px;

    ${media.desktop} {
      width: calc(100% - 80px);
      padding-bottom: 40px;
      gap: 24px;
      left: 40px;
    }
  `,

  title: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    > h2 {
      color: #fff;
      font-size: var(--font-size-18);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    p {
      color: #fff;
      font-size: var(--font-size-18);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    ${media.desktop} {
      > h2 {
        font-size: var(--font-size-32);
        line-height: var(--line-height-tight);
        letter-spacing: var(--letter-spacing-tight);
      }
    }
  `,

  pointContainer: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;

    > div {
      display: flex;
      align-items: center;
      gap: 8px;
      align-self: stretch;

      > svg {
        flex-shrink: 0;
      }

      > p {
        color: #fff;
        font-size: var(--font-size-15);
        font-weight: var(--font-weight-regular);
        line-height: var(--line-height-normal);
        letter-spacing: var(--letter-spacing-tight);
      }
    }

    ${media.desktop} {
      > div > p {
        font-size: var(--font-size-15);
        line-height: var(--line-height-normal);
      }
    }
  `,
};
