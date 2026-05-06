import { css, keyframes } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const rainbowMove = keyframes`
  0% { background-position: 0%; }
  100% { background-position: 200%; }
`;

export default {
  container: css`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 120px 20px 340px;
    background: #f1f5f9;
    color: rgba(17, 17, 21, 0.9);
    text-align: center;
    overflow: hidden;

    ${media.desktop} {
      padding: 160px 60px 560px;
    }
  `,

  flowImageWrap: css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 0;
    width: 100%;
    pointer-events: none;
    user-select: none;
  `,

  flowImage: css`
    width: 100%;
    height: auto;
    object-fit: cover;
    object-position: center bottom;
    display: block;
  `,

  inner: css`
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  `,

  title: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    > .highlight {
      background: linear-gradient(
        135deg,
        oklch(54.6% 0.245 262.881) 0%,
        #18181b 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    ${media.desktop} {
      font-size: var(--font-size-54);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  subtitle: css`
    color: #4e4e55;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
    }
  `,

  buttons: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 8px;
  `,

  primaryBtn: css`
    position: relative;
    isolation: isolate;
    display: inline-flex;
    padding: 12px 24px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: #18181b;
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
      linear-gradient(#fff, #fff) padding-box,
      linear-gradient(
          #fff 50%,
          rgba(255, 255, 255, 0.6) 80%,
          rgba(255, 255, 255, 0)
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
};
