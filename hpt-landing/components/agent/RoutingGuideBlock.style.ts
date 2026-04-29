import { css, keyframes } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const dotPulse1 = keyframes`
  0%, 33% { width: 10px; height: 10px; }
  34%, 100% { width: 6px; height: 6px; }
`;

const dotPulse2 = keyframes`
  0%, 33% { width: 6px; height: 6px; }
  34%, 66% { width: 10px; height: 10px; }
  67%, 100% { width: 6px; height: 6px; }
`;

const dotPulse3 = keyframes`
  0%, 66% { width: 6px; height: 6px; }
  67%, 100% { width: 10px; height: 10px; }
`;

const drawLine = keyframes`
  0% {
    stroke-dashoffset: 350;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const circleFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeIn = (y = '-10px') => keyframes`
  from {
    opacity: 0;
    transform: translateY(${y});
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }`;

const lineSvgAnimation = css`
  > path {
    stroke-dasharray: 350;
    stroke-dashoffset: 350;
    animation: ${drawLine} 800ms ease forwards;
    animation-delay: 200ms;
  }

  > circle {
    opacity: 0;
    animation: ${circleFadeIn} 300ms ease forwards;
    animation-delay: 600ms;
  }
`;

const styles = {
  aiLineSvg: css`
    left: 50% !important;
    transform: translateX(-50%);
    top: 0;
    ${lineSvgAnimation}

    ${media.desktop} {
      left: unset !important;
      transform: none;
      top: unset;
    }
  `,

  counselorLineSvg: css`
    ${lineSvgAnimation}
  `,

  block: (isMain: boolean) => css`
    position: relative;
    height: auto;
    width: 336px;
    opacity: ${isMain ? 1 : 0.3};

    &:first-of-type {
      > svg {
        right: 0;
      }

      > div {
        margin-right: 0;

        ${media.desktop} {
          margin-right: 10px;
        }
      }
    }

    &:last-of-type > svg {
      left: 0;
    }

    > svg {
      position: absolute;
      z-index: 1;
    }

    ${!isMain &&
    css`
      * {
        animation: none !important;
        opacity: 1 !important;
      }

      svg path {
        stroke-dashoffset: 0 !important;
      }
    `}

    ${media.desktop} {
      width: auto;
      height: 300px;
    }
  `,

  itemContainer: css`
    position: relative;
    width: auto;
    padding-top: 29px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;

    ${media.desktop} {
      width: 320px;
      padding-top: 76px;
      gap: 30px;
    }
  `,

  badge: (isAyvin: boolean) => css`
    opacity: 0;
    z-index: 2;
    display: inline-flex;
    animation: ${fadeIn()} 300ms ease forwards;
    animation-delay: 700ms;
    padding: 8px 12px;
    align-items: center;
    gap: 5px;
    border-radius: 6px;
    border: 3px solid ${isAyvin ? '#3b82f6' : '#EF4444'};
    background: #000;
    color: #eff6ff;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
  `,

  chatContainer: css`
    opacity: 0;
    animation: ${fadeIn()} 300ms ease forwards;
    animation-delay: 1000ms;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 7px;
    align-items: center;
  `,

  answerBadge: (isAyvin: boolean) => css`
    width: fit-content;
    display: flex;
    padding: 6px 8px;
    align-items: center;
    gap: 4px;
    border-radius: 4px;
    border: 1px solid #d4d4d8;
    background-color: #fff;

    > span {
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      color: #52525b;

      ${isAyvin &&
      css`
        background: linear-gradient(90deg, #1dddb5 0%, #5062ff 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      `}
    }
  `,

  chatting: (isAyvin: boolean) => css`
    display: flex;
    width: 100%;
    height: 200px;
    padding: 5px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: ${isAyvin
      ? 'linear-gradient(156deg, #f1fbc5 0%, #cfffe1 50%, #c4d6ff 100%)'
      : '#e4e4e7'};

    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -4px rgba(0, 0, 0, 0.1);
  `,

  chattingInner: css`
    gap: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #fff;
    padding: 12px 0;
    box-shadow:
      0 1px 3px 0 rgba(0, 0, 0, 0.1),
      0 1px 2px -1px rgba(0, 0, 0, 0.1);
    overflow-y: hidden;
  `,

  message: css`
    display: flex;
    max-width: 225px;
    padding: 6px 7.5px;
    justify-content: center;
    align-items: center;
    gap: 7.5px;
    border-radius: 9px;
    color: #000;
    text-align: left;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
  `,

  customer: css`
    background-color: #e4e4e7;
    align-self: flex-end;
    margin-right: 22px;
  `,

  counselor: css`
    position: relative;
    opacity: 0;
    animation: ${fadeIn('10px')} 200ms ease forwards;
    align-self: flex-start;
    margin-left: 12px;
    border: 1px solid #e4e4e7;
    background-color: #fff;
    box-shadow:
      0 0.75px 2.25px 0 rgba(0, 0, 0, 0.1),
      0 0.75px 1.5px -0.75px rgba(0, 0, 0, 0.1);

    > p {
      position: absolute;
      content: 'IVY AI ⋅ workflow';
      margin-top: 4px;
      opacity: 0.6;
      color: #333;
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
      top: calc(100% + 4px);
      left: 0;
    }
  `,

  aiAnalyzingMessage: css`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 0;
    align-self: flex-start;

    p {
      color: #333;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  aiAnalyzingProgress: css`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 12px;

    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;

      &:nth-of-type(1) {
        background-color: #1be2b0;
        animation: ${dotPulse1} 1.2s steps(1) infinite;
      }
      &:nth-of-type(2) {
        background-color: #33afdb;
        animation: ${dotPulse2} 1.2s steps(1) infinite;
      }
      &:nth-of-type(3) {
        background-color: #4b71ff;
        animation: ${dotPulse3} 1.2s steps(1) infinite;
      }
    }
  `,
};

export default styles;
