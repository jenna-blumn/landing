import { css } from '@emotion/react';

import { media } from '@/styles/breakpoints';

export default {
  container: css`
    position: relative;
    width: 100vw;
    height: 1040px;
    padding-top: 120px;
    overflow: hidden;

    ${media.desktop} {
      padding-top: 68px;
    }
  `,

  backgroundWrapper: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: linear-gradient(
      0deg,
      rgba(234, 238, 212, 0.35) 0%,
      rgba(234, 238, 212, 0.35) 100%
    );
  `,

  headerWrapper: css`
    display: contents;

    ${media.desktop} {
      display: flex;
      height: 860px;
      padding: 72px 60px;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
  `,

  headerContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    padding-top: 20px;
    gap: 24px;
    width: 100%;
    max-width: 336px;

    ${media.desktop} {
      gap: 32px;
      padding-top: 0;
      max-width: 100%;
    }
  `,

  title: css`
    color: #000;
    text-align: center;
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    align-self: stretch;

    ${media.desktop} {
      font-size: var(--font-size-54);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  backgroundVector: (top: number, left: number) => css`
    position: absolute;
    top: ${top}px;
    left: ${left}px;
  `,

  contentWrapper: css`
    position: absolute;
    top: 360px;
    left: 50%;
    transform: translateX(-50%);
    width: 336px;
    height: 480px;

    * {
      max-width: none;
    }

    ${media.desktop} {
      top: 441px;
      width: 638px;
      height: 528px;
    }
  `,

  vectorRelative: (top: number, left: number) => css`
    position: absolute;
    top: ${top}px;
    left: ${left}px;
  `,

  rightVector: css`
    width: 442px;
    height: 269px;
  `,

  gradientTop: css`
    position: absolute;
    top: 0;
    width: 100%;
    height: 240px;
    background: linear-gradient(
      180deg,
      #f0f1e9 0%,
      rgba(240, 241, 233, 0) 100%
    );

    ${media.desktop} {
      height: 440px;
    }
  `,

  gradientBottom: css`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 240px;
    background: linear-gradient(
      180deg,
      rgba(240, 241, 233, 0) 0%,
      #f0f1e9 100%
    );
  `,
};
