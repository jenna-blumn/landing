import { media } from '@/styles/breakpoints';
import { css, keyframes } from '@emotion/react';

const delay = 200;

const drawLeftToRight = keyframes`
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
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

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const horizontalLine = (
  left: number,
  top: number,
  delayMultiplier: number,
  isAnimated: boolean,
) => css`
  position: absolute;
  left: ${left}px;
  top: ${top}px;
  z-index: 1;
  ${isAnimated
    ? css`
        clip-path: inset(0 100% 0 0);
        animation: ${drawLeftToRight} 200ms ease forwards;
        animation-delay: ${delay * delayMultiplier}ms;
      `
    : css`
        clip-path: inset(0 0 0 0);
      `}
`;

const verticalLine = (
  left: number,
  top: number,
  delayMultiplier: number,
  isAnimated: boolean,
) => css`
  position: absolute;
  left: ${left}px;
  top: ${top}px;
  z-index: 1;
  ${isAnimated
    ? css`
        clip-path: inset(0 0 100% 0);
        animation: ${drawUpToDown} 200ms ease forwards;
        animation-delay: ${delay * delayMultiplier}ms;
      `
    : css`
        clip-path: inset(0 0 0 0);
      `}
`;

const scenarioSvg = (
  left: number,
  top: number,
  delayMultiplier: number,
  isAnimated: boolean,
) => css`
  position: absolute;
  left: ${left}px;
  top: ${top}px;
  ${isAnimated
    ? css`
        opacity: 0;
        animation: ${fadeIn} ${delay}ms ease forwards;
        animation-delay: ${delay * delayMultiplier}ms;
      `
    : css`
        opacity: 1;
      `}
`;

const fadeInWrapper = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

export const createStyles = (isAnimated: boolean, isSecondGuide: boolean) => ({
  scenarioWrapper: (top?: number) => css`
    position: absolute;
    width: 312px;
    left: 50%;
    top: ${top ? `${top}px` : '148px'};
    border-radius: 0 0 6px 6px;

    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
    ${isAnimated
      ? css`
          opacity: 0;
          transform: translate(-50%, -10px);
          animation: ${fadeInWrapper} ${delay}ms ease forwards;
          animation-delay: ${delay * 5}ms;
        `
      : css`
          opacity: 1;
          transform: translateX(-50%);
        `}

    ${media.desktop} {
      width: 560px;
      height: 195px;
      top: ${top ? `${top}px` : 'calc(56.28px + 78px)'};
    }
  `,

  scenarioHeader: css`
    display: flex;
    justify-content: space-between;
  `,

  tabUI: css`
    color: #52525b;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    display: flex;
    padding: 6px 10px;
    align-items: center;
    gap: 5px;
    border-radius: 6px 6px 0 0;
    border-top: 1px solid #d4d4d8;
    border-right: 1px solid #d4d4d8;
    border-left: 1px solid #d4d4d8;
    background: #fafafa;
  `,

  badgeUI: css`
    display: flex;
    gap: 4px;
    height: 22px;
    justify-content: center;
    align-items: center;
    background-color: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 6px;
    padding: 4px 6px;

    > span {
      color: #16a34a;
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
    }
  `,

  container: css`
    overflow: hidden;
    width: 100%;
    height: 224px;
    border-radius: 0 6px 6px 6px;
    border: 1px solid #d4d4d8;
    background-color: #fafafa;
    position: relative;

    ${media.desktop} {
      height: 163px;
    }
  `,

  startText: css`
    position: absolute;
    display: inline-flex;
    padding: 4.577px;
    justify-content: center;
    align-items: center;
    gap: 11.444px;
    border-radius: 4.577px;
    border: 1px solid #60a5fa;
    background: #eff6ff;
    color: #2563eb;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    left: 9px;
    top: 111px;

    ${isAnimated
      ? css`
          opacity: 0;
          animation: ${fadeIn} ${delay}ms ease forwards;
          animation-delay: ${delay * 6}ms;
        `
      : css`
          opacity: 1;
        `}

    ${media.desktop} {
      left: 23px;
      top: 81px;
    }
  `,

  wrapper: css`
    opacity: ${isSecondGuide ? 0.5 : 1};
  `,

  firstLine: horizontalLine(76.25, 90, 7, isAnimated),
  firstMobileLine: horizontalLine(64, 120, 7, isAnimated),
  firstScenarioSvg: scenarioSvg(100, 29, 8, isAnimated),
  firstMobileScenarioSvg: scenarioSvg(75.13, 59, 8, isAnimated),

  secondLine: horizontalLine(201, 29, 9, isAnimated),
  secondMobileLine: horizontalLine(177, 57, 9, isAnimated),
  secondScenarioSvg: scenarioSvg(230, -21.18, 10, isAnimated),
  secondMobileScenarioSvg: scenarioSvg(197, 17, 10, isAnimated),

  thirdLine: verticalLine(280, 78, 11, isAnimated),
  thirdMobileLine: verticalLine(246, 123, 11, isAnimated),
  thirdScenarioSvg: scenarioSvg(230, 109.22, 12, isAnimated),
  thirdMobileScenarioSvg: scenarioSvg(197, 142, 12, isAnimated),
  thirdMobileScenarioGradientSvg: scenarioSvg(179, 134, 12, isAnimated),

  fourthLine: horizontalLine(325, 30, 11, isAnimated),
  fourthScenarioSvg: scenarioSvg(356.13, 77, 12, isAnimated),
  fourthScenarioGradientSvg: scenarioSvg(338, 65, 12, isAnimated),

  fifthLine: horizontalLine(456, 116, 13, isAnimated),
  fifthScenarioSvg: scenarioSvg(470.13, 53.02, 14, isAnimated),

  gradientShadow: css`
    box-shadow: 0 5.493px 18.311px 0 rgba(44, 85, 221, 0.3);
  `,

  blur: css`
    position: absolute;
    width: 58px;
    height: 180px;
    top: 0;
    right: 0;
    background: linear-gradient(
      90deg,
      rgba(250, 250, 250, 0) 0%,
      rgba(250, 250, 250, 0.78) 46.15%,
      #fafafa 100%
    );
  `,
});
