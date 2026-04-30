import { css, keyframes } from '@emotion/react';

import { media } from '@/styles/breakpoints';

const marquee = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const rainbowMove = keyframes`
  0% { background-position: 0%; }
  100% { background-position: 200%; }
`;

export default {
  container: css`
    position: relative;
    display: flex;
    width: 100%;
    padding: 56px 12px;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    background-color: #f5f5f5;
    overflow: hidden;

    ${media.desktop} {
      padding: 72px 60px;
      gap: 40px;
    }
  `,

  dotSection: css`
    position: absolute;
    width: 540px;
    height: 540px;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    border-radius: 320px;
    background: radial-gradient(
      206.3% 50% at 50% 50%,
      rgba(245, 245, 245, 0) 0%,
      #f5f5f5 100%
    );
    -webkit-mask-image: radial-gradient(
      ellipse at center,
      black 0%,
      black 40%,
      transparent 70%
    );
    mask-image: radial-gradient(
      ellipse at center,
      black 0%,
      black 40%,
      transparent 70%
    );

    ${media.desktop} {
      width: 1300px;
      height: 640px;
      top: auto;
      bottom: -89px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,

  primaryBtn: css`
    position: relative;
    isolation: isolate;
    display: inline-flex;
    margin-top: 8px;
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
      linear-gradient(#18181b, #18181b) padding-box,
      linear-gradient(
          #18181b 50%,
          rgba(24, 24, 27, 0.6) 80%,
          rgba(24, 24, 27, 0)
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

    > svg {
      width: 16px;
      height: 16px;
    }
  `,

  titleContainer: css`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    text-align: center;

    > h2 {
      color: rgba(17, 17, 21, 0.9);
      font-size: var(--font-size-32);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }

    > p {
      color: #4e4e55;
      font-size: var(--font-size-18);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    ${media.desktop} {
      gap: 16px;

      > h2 {
        font-size: var(--font-size-32);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-tight);
        letter-spacing: var(--letter-spacing-tight);

        > br {
          display: none;
        }
      }

      > p {
        font-size: var(--font-size-21);
        line-height: var(--line-height-tight);

        > br {
          display: none;
        }
      }
    }
  `,

  badgeGroup: css`
    position: relative;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    ${media.desktop} {
      flex-direction: row;
      gap: 12px;
    }
  `,

  badge: css`
    display: flex;
    padding: 10px 14px;
    justify-content: center;
    align-items: center;
    gap: 6px;
    border-radius: 9999px;
    border: 1px solid rgba(39, 39, 42, 0.12);
    background: rgba(255, 255, 255, 0.6);
    color: oklch(62.3% 0.214 259.815);

    > span {
      color: rgba(17, 17, 21, 0.9);
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  partnerGroup: css`
    position: relative;
    width: 100%;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(
      to right,
      transparent,
      black 10%,
      black 90%,
      transparent
    );
    mask-image: linear-gradient(
      to right,
      transparent,
      black 10%,
      black 90%,
      transparent
    );

    ${media.desktop} {
      width: fit-content;
      align-self: center;
      overflow: visible;
      -webkit-mask-image: none;
      mask-image: none;
    }
  `,

  partnerTrack: css`
    display: flex;
    align-items: flex-start;
    width: max-content;
    animation: ${marquee} 20s linear infinite;

    ${media.desktop} {
      gap: 24px;
      animation: none;
      width: auto;
      transform: none;
    }
  `,

  partnerSet: css`
    display: flex;
    align-items: flex-start;
    gap: 24px;
    padding-right: 24px;
  `,

  partnerImage: css`
    display: flex;
    align-items: center;
    border-radius: 9999px;
    border: 1px solid rgba(39, 39, 42, 0.15);
    background: #fff;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    box-shadow:
      0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
      0 1px 2px 0 rgba(0, 0, 0, 0.05);
  `,
};
