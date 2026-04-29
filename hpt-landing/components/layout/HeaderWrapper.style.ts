import { css } from '@emotion/react';

export default {
  container: css`
    width: 100%;
    height: 60px;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
  `,

  blurContainer: css`
    position: absolute;
    inset: 0;
    z-index: -10;
  `,

  blurLayer: (
    blur: number,
    opacity: number,
    zIndex: number,
    isBlurVisible: boolean,
  ) => css`
    position: absolute;
    inset: 0;
    pointer-events: none;
    mask-image: linear-gradient(360deg, transparent 0%, black 100%);

    opacity: ${opacity};
    z-index: ${zIndex};

    ${isBlurVisible &&
    css`
      backdrop-filter: blur(${blur}px);
    `}
  `,

  gradientOverlay: css`
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      360deg,
      transparent 0%,
      hsl(var(--background)) 100%
    );
  `,
};
