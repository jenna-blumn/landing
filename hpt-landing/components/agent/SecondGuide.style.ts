import { css, keyframes } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const drawLine = keyframes`
  0% {
    stroke-dashoffset: 300;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }`;

const textFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }`;

const MOBILE_TEXT_HEIGHT = 20;
const DESKTOP_TEXT_HEIGHT = 24;
const TEXT_GAP = 10;

const styles = {
  container: css`
    width: 100%;
    height: 100%;
  `,

  wrapper: css`
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  `,

  scenarioWrapper: css`
    position: relative;
    width: 312px;
    height: 256px;
    left: 50%;
    transform: translateX(-50%);

    ${media.desktop} {
      width: 560px;
      height: 195px;
    }
  `,

  lineSvg: css`
    position: absolute;
    top: 76px;
    left: calc(50% + 46.5px);
    transform: translateX(-50%);
    z-index: 1;

    > path {
      stroke-dasharray: 300;
      stroke-dashoffset: 300;
      animation: ${drawLine} 800ms ease forwards;
      animation-delay: 200ms;
    }

    ${media.desktop} {
      top: 78px;
      left: 280px;
      transform: none;
    }
  `,

  brandIcon: css`
    width: 128px;
    height: 128px;
    position: absolute;
    top: 123px;
    left: 91px;
    transform: translate(-50%, -50%);
    z-index: 2;

    opacity: 0;
    animation: ${fadeIn} 300ms ease forwards;
    animation-delay: 700ms;

    .gradient-text {
      position: absolute;
      bottom: 0;
      z-index: 6;
      right: 10px;
      font-size: var(--font-size-18);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
      overflow: visible;
      white-space: nowrap;
    }

    ${media.desktop} {
      top: 156px;
      left: 216px;
      transform: translateY(-10px);
    }
  `,

  slideText: css`
    position: absolute;
    left: 50%;
    top: 270px;
    width: 336px;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;

    transform: translate(-50%, -10px);
    opacity: 0;
    animation: ${textFadeIn} 300ms ease forwards;
    animation-delay: 700ms;

    ${media.desktop} {
      top: auto;
      bottom: 47px;
      width: fit-content;
      padding: 0;
    }
  `,

  bubble: css`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 12px 16px;
    gap: 4px;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    background-color: #fff;
    width: 100%;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 9px;
      padding: 1px;
      background: linear-gradient(90deg, #eedd45, #98e7ba, #5c8aff);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }

    ${media.desktop} {
      flex-direction: row;
      padding: 16px;
      gap: 0;
      width: 513px;
    }
  `,

  bubbleRow: css`
    display: flex;
    align-items: center;
    gap: 4px;

    > svg {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
    }

    ${media.desktop} {
      gap: 0;
      margin-right: 8px;

      > svg {
        margin-right: 4px;
      }
    }
  `,

  processWrapper: css`
    position: relative;
    height: ${MOBILE_TEXT_HEIGHT}px;
    overflow: hidden;

    ${media.desktop} {
      height: ${DESKTOP_TEXT_HEIGHT}px;
    }
  `,

  processSlider: (isAnimating: boolean) => css`
    position: relative;
    transform: translateY(
      ${isAnimating ? -(MOBILE_TEXT_HEIGHT + TEXT_GAP) : 0}px
    );
    transition: transform ${isAnimating ? '500ms' : '0ms'} ease-in-out;

    ${media.desktop} {
      transform: translateY(
        ${isAnimating ? -(DESKTOP_TEXT_HEIGHT + TEXT_GAP) : 0}px
      );
    }
  `,

  processText: (isNext: boolean) => css`
    line-height: ${MOBILE_TEXT_HEIGHT}px;
    font-size: var(--font-size-15);
    white-space: nowrap;
    color: #18181b;
    font-weight: var(--font-weight-bold);

    ${isNext &&
    `
      position: absolute;
      top: ${MOBILE_TEXT_HEIGHT + TEXT_GAP}px;
      left: 0;
    `}

    ${media.desktop} {
      line-height: ${DESKTOP_TEXT_HEIGHT}px;
      font-size: var(--font-size-15);

      ${isNext &&
      `
        top: ${DESKTOP_TEXT_HEIGHT + TEXT_GAP}px;
      `}
    }
  `,

  descriptionText: css`
    min-height: 16px;
    line-height: var(--line-height-16);
    font-size: var(--font-size-13);
    white-space: nowrap;
    color: #52525b;
    font-weight: var(--font-weight-regular);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      line-height: ${DESKTOP_TEXT_HEIGHT}px;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
    }
  `,
};

export default styles;
