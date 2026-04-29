import { css, keyframes } from '@emotion/react';

import common from '@/styles/common';
import { media } from '@/styles/breakpoints';

const rotate = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const drawUpToDown = keyframes`
  0% {
    clip-path: inset(0 0 100% 0);
  }
  100% {
    clip-path: inset(0 0 0% 0);
  }
`;

export default {
  layoutContainer: css`
    padding-top: 60px;
    width: 100vw;
    height: fit-content;
    position: relative;
    background: #f0f1e9;
    overflow: clip;

    ${media.desktop} {
      height: 200vh;
    }
  `,

  headlineWrapper: css`
    position: relative;
    height: 100vh;

    ${media.desktop} {
      height: 50%;
    }
  `,

  stickyWrapper: css`
    position: sticky;
    top: 0;
    height: 100vh;
    margin-bottom: -100vh;
    z-index: 0;
  `,

  fixedWheel: css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 594px;
    aspect-ratio: 1/1;
    max-width: 90vw;

    ${media.desktop} {
      width: 840px;
    }
  `,

  section: css`
    position: relative;
    width: 100%;
    height: 100vh;
    z-index: 1;
    display: grid;
    place-items: center;
  `,

  ellipse: css`
    ${common.absoluteCenter};
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: radial-gradient(
      50% 50% at 50% 50%,
      rgba(255, 255, 255, 0) 50%,
      rgba(255, 255, 255, 0.2) 80%,
      rgba(255, 255, 255, 0.4) 100%
    );

    ${media.desktop} {
      width: 840px;
      height: 840px;
    }
  `,

  dashedCircle: css`
    position: absolute;
    width: 96%;
    height: 96%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation: ${rotate} 120s linear infinite;
  `,

  innerCircle: css`
    ${common.absoluteCenter};
    width: 54%;
    height: 54%;
    aspect-ratio: 1/1;
    border-radius: 100%;
    background: #fff;

    ${media.desktop} {
      width: 48%;
      height: 48%;
    }
  `,

  mapleLeaf: css`
    ${common.absoluteCenter};
    width: 30%;
    height: 30%;

    ${media.desktop} {
      width: 31%;
      height: 31%;
    }
  `,

  lineSentinel: css`
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 1px;
    height: 1px;
  `,

  lineAiWrapper: (isInView: boolean, direction: 'left' | 'right') => css`
    display: none;

    ${media.desktop} {
      display: block;
      position: absolute;
      top: 62%;
      ${direction === 'left' ? 'right: calc(50% - 3px);' : 'left: 50%;'}
      height: 604px;
      z-index: 1;
      pointer-events: none;
      clip-path: inset(0 0 100% 0);
      width: 383px;

      ${isInView &&
      css`
        animation: ${drawUpToDown} 1s ease forwards;
      `}
    }
  `,
};
