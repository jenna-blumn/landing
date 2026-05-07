import { css, keyframes } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const scroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

export default {
  container: css`
    padding: 40px 0;
    overflow: hidden;

    ${media.desktop} {
      padding: 60px 0;
    }
  `,

  marquee: css`
    width: 100%;
    overflow: hidden;
    mask-image: linear-gradient(
      to right,
      transparent 0,
      #000 80px,
      #000 calc(100% - 80px),
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0,
      #000 80px,
      #000 calc(100% - 80px),
      transparent 100%
    );
  `,

  track: css`
    display: flex;
    width: max-content;
    animation: ${scroll} 60s linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation-duration: 120s;
    }
  `,

  set: css`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 12px;
    padding-right: 12px;

    ${media.desktop} {
      gap: 20px;
      padding-right: 20px;
    }
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
    width: calc(var(--logo-width) * 0.75);
    height: calc(var(--logo-height) * 0.75);
    max-width: none;
    max-height: none;
    object-fit: cover;
    border-radius: calc(var(--logo-radius) * 0.75);
    flex-shrink: 0;

    ${media.desktop} {
      width: var(--logo-width);
      height: var(--logo-height);
      border-radius: var(--logo-radius);
    }
  `,
};
