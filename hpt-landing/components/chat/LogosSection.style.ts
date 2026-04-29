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

export default {
  container: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 40px 0;
    overflow: hidden;

    ${media.desktop} {
      gap: 20px;
      padding: 60px 0;
    }
  `,

  marqueeWrapper: css`
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
  `,

  track: css`
    display: flex;
    align-items: center;
    width: max-content;
    animation: ${marquee} 30s linear infinite;
  `,

  logoSet: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding-right: 12px;

    ${media.desktop} {
      gap: 20px;
      padding-right: 20px;
    }
  `,

  trackReverse: css`
    animation-direction: reverse;
  `,

  logoItem: css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 81px;
    height: 63px;
    overflow: hidden;
    flex-shrink: 0;

    ${media.desktop} {
      width: 108px;
      height: 84px;
    }
  `,

  logoImage: css`
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;

    ${media.desktop} {
      border-radius: 10px;
    }
  `,
};
