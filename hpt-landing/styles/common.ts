import { css, keyframes } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const rainbowMove = keyframes`
  0% { background-position: 0%; }
  100% { background-position: 200%; }
`;

export default {
  absoluteCenter: css`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `,

  absoluteCenterX: css`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  `,

  desktopBr: css`
    display: none;

    ${media.desktop} {
      display: block;
    }
  `,

  mobileBr: css`
    display: block;

    ${media.desktop} {
      display: none;
    }
  `,

  primaryCta: css`
    position: relative;
    isolation: isolate;
    display: inline-flex;
    padding: 12px 24px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-family: inherit;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-decoration: none;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 9999px;
    background:
      linear-gradient(#121213, #121213) padding-box,
      linear-gradient(
          #121213 50%,
          rgba(18, 18, 19, 0.6) 80%,
          rgba(18, 18, 19, 0)
        )
        border-box,
      linear-gradient(
          90deg,
          hsl(0 100% 63%),
          hsl(90 100% 63%),
          hsl(210 100% 63%),
          hsl(195 100% 63%),
          hsl(270 100% 63%)
        )
        border-box;
    background-size: 200%;
    animation: ${rainbowMove} 2s linear infinite;
    transition: opacity 0.15s ease;

    &::before {
      content: '';
      position: absolute;
      bottom: -20%;
      left: 50%;
      z-index: -1;
      height: 20%;
      width: 60%;
      transform: translateX(-50%);
      background: linear-gradient(
        90deg,
        hsl(0 100% 63%),
        hsl(90 100% 63%),
        hsl(210 100% 63%),
        hsl(195 100% 63%),
        hsl(270 100% 63%)
      );
      background-size: 200%;
      filter: blur(12px);
      animation: ${rainbowMove} 2s linear infinite;
      pointer-events: none;
    }

    &:hover {
      opacity: 0.95;
    }
  `,
};
